import { Connection } from 'mysql';
import { formatInsertColumnsQuery } from '../utils/formatDbQuery';
import { BuyingHistory } from '../../../shared';
import { FetchDbDataCallback } from '../@types/utils';

class TransactionService {
  conneciton: Connection;
  constructor(conn: Connection) {
    this.conneciton = conn;
  }

  create(transaction: BuyingHistory) {
    const createTransactionQuery = formatInsertColumnsQuery('BuyingHistory', transaction);
    this.conneciton.query(createTransactionQuery, (err) => {
      if (err) throw new Error(`Error recording the transaction in BuyingHistory: ${err.message}`);
    });
  }

  getCustomerBuyingHistory(customerId: string, cb: FetchDbDataCallback) {
    // get all the products one customer have bought
    const customerBuyingHistoryQuery =
      'SELECT * FROM BuyingHistory LEFT JOIN Products ON BuyingHistory.product_id = Products.id WHERE BuyingHistory.customer_id = ?';

    this.conneciton.query(customerBuyingHistoryQuery, customerId, (err, res) => {
      if (err) cb(err, undefined);
      else cb(undefined, res);
    });
  }
}

export default TransactionService;
