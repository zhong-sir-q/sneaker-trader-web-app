import { mailAfterPurchase } from 'api/api';
import { MailAfterPurchasePayload, CreateTransactionPayload, DecreaseWalletPayload } from '../../../shared';
import ListedSneakerControllerInstance from 'api/controllers/ListedSneakerController';
import TransactionControllerInstance from 'api/controllers/TransactionController';

import WalletControllerInstance from 'api/controllers/WalletController';

const onConfirmPurchaseSneaker = async (
  mailPayload: MailAfterPurchasePayload,
  transaction: CreateTransactionPayload,
  listedSneakerId: number,
  sellerId: number,
  decreaseWalletBalPayload: DecreaseWalletPayload
) => {
  await mailAfterPurchase(mailPayload);

  await ListedSneakerControllerInstance.handlePurchase(listedSneakerId, sellerId);

  await TransactionControllerInstance.create(transaction);

  // decrease the wallet balance of the seller
  const { userId, amount } = decreaseWalletBalPayload;
  await WalletControllerInstance.decreaseBalance(userId, amount);

  // increment the ranking points of both users
};

export default onConfirmPurchaseSneaker;
