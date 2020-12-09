import { ChatEntity } from '../../../shared';
import { formatGetRowsQuery, formatInsertRowsQuery } from '../utils/formatDbQuery';

import { CHAT } from '../config/tables';
import mysqlPoolConnection from '../config/mysql';

class ChatService implements ChatEntity {

  async sendMessage(productId: number, buyerId: number, sellerId: number, message: string, userType: string): Promise<void> {
    const poolConn = await mysqlPoolConnection();
    const sendMessageQuery = formatInsertRowsQuery(CHAT, { productId, buyerId, sellerId, message, userType });
    await poolConn.query(sendMessageQuery);
  }

  async getChatByProductIdAndBuyerIDAndSellerId(productId: number, buyerId: number, sellerId: number): Promise<any> {
    const poolConn = await mysqlPoolConnection();

    const getChatQuery = formatGetRowsQuery(CHAT, `productId = ${productId} and buyerId = ${buyerId} and sellerId = ${sellerId}`);
    const result = await poolConn.query(getChatQuery);

    return result.length === 0 ? null : result;
  }
}

export default ChatService;
