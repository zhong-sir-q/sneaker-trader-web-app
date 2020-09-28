import {
  formatInsertColumnsQuery,
  formateGetColumnsQuery,
  doubleQuotedValue,
  formatUpdateColumnsQuery,
  formatDeleteQuery,
} from '../utils/formatDbQuery';

import { User, UserEntity } from '../../../shared';
import { PromisifiedConnection, getMysqlDb } from '../config/mysql';
import { USERS } from '../config/tables';

class UserService implements UserEntity {
  private connection: PromisifiedConnection;

  constructor() {
    this.connection = getMysqlDb();
  }

  update(user: User) {
    const condition = 'email = ' + doubleQuotedValue(user.email);
    const updateUserQuery = formatUpdateColumnsQuery(USERS, user, condition);

    return this.connection.query(updateUserQuery);
  }

  async create(user: Partial<User>) {
    const createUserQuery = formatInsertColumnsQuery(USERS, user);
    const userId = await this.connection.query(createUserQuery).then((result) => result.insertId);

    return userId;
  }

  async getByUsername(username: string): Promise<User> {
    const getQuery = formateGetColumnsQuery(USERS, `username = ${doubleQuotedValue(username)}`);
    const res = await this.connection.query(getQuery);

    return res.length === 0 ? null : res[0];
  }

  async getByEmail(email: string): Promise<User> {
    const getUserByEmailQuery = formateGetColumnsQuery(USERS, 'email = ' + doubleQuotedValue(email));
    const res = await this.connection.query(getUserByEmailQuery);

    return res.length === 0 ? null : res[0];
  }

  deleteByUsername = (username: string) =>
    this.connection.query(formatDeleteQuery(USERS, `username = ${doubleQuotedValue(username)}`));
}

export default UserService;
