import mysqlPoolConnection from '../../config/mysql';

const clearTable = async (tableName: string) => {
  
  await this.conn.query(`DELETE FROM ${tableName}`);
};

export default clearTable;
