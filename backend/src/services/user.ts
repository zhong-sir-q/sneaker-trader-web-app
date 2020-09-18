import {
  formatInsertColumnsQuery,
  formateGetColumnsQuery,
  doubleQuotedValue,
  formatUpdateColumnsQuery,
} from '../utils/formatDbQuery';
import { User } from '../../../shared';
import { RequestHandler } from 'express';
import { PromisifiedConnection } from '../config/mysql';
import { USERS } from '../config/tables';
import WalletService from './wallet';

import { getBuyersAvgRatingQuery, getSellersAvgRatingQuery } from '../utils/queries';

class UserService {
  private connection: PromisifiedConnection;

  constructor(conn: PromisifiedConnection) {
    this.connection = conn;
  }

  handleCreate: RequestHandler = async (req, res, next) => {
    const user = req.body;

    this.create(user)
      .then((userId) => res.json(userId))
      .catch(next);
  };

  handleGetByEmail: RequestHandler = async (req, res, next) => {
    const { email } = req.params;

    this.getByEmail(email)
      .then((user) => res.json(user))
      .catch(next);
  };

  handleUpdate: RequestHandler = async (req, res, next) => {
    const user = req.body;
    const condition = 'email = ' + doubleQuotedValue(user.email);
    const updateUserQuery = formatUpdateColumnsQuery(USERS, user, condition);

    this.connection
      .query(updateUserQuery)
      .then((updateResult) => res.json(updateResult))
      .catch(next);
  };

  async create(user: Partial<User>) {
    const createUserQuery = formatInsertColumnsQuery(USERS, user);
    const userId = await this.connection.query(createUserQuery).then((result) => result.insertId);

    // create the wallet for the user
    new WalletService(this.connection).create(userId);

    return userId;
  }

  async getByEmail(email: string): Promise<Partial<User>> {
    const getUserByEmailQuery = formateGetColumnsQuery(USERS, 'email = ' + doubleQuotedValue(email));
    const queryResult = await this.connection.query(getUserByEmailQuery);

    if (queryResult.length === 0) {
      const createUserResult = await this.create({ email });
      return createUserResult;
    }

    return queryResult[0];
  }

  handleGetBuyerAvgRating: RequestHandler = (req, res, next) => {
    const { buyerId } = req.params;

    this.getBuyerAvgRating(buyerId)
      .then((rating) => res.json(rating))
      .catch(next);
  };

  handleGetSellerAvgRating: RequestHandler = (req, res, next) => {
    const { sellerId } = req.params;

    this.getSellerAvgRating(sellerId)
      .then((rating) => res.json(rating))
      .catch(next);
  };

  getBuyerAvgRating(buyerId: string) {
    return this.connection
      .query(getBuyersAvgRatingQuery('buyerRating', `WHERE buyerId = ${buyerId}`))
      .then((result) => (result.length == 1 ? result[0].buyerRating : 0));
  }

  getSellerAvgRating(sellerId: string) {
    return this.connection
      .query(getSellersAvgRatingQuery('sellerRating', `WHERE sellerId = ${sellerId}`))
      .then((result) => (result.length == 1 ? result[0].sellerRating : 0));
  }
}

export default UserService;
