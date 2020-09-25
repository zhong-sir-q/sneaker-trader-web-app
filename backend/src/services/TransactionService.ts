import { PromisifiedConnection, getMysqlDb } from '../config/mysql';
import { formatInsertColumnsQuery, formatUpdateColumnsQuery, formateGetColumnsQuery } from '../utils/formatDbQuery';
import { TRANSACTION } from '../config/tables';
import TranscationEntity from '../../../shared/@types/domains/entities/TransactionEntity';
import { Transaction } from '../../../shared';

class TransactionService implements TranscationEntity {
  private conneciton: PromisifiedConnection;

  constructor() {
    this.conneciton = getMysqlDb();
  }

  async get(listedSneakerId: number) {
    const findTransactionQuery = formateGetColumnsQuery(TRANSACTION, `listedProductId = ${listedSneakerId}`);
    const res = await this.conneciton.query(findTransactionQuery)

    return res.length === 0 ? null : res[0]
  }

  create(transaction: Transaction) {
    return this.conneciton.query(formatInsertColumnsQuery(TRANSACTION, transaction));
  }

  rateBuyer(listedProductId: number, rating: number) {
    const rateSellerQuery = formatUpdateColumnsQuery(
      TRANSACTION,
      { buyerRatingFromSeller: rating },
      `listedProductId = ${listedProductId}`
    );

    return this.conneciton.query(rateSellerQuery);
  }

  rateSeller(listedProductId: number, rating: number) {
    const rateSellerQuery = formatUpdateColumnsQuery(
      TRANSACTION,
      { sellerRatingFromBuyer: rating },
      `listedProductId = ${listedProductId}`
    );

    return this.conneciton.query(rateSellerQuery);
  }
}

export default TransactionService;
