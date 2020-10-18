import { PortfolioSneakerEntity, PortfolioSneaker, PortfolioSneakerWithMarketValue } from '../../../../shared';
import formatApiEndpoint, { concatPaths } from 'utils/formatApiEndpoint';
import formatRequestOptions from 'utils/formatRequestOptions';

export class PortfolioController implements PortfolioSneakerEntity {
  portfolioPath: string;

  constructor() {
    this.portfolioPath = formatApiEndpoint('portfolio');
  }

  getAllByUserId = (userId: number): Promise<PortfolioSneaker[]> =>
    fetch(concatPaths(this.portfolioPath, 'all', userId)).then((r) => r.json());

  getAllWithMarketValueByUserId = (userId: number): Promise<PortfolioSneakerWithMarketValue[]> =>
    fetch(concatPaths(this.portfolioPath, 'all', 'marketValue', userId)).then((r) => r.json());

  add = (sneaker: Partial<PortfolioSneaker>): Promise<number> =>
    fetch(this.portfolioPath, formatRequestOptions(sneaker)).then((r) => r.json());

  delete = (portfolioSneakerId: number): Promise<void> =>
    fetch(
      concatPaths(this.portfolioPath, portfolioSneakerId),
      formatRequestOptions(undefined, undefined, 'DELETE')
    ).then((r) => r.json());
}

const PortfolioControllerInstance = new PortfolioController();

export default PortfolioControllerInstance;
