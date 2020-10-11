import { WalletController } from 'api/controllers/WalletController';

const checkUserWalletBalance = async (WalletControllerInstance: WalletController, currUserId: number) => {
  const balance = await WalletControllerInstance.getBalanceByUserId(currUserId);

  if (balance === null) throw new Error('User does not exist!');

  if (balance <= 0) return false;

  return true;
};

export default checkUserWalletBalance;
