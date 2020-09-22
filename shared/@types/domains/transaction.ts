import { Transaction } from '../models';

export type CreateTransactionPayload = Pick<
  Transaction,
  'buyerId' | 'sellerId' | 'amount' | 'processingFee' | 'listedProductId'
>;
