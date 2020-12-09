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

  chatRoute.put('/updateStatus', (req, res, next) => {
    const { ids } = req.body;

    ChatServiceInstance.updateStatus(ids, 'read')
      .then(() => res.json('Status Updated'))
      .catch(next);
  });
};
