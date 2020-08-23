import { Connection } from 'mysql';
import { FetchDbDataCallback } from '../@types/utils';
import { formatInsertColumnsQuery } from '../utils/formatDbQuery';
import { User } from '../../../shared';

class UserService {
  connection: Connection;
  tableName: string;
  constructor(conn: Connection) {
    this.connection = conn;
    this.tableName = 'Users';
  }

  create(user: User, cb: FetchDbDataCallback) {
    const query = formatInsertColumnsQuery(this.tableName, user);
    this.connection.query(query, (err, result) => {
      if (err) cb(err, undefined);
      else cb(undefined, result);
    });
  }
}

export default UserService;
