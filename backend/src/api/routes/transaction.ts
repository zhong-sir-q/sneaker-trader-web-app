import { Router } from 'express';

import TransactionService from '../../services/TransactionService';

const transactionRoute = Router();

export default (app: Router, TransactionServiceInstance: TransactionService) => {
  app.use('/transaction', transactionRoute);

  transactionRoute.get('/:listedProductId', (req, res, next) => {
    const { listedProductId } = req.params;

    TransactionServiceInstance.get(Number(listedProductId))
      .then((transaction) => res.json(transaction))
      .catch(next);
  });

  transactionRoute.post('/', (req, res, next) => {
    const transaction = req.body;

    TransactionServiceInstance.create(transaction)
      .then(() => res.json('Transaction created'))
      .catch(next);
  });

  transactionRoute.put('/rating/buyer/:listedProductId', (req, res, next) => {
    const { listedProductId } = req.params;
    const { rating, comment } = req.body;

    TransactionServiceInstance.rateBuyer(Number(listedProductId), rating, comment)
      .then(() => res.json('Buyer is rated'))
      .catch(next);
  });

  transactionRoute.put('/rating/seller/:listedProductId', (req, res, next) => {
    const { listedProductId } = req.params;
    const { rating, comment } = req.body;

    TransactionServiceInstance.rateSeller(Number(listedProductId), rating, comment)
      .then(() => res.json('Buyer is rated'))
      .catch(next);
  });
};
