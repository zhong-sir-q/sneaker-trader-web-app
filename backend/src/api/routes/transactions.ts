import { Router } from "express";

import TransactionService from "../../services/TransactionsService";

const transactionsRoute = Router()

export default (app: Router, TransactionsServiceInstance: TransactionService) => {
  app.use('/transactions', transactionsRoute)

  transactionsRoute.get('/listed/:sellerId', TransactionsServiceInstance.handleGetListedBySellerId)

  transactionsRoute.get('/purchased/:buyerId', TransactionsServiceInstance.handleGetPurchasedByBuyerId)
}
