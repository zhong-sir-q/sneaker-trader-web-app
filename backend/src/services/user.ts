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

class UserService {
  private connection: PromisifiedConnection;

  constructor(conn: PromisifiedConnection) {
    this.connection = conn;
  }

  handleCreate: RequestHandler = async (req, res, next) => {
    const user = req.body;

    this.create(user).then(userId => res.json(userId)).catch(next)
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

    return userId
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
}

export default UserService;
