import { MailAfterPurchasePayload, CreateTransactionPayload, DecreaseWalletPayload } from '../../../shared';
import { ListedSneakerController } from 'api/controllers/ListedSneakerController';
import { TransactionController } from 'api/controllers/TransactionController';

import { WalletController } from 'api/controllers/WalletController';
import { MailController } from 'api/controllers/MailController';

const onConfirmPurchaseSneaker = (
  ListedSneakerControllerInstance: ListedSneakerController,
  TransactionControllerInstance: TransactionController,
  WalletControllerInstance: WalletController,
  MailControllerInstance: MailController
) => async (
  mailPayload: MailAfterPurchasePayload,
  transaction: CreateTransactionPayload,
  decreaseWalletBalPayload: DecreaseWalletPayload
) => {
  await MailControllerInstance.mailOnConfirmPurchase(mailPayload);

  await ListedSneakerControllerInstance.handlePurchase(transaction.listedProductId, transaction.sellerId);

  await TransactionControllerInstance.create(transaction);

  // decrease the wallet balance of the seller
  const { userId, amount } = decreaseWalletBalPayload;
  await WalletControllerInstance.decreaseBalance(userId, amount);
};

export default onConfirmPurchaseSneaker;
