import { User } from '../../models';
import { ListedSneakerSeller } from '../user';

export interface UserEntity {
  // return the id of the created user
  create(user: Partial<User>): Promise<number>;
  getByEmail(email: string): Promise<User>;
  getByUsername(username: string): Promise<User>;
  update(user: User): Promise<any>;
  deleteByUsername(username: string): Promise<any>;
}

export interface UserControllerEntity extends UserEntity {
  isDuplicateUsername(username: string): Promise<boolean | void>;
  isDuplicateEmail(email: string): Promise<boolean | void>;
}

export interface BuyerEntity {
  getAvgRating(buyerId: number): Promise<number>;
}

export interface SellerEntity {
  getSellersBySneakerNameSize(nameColorway: string, size: number): Promise<ListedSneakerSeller>;
  getAvgRating(sellerId: number): Promise<number>;
}
