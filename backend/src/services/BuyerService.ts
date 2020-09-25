import { BuyerEntity } from '../../../shared';
import { PromisifiedConnection, getMysqlDb } from '../config/mysql';
import { getBuyersAvgRatingQuery } from '../utils/queries';

class BuyerService implements BuyerEntity {
  connection: PromisifiedConnection;

  constructor() {
    this.connection = getMysqlDb();
  }

  async getAvgRating(buyerId: number) {
    return this.connection
      .query(getBuyersAvgRatingQuery('buyerRating', `WHERE buyerId = ${buyerId}`))
      .then((result) => (result.length == 1 ? result[0].buyerRating : 0));
  }
}

export default BuyerService;
