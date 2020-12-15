import { ChatEntity } from '../../../shared';
import { formatInsertRowsQuery, formatUpdateRowsQuery } from '../utils/formatDbQuery';

import { CHAT } from '../config/tables';
import mysqlPoolConnection from '../config/mysql';
import { Persistance } from '../@types/persistance';

class ChatService implements ChatEntity {
  private persistance: Persistance;

  constructor(persistance: Persistance) {
    this.persistance = persistance;
  }

  async sendMessage(
    productId: number,
    buyerId: number,
    sellerId: number,
    message: string,
    userType: string
  ): Promise<void> {
    const sendMessageQuery = formatInsertRowsQuery(CHAT, { productId, buyerId, sellerId, message, userType });
    await this.persistance.query(sendMessageQuery);
  }

  async getChatByProductIdAndBuyerIDAndSellerId(productId: number, buyerId: number, sellerId: number): Promise<any> {
    const q = `
      SELECT * FROM ${CHAT} WHERE productId = ? AND buyerId = ? AND sellerId = ?
    `;
    const result = await this.persistance.query(q, [productId, buyerId, sellerId]);

    return result.length === 0 ? null : result;
  }

  async updateStatus(ids: any, status: string) {
    const updateStatusQuery = formatUpdateRowsQuery(CHAT, { status: status }, `id IN (${ids})`);
    return this.persistance.query(updateStatusQuery);
  }
}

export default ChatService;
