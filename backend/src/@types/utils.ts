import { MysqlError } from "mysql";

// database query arguments
export type FormatCreateSessionOptionArgs = {
    priceId: string;
    productId: string;
    customerId: string;
  };
  
  export type FetchDbDataCallback = (err: MysqlError | undefined, queryResult: any) => Promise<void> | void;
  