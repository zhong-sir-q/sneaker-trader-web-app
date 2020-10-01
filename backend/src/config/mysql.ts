import util from 'util';
import mysql from 'mysql';
import config from '.';

export type PromisifiedConnection = {
  query(sql: string | mysql.QueryOptions): Promise<any>;
  close(): Promise<any>;
};

const pool = mysql.createPool(config.sqlConnectionConfig);

const mysqlPoolConnection = (): Promise<PromisifiedConnection> => {
  return new Promise((resolve, reject) => {
    pool.getConnection((err, conn) => {
      if (err) reject(err);

      const query = (sql: string): Promise<any> => {
        return new Promise((resolve, reject) => {
          conn.query('START TRANSACTION')

          conn.query(sql, (queryErr, queryResult) => {
            if (queryErr) {
              reject(queryErr);
              return
            }

            conn.query('COMMIT')
            resolve(queryResult);
          });
        })
          .catch((err) => {
            console.log(`Encountered error: ${err.message}, rolling back...`)
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

export const poolQuery = (sql: string) => util.promisify(pool.query).call(pool, sql);

export default mysqlPoolConnection;
