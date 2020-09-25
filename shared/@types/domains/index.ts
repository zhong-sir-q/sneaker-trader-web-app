export * from './sneaker'
export * from './user'
export * from './transaction'

export * from './entities/CustomerEntity'
export * from './entities/ListedSneakerEntity'
export * from './entities/TransactionEntity'

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
