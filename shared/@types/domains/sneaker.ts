import { Sneaker, ListedProduct } from '../..';
import { Customer } from './user';
import { Transaction } from '../models';

export type SneakerAsk = {
  size: number;
  askingPrice: number;
  numsAvailable: number;
};

type SizeMinPriceType = { size: number; minPrice: number };
export type SizeMinPriceGroupType = SizeMinPriceType[];

export type CustomerSneaker = Pick<Sneaker, 'imageUrls' | 'name' | 'colorway' | 'size' | 'brand'> &
  Pick<ListedProduct, 'id' | 'prodStatus' | 'sizeSystem'> & { quantity: number; price: number };

export type AppSneaker = Omit<Sneaker, 'id' | 'RRP'>;

export type GallerySneaker = AppSneaker & { minPrice: number };

export type AppListedSneaker = Omit<ListedProduct, 'id'>;

export type ListedSneakerFormPayload = Omit<ListedProduct, 'id' | 'productId' | 'userId' | 'imageUrls'>;

export type ListingFormSneaker = Omit<AppSneaker, 'imageUrls'>;

export type SellerListedSneaker = CustomerSneaker & { buyer: Customer & Pick<Transaction, 'transactionDatetime'> };

export type BuyerPurchasedSneaker = CustomerSneaker & Pick<Transaction, 'transactionDatetime'> & { seller: Customer };

export type CreateListedSneakerPayload = Omit<ListedProduct, 'id' | 'prodStatus'>
