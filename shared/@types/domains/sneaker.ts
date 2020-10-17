import { Sneaker, ListedProduct } from '../..';
import { Buyer, Seller } from './user';
import { Transaction } from '../models';

export type SneakerAsk = {
  size: number;
  askingPrice: number;
  numsAvailable: number;
};

type SizeMinPriceType = { size: number; minPrice: number };
export type SizeMinPriceGroupType = SizeMinPriceType[];

export type CustomerSneaker = Pick<Sneaker, 'name' | 'colorway' | 'size' | 'brand'> &
  Pick<ListedProduct, 'id' | 'prodStatus' | 'sizeSystem' | 'mainDisplayImage'> & { quantity: number; price: number };

export type AppSneaker = Omit<Sneaker, 'id' | 'RRP'>;

export type AppListedSneaker = Omit<ListedProduct, 'id'>;

export type GallerySneaker = AppSneaker & AppListedSneaker & { minPrice: number };

export type ListedSneakerFormPayload = Omit<ListedProduct, 'id' | 'productId' | 'userId' | 'imageUrls'>;

export type ListingFormSneaker = Omit<AppSneaker, 'imageUrls'>;

export type SellerListedSneaker = CustomerSneaker & { buyer: Buyer };

export type BuyerPurchasedSneaker = CustomerSneaker & Pick<Transaction, 'transactionDatetime'> & { seller: Seller };

export type CreateListedSneakerPayload = Omit<ListedProduct, 'id' | 'prodStatus'>;

export type Size = number | 'all' | undefined;
