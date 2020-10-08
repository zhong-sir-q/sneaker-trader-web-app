import { Router } from 'express';
import StripeService from '../../services/external/StripeService';

const stripeRoute = Router();

export default (app: Router, StripeServiceInstance: StripeService) => {
  app.use('/stripe', stripeRoute);

  stripeRoute.get('/secret/:amount', async (req, res, next) => {
    const { amount } = req.params;

    console.log(Number(amount))

    try {
      const intent = await StripeServiceInstance.createPaymentIntent(Number(amount));
      res.json(intent.client_secret);
    } catch (err) {
      next(err);
    }
  });
};
