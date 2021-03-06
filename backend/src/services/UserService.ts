import {
  formatInsertRowsQuery,
  formatGetRowsQuery,
  doubleQuotedValue,
  formatUpdateRowsQuery,
  formatDeleteQuery,
} from '../utils/formatDbQuery';

import { User, UserServiceEntity, UserRankingRow } from '../../../shared';
import mysqlPoolConnection from '../config/mysql';
import { USERS, TRANSACTION } from '../config/tables';

class UserService implements UserServiceEntity {
  async update(email: string, user: Partial<User>) {
    const poolConn = await mysqlPoolConnection();
    const condition = 'email = ' + doubleQuotedValue(email);
    const updateUserQuery = formatUpdateRowsQuery(USERS, user, condition);

    return poolConn.query(updateUserQuery);
  }

  async create(user: Partial<User>) {
    const poolConn = await mysqlPoolConnection();

    if (!user.email) throw new Error('Email is required');
    if (!user) throw new Error('Recieved a null user');

    await this.checkDuplicateEmail(user.email);

    if (user.username) await this.checkDuplicateUsername(user.username);

    const createUserQuery = formatInsertRowsQuery(USERS, user);
    const userId = await poolConn.query(createUserQuery).then((result) => result.insertId);

    return userId;
  }

  async checkDuplicateUsername(username: string) {
    const user = await this.getByUsername(username);
    if (user) throw new Error('Username is chosen');
  }

  async checkDuplicateEmail(email: string) {
    const user = await this.getByEmail(email);
    if (user) throw new Error('Email is chosen');
  }

  async getByUsername(username: string): Promise<User | null> {
    const poolConn = await mysqlPoolConnection();

    const getQuery = formatGetRowsQuery(USERS, `username = ${doubleQuotedValue(username)}`);
    const res = await poolConn.query(getQuery);

    return res.length === 0 ? null : res[0];
  }

  async getByEmail(email: string): Promise<User> {
    const poolConn = await mysqlPoolConnection();
    const getUserByEmailQuery = formatGetRowsQuery(USERS, 'email = ' + doubleQuotedValue(email));
    const res = await poolConn.query(getUserByEmailQuery);

    return res.length === 0 ? null : res[0];
  }

  async deleteByUsername(username: string) {
    const poolConn = await mysqlPoolConnection();
    return poolConn.query(formatDeleteQuery(USERS, `username = ${doubleQuotedValue(username)}`));
  }

  async getRankingPointsByUserId(userId: number): Promise<number> {
    const poolConn = await mysqlPoolConnection();
    const getNumTransactionQuery = `
      SELECT COUNT(*) AS numTransactions FROM ${TRANSACTION} WHERE
        buyerId = ${userId} OR sellerId = ${userId}
    `;
    const res = await poolConn.query(getNumTransactionQuery);
    const rankingPoints = res[0].numTransactions;

    return rankingPoints;
  }

  async getAllUserRankingPoints(): Promise<UserRankingRow[]> {
    const poolConn = await mysqlPoolConnection();

    // points for buying or selling the sneaker
    const getTransactionPoints = `
      SELECT U.id as userId, profilePicUrl, COUNT(*) AS transactionPoints
        FROM Transactions T, Users U  WHERE sellerId = U.id OR buyerId = U.id 
          GROUP BY U.id ORDER BY transactionPoints DESC`;

    // points for listing the sneaker
    const getListingPoints = `
      SELECT U.id as userId, username, COUNT(*) as listingPoints FROM Users U, ListedProducts L
         WHERE L.userId = U.id GROUP BY U.id ORDER BY listingPoints DESC`;

    const query = `
      SELECT username, profilePicUrl, (listingPoints + transactionPoints) as rankingPoints FROM (${getTransactionPoints}) X 
        INNER JOIN (${getListingPoints}) Y ON X.userId = Y.userId ORDER BY rankingPoints DESC`;

    return poolConn.query(query);
  }
}

export default UserService;
