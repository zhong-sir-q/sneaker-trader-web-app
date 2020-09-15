import { PromisifiedConnection } from '../config/mysql';
import { RequestHandler } from 'express';
import { formatInsertColumnsQuery } from '../utils/formatDbQuery';
import { TRANSACTION } from '../config/tables';

class TransactionService {
  private conneciton: PromisifiedConnection;

  constructor(conn: PromisifiedConnection) {
    this.conneciton = conn;
  }

  handleCreate: RequestHandler = (req, res, next) => {
    const transaction = req.body;

    this.conneciton
      .query(formatInsertColumnsQuery(TRANSACTION, transaction))
      .then((result) => res.json(result))
      .catch(next);
  };
}

export default TransactionService;
