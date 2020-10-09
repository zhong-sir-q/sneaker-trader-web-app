import { ADMIN, TOPUP_WALLET } from 'routes';
import { WalletController } from 'api/controllers/WalletController';

const checkUserWalletBalance = async (WalletControllerInstance: WalletController, currUserId: number, history: any) => {
  const balance = await WalletControllerInstance.getBalanceByUserId(currUserId);

  if (!balance) throw new Error('User does not exist!');

  if (balance <= 0) {
    history.push(ADMIN + TOPUP_WALLET);
    alert('Please topup first, your wallet balance must be greater than 0');
    return false;
  }

  return true;
};

export default checkUserWalletBalance;
