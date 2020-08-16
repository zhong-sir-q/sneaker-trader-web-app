import { Connection } from 'mysql';
import { formatInsertAllColumnsQuery } from '../utils/formatDbQuery';
import { FetchDbDataCallback } from '../@types/utils';

type CustomerIdentity = {
  id: string;
  userId: string;
};

class CustomerService {
  connection: Connection;
  constructor(conn: Connection) {
    this.connection = conn;
  }

  create(identity: CustomerIdentity) {
    const createCustoerQuery = formatInsertAllColumnsQuery('Customers', identity);

    this.connection.query(createCustoerQuery, (err) => {
      if (err) throw new Error(`Error creating the user in the database: ${err.message}`);
    });
  }

  // pass the fetched data if any, to the callback function
  getCustomerId(userId: string, cb: FetchDbDataCallback) {
      // fetch the customerId using the userId
    const query = 'SELECT id FROM Customers WHERE userId = ?';

    this.connection.query(query, userId, (err, data: { id: string }[]) => {
      if (err) cb(err, undefined);
      // no customer id in respect to the user id
      if (!data[0]) cb(undefined, undefined);
      else cb(undefined, data[0].id);
    });
  }
}

export default CustomerService;
