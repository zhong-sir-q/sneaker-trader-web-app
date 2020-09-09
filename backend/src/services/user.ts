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

class UserService {
  private connection: PromisifiedConnection;

  constructor(conn: PromisifiedConnection) {
    this.connection = conn;
  }

  handleCreate: RequestHandler = async (req, res, next) => {
    const user = req.body;

    try {
      const createUserResult = await this.create(user);
      res.json(createUserResult);
    } catch (err) {
      next(err);
    }
  };

  handleGetByEmail: RequestHandler = async (req, res, next) => {
    const { email } = req.params;

    try {
      const user = await this.getByEmail(email);
      res.json(user);
    } catch (err) {
      next(err);
    }
  };

  handleUpdate: RequestHandler = async (req, res, next) => {
    const user = req.body;
    const condition = 'email = ' + doubleQuotedValue(user.email);

    const updateUserQuery = formatUpdateColumnsQuery(USERS, user, condition);

    try {
      const updateResult = await this.connection.query(updateUserQuery);
      res.json(updateResult);
    } catch (err) {
      next(err);
    }
  };

  async create(user: Partial<User>) {
    const createUserQuery = formatInsertColumnsQuery(USERS, user);

    return this.connection.query(createUserQuery);
  }

  async getByEmail(email: string): Promise<Partial<User>> {
    const getUserByEmailQuery = formateGetColumnsQuery(USERS, 'email = ' + doubleQuotedValue(email));

    try {
      const queryResult = await this.connection.query(getUserByEmailQuery);
      if (queryResult.length === 0) {
        // create the user
        try {
          const createUserResult = await this.create({ email });
          return createUserResult;
        } catch (err) {
          throw err;
        }
      } else return queryResult[0];
    } catch (err) {
      throw err;
    }
  }
}

export default UserService;
