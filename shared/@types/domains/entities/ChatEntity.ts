export interface ChatEntity {
  getChatByProductIdAndBuyerIDAndSellerId(productId: number, buyerId: number, sellerId: number): Promise<any>;
  sendMessage(productId: number, buyerId: number, sellerId: number, message: string, userType: string): Promise<any>;
}
