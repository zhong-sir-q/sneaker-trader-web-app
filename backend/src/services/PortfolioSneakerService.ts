import { PortfolioSneakerEntity, PortfolioSneaker, PortfolioSneakerWithMarketValue } from '../../../shared';

import { formatInsertRowsQuery, formatDeleteQuery } from '../utils/formatDbQuery';

import mysqlPoolConnection from '../config/mysql';
import { PORTFOLIO_SNEAKER, LISTED_PRODUCTS, PRODUCTS, TRANSACTION } from '../config/tables';

class PortfolioSneakerService implements PortfolioSneakerEntity {
  async getAllByUserId(userId: number): Promise<PortfolioSneaker[]> {
    const poolConn = await mysqlPoolConnection();

    const getQuery = `
      SELECT PS.* FROM ${PORTFOLIO_SNEAKER} PS, ${LISTED_PRODUCTS} L, ${PRODUCTS} P
        WHERE PS.userId = ${userId} AND L.productId = P.id
    `;

    return poolConn.query(getQuery);
  }

  async getAllWithMarketValueByUserId(userId: number): Promise<PortfolioSneakerWithMarketValue[]> {
    const poolConn = await mysqlPoolConnection();

    const getGroupedLatestTransactions = `
      SELECT name, colorway, size, T.amount as marketValue,
        MAX(T.transactionDatetime) AS latestTransactionDate 
          FROM ${TRANSACTION} T, ${LISTED_PRODUCTS} L, ${PRODUCTS} P 
            WHERE T.listedProductId = L.id AND L.productId = P.id 
              AND prodStatus = 'sold' GROUP BY name, colorway, size
    `

    const getPortfolioWithMarketValueQuery = `
      SELECT marketValue, latestTransactionDate, t2.*, (marketValue - t2.purchasePrice) AS gain,
          ROUND((marketValue - t2.purchasePrice) / t2.purchasePrice, 2) * 100 AS gainPercentage
            FROM (
              ${getGroupedLatestTransactions}        
            ) AS t1 RIGHT JOIN ${PORTFOLIO_SNEAKER} AS t2
              ON t1.name = t2.name AND t1.colorway = t2.colorway AND t1.size = t2.size
                WHERE userId = ${userId}
    `;

    return poolConn.query(getPortfolioWithMarketValueQuery);
  }

  async add(sneaker: Partial<PortfolioSneaker>): Promise<number> {
    const poolConn = await mysqlPoolConnection();

    const addQuery = formatInsertRowsQuery(PORTFOLIO_SNEAKER, sneaker);

    const res = await poolConn.query(addQuery);

    return res.insertId;
  }

  async delete(portfolioSneakerId: number): Promise<void> {
    const poolConn = await mysqlPoolConnection();

    const delQuery = formatDeleteQuery(PORTFOLIO_SNEAKER, `id = ${portfolioSneakerId}`);

    return poolConn.query(delQuery);
  }
}

export default PortfolioSneakerService;
