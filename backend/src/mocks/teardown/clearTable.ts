import mysqlPoolConnection from '../../config/mysql';

const clearTable = async (tableName: string) => {
  const poolConn = await mysqlPoolConnection();
  poolConn.query(`DELETE FROM ${tableName}`);
};

export default clearTable;
