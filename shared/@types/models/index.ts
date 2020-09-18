export type User = {
  firstName: string;
  lastName: string;
  username: string;
  gender: string;
  dob: string;
  email: string;
  phoneNo: string;
  buyerRating?: string;
  sellerRating?: string;
  profilePicUrl?: string
  id?: number;
};

// customer can either be a seller or buyer
export type Customer = Pick<User, 'email' | 'username' | 'phoneNo' | 'buyerRating' | 'sellerRating'>;

// NOTE: type Sneaker and ListedProduct have some
// duplicate fields, how can I refactor that?
export type Sneaker = {
  name: string;
  brand: string;
  colorway: string;
  size: number | '';
  imageUrls: string;
  id?: number;
  RRP?: number;
  price?: number | '';
  buyer?: Customer;
  seller?: Customer;
  stringifiedBuyer?: string;
  stringifiedSeller?: string;
  quantity?: number;
  description?: string;
  prodStatus?: SneakerStatus;
  transactionId?: number;
};

export type SneakerCondition = 'new' | 'used' | 'dead stock';
export type SneakerStatus = 'listed' | 'pending' | 'sold';

export type ListedProduct = {
  // fk to Products table
  productId: number;
  // fk to Users table
  userId: number;
  askingPrice: number | '';
  quantity: number;
  sizeSystem: string;
  currencyCode: string;
  prodStatus: SneakerStatus;
  prodCondition: SneakerCondition;
  conditionRating: number
};

export type Transaction = {
  listedProductId: number;
  buyerId: number;
  sellerId: number;
  amount: number;
  processingFee: number;
  quantity?: number;
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
