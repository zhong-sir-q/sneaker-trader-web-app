import { Sneaker, ListedProduct } from '../..';
import { Customer } from './user';

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

export type ListedSneakerPayload = Omit<ListedProduct, 'id' | 'productId' | 'userId'>;

export type ListingFormSneaker = Omit<AppSneaker, 'imageUrls'>;

export type SellerListedSneaker = CustomerSneaker & { buyer: Customer };

export type BuyerPurchasedSneaker = CustomerSneaker & { seller: Customer };
