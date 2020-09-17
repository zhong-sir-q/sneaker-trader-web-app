import { PromisifiedConnection } from '../config/mysql';
import { RequestHandler } from 'express';
import { formatInsertColumnsQuery, formatUpdateColumnsQuery } from '../utils/formatDbQuery';
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

  rateBuyer: RequestHandler = (req, res, next) => {
    const { listedProductId } = req.params;
    const { rating } = req.body;

    const rateBuyerQuery = formatUpdateColumnsQuery(TRANSACTION, { buyerRatingFromSeller: rating }, `listedProductId = ${listedProductId}`)

    this.conneciton.query(rateBuyerQuery).then(() => res.json('Complete buyer rating')).catch(next)
  };

  rateSeller: RequestHandler = (req, res, next) => {
    const { listedProductId } = req.params;
    const { rating } = req.body;

    const rateBuyerQuery = formatUpdateColumnsQuery(
      TRANSACTION,
      { sellerRatingFromBuyer: rating },
      `listedProductId = ${listedProductId}`
    );
    this.conneciton
      .query(rateBuyerQuery)
      .then(() => res.json('Complete buyer rating'))
      .catch(next);
  };
}

export default TransactionService;
