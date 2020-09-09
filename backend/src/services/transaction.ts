import { Connection } from 'mysql';

class TransactionService {
  conneciton: Connection;
  tableName: string;

  constructor(conn: Connection) {
    this.conneciton = conn;
    this.tableName = ''
  }
}

export default TransactionService;
