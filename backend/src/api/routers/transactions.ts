import { Router } from 'express';

import TransactionService from '../../services/TransactionsService';

const transactionsRoute = Router();

export default (app: Router, TransactionsServiceInstance: TransactionService) => {
  app.use('/transactions', transactionsRoute);

  transactionsRoute.get('/purchased/:buyerId', (req, res, next) => {
    const { buyerId } = req.params;

    TransactionsServiceInstance.getPurchasedByBuyerId(buyerId)
      .then((purchasedProducts) => res.json(purchasedProducts))
      .catch(next);
  });
};
