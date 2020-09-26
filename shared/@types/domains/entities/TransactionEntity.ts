import { Transaction } from '../../models';

interface TranscationEntity {
  create(transaction: Transaction): Promise<any>;
  get(listedProductId: number): Promise<Transaction>;

  rateBuyer(listedSneakerId: number, rating: number, comment: string): Promise<any>;
  rateSeller(listedSneakerId: number, rating: number, comment: string): Promise<any>;
}

export default TranscationEntity;
