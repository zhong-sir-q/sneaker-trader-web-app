import { Connection } from 'mysql';

class RefundService {
  connection: Connection;
  tableName: string;

  constructor(conn: Connection) {
    this.connection = conn;
    this.tableName = 'BuyingHistory';
  }

  updateRefundStatusSuccessful(paymentIntentId: string) {
    const updateStatusQuery = 'UPDATE BuyingHistory SET status = "refunded" WHERE payment_intent_id = ?';

    this.connection.query(updateStatusQuery, paymentIntentId, (err) => {
      if (err) throw new Error(`Error updating the status to refunded: ${err.message}`);
    });
  }
}

export default RefundService;
