export type User = {
  firstName: string;
  lastName: string;
  userName: string;
  gender: string;
  dob: string;
  email: string;
  id?: number;
};

export type Sneaker = {
  name: string;
  brand: string;
  colorWay: string;
  size: number | undefined;
  price: number | undefined;
  imageUrls: string;
  id?: number;
  description?: string;
};

export type ListedProduct = {
  // fk to Products table
  productId: number;
  // fk to Users table
  userId: number;
  askingPrice: number;
  quantity: number;
  sold: 0 | 1;
};

export type GallerySneakersType = {
  [brand: string]: {
    [size: number]: { [colorName: string]: Sneaker };
  };
};

export type UserSizeGroupedPriceType = { [size: number]: { [userId: number]: number } & { lowestAsk: number } };

export type GetUserSizeGroupedPriceType = Sneaker & {
  payload: UserSizeGroupedPriceType;
};
