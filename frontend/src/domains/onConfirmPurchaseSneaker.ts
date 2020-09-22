import { mailAfterPurchase, purchaseListedProduct, createProductTransaction, decreaseWalletBalance } from 'api/api';
import { MailAfterPurchasePayload, CreateTransactionPayload } from '../../../shared';

// NOTE: DRY is violated, the types were declared in multiple places
// here and the api.ts file
const onConfirmPurchaseSneaker = async (
  mailPayload: MailAfterPurchasePayload,
  transaction: CreateTransactionPayload,
  purchaseListedProdPayload: { id: number; sellerId: number },
  decreaseWalletBalPayload: { userId: number; amount: number },
  onEmailSent: () => void
) => {
  await mailAfterPurchase(mailPayload);

  onEmailSent()

  await purchaseListedProduct(purchaseListedProdPayload);

  await createProductTransaction(transaction);

  await decreaseWalletBalance(decreaseWalletBalPayload);

  // increment the ranking points of both users
};

export default onConfirmPurchaseSneaker;
