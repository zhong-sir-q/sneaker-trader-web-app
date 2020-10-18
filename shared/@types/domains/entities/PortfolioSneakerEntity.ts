import { PortfolioSneaker } from '../../models';
import { PortfolioSneakerWithMarketValue } from '..';

export interface PortfolioSneakerEntity {
  getAllByUserId(userId: number): Promise<PortfolioSneaker[]>;
  getAllWithMarketValueByUserId(userId: number): Promise<PortfolioSneakerWithMarketValue[]>;
  add(sneaker: Partial<PortfolioSneaker>): Promise<number>;
  delete(portfolioSneakerId: number): Promise<void>;
}
