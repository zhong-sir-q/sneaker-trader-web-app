import { ChatEntity } from '../../../shared';
import { formatGetRowsQuery, formatInsertRowsQuery, formatUpdateRowsQuery } from '../utils/formatDbQuery';

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

  async updateStatus(ids: any, status: string) {
    const updateStatusQuery = formatUpdateRowsQuery(
      CHAT,
      { status: status },
      `id IN (${ids})`
    );
    const poolConn = await mysqlPoolConnection();
    return poolConn.query(updateStatusQuery);
  }
}

export default ChatService;
