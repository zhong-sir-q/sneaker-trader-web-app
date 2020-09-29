import { BuyerPurchasedSneaker } from "..";

interface TransactionsEntity {
  getPurchasedByBuyerId(buyerId: number): Promise<BuyerPurchasedSneaker[]>;
}

export default TransactionsEntity;
