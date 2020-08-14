import express, { Response, Request } from 'express';
import mysql from 'mysql';
import cors from 'cors';
import bodyParser from 'body-parser';
import { Stripe } from 'stripe';
import { config } from 'dotenv';

// load environment variable
config();
const app = express();

// enable cors
app.use(cors());
app.use('/api', express.json()); // parsing application/json

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

// TODO:
// how can I make my database interaction code-first, i.e. my code defines the schema of the table
// rather than having to change the schema of the table, then come back and change the relevant area of the code?

// how do I manage db migration, i.e. keep the history of different versions of the db

// test is necessary to make sure the query works, it does what we expect it to do
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

const formatInsertAllColumnsQuery = (tableName: string, obj: { [key: string]: string | number }) =>
  `insert into ${tableName} (${formatColumns(obj)}) values (${formatValues(obj)})`;

const dbCreateProduct = (conn: mysql.Connection, product: Product) => {
  const createProductQuery = formatInsertAllColumnsQuery('Products', product);
  conn.query(createProductQuery, (err) => {
    if (err) throw new Error(`Error creating the product in the database: ${err.message}`);
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
 *
 * NOTE: in express 5.X, the errors in async middleware handlers will be automatically handled,
 * therefore there is no need for this custom wrapper when the express module gets updated
 */
const runAsyncWrapper = (cb: any) => (res: Response<any>, req: Request<any>, next: any) => cb(res, req, next).catch(next);

const formatSneakerMetaData = (shoe: Sneaker) => {
  const sneakerMetaData = makeDeepCopy(shoe);
  // the name and description are passed by argument
  // to create the product so it is not needed here
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
  '/api/product',
  runAsyncWrapper(async (req: Request<any>, res: Response<any>) => {
    if (hasValidBody(req)) {
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
    } else throw new Error('Recieved invalid body');
  })
);

const getCustomerId = (conn: mysql.Connection, userId: string, cb: FetchDbDataCallback) => {
  const query = 'select id from Customers where userId = ?';

  conn.query(query, userId, (err, data: { id: string }[]) => {
    if (err) cb(err, undefined);
    // no customer id in respect to the user id
    if (!data[0]) cb(undefined, undefined);
    else cb(undefined, data[0].id);
  });
};

type DbCustomer = {
  id: string;
  userId: string;
};

type FetchDbDataCallback = (err: mysql.MysqlError | undefined, queryResult: string | undefined) => Promise<void>;

const dbCreateCustomer = (conn: mysql.Connection, customer: DbCustomer) => {
  const createCustoerQuery = formatInsertAllColumnsQuery('Customers', customer);

  conn.query(createCustoerQuery, (err) => {
    if (err) throw new Error(`Error creating the user in the database: ${err.message}`);
  });
};

// if the customer does not already exists in db, then create a customer in stripe ->  create a user in the table
app.get('/api/customer/:userId', (req, res, next) => {
  const userId = req.params.userId;
  getCustomerId(connection, userId, async (err, queryResult) => {
    if (err) next(err);

    if (!queryResult) {
      // this check may not be necessary, but use it just to be safe
      const createCustomerOption = typeof req.query.email === 'string' ? { email: req.query.email } : {};
      const customer = await stripe.customers.create(createCustomerOption);

      dbCreateCustomer(connection, { id: customer.id, userId });

      res.send(customer.id);
    } else res.send(queryResult);
  });
});

type FormatCreateSessionOptionArgs = {
  priceId: string;
  productId: string;
  customerId: string;
};

// TODO: mannualy type the return object or install the type from somewhere
const formatCreateSessionOption = (args: FormatCreateSessionOptionArgs) => ({
  line_items: [
    {
      price: args.priceId,
      quantity: 1,
    },
  ],
  customer: args.customerId,
  // customer_email: '', // TODO: provide this field so we can prefill the email field in checkout
  mode: 'payment' as 'payment',
  metadata: { productId: args.productId }, // this field will be used to create a record in the user's buying history when the checkout session is completed
  payment_method_types: ['card' as 'card'],
  // TODO: the url here should depend on the developent stage
  success_url: `http://localhost:8000/success/?session_id={CHECKOUT_SESSION_ID}`,
  cancel_url: `http://localhost:8000/cancelled`,
});

app.get(
  '/api/checkoutSession',
  runAsyncWrapper(async (req: Request<any>, res: Response<any>) => {
    const session = await stripe.checkout.sessions.create(formatCreateSessionOption(req.query as FormatCreateSessionOptionArgs));

    res.json({ sessionId: session.id });
  })
);

// the keys map to the columns of the BuyingHistory table
type Transaction = {
  payment_intent_id: string;
  customer_id: string;
  product_id: string;
};

// handle post-payments, in this case, record the user's transaction in buying history
const onCheckoutSessionCompleted = (session: any) => {
  const { payment_intent, metadata, customer } = session;
  const { productId } = metadata;

  const transaction: Transaction = {
    payment_intent_id: payment_intent,
    customer_id: customer,
    product_id: productId,
  };

  const createTransactionQuery = formatInsertAllColumnsQuery('BuyingHistory', transaction);
  connection.query(createTransactionQuery, (err) => {
    if (err) throw new Error(`Error recording the transaction in BuyingHistory: ${err.message}`);
  });
};

// use the secret defined from the dashboard
const endpointSecret = 'whsec_BbHe6gRugqTRQUkBMShDJBxGBdwLksdG';

// the user will be redirected to the success url when we acknowledge
// that we have recieved the event by responding with the 200 status code


// Use body-parser to retrieve the raw body as a buffer
// match the raw body to content type application/json
app.post('/webhook/stripe', bodyParser.raw({ type: 'application/json' }), (req, res) => {
  const sig = req.headers['stripe-signature']!;

  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err) {
    console.log(err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the checkout.session.completed event
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;

    // record the transaction in the buying history
    onCheckoutSessionCompleted(session);
  }

  // Return a response to acknowledge receipt of the event
  res.json({ received: true });
});

const PORT = 4000;
app.listen(PORT, () => console.log('Listening at', `http://localhost:${PORT}`));
