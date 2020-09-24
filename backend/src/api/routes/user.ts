import { Router } from 'express';
import UserService from '../../services/UserService';

const userRoute = Router();

export default (app: Router, UserServiceInstance: UserService) => {
  app.use('/user', userRoute);

  userRoute.put('/', UserServiceInstance.handleUpdate);

  userRoute.get('/:email', UserServiceInstance.handleGetByEmail);

  userRoute.get('/buyerRating/:buyerId', UserServiceInstance.handleGetBuyerAvgRating);

  userRoute.get('/sellerRating/:sellerId', UserServiceInstance.handleGetSellerAvgRating);

  userRoute.post('/', UserServiceInstance.handleCreate);
};
