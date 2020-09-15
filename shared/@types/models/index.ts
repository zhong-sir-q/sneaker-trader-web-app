export type User = {
  firstName: string;
  lastName: string;
  userName: string;
  gender: string;
  dob: string;
  email: string;
  id?: number;
};

// NOTE: type Sneaker and ListedProduct have some 
// duplicate fields, how can I refactor that?
export type Sneaker = {
  name: string;
  brand: string;
  colorway: string;
  size: number | '';
  imageUrls: string;
  sold?: 0 | 1
  price?: number | '';
  RRP?: number;
  id?: number;
  quantity?: number
  description?: string;
};

export type SneakerCondition = 'new' | 'used' | 'dead stock';

export type ListedProduct = {
  // fk to Products table
  productId: number;
  // fk to Users table
  userId: number;
  askingPrice: number | '';
  quantity: number;
  sizeSystem: string;
  currencyCode: string;
  sold: 0 | 1;
  prodCondition: SneakerCondition;
};

export type Brand = {
  brand: string;
};

export type Colorway = {
  colorway: string;
};

export type SneakerName = {
  name: string;
};

export type SizeMinPriceGroupType = { size: number; minPrice: number }[];
