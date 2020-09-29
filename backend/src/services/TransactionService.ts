import mysqlPoolConnection, {  } from '../config/mysql';
import { formatInsertColumnsQuery, formatUpdateColumnsQuery, formateGetColumnsQuery } from '../utils/formatDbQuery';
import { TRANSACTION } from '../config/tables';
import TranscationEntity from '../../../shared/@types/domains/entities/TransactionEntity';
import { Transaction } from '../../../shared';

class TransactionService implements TranscationEntity {

  async get(listedSneakerId: number) {
    const findTransactionQuery = formateGetColumnsQuery(TRANSACTION, `listedProductId = ${listedSneakerId}`);

    const poolConn = await mysqlPoolConnection()
    const res = await poolConn.query(findTransactionQuery);

    return res.length === 0 ? null : res[0];
  }

  async create(transaction: Transaction) {
    const poolConn = await mysqlPoolConnection()
    return poolConn.query(formatInsertColumnsQuery(TRANSACTION, transaction));
  }

  async rateBuyer(listedProductId: number, rating: number, comment: string) {
    const rateSellerQuery = formatUpdateColumnsQuery(
      TRANSACTION,
      { buyerRatingFromSeller: rating, buyerCommentFromSeller: comment },
      `listedProductId = ${listedProductId}`
    );
    
    const poolConn = await mysqlPoolConnection()
    return poolConn.query(rateSellerQuery);
  }

  async rateSeller(listedProductId: number, rating: number, comment: string) {
    const rateSellerQuery = formatUpdateColumnsQuery(
      TRANSACTION,
      { sellerRatingFromBuyer: rating, sellerCommentFromBuyer: comment },
      `listedProductId = ${listedProductId}`
    );
    
    const poolConn = await mysqlPoolConnection()
    return poolConn.query(rateSellerQuery);
  }
}

export default TransactionService;
