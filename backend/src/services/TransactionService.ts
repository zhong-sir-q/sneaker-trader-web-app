import mysqlPoolConnection from '../config/mysql';
import { formatInsertColumnsQuery, formatUpdateColumnsQuery, formateGetColumnsQuery } from '../utils/formatDbQuery';
import { TRANSACTION } from '../config/tables';
import TranscationEntity from '../../../shared/@types/domains/entities/TransactionEntity';
import { Transaction, BuyerPurchasedSneaker } from '../../../shared';
import { getSellersAvgRatingQuery } from '../utils/queries';

class TransactionService implements TranscationEntity {
  async get(listedSneakerId: number) {
    const findTransactionQuery = formateGetColumnsQuery(TRANSACTION, `listedProductId = ${listedSneakerId}`);

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
      SELECT email, name, username, phoneNo, U.id as userId FROM
        Transactions T, Users U WHERE listedProductId = L.id AND T.sellerId = U.id
    `;

    const getSellerObjectQuery = `
      SELECT JSON_OBJECT("email", email, "username", username, 
        "phoneNo", phoneNo, "sellerRating", sellerRating)
          FROM ( ${getSellersInfo} ) q1 LEFT JOIN
            ( ${getSellersAvgRatingQuery('sellerRating')} ) q2 ON q1.userId = q2.sellerId
    `;

    const sellerIfPendingOrSoldProduct = `
      IF(prodStatus = 'pending' OR prodStatus = 'sold', 
        (${getSellerObjectQuery}), null) AS stringifiedSeller`;

    const getPurchasedProductsQuery = `
      SELECT T.amount as price, T.transactionDatetime, T.quantity, L.id, name, L.imageUrls, colorway, brand, size, prodStatus, sizeSystem,
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
}

export default TransactionService;
