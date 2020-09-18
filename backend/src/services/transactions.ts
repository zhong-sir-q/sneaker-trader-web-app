import { PromisifiedConnection } from '../config/mysql';
import { RequestHandler } from 'express';
import { getSellersAvgRatingQuery, getBuyersAvgRatingQuery } from '../utils/queries';

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

  getListedBySellerId(sellerId: string) {
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
      SELECT L.id, imageUrls, name, colorway, size, prodStatus, ${buyerIfPendingOrSoldProduct},
        askingPrice as price, quantity FROM ListedProducts L, Products P
          WHERE L.userId = ${sellerId} AND L.productId = P.id
    `;

    return this.conneciton.query(getSellerListedProductsQuery);
  }

  getPurchasedByBuyerId(buyerId: string) {
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
      SELECT T.amount as price, T.quantity, L.id, name, imageUrls, colorway, size, prodStatus, 
        ${sellerIfPendingOrSoldProduct} FROM Transactions T, ListedProducts L, Products P
          WHERE T.buyerId = ${buyerId} AND T.listedProductId = L.id AND L.productId = P.id
    `;

    return this.conneciton.query(getPurchasedProductsQuery);
  }
}

export default TransactionsService;
