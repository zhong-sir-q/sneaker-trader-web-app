import { User } from '../models';

// customer can either be a seller or buyer
export type Customer = Pick<User, 'email' | 'username' | 'phoneNo'> & { buyerRating: number; sellerRating: number };

export type AppUser = Omit<User, 'id' | 'rankingPoint'>;

export type ListedSneakerSeller = {
  id: number;
  username: string;
  email: string;
  askingPrice: number;
  listedProductId: number;
  rating: number;
};

export type CreateUserPayload = Omit<AppUser, 'profilePicUrl'>;
