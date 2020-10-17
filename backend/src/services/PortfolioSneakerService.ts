import { PortfolioSneakerEntity, PortfolioSneaker } from '../../../shared';

import { formateGetColumnsQuery, formatInsertColumnsQuery, formatDeleteQuery } from '../utils/formatDbQuery';

import mysqlPoolConnection from '../config/mysql';
import { PORTFOLIO_SNEAKER } from '../config/tables';

class PortfolioSneakerService implements PortfolioSneakerEntity {
  async getAllByUserId(userId: number): Promise<PortfolioSneaker[]> {
    const poolConn = await mysqlPoolConnection();

    const getQuery = formateGetColumnsQuery(PORTFOLIO_SNEAKER, `userId = ${userId}`);
    return poolConn.query(getQuery);
  }

  async add(sneaker: Partial<PortfolioSneaker>): Promise<number> {
    const poolConn = await mysqlPoolConnection();

    const addQuery = formatInsertColumnsQuery(PORTFOLIO_SNEAKER, sneaker);

    const res = await poolConn.query(addQuery);

    return res[0].insertId;
  }

  async delete(portfolioSneakerId: number): Promise<void> {
    const poolConn = await mysqlPoolConnection();

    const delQuery = formatDeleteQuery(PORTFOLIO_SNEAKER, `id = ${portfolioSneakerId}`);

    return poolConn.query(delQuery);
  }
}

export default PortfolioSneakerService;
