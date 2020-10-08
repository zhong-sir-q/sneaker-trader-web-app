export * from './@types/models';
export * from './@types/domains';

export type CreatePoliLinkPayload = {
  Amount: number;
  // <100 characters
  MerchantReference: string;
  RecipientName: string;
  RecipientEmail: string;
  CurrencyCode?: 'AUD' | 'NZD';
  // 0 = Simple, 1 = Variable, 2 = Discounted
  LinkType?: 0 | 1 | 2;
  // max 2000 characters
  MerchantData?: string;
  ConfirmationEmail?: boolean;
  AllowCustomerReference?: boolean;
  ViaEmail?: boolean;
  // DateTime string
  LinkExpiry?: string;
};
