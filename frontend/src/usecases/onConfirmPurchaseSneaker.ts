import { mailAfterPurchase, decreaseWalletBalance } from 'api/api';
import { MailAfterPurchasePayload, CreateTransactionPayload } from '../../../shared';
import ListedSneakerControllerInstance from 'api/ListedSneakerController';
import TransactionControllerInstance from 'api/TransactionController';

// NOTE: DRY is violated, the types were declared in multiple places
// here and the api.ts file
const onConfirmPurchaseSneaker = async (
  mailPayload: MailAfterPurchasePayload,
  transaction: CreateTransactionPayload,
  listedSneakerId: number,
  sellerId: number,
  decreaseWalletBalPayload: { userId: number; amount: number },
  onEmailSent: () => void
) => {
  await mailAfterPurchase(mailPayload);

  onEmailSent()

  await ListedSneakerControllerInstance.handlePurchase(listedSneakerId, sellerId)

  await TransactionControllerInstance.create(transaction)

  await decreaseWalletBalance(decreaseWalletBalPayload);

  // increment the ranking points of both users
};

export default onConfirmPurchaseSneaker;
