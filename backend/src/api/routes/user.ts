import { Router } from 'express';
import { getMysqlDb } from '../../config/mysql';
import UserService from '../../services/user';

const userRoute = Router();

export default (app: Router) => {
  app.use('/user', userRoute)

  userRoute.put('/', new UserService(getMysqlDb()).handleUpdate)

  userRoute.get('/:email', new UserService(getMysqlDb()).handleGetByEmail)

  userRoute.post('/', new UserService(getMysqlDb()).handleCreate)
};
