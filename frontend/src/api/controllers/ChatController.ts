import ChatEntity from '../../../../shared/@types/domains/entities/ChatEntity';
import formatRequestOptions from '../../utils/formatRequestOptions';
import formatApiEndpoint, { concatPaths } from '../../utils/formatApiEndpoint';

export class ChatController implements ChatEntity {
  chatPath: string;

  constructor() {
    this.chatPath = formatApiEndpoint('chat');
  }

  sendMessage = (productId: number, buyerId: number, sellerId: number, message: string, userType: string) =>
    fetch(this.chatPath, formatRequestOptions({productId, buyerId, sellerId, message, userType}, undefined, 'POST'));
  
  getChatByProductIdAndBuyerIDAndSellerId = (productId: number, buyerId: number, sellerId: number): Promise<any> =>
    fetch(concatPaths(this.chatPath, productId, buyerId, sellerId)).then((r) => r.json());

  updateStatus = (ids: any, status: string) =>
    fetch(concatPaths(this.chatPath, 'updateStatus'), formatRequestOptions({ids, status}, undefined, 'PUT'));

}

const ChatControllerrInstance = new ChatController();

export default ChatControllerrInstance;