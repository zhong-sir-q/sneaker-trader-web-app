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

export type Sneaker = {
  name: string;
  brand: string;
  colorWay: string;
  size: number | undefined;
  price: number | undefined;
  imageUrls: string;
  description?: string;
};
