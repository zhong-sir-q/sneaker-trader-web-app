import { Router } from 'express';
import ChatService from '../../services/ChatService';
import chartHistory from '../../start';

const chatRoute = Router();

export default (app: Router, ChatServiceInstance: ChatService) => {
  app.use('/chat', chatRoute);

  chatRoute.get('/:productId/:buyerId/:sellerId', (req, res, next) => {
    const { productId, buyerId, sellerId } = req.params;
    res.json(chartHistory)
    // ChatServiceInstance.getChatByProductIdAndBuyerIDAndSellerId(Number(productId), Number(buyerId), Number(sellerId))
    //   .then((chatList: any) => res.json(chatList))
    //   .catch(next);
  });

  chatRoute.post('/:productId', (req, res, next) => {
    const { productId } = req.params;
    const { message, userType, buyerId, sellerId } = req.body;
    const myDate = new Date();
    const dateTime = myDate.toUTCString();
    ChatServiceInstance.sendMessage(Number(productId), Number(buyerId), Number(sellerId), message, userType, dateTime)
      .then(() => res.json('Sent message'))
      .catch(next);
  });
};
