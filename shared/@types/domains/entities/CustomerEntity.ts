import { User } from '../../models';
import { ListedSneakerSeller } from '../user';
import { UserRankingRow } from '..';

export interface UserEntity {
  // return the id of the created user
  create(user: Partial<User>): Promise<number>;
  getByEmail(email: string): Promise<User | null>;
  getByUsername(username: string): Promise<User | null>;
  update(user: User): Promise<any>;
  deleteByUsername(username: string): Promise<any>;
  getRankingPointsByUserId(userId: number): Promise<number>;
  getAllUserRankingPoints(): Promise<UserRankingRow[]>;
}

interface UserUseCase {
  checkDuplicateUsername(username: string): Promise<void>;
  checkDuplicateEmail(email: string): Promise<void>;
}

export interface UserServiceEntity extends UserEntity, UserUseCase {}

export interface SellerEntity {
  getSellersBySneakerNameSize(
    currentUserId: number,
    nameColorway: string,
    size: number
  ): Promise<ListedSneakerSeller[]>;
}
