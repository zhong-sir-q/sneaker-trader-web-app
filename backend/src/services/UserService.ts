import {
  formatInsertColumnsQuery,
  formateGetColumnsQuery,
  doubleQuotedValue,
  formatUpdateColumnsQuery,
  formatDeleteQuery,
} from '../utils/formatDbQuery';

import { User, UserEntity } from '../../../shared';
import mysqlPoolConnection from '../config/mysql';
import { USERS } from '../config/tables';

class UserService implements UserEntity {
  async update(user: User) {
    const poolConn = await mysqlPoolConnection();
    const condition = 'email = ' + doubleQuotedValue(user.email);
    const updateUserQuery = formatUpdateColumnsQuery(USERS, user, condition);

    return poolConn.query(updateUserQuery);
  }

  async create(user: Partial<User>) {
    const poolConn = await mysqlPoolConnection();

    const createUserQuery = formatInsertColumnsQuery(USERS, user);
    const userId = await poolConn.query(createUserQuery).then((result) => result.insertId);

    return userId;
  }

  async getByUsername(username: string): Promise<User> {
    const poolConn = await mysqlPoolConnection();

    const getQuery = formateGetColumnsQuery(USERS, `username = ${doubleQuotedValue(username)}`);
    const res = await poolConn.query(getQuery);

    return res.length === 0 ? null : res[0];
  }

  async getByEmail(email: string): Promise<User> {
    const poolConn = await mysqlPoolConnection();
    const getUserByEmailQuery = formateGetColumnsQuery(USERS, 'email = ' + doubleQuotedValue(email));
    const res = await poolConn.query(getUserByEmailQuery);

    return res.length === 0 ? null : res[0];
  }

  async deleteByUsername(username: string) {
    const poolConn = await mysqlPoolConnection();
    return poolConn.query(formatDeleteQuery(USERS, `username = ${doubleQuotedValue(username)}`));
  }
}

export default UserService;
