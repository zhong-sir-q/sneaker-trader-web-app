import { Router } from 'express';
import UserService from '../../services/UserService';

const userRoute = Router();

export default (app: Router, UserServiceInstance: UserService) => {
  app.use('/user', userRoute);

  userRoute.put('/', (req, res, next) => {
    const user = req.body;

    UserServiceInstance.update(user)
      .then(() => res.json('User is updated'))
      .catch(next);
  });

  userRoute.get('/name/:username', (req, res, next) => {
    const { username } = req.params;

    UserServiceInstance.getByUsername(username)
      .then((user) => res.json(user))
      .catch(next);
  });

  userRoute.get('/:email', (req, res, next) => {
    const { email } = req.params;

    UserServiceInstance.getByEmail(email)
      .then((user) => res.json(user))
      .catch(next);
  });

  userRoute.get('/rankingPoints/:userId', (req, res, next) => {
    const { userId } = req.params;

    UserServiceInstance.getRankingPointsByUserId(Number(userId))
      .then((rankingPoints) => res.json(rankingPoints))
      .catch(next);
  });

  userRoute.post('/', (req, res, next) => {
    const user = req.body;

    UserServiceInstance.create(user)
      .then((userId) => res.json(userId))
      .catch(next);
  });

  userRoute.delete('/name/:username', (req, res, next) => {
    const { username } = req.params;

    UserServiceInstance.deleteByUsername(username)
      .then(() => res.json('User deleted'))
      .catch(next);
  });
};
