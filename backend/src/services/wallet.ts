import { PromisifiedConnection } from '../config/mysql';
import { formatInsertColumnsQuery, formateGetColumnsQuery, formatUpdateColumnsQuery } from '../utils/formatDbQuery';
import { WALLET } from '../config/tables';
import { RequestHandler } from 'express';

class WalletService {
  private connection: PromisifiedConnection;

  constructor(conn: PromisifiedConnection) {
    this.connection = conn;
  }

  getBalanceByUserId: RequestHandler = (req, res, next) => {
    const { userId } = req.params;
    const getBalanceByUserIdQuery = formateGetColumnsQuery(WALLET, `userId = ${userId}`);

    this.connection
      .query(getBalanceByUserIdQuery)
      .then((queryResult) => res.json(queryResult[0].balance))
      .catch(next);
  };

  handleTopup: RequestHandler = (req, res, next) => {
    const { userId, amount } = req.body;
    this.topUp(userId, amount)
      .then((result) => res.json(result))
      .catch(next);
  };

  handleDecreaseBalance: RequestHandler = (req, res, next) => {
    const { userId, amount } = req.body;
    this.decreaseBalance(userId, amount)
      .then((result) => res.json(result))
      .catch(next);
  };

  create(userId: string) {
    return this.connection.query(formatInsertColumnsQuery(WALLET, { userId }));
  }

  // amount cannot be negative
  // assume there is no limit
  topUp(userId: number, amount: number) {
    const topupQuery = `UPDATE ${WALLET} SET balance = balance + ${amount} WHERE userId = ${userId}`;

    return this.connection.query(topupQuery);
  }

  // amount cannot be negative
  // NOTE: assume balance can go to negative
  decreaseBalance(userId: number, amount: number) {
    const decreaseBalanceQuery = `UPDATE ${WALLET} SET balance = balance - ${amount} WHERE userId = ${userId}`;

    return this.connection.query(decreaseBalanceQuery);
  }
}

export default WalletService;
