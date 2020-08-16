import { Router } from 'express';
import TransactionService from '../../services/transactions';
import { getMysqlDb } from '../../config/mysql';

const route = Router();

export default (app: Router) => {
  app.use('/buying_history', route);

  route.get('/:customerId', (req, res) => {
    const customerId = req.params.customerId;
    const mySqlConnection = getMysqlDb();
    const TransactionServiceInstance = new TransactionService(mySqlConnection);

    TransactionServiceInstance.getCustomerBuyingHistory(customerId, (err, queryResult) => {
      if (err) throw new Error('Error fetching the buying history of a customer');
      else res.json({ transactions: queryResult });
    });
  });
};
