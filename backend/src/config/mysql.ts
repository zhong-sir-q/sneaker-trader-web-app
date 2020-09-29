import util from 'util';
import mysql from 'mysql';
import config from '.';

export type PromisifiedConnection = {
  query(sql: string | mysql.QueryOptions): Promise<any>;
  close(): Promise<any>;
};

// let _db: PromisifiedConnection;

// const makeDb = (): PromisifiedConnection => {
//   const sqlConnection = mysql.createConnection(config.sqlConnectionConfig);

//   return {
//     query(sql: string | mysql.QueryOptions) {
//       return util.promisify(sqlConnection.query).call(sqlConnection, sql);
//     },
//     close() {
//       return util.promisify(sqlConnection.end).call(sqlConnection);
//     },
//   };
// };

// // how do I manage db migration, i.e. keep the history of different versions of the db

// // test is necessary to make sure the query works, it does what we expect it to do
// export const initMysqlDb = () => {
//   if (_db) console.warn('Already established connection');
//   else {
//     _db = makeDb();
//   }
// };

// export const getMysqlDb = () => {
//   if (!_db) throw new Error('No connection to the database');

//   return _db;
// };

const pool = mysql.createPool(config.sqlConnectionConfig);

export const poolQuery = (sql: string) => util.promisify(pool.query).call(pool, sql);

const mysqlPoolConnection = (): Promise<PromisifiedConnection> => {
  return new Promise((resolve, reject) => {
    pool.getConnection((err, conn) => {
      if (err) reject(err);

      const query = (sql: string): Promise<any> => {
        return new Promise(async (resolve, reject) => {
          await poolQuery('START TRANSACTION');

          conn.query(sql, (queryErr, queryResult) => {
            if (queryErr) reject(queryErr);
            resolve(queryResult);
          });
        })
          .catch((err) => {
            conn.query('ROLLBACK');
            reject(err);
          })
          .finally(() => {
            conn.release();
          });
      };

      const close = () => util.promisify(conn.destroy).call(conn);

      resolve({ query, close });
    });
  });
};

export default mysqlPoolConnection;
