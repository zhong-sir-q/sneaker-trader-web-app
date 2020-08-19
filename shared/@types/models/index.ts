// the keys map to the columns of the BuyingHistory table

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
