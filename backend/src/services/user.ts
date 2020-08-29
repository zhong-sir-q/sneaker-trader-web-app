import { Connection } from 'mysql';
import { FetchDbDataCallback } from '../@types/utils';
import { formatInsertColumnsQuery, formateGetColumnsQuery, doubleQuotedValue, formatUpdateColumnsQuery } from '../utils/formatDbQuery';
import { User } from '../../../shared';
import { RequestHandler } from 'express';

// TODO: is there a way to refactor all these callbacks?

class UserService {
  connection: Connection;
  tableName: string;
  constructor(conn: Connection) {
    this.connection = conn;
    this.tableName = 'Users';
  }

  handleCreate: RequestHandler = (req, res, next) => {
    const { user } = req.body;

    // refactor the callbacks, general and do soemthing if result not found
    const createUserCallback: FetchDbDataCallback = (err, queryResult) => {
      if (err) next(err);
      else res.json({ user: queryResult });
    };

    this.create(user, createUserCallback);
  };

  handleGetByEmail: RequestHandler = (req, res, next) => {
    const { email } = req.params;

    const getByEmailCallback: FetchDbDataCallback = (err, result) => {
      if (err) next(err);
      else res.json(result);
    };

    this.getByEmail(email, getByEmailCallback);
  };

  handleUpdate: RequestHandler = (req, res, next) => {
    const { user } = req.body
    const condition = 'email = ' + doubleQuotedValue(user.email)

    const updateUserQuery = formatUpdateColumnsQuery(this.tableName, user, condition)
    this.connection.query(updateUserQuery, (err, result) => {
      if (err) next(err)
      else res.json(result)
    })
  }

  create(user: User, cb: FetchDbDataCallback) {
    const query = formatInsertColumnsQuery(this.tableName, user);

    this.connection.query(query, (err, result) => {
      if (err) cb(err, undefined);
      else cb(undefined, result);
    });
  }

  getByEmail(email: string, cb: FetchDbDataCallback) {
    const query = formateGetColumnsQuery(this.tableName, 'email = ' + doubleQuotedValue(email));

    this.connection.query(query, (err, getUserResult) => {
      if (err) cb(err, undefined);
      else if (getUserResult.length === 0) {
        // create the user
        const user = { email };
        this.create(user as User, (error, createUserResult) => {
          if (error) cb(error, undefined);
          else cb(undefined, createUserResult);
        });
      } else cb(undefined, getUserResult[0]);
    });
  }
}

export default UserService;
