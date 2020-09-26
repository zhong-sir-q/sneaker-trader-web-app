import TranscationEntity from '../../../shared/@types/domains/entities/TransactionEntity';
import formatApiEndpoint from './formatApiEndpoint';
import { Transaction, CreateTransactionPayload } from '../../../shared';
import formatRequestOptions from './formatRequestOptions';

class TransactionController implements TranscationEntity {
  transactionPath: string;

  constructor() {
    this.transactionPath = formatApiEndpoint('transaction');
  }

  get = (listedSneakerId: number): Promise<Transaction> =>
    fetch(`${this.transactionPath}/${listedSneakerId}`).then((r) => r.json());

  create = (payload: CreateTransactionPayload) =>
    fetch(this.transactionPath, formatRequestOptions(payload, undefined, 'POST'));

  async hasBuyerRatedSeller(listedSneakerId: number): Promise<boolean> {
    const transaction = await this.get(listedSneakerId);

    return transaction && transaction.sellerRatingFromBuyer > 0;
  }

  async hasSellerRatedBuyer(listedSneakerId: number): Promise<boolean> {
    const transaction = await this.get(listedSneakerId);

    return transaction && transaction.buyerRatingFromSeller > 0;
  }

  rateBuyer = (listedProductId: number, rating: number, comment: string) =>
    fetch(
      this.transactionPath + `/rating/buyer/${listedProductId}`,
      formatRequestOptions({ rating, comment }, undefined, 'PUT')
    ).then((r) => r.json());

  rateSeller = (listedProductId: number, rating: number, comment: string) =>
    fetch(
      this.transactionPath + `/rating/seller/${listedProductId}`,
      formatRequestOptions({ rating, comment }, undefined, 'PUT')
    ).then((r) => r.json());
}

const TransactionControllerInstance = new TransactionController();

export default TransactionControllerInstance;
