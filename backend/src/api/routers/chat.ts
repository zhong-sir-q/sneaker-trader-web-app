import { Router } from 'express';
import ChatService from '../../services/ChatService';

const chatRoute = Router();

export default (app: Router, ChatServiceInstance: ChatService) => {
  app.use('/chat', chatRoute);

  chatRoute.get('/:productId/:buyerId/:sellerId', (req, res, next) => {
    const { productId, buyerId, sellerId } = req.params;

    ChatServiceInstance.getChatByProductIdAndBuyerIDAndSellerId(Number(productId), Number(buyerId), Number(sellerId))
      .then((chatList: any) => res.json(chatList))
      .catch(next);
  });

  chatRoute.post('/:productId', (req, res, next) => {
    const { productId } = req.params;
    const { message, userType, buyerId, sellerId } = req.body;

    ChatServiceInstance.sendMessage(Number(productId), Number(buyerId), Number(sellerId), message, userType)
      .then(() => res.json('Sent message'))
      .catch(next);
  });
};
