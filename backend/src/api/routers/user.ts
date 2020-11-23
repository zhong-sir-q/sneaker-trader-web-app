import { Router, Request, Response, NextFunction } from 'express';
import UserService from '../../services/UserService';

function createHandlers(userService: UserService) {
  function updateUser(req: Request, res: Response, next: NextFunction) {
    const { email } = req.params;
    const user = req.body;

    userService
      .update(email, user)
      .then(() => res.json('User is updated'))
      .catch(next);
  }

  function createUser(req: Request, res: Response, next: NextFunction) {
    const user = req.body;

    userService
      .create(user)
      .then((userId) => res.json(userId))
      .catch(next);
  }

  function getUserByUsername(req: Request, res: Response, next: NextFunction) {
    const { username } = req.params;

    userService
      .getByUsername(username)
      .then((user) => res.json(user))
      .catch(next);
  }

  function deleteUser(req: Request, res: Response, next: NextFunction) {
    const { username } = req.params;

    userService
      .deleteByUsername(username)
      .then(() => res.json('User deleted'))
      .catch(next);
  }

  function getUserByEmail(req: Request, res: Response, next: NextFunction) {
    const { email } = req.params;

    userService
      .getByEmail(email)
      .then((user) => res.json(user))
      .catch(next);
  }

  function getAllUsersByRankingPoints(_req: Request, res: Response, next: NextFunction) {
    userService
      .getAllUserRankingPoints()
      .then((result) => res.json(result))
      .catch(next);
  }

  function getRankingPointsByUser(req: Request, res: Response, next: NextFunction) {
    const { userId } = req.params;

    userService
      .getRankingPointsByUserId(Number(userId))
      .then((rankingPoints) => res.json(rankingPoints))
      .catch(next);
  }

  return {
    updateUser,
    createUser,
    getUserByUsername,
    deleteUser,
    getUserByEmail,
    getAllUsersByRankingPoints,
    getRankingPointsByUser,
  };
}

export default function createUserRouter(userService: UserService) {
  const router = Router();

  const handlers = createHandlers(userService);

  router.route('/').post(handlers.createUser);

  router.route('/name/:username').get(handlers.getUserByUsername).delete(handlers.deleteUser);

  router.route('/:email').get(handlers.getUserByEmail).put(handlers.updateUser);

  router.route('/all/rankingPoints').get(handlers.getAllUsersByRankingPoints);

  router.route('/rankingPoints/:userId').get(handlers.getRankingPointsByUser);

  return { router, handlers };
}
