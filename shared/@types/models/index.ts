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
  colorway: string;
  size: number | '';
  price: number | '';
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

export type Brand = {
  brand: string
}

export type Colorway = {
  colorway: string
}

export type SneakerName = {
  name: string
}

export type SizeMinPriceGroupType = { size: number, minPrice: number }[]
