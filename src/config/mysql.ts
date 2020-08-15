import mysql, { Connection } from 'mysql';
import config from '.';

let _db: Connection;

// TODO:
// how can I make my database interaction code-first, i.e. my code defines the schema of the table
// rather than having to change the schema of the table, then come back and change the relevant area of the code?

// how do I manage db migration, i.e. keep the history of different versions of the db

// test is necessary to make sure the query works, it does what we expect it to do

export const initMysqlDb = () => {
  if (_db) console.warn('Already established connection');
  else {
    _db = mysql.createConnection(config.sqlConnectionConfig);
    // TODO: when should I end the connection?
    // would using a connection pool here be better?
    _db.connect();
  }
};

export const getMysqlDb = () => {
  if (!_db) throw new Error('No connection to the database');

  return _db;
};
