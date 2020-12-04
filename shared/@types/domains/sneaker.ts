import { Sneaker, ListedProduct } from '../..';
import { Buyer, Seller } from './user';
import { Transaction, PortfolioSneaker } from '../models';

export type SneakerAsk = {
  size: number;
  askingPrice: number;
  numsAvailable: number;
};

type SizeMinPriceType = { size: number; minPrice: number };
export type SizeMinPriceGroupType = SizeMinPriceType[];

export type CustomerSneaker = Pick<Sneaker, 'name' | 'colorway' | 'size' | 'brand'> &
  Pick<ListedProduct, 'id' | 'prodStatus' | 'sizeSystem' | 'mainDisplayImage' | 'listedDatetime' | 'userId'> & { quantity: number; price: number };

export type AppSneaker = Omit<Sneaker, 'id' | 'RRP'>;

export type AppListedSneaker = Omit<ListedProduct, 'id' | 'listedDatetime'>;

export type GallerySneaker = AppSneaker & AppListedSneaker & { minPrice: number };

export type ListedSneakerFormPayload = Omit<ListedProduct, 'id' | 'productId' | 'userId' | 'imageUrls' | 'listedDatetime'>;

export type ListingFormSneaker = Omit<AppSneaker, 'imageUrls'>;

export type SellerListedSneaker = CustomerSneaker & { buyer: Buyer };

export type BuyerPurchasedSneaker = CustomerSneaker & Pick<Transaction, 'transactionDatetime'> & { seller: Seller };

export type SearchBarSneaker = { brand: string; name: string; colorway: string; mainDisplayImage: string };

export type PortfolioSneakerWithMarketValue = PortfolioSneaker & {
  marketValue: number;
  latestTransactionDate: string;
  gain: number;
  gainPercentage: number;
};

export type GetListedSneaker = ListedProduct & AppSneaker;

export type CreateListedSneakerPayload = Omit<ListedProduct, 'id' | 'prodStatus' | 'listedDatetime'>;

export type Size = number | 'all' | undefined;
