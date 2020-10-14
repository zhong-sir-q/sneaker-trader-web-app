import { Transaction } from '../../models';
import { BuyerPurchasedSneaker } from '..';
import { MonthlyProfit } from '../transaction';

interface TranscationEntity {
  create(transaction: Transaction): Promise<any>;
  get(listedProductId: number): Promise<Transaction>;

  rateBuyer(listedSneakerId: number, rating: number, comment: string): Promise<any>;
  rateSeller(listedSneakerId: number, rating: number, comment: string): Promise<any>;
  getPurchasedSneakersByBuyerId(buyerId: number): Promise<BuyerPurchasedSneaker[] | null>;
  getCumMonthlyProfit(sellerId: number): Promise<MonthlyProfit[]>;
}

export default TranscationEntity;
