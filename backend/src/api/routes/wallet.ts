import { Router } from 'express';
import WalletService from '../../services/WalletService';

const walletRoute = Router();

export default (app: Router, WalletServiceInstance: WalletService) => {
  app.use('/wallet', walletRoute);

  walletRoute.get('/:userId', WalletServiceInstance.getBalanceByUserId)
  walletRoute.put('/topup', WalletServiceInstance.handleTopup)
  walletRoute.put('/decreaseBalance', WalletServiceInstance.handleDecreaseBalance)
};
