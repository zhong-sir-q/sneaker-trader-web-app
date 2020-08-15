import { Connection } from 'mysql';
import { FetchDbDataCallback, BuyingHistory } from '../declarations';
import { formatInsertAllColumnsQuery } from '../utils/formatDbQuery';

class TransactionService {
  conneciton: Connection;
  constructor(conn: Connection) {
    this.conneciton = conn;
  }

  create(transaction: BuyingHistory) {
    const createTransactionQuery = formatInsertAllColumnsQuery('BuyingHistory', transaction);
    this.conneciton.query(createTransactionQuery, (err) => {
      if (err) throw new Error(`Error recording the transaction in BuyingHistory: ${err.message}`);
    });
  }

  getCustomerBuyingHistory(customerId: string, cb: FetchDbDataCallback) {
    // get all the products one customer have bought
    const customerBuyingHistoryQuery =
      'select * from BuyingHistory left join Products on BuyingHistory.product_id = Products.id where BuyingHistory.customer_id = ?';

    this.conneciton.query(customerBuyingHistoryQuery, customerId, (err, res) => {
      if (err) cb(err, undefined);
      else cb(undefined, res);
    });
  }
}

export default TransactionService;
