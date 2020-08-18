import { Router, Response, Request } from 'express';

import { runAsyncWrapper, hasValidBody, dollarToCent } from '../../utils';
import { formatSneakerMetaData, formatDbSneaker } from '../../utils/formatDbData';
import stripe from '../../config/stripe';
import ProductService from '../../services/product';
import { getMysqlDb } from '../../config/mysql';

const productRoute = Router();

// NOTE: are there too much going on in this funtion? If so, how can I refactor it?
export default (app: Router) => {
  app.use('/product', productRoute);

  // create a product in stripe -> use the product id to create the price -> using the price
  productRoute.post(
    '/',
    runAsyncWrapper(async (req: Request<any>, res: Response<any>) => {
      if (hasValidBody(req)) {
        // TODO: give the variable a type
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

        const dbConnection = getMysqlDb();
        const ProductServiceInstance = new ProductService(dbConnection);

        // NOTE: remember the order the parameters, e.g. don't assign productId to the priceId parameter
        const dbSneaker = formatDbSneaker(sneaker, stripeProduct.id, stripePrice.id);
        ProductServiceInstance.create(dbSneaker);

        res.send('A product is created in stripe and the database');
      } else throw new Error('Recieved invalid body');
    })
  );
};
