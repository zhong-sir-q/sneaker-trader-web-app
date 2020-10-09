import { mailAfterPurchase } from 'api/api';
import { MailAfterPurchasePayload, CreateTransactionPayload, DecreaseWalletPayload } from '../../../shared';
import { ListedSneakerController } from 'api/controllers/ListedSneakerController';
import { TransactionController } from 'api/controllers/TransactionController';

import { WalletController } from 'api/controllers/WalletController';

const onConfirmPurchaseSneaker = (
  ListedSneakerControllerInstance: ListedSneakerController,
  TransactionControllerInstance: TransactionController,
  WalletControllerInstance: WalletController
) => async (
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
