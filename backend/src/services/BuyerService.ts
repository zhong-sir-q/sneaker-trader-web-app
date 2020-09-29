import { BuyerEntity } from '../../../shared';
import mysqlPoolConnection, {  } from '../config/mysql';
import { getBuyersAvgRatingQuery } from '../utils/queries';

class BuyerService implements BuyerEntity {

  async getAvgRating(buyerId: number) {
    const poolConn = await mysqlPoolConnection()

    return poolConn
      .query(getBuyersAvgRatingQuery('buyerRating', `WHERE buyerId = ${buyerId}`))
      .then((result) => (result.length == 1 ? result[0].buyerRating : 0));
  }
}

export default BuyerService;
