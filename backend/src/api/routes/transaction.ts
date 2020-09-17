import { Router } from "express";

import TransactionService from "../../services/transaction";

const transactionRoute = Router()

export default (app: Router, TransactionServiceInstance: TransactionService) => {
  app.use('/transaction', transactionRoute)

  transactionRoute.post('/', TransactionServiceInstance.handleCreate)

  transactionRoute.put('/rating/buyer/:listedProductId', TransactionServiceInstance.rateBuyer)

  transactionRoute.put('/rating/seller/:listedProductId', TransactionServiceInstance.rateSeller)
}
