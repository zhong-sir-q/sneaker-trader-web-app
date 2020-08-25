import { Router } from 'express';
import { getMysqlDb } from '../../config/mysql';
import { FetchDbDataCallback } from '../../@types/utils';
import UserService from '../../services/user';

const userRoute = Router();

export default (app: Router) => {
  app.use('/user', userRoute)

  userRoute.post('/', (req, res, next) => {
    const { user } = req.body
    
    const dbConnection = getMysqlDb()
    const UserServiceInstance = new UserService(dbConnection)
    
    const createUserCallback: FetchDbDataCallback = (err, queryResult) => {
        if (err) next(err)
        else res.json({ user: queryResult })
    }

    UserServiceInstance.create(user, createUserCallback)
  })
};
