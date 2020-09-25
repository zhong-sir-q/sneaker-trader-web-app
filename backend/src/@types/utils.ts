import { MysqlError } from 'mysql';
// database query arguments
export type FetchDbDataCallback = (err: MysqlError | undefined, queryResult: any) => Promise<any> | void;
