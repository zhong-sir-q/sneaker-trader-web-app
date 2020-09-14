export type ContactSellerMailPayload = {
  sellerUserName: string;
  sellerEmail: string;
  buyerUserName: string;
  buyerEmail: string;
  productName: string;
};

export type SneakerAsk = {
  size: number;
  askingPrice: number;
  numsAvailable: number;
};
