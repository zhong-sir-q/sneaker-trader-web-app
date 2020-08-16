import { Router } from 'express';
import bodyParser from 'body-parser';

import TransactionService from '../../services/transactions';

import { formatTransaction } from '../../utils';

import stripe from '../../config/stripe';
import { getMysqlDb } from '../../config/mysql';

const route = Router();

// handle post-payments, in this case, record the user's transaction in buying history
const onCheckoutSessionCompleted = (session: any) => {
  const transaction = formatTransaction(session);
  const mysqlConnection = getMysqlDb();

  const TransactionServiceInstance = new TransactionService(mysqlConnection);

  TransactionServiceInstance.create(transaction);
};

// use the secret defined from the dashboard or the one from terminal if using cli
const endpointSecret = 'whsec_BbHe6gRugqTRQUkBMShDJBxGBdwLksdG';

export default (app: Router) => {
  app.use('/stripe', route);

  // NOTE: a proper endpoint is not setup to recieve the webhook yet
  // I need to test the webhook endpoint through the terminal for now

  // Use body-parser to retrieve the raw body as a buffer
  // match the raw body to content type application/json
  route.post('/', bodyParser.raw({ type: 'application/json' }), (req, res) => {
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
};
