import mysqlPoolConnection from '../config/mysql';
import { formatInsertColumnsQuery, formatUpdateColumnsQuery, formatGetRowsQuery } from '../utils/formatDbQuery';
import { TRANSACTION } from '../config/tables';
import TranscationEntity from '../../../shared/@types/domains/entities/TransactionEntity';
import { Transaction, BuyerPurchasedSneaker, MonthlyProfit } from '../../../shared';
import { getSellersAvgRatingQuery } from '../utils/queries';

class TransactionService implements TranscationEntity {
  async get(listedSneakerId: number) {
    const findTransactionQuery = formatGetRowsQuery(TRANSACTION, `listedProductId = ${listedSneakerId}`);

    const poolConn = await mysqlPoolConnection();
    const res = await poolConn.query(findTransactionQuery);

    return res.length === 0 ? null : res[0];
  }

  async create(transaction: Transaction) {
    const poolConn = await mysqlPoolConnection();
    return poolConn.query(formatInsertColumnsQuery(TRANSACTION, transaction));
  }

  async rateBuyer(listedProductId: number, rating: number, comment: string) {
    const rateSellerQuery = formatUpdateColumnsQuery(
      TRANSACTION,
      { buyerRatingFromSeller: rating, buyerCommentFromSeller: comment },
      `listedProductId = ${listedProductId}`
    );

    const poolConn = await mysqlPoolConnection();
    return poolConn.query(rateSellerQuery);
  }

  async rateSeller(listedProductId: number, rating: number, comment: string) {
    const rateSellerQuery = formatUpdateColumnsQuery(
      TRANSACTION,
      { sellerRatingFromBuyer: rating, sellerCommentFromBuyer: comment },
      `listedProductId = ${listedProductId}`
    );

    const poolConn = await mysqlPoolConnection();
    return poolConn.query(rateSellerQuery);
  }

  async getPurchasedSneakersByBuyerId(buyerId: number): Promise<BuyerPurchasedSneaker[]> {
    const getSellersInfo = `
      SELECT email, name, username, phoneNo, U.id as userId, 
        IF(T.sellerRatingFromBuyer > 0, 1, 0) AS hasBuyerRatedSeller FROM
          Transactions T, Users U WHERE listedProductId = L.id AND T.sellerId = U.id
    `;

    const getSellerObjectQuery = `
      SELECT JSON_OBJECT("email", email, "username", username, 
        "phoneNo", phoneNo, "sellerRating", sellerRating, "hasBuyerRatedSeller", hasBuyerRatedSeller)
          FROM ( ${getSellersInfo} ) q1 LEFT JOIN
            ( ${getSellersAvgRatingQuery('sellerRating')} ) q2 ON q1.userId = q2.sellerId
    `;

    const sellerIfPendingOrSoldProduct = `
      IF(prodStatus = 'pending' OR prodStatus = 'sold', 
        (${getSellerObjectQuery}), null) AS stringifiedSeller`;

    const getPurchasedProductsQuery = `
      SELECT T.amount as price, T.transactionDatetime, T.quantity, L.*, name, colorway, brand, size, prodStatus, sizeSystem,
        ${sellerIfPendingOrSoldProduct} FROM Transactions T, ListedProducts L, Products P
          WHERE T.buyerId = ${buyerId} AND T.listedProductId = L.id AND L.productId = P.id
            ORDER BY T.transactionDatetime DESC
    `;

    const poolConn = await mysqlPoolConnection();
    const purchasedSneakers = await poolConn.query(getPurchasedProductsQuery);

    if (!purchasedSneakers) return [];

    for (const sneaker of purchasedSneakers) {
      sneaker.seller = JSON.parse(sneaker.stringifiedSeller);
      delete sneaker.stringifiedSeller;
    }

    return purchasedSneakers;
  }

  // get the cumulative monthly profit of the last 12 month
  async getCumMonthlyProfit(sellerId: number): Promise<MonthlyProfit[]> {
    const poolConn = await mysqlPoolConnection();

    const getMonthlyCumProfitQuery = `
      SELECT ROUND(SUM((T.amount - T.processingFee - L.originalPurchasePrice))) as cumMonthlyProfit, 
        MONTH(T.transactionDatetime) AS transactionMonth FROM Transactions T,
          ListedProducts L WHERE sellerId = ${sellerId} AND T.listedProductId = L.id AND L.prodStatus = 'sold'
            AND T.transactionDatetime > DATE_SUB(NOW(), INTERVAL 12 MONTH) GROUP BY MONTH(T.transactionDatetime)
    `;

    return poolConn.query(getMonthlyCumProfitQuery);
  }
}

export default TransactionService;
