import { User, Transaction } from '../models';

// customer can either be a seller or buyer
export type Customer = Pick<User, 'email' | 'username' | 'phoneNo'> & { buyerRating: number; sellerRating: number };

export type AppUser = Omit<User, 'id' | 'rankingPoints'>;

export type ListedSneakerSeller = {
  id: number;
  username: string;
  email: string;
  askingPrice: number;
  listedProductId: number;
  rating: number;
  sneakerImgUrls: string;
  profilePicUrl: string;
};

export type Buyer = Customer & Pick<Transaction, 'transactionDatetime'> & { hasSellerRatedBuyer: 0 | 1 };

export type Seller = Customer & { hasBuyerRatedSeller: 0 | 1 };

export type CreateUserPayload = Omit<AppUser, 'profilePicUrl'>;

export type AddrVerificationStatus = 'not_verified' | 'in_progress' | 'verified';

export type Address = {
  street: string;
  city: string;
  region: string;
  zipcode: number | '';
  country: string;
  suburb: string;
  verificationStatus: AddrVerificationStatus;
};
