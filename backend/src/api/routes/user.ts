import { Router } from 'express';
import { getMysqlDb } from '../../config/mysql';
import { FetchDbDataCallback } from '../../@types/utils';
import UserService from '../../services/user';

const userRoute = Router();

export default (app: Router) => {
  app.use('/user', userRoute)

  userRoute.get('/:email', new UserService(getMysqlDb()).handleGetByEmail)

  userRoute.post('/', new UserService(getMysqlDb()).handleCreate)

  userRoute.post('/update', new UserService(getMysqlDb()).handleUpdate)
};
