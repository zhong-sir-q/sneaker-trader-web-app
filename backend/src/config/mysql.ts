import util from 'util';
import mysql from 'mysql';
import config from '.';

export type DataConnection = {
  query(sql: string | mysql.QueryOptions, escapeData?: any[]): Promise<any>;
  close(): Promise<any>;
};

const pool = mysql.createPool(config.sqlConnectionConfig);

// Ping database to check for common exception errors.
pool.getConnection((err, connection) => {
  if (err) {
    if (err.code === 'PROTOCOL_CONNECTION_LOST') {
      console.error('Database connection was closed.');
    }
    if (err.code === 'ER_CON_COUNT_ERROR') {
      console.error('Database has too many connections.');
    }
    if (err.code === 'ECONNREFUSED') {
      console.error('Database connection was refused.');
    }
  }

  if (connection) connection.release();

  return;
});

// NOTE: this method should be removed, very hard to inject
// the sql  connection because the connection is promisified
function mysqlPoolConnection(): Promise<DataConnection> {
  return new Promise((resolve, reject) => {
    pool.getConnection((err, conn) => {
      if (err) reject(err);

      const query = (sql: string, escapeData: any[] = []): Promise<any> => {
        return new Promise((resolve, reject) => {
          conn.beginTransaction();

          conn.query(sql, escapeData, (queryErr, queryResult) => {
            if (queryErr) {
              console.log(`Encountered error: ${queryErr.message}, rolling back...`);
              conn.rollback();

              reject(queryErr);
              return;
            }

            conn.commit();
            resolve(queryResult);
          });
        }).finally(() => {
          conn.release();
        });
      };

      const close = () => util.promisify(conn.destroy).call(conn);

      resolve({ query, close });
    });
  });
}

export const endPool = () => pool.end();

export const poolQuery = (sql: string, escapeData?: any[]): Promise<any> =>
  new Promise((resolve, reject) => {
    pool.getConnection((err, conn) => {
      if (err) reject(err);

      conn.beginTransaction();

      conn.query(sql, escapeData, (queryErr, queryRes) => {
        if (queryErr) {
          console.log(`Encountered error: ${queryErr.message}, rolling back...`);
          conn.rollback();
          reject(queryErr);
          return;
        }

        conn.commit();
        resolve(queryRes);
      });

      conn.release();
    });
  });

export const promisifiedPool = { query: poolQuery };

export type PromisifiedPool = typeof promisifiedPool;

export default mysqlPoolConnection;
