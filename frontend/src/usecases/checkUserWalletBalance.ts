import WalletControllerInstance from 'api/controllers/WalletController';
import { ADMIN, TOPUP_WALLET } from 'routes';

const checkUserWalletBalance = async (currUserId: number, history: any) => {
  const balance = await WalletControllerInstance.getBalanceByUserId(currUserId);

  if (balance < 0) {
    history.push(ADMIN + TOPUP_WALLET);
    alert('Please topup first, so your wallet balance is positive');
    return false;
  }

  return true;
};

export default checkUserWalletBalance;
