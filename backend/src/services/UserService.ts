import {
  formatInsertColumnsQuery,
  formateGetColumnsQuery,
  doubleQuotedValue,
  formatUpdateColumnsQuery,
} from '../utils/formatDbQuery';

import WalletService from './WalletService';

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

    // create the wallet for the user
    new WalletService().create(userId);

    return userId;
  }

  async getByEmail(email: string): Promise<User> {
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
