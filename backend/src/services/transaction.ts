import { Connection } from 'mysql';

class TransactionService {
  private conneciton: Connection;

  constructor(conn: Connection) {
    this.conneciton = conn;
  }
}

export default TransactionService;
