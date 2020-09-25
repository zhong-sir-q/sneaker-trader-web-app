import { Router } from 'express';
import UserService from '../../services/UserService';

const userRoute = Router();

export default (
  app: Router,
  UserServiceInstance: UserService
) => {
  app.use('/user', userRoute);

  userRoute.put('/', (req, res, next) => {
    const user = req.body;

    UserServiceInstance.update(user)
      .then(() => res.json('User is updated'))
      .catch(next);
  });

  userRoute.get('/:email', (req, res, next) => {
    const { email } = req.params;

    UserServiceInstance.getByEmail(email)
      .then((user) => res.json(user))
      .catch(next);
  });

  userRoute.post('/', (req, res, next) => {
    const user = req.body;

    UserServiceInstance.create(user)
      .then((userId) => res.json(userId))
      .catch(next);
  });
};
