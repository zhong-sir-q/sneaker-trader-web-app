export * from './sneaker';
export * from './user';
export * from './transaction';

export * from './entities/CustomerEntity';
export * from './entities/ListedSneakerEntity';
export * from './entities/TransactionEntity';
export * from './entities/WalletEntity';
export * from './entities/HelperInfoEntity';
export * from './entities/TransactionsEntity';
export * from './entities/SneakerEntity';
export * from './entities/AddressEntity';
export * from './entities/PortfolioSneakerEntity';
export * from './entities/GoogleOauthEntity';

export type DecreaseWalletPayload = {
  userId: number;
  amount: number;
};

export type TopupWalletPayload = {
  userId: number;
  amount: number;
};

export type MailAfterPurchasePayload = {
  sellerUserName: string;
  sellerEmail: string;
  buyerUserName: string;
  buyerEmail: string;
  productName: string;
};

export type NewRequestSneaker = {
  id: number;
  productId: number;
  name: string;
  colorway: string;
  size: number;
  mainDisplayImage: string;
};

export type HelperInfoType = 'sneakernames' | 'colorways' | 'brands';

export type UserRankingRow = { username: string; profilePicUrl: string; rankingPoints: number };
