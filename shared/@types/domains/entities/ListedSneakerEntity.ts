import { SneakerAsk, GallerySneaker, SizeMinPriceGroupType } from '..';
import { ListedProduct } from '../../models';
import { SellerListedSneaker, CreateListedSneakerPayload, GetListedSneaker } from '../sneaker';

interface ListedSneakerEntity {
  getGallerySneakersBySize(sellerId: number, size: number): Promise<GallerySneaker[]>;
  getBySellerId(sellerId: number): Promise<SellerListedSneaker[]>;
  getAllAsksByNameColorway(name: string, colorway: string): Promise<SneakerAsk[]>;
  getGallerySneakers(sellerId: number, limit?: number, offset?: number): Promise<GallerySneaker[]>;
  getSizeMinPriceGroupByNameColorway(name: string, colorway: string, sellerId: number): Promise<SizeMinPriceGroupType>;
  // returns sneakers that have status of listed
  getAllListedSneakers(): Promise<GetListedSneaker[]>;
  // returns all sneakers no matter the status
  getAll(): Promise<{ name: string; colorway: string; brand: string; imageUrls: string }[]>;

  create(p: CreateListedSneakerPayload): Promise<number>;
  // it returns the updated listed sneaker payload
  update(listedSneakerId: number, listedSneaker: CreateListedSneakerPayload): Promise<ListedProduct>;
  handlePurchase(listedSneakerId: number, sellerId: number): Promise<any>;
  updateListedSneakerStatus(
    listedSneakerId: number,
    listedSneakerStatus: Pick<ListedProduct, 'prodStatus'>
  ): Promise<any>;
}

export default ListedSneakerEntity;
