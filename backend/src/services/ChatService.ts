import { ChatEntity } from '../../../shared';
import { formatGetRowsQuery, formatInsertRowsQuery } from '../utils/formatDbQuery';

import { CHAT } from '../config/tables';
import mysqlPoolConnection from '../config/mysql';

class ChatService implements ChatEntity {

  async sendMessage(productId: number, buyerId: number, sellerId: number, message: string, userType: string, dateTime: string): Promise<void> {
    const poolConn = await mysqlPoolConnection();

    const sendMessageQuery = formatInsertRowsQuery(CHAT, { productId, buyerId, sellerId, message, userType, dateTime });
    await poolConn.query(sendMessageQuery);
  }


  async getChatByProductIdAndBuyerIDAndSellerId(productId: number, buyerId: number, sellerId: number): Promise<any> {
    const poolConn = await mysqlPoolConnection();

    const getAddrQuery = formatGetRowsQuery(CHAT, `productId = ${productId} and buerId = ${buyerId} and sellerId = ${sellerId}`);
    const result = await poolConn.query(getAddrQuery);

    return result.length === 0 ? null : result[0];
  }
}

export default ChatService;
