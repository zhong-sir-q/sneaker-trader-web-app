import { Router } from 'express';
import WalletService from '../../services/WalletService';

const walletRoute = Router();

export default (app: Router, WalletServiceInstance: WalletService) => {
  app.use('/wallet', walletRoute);

  walletRoute.post('/:userId', (req, res, next) => {
    const { userId } = req.params;

    WalletServiceInstance.create(Number(userId))
      .then(() => res.json('Wallet created'))
      .catch(next);
  });

  walletRoute.delete('/:userId', (req, res, next) => {
    const { userId } = req.params;

    WalletServiceInstance.delete(Number(userId))
      .then(() => res.json('Wallet deleted'))
      .catch(next);
  });

  walletRoute.get('/:userId', (req, res, next) => {
    const { userId } = req.params;

    WalletServiceInstance.getBalanceByUserId(Number(userId))
      .then((balance) => res.json(balance))
      .catch(next);
  });

  walletRoute.put('/topup', (req, res, next) => {
    const { userId, amount } = req.body;

    WalletServiceInstance.topup(userId, amount)
      .then(() => res.json('Topup successful'))
      .catch(next);
  });

  walletRoute.put('/decreaseBalance', (req, res, next) => {
    const { userId, amount } = req.body;

    WalletServiceInstance.decreaseBalance(userId, amount)
      .then(() => res.json('Wallet balance deducted'))
      .catch(next);
  });
};
