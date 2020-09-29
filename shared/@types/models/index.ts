export type SocialProvider = 'google' | 'facebook';

export type User = {
  id: number;
  firstName: string;
  lastName: string;
  username: string;
  gender: string;
  dob: string;
  email: string;
  phoneNo: string;
  rankingPoint: number;
  profilePicUrl: string;
  signinMethod: 'email' | SocialProvider;
};

export type Sneaker = {
  id: number;
  RRP: number;
  size: number;
  name: string;
  brand: string;
  colorway: string;
  imageUrls: string;
  description: string;
};

export type SneakerCondition = 'new' | 'used' | 'dead stock';
export type SneakerStatus = 'listed' | 'pending' | 'sold';

export type ListedProduct = {
  id: number;
  // fk to Products table
  productId: number;
  // fk to Users table
  userId: number;
  askingPrice: number;
  quantity: number;
  sizeSystem: string;
  currencyCode: string;
  prodStatus: SneakerStatus;
  prodCondition: SneakerCondition;
  conditionRating: number;
  imageUrls: string;
};

export type Transaction = {
  id: number;
  quantity: number;
  buyerId: number;
  sellerId: number;
  amount: number;
  processingFee: number;
  listedProductId: number;
  buyerRatingFromSeller: number;
  sellerRatingFromBuyer: number;
  buyerCommentFromSeller: string | null;
  sellerCommentFromBuyer: string | null;
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
