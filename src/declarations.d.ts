import { MysqlError } from 'mysql';

// TODO: can potentially refactor these types into its individual files

// database objects
// TODO: dynamically translate the datatype of the columns of the database to here
export type DbSneaker = {
  id: string;
  size: number;
  brand: string;
  color_way: string;
  serial_number: string;
  price: number;
  price_id: string;
  description: string;
  name: string;
};

// TODO: put the defined types in a centralized place, so I can access them from both the client and server side
export type StripeSneaker = Omit<Omit<DbSneaker, 'id'>, 'price_id'>;

// the keys map to the columns of the BuyingHistory table
export type BuyingHistory = {
  payment_intent_id: string;
  customer_id: string;
  product_id: string;
};

// database query arguments
export type FormatCreateSessionOptionArgs = {
  priceId: string;
  productId: string;
  customerId: string;
};

export type FetchDbDataCallback = (err: MysqlError | undefined, queryResult: any) => Promise<void> | void;
