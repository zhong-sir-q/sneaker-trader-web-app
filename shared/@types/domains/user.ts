import { User } from '../models';

// customer can either be a seller or buyer
export type Customer = Pick<User, 'email' | 'username' | 'phoneNo'> & { buyerRating: number; sellerRating: number };

export type AppUser = Omit<User, 'id' | 'rankingPoint'>;

export type CreateUserPayload = Omit<AppUser, 'profilePicUrl'>;
