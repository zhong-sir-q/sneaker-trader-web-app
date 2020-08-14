import express, { Response, Request, response } from 'express';
import mysql from 'mysql';
import cors from 'cors';
import { Stripe } from 'stripe';
import { config } from 'dotenv';

// load environment variable
config();
const app = express();

// enable cors
app.use(cors());
app.use(express.json()); // parsing application/json
app.use(express.urlencoded({ extended: false }));
app.get('/', (req, res) => res.send('Homepage is here'));

// dynamically translate the datatype of the columns of the database to here
type Product = {
  id: string;
  size: number;
  brand: string;
  color_way: string;
  serial_number: string;
  price: number;
  price_id: string;
  description: string;
  name: string;
};

// TODO: type guard to check the query must specify all columns that we have in the database
// a simple check to make sure the request body is an object
const hasValidBody = (req: any) => req.body && typeof req.body === 'object';

// the keys of the object will be the columns in the corresponding database
const formatColumns = (obj: { [key: string]: string | number }) => {
  const columns = Object.keys(obj);

  return columns.join(', ');
};

const formatValues = (obj: { [key: string]: string | number }) => {
  const values = Object.values(obj);
  // only add double quotes around the values that do not have the type of string
  const doubleQuoteVals = values.map((val) => (typeof val == 'string' ? `"${val}"` : val));

  return doubleQuoteVals.join(', ');
};

const connection = mysql.createConnection({
  host: process.env.host,
  user: process.env.user,
  password: process.env.dbPassword,
  database: process.env.database,
});

const stripe = new Stripe(process.env.stripeSecretKey as string, { apiVersion: '2020-03-02' });

// TODO: when should I end the connection?
// would using a connection pool here be better?
connection.connect();

// TODO: assign primary key to the products table
const dbCreateProduct = (conn: mysql.Connection, product: Product) => {
  const createProductQuery = `insert into products (${formatColumns(product)}) values (${formatValues(product)})`;
  conn.query(createProductQuery, (err, res) => {
    if (err) throw new Error(`Error creating the product in the database: ${err}`);
  });
};

// TODO: put the defined types in a centralized place, so I can access them from both the client and server sid
type Sneaker = {
  size: number;
  brand: string;
  color_way: string;
  serial_number: string;
  description: string;
  name: string;
  price: number;
};

const dollarToCent = (price: number) => price * 100;

const makeDeepCopy = (obj: { [key: string]: any }) => {
  const result: any = {};
  Object.keys(obj).forEach((k) => (result[k] = obj[k]));

  return result;
};

/**
 * @param cb : a express middleware handler
 *
 * if there exists any error during the callback, it passes the
 * first error message to the next middleware router to handle
 */
const runAsyncWrapper = (cb: any) => (res: Response<any>, req: Request<any>, next: any) => {
  if (hasValidBody(req)) return cb(res, req, next).catch(next);
  else throw new Error('Recieved invalid body');
};

const formatSneakerMetaData = (shoe: Sneaker) => {
  const sneakerMetaData = makeDeepCopy(shoe);
  delete sneakerMetaData.name;
  delete sneakerMetaData.description;

  return sneakerMetaData;
};

const formatDbSneaker = (shoe: Sneaker, productId: string, priceId: string) => {
  const dbSneaker = makeDeepCopy(shoe);
  dbSneaker['id'] = productId;
  dbSneaker['price_id'] = priceId;

  return dbSneaker;
};

// create a product in stripe -> use the product id to create the price -> using the price
app.post(
  '/product',
  runAsyncWrapper(async (req: Request<any>, res: Response<any>) => {
    const sneaker = req.body;
    sneaker.price = Number(sneaker.price);
    sneaker.size = Number(sneaker.size);

    // name is the required parameter to create a product
    // use the optional description parameter, then the rest goes into the meta data field
    const sneakerMetaData = formatSneakerMetaData(sneaker);

    const stripeProduct = await stripe.products.create({
      name: sneaker.name,
      description: sneaker.description,
      metadata: sneakerMetaData,
    });

    const stripePrice = await stripe.prices.create({
      unit_amount: dollarToCent(sneaker.price),
      currency: 'nzd', // convert nzd to an environment variabl
      product: stripeProduct.id,
    });

    // NOTE: remember the order the parameters, e.g. don't assign productId to the priceId parameter
    const dbSneaker = formatDbSneaker(sneaker, stripeProduct.id, stripePrice.id);
    dbCreateProduct(connection, dbSneaker);

    res.send('A product is created in stripe and the database');
  })
);

const getUserStripeCustomerId = (conn: mysql.Connection, userId: string, cb: FetchDbDataCallback) => {
  const query = 'select stripe_customer_id from users where id = ?';
  conn.query(query, userId, (err, data) => {
    if (err) cb(err, undefined);
    // no customer id in respect to the user id
    if (!data[0]) cb(undefined, undefined);
    else cb(undefined, data[0].stripe_customer_id);
  });
};

type DbUser = {
  id: string;
  stripe_customer_id: string;
};

type FetchDbDataCallback = (err: mysql.MysqlError | undefined, queryResult: string | undefined) => Promise<void>;

const dbCreateUser = (conn: mysql.Connection, user: DbUser) => {
  const createUserQuery = `insert into users (${formatColumns(user)}) values (${formatValues(user)})`;
  conn.query(createUserQuery, (err, res) => {
    if (err) throw new Error(`Error creating the user in the database: ${err}`);
  });
};

app.get('/user/:id', (req, res, next) => {
  const userId = req.params.id;
  getUserStripeCustomerId(connection, userId, async (err, queryResult) => {
    if (err) next(err);

    if (!queryResult) {
      // create a customer in stripe ->  create a user in the table
      const customer = await stripe.customers.create();
      dbCreateUser(connection, { id: userId, stripe_customer_id: customer.id });
      res.send(customer.id);
    } else res.send(queryResult);
  });
});

const PORT = 4000;
app.listen(PORT, () => console.log('Listening at', `http://localhost:${PORT}`));
