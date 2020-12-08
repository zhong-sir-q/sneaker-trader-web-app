import { Router } from 'express';
import ChatService from '../../services/ChatService';
import chartHistory from '../../start';

const chatRoute = Router();

export default (app: Router, ChatServiceInstance: ChatService) => {
  app.use('/chat', chatRoute);

  chatRoute.get('/:productId/:buyerId/:sellerId', (req, res, next) => {
    const { productId, buyerId, sellerId } = req.params;
    ChatServiceInstance.getChatByProductIdAndBuyerIDAndSellerId(Number(productId), Number(buyerId), Number(sellerId))
      .then((chatList: any) => res.json(chatList))
      .catch(next);
  });
};
