// the keys map to the columns of the BuyingHistory table

export type DbSneaker = {
  id: string;
  size: number;
  brand: string;
  colorWay: string;
  serialNumber: string;
  price: number;
  priceId: string;
  description: string;
  name: string;
  imageUrl?: string;
};

export type User = {
  firstName: string;
  lastName: string;
  userName: string;
  gender: string;
  dob: string;
  email: string;
};
