import { Router } from 'express';
import UserService from '../../services/user';

const userRoute = Router();

export default (app: Router, UserServiceInstance: UserService) => {
  app.use('/user', userRoute);

  userRoute.put('/', UserServiceInstance.handleUpdate);

  userRoute.get('/:email', UserServiceInstance.handleGetByEmail);

  userRoute.post('/', UserServiceInstance.handleCreate);
};
