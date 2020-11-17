import { Request, Response, NextFunction, Router } from 'express';
import UserService from '../../services/UserService';
import WalletService from '../../services/WalletService';

function createHandlers (userService: UserService, walletService: WalletService) {
  function registerUser (req: Request, res: Response, next: NextFunction) {
    const user = req.body;

    userService.create(user)
      .then((userId) => {
        walletService.create(Number(userId))
        return userId
      })
      .then((userId) => res.json(userId))
      .catch(next);
  }

  return {
    registerUser
  }
}

export default function (userService: UserService, walletService: WalletService) {
  const router = Router();
  const handlers = createHandlers(userService, walletService);

  router
    .route('/')
    .post(handlers.registerUser);

  return {
    router,
    handlers
  }
};
