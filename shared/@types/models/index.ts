// TODO: dynamically translate the datatype of the columns of the database to here
export type TransactionStatus = 'completed' | 'refunded';

// the keys map to the columns of the BuyingHistory table
export type BuyingHistory = {
  payment_intent_id: string;
  customer_id: string;
  product_id: string;
  status: TransactionStatus;
};

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
  image_url?: string;
};

export type StripeSneaker = Omit<Omit<DbSneaker, 'id'>, 'price_id'>;

export type BoughtSneaker = BuyingHistory & DbSneaker;
