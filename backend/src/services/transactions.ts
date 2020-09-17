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

  handleGetBoughtByBuyerId: RequestHandler = (req, res, next) => {
    const { buyerId } = req.params;

    this.getBoughtByBuyerId(buyerId)
      .then((boughtProducts) => res.json(boughtProducts))
      .catch(next);
  };

  getListedBySellerId(sellerId: string) {
    // L refers to ListedProduct
    const getBuyerQuery = `
    SELECT JSON_OBJECT("email", U.email, "username", U.username)
      FROM Transactions T, Users U
        WHERE listedProductId = L.id AND T.buyerId = U.id
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

  getBoughtByBuyerId(buyerId: string) {
    // L refers to ListedProduct
    const getSellerQuery = `
    SELECT JSON_OBJECT("email", U.email, "username", U.username)
      FROM Transactions T, Users U
        WHERE listedProductId = L.id AND T.sellerId = U.id
    `;

    const sellerIfPendingOrSoldProduct = `
      IF(prodStatus = 'pending' OR prodStatus = 'sold', 
        (${getSellerQuery}), null) AS stringifiedSeller`;

    const getBoughtProductsQuery = `
      SELECT T.amount as price, T.quantity, L.id, name, imageUrls, ${sellerIfPendingOrSoldProduct},
        colorway, size, prodStatus FROM Transactions T, ListedProducts L, Products P
          WHERE T.buyerId = ${buyerId} AND T.listedProductId = L.id AND L.productId = P.id
    `;

    return this.conneciton.query(getBoughtProductsQuery);
  }
}

export default TransactionsService;
