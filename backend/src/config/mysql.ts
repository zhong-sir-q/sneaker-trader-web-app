import util from 'util';
import mysql from 'mysql';
import config from '.';

export type DataConnection = {
  query(sql: string | mysql.QueryOptions): Promise<any>;
  close(): Promise<any>;
};

const pool = mysql.createPool(config.sqlConnectionConfig);

export const endPool = () => pool.end();

function mysqlPoolConnection(): Promise<DataConnection> {
  return new Promise((resolve, reject) => {
    pool.getConnection((err, conn) => {
      if (err) reject(err);

      const query = (sql: string): Promise<any> => {
        return new Promise((resolve, reject) => {
          conn.beginTransaction();

          conn.query(sql, (queryErr, queryResult) => {
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
};

export const poolQuery = (sql: string) => util.promisify(pool.query).call(pool, sql);

export default mysqlPoolConnection;
