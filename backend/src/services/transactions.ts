import { PromisifiedConnection } from '../config/mysql';
import { RequestHandler } from 'express';

class TransactionsService {
  private conneciton: PromisifiedConnection;

  constructor(conn: PromisifiedConnection) {
    this.conneciton = conn;
  }

  handleGetListedBySellerId: RequestHandler = (req, res, next) => {
    const { sellerId } = req.params;

    this.getListedBySellerId(sellerId)
      .then((listedProducts) => res.json(listedProducts))
      .catch(next);
  };

  handleGetPurchasedByBuyerId: RequestHandler = (req, res, next) => {
    const { buyerId } = req.params;

    this.getPurchasedByBuyerId(buyerId)
      .then((purchasedProducts) => res.json(purchasedProducts))
      .catch(next);
  };

  // TODO: same as below, document this and the getPurhcasedByBuyerId queries
  // can perhaps refactor the get rating query too, similar query also in sellers.ts file
  getListedBySellerId(sellerId: string) {
    // select the transactions based on L.id
    const getBuyerQuery = `
      SELECT JSON_OBJECT("email", email, "username", username, 
      "phoneNo", phoneNo, "buyerRating", buyerRating)
        FROM ( SELECT email, name, username, phoneNo, U.id as userId FROM
          Transactions T, Users U WHERE listedProductId = L.id AND T.buyerId = U.id ) q1 LEFT JOIN
          (SELECT ROUND(AVG(buyerRatingFromSeller), 1) as buyerRating, buyerId  FROM Transactions GROUP BY buyerId) q2
            ON q1.userId = q2.buyerId
    `;

    const buyerIfPendingOrSoldProduct = `
      IF(prodStatus = 'pending' OR prodStatus = 'sold', 
        (${getBuyerQuery}), null) AS stringifiedBuyer`;

    const getSellerListedProductsQuery = `
      SELECT L.id, imageUrls, name, colorway, size, prodStatus, ${buyerIfPendingOrSoldProduct},
        askingPrice as price, quantity FROM ListedProducts L, Products P
          WHERE L.userId = ${sellerId} AND L.productId = P.id
    `;

    return this.conneciton.query(getSellerListedProductsQuery);
  }

  getPurchasedByBuyerId(buyerId: string) {
    // select the transactions based on L.id
    // TODO: explain what this code does
    const getSellerQuery = `
      SELECT JSON_OBJECT("email", email, "username", username, 
        "phoneNo", phoneNo, "sellerRating", sellerRating)
          FROM ( SELECT email, name, username, phoneNo, U.id as userId FROM
            Transactions T, Users U WHERE listedProductId = L.id AND T.sellerId = U.id ) q1 LEFT JOIN
            (SELECT ROUND(AVG(sellerRatingFromBuyer), 1) as sellerRating, sellerId FROM Transactions GROUP BY sellerId) q2
              ON q1.userId = q2.sellerId
    `;

    const sellerIfPendingOrSoldProduct = `
      IF(prodStatus = 'pending' OR prodStatus = 'sold', 
        (${getSellerQuery}), null) AS stringifiedSeller`;

    const getPurchasedProductsQuery = `
      SELECT T.amount as price, T.quantity, L.id, name, imageUrls, ${sellerIfPendingOrSoldProduct},
        colorway, size, prodStatus FROM Transactions T, ListedProducts L, Products P
          WHERE T.buyerId = ${buyerId} AND T.listedProductId = L.id AND L.productId = P.id
    `;

    return this.conneciton.query(getPurchasedProductsQuery);
  }
}

export default TransactionsService;
