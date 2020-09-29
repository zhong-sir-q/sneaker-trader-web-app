import mysqlPoolConnection from '../config/mysql';
import { getSellersAvgRatingQuery, getBuyersAvgRatingQuery } from '../utils/queries';
import { SellerListedSneaker, BuyerPurchasedSneaker } from '../../../shared';

class TransactionsService {
  async getListedBySellerId(sellerId: string): Promise<SellerListedSneaker[]> {
    const getBuyersInfo = `
      SELECT email, name, username, phoneNo, U.id as userId FROM
        Transactions T, Users U WHERE listedProductId = L.id AND T.buyerId = U.id
    `;

    const getBuyerQuery = `
      SELECT JSON_OBJECT("email", email, "username", username, 
      "phoneNo", phoneNo, "buyerRating", buyerRating)
        FROM ( ${getBuyersInfo} ) q1 LEFT JOIN
          ( ${getBuyersAvgRatingQuery('buyerRating')} ) q2
            ON q1.userId = q2.buyerId
    `;

    const buyerIfPendingOrSoldProduct = `
      IF(prodStatus = 'pending' OR prodStatus = 'sold', 
        (${getBuyerQuery}), null) AS stringifiedBuyer`;

    const getSellerListedProductsQuery = `
      SELECT L.id, imageUrls, name, colorway, brand, size, prodStatus, ${buyerIfPendingOrSoldProduct},
        askingPrice as price, quantity FROM ListedProducts L, Products P
          WHERE L.userId = ${sellerId} AND L.productId = P.id
    `;

    const poolConn = await mysqlPoolConnection();
    const queryResult = await poolConn.query(getSellerListedProductsQuery);

    for (const sneaker of queryResult) {
      sneaker.buyer = JSON.parse(sneaker.stringifiedBuyer);
      delete sneaker.stringifiedBuyer;
    }

    return queryResult;
  }

  async getPurchasedByBuyerId(buyerId: string): Promise<BuyerPurchasedSneaker[]> {
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
      SELECT T.amount as price, T.quantity, L.id, name, imageUrls, colorway, brand, size, prodStatus, 
        ${sellerIfPendingOrSoldProduct} FROM Transactions T, ListedProducts L, Products P
          WHERE T.buyerId = ${buyerId} AND T.listedProductId = L.id AND L.productId = P.id
    `;

    const poolConn = await mysqlPoolConnection();
    const queryResult = await poolConn.query(getPurchasedProductsQuery);

    for (const sneaker of queryResult) {
      sneaker.seller = JSON.parse(sneaker.stringifiedSeller);
      delete sneaker.stringifiedSeller;
    }

    return queryResult;
  }
}

export default TransactionsService;
