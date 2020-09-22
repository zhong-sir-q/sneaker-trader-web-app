import { Sneaker, ListedProduct } from '../..';
import { Customer } from './user';

export type SneakerAsk = {
  size: number;
  askingPrice: number;
  numsAvailable: number;
};

type SizeMinPriceType = { size: number; minPrice: number };
export type SizeMinPriceGroupType = SizeMinPriceType[];

export type CustomerSneaker = Pick<Sneaker, 'imageUrls' | 'name' | 'colorway' | 'size'> &
  Pick<ListedProduct, 'id' | 'prodStatus'> & { quantity: number; price: number };

export type DomainSneaker = Omit<Sneaker, 'id' | 'RRP'>;

export type GallerySneaker = DomainSneaker & { minPrice: number };

export type DomainListedSneaker = Omit<ListedProduct, 'id'>;

export type ListedSneakerPayload = Omit<ListedProduct, 'id' | 'productId' | 'userId'>;

export type ListingFormSneaker = Omit<DomainSneaker, 'imageUrls'>;

export type SellerListedSneaker = CustomerSneaker & { buyer: Customer };

export type BuyerPurchasedSneaker = CustomerSneaker & { seller: Customer };
