import { User } from '../../models';
import { ListedSneakerSeller } from '../user';

export interface UserEntity {
  // return the id of the created user
  create(user: Partial<User>): Promise<number>;
  getByEmail(email: string): Promise<User>;
  update(user: User): Promise<any>;
}

export interface BuyerEntity {
  getAvgRating(buyerId: number): Promise<number>;
}

export interface SellerEntity {
  getSellersBySneakerNameSize(nameColorway: string, size: number): Promise<ListedSneakerSeller>;
  getAvgRating(sellerId: number): Promise<number>;
}
