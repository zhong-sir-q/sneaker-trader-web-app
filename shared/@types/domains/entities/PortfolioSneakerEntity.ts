import { PortfolioSneaker } from '../../models';

export interface PortfolioSneakerEntity {
  getAllByUserId(userId: number): Promise<PortfolioSneaker[]>;
  add(sneaker: Partial<PortfolioSneaker>): Promise<number>;
  delete(portfolioSneakerId: number): Promise<void>;
}
