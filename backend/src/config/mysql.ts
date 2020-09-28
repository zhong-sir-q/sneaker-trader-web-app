import util from 'util';
import mysql from 'mysql';
import config from '.';

export type PromisifiedConnection = {
  query(sql: string | mysql.QueryOptions): Promise<any>;
  close(): Promise<any>;
};

let _db: PromisifiedConnection;

const makeDb = (): PromisifiedConnection => {
  const sqlConnection = mysql.createConnection(config.sqlConnectionConfig);

  return {
    query(sql: string | mysql.QueryOptions) {
      return util.promisify(sqlConnection.query).call(sqlConnection, sql);
    },
    close() {
      return util.promisify(sqlConnection.end).call(sqlConnection);
    },
  };
};

// how do I manage db migration, i.e. keep the history of different versions of the db

// test is necessary to make sure the query works, it does what we expect it to do
export const initMysqlDb = () => {
  if (_db) console.warn('Already established connection');
  else {
    _db = makeDb();
  }
};

export const getMysqlDb = () => {
  if (!_db) throw new Error('No connection to the database');

  return _db;
};


const makePool = (): Promise<{ query(sql: string): Promise<any>; release(): Promise<void> }> => {
  const pool = mysql.createPool(config.sqlConnectionConfig);

  return new Promise((resolve, reject) => {
    pool.getConnection((err, conn) => {
      if (err) reject(err);

      const query = (sql: string): Promise<any> => {
        return new Promise((resolve, reject) => {
          conn.query(sql, (queryErr, queryResult) => {
            conn.release();

            if (queryErr) reject(queryErr);
            resolve(queryResult);
          });
        });
      };

      const release = (): Promise<void> => {
        return new Promise((resolve, reject) => {
          if (err) reject(err);
          resolve(conn.release());
        });
      };

      resolve({ query, release });
    });
  });
};
