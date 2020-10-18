import { SneakerAsk, GallerySneaker, SizeMinPriceGroupType } from '..';
import { ListedProduct } from '../../models';
import { SellerListedSneaker, CreateListedSneakerPayload, GetListedSneaker } from '../sneaker';

interface ListedSneakerEntity {
  getGallerySneakersBySize(sellerId: number, size: number): Promise<GallerySneaker[]>;
  getBySellerId(sellerId: number): Promise<SellerListedSneaker[]>;
  getAllAsksByNameColorway(nameColorway: string): Promise<SneakerAsk[]>;
  getGallerySneakers(sellerId: number): Promise<GallerySneaker[]>;
  getSizeMinPriceGroupByNameColorway(name: string, sellerId: number): Promise<SizeMinPriceGroupType>;
  getAllListedSneakers(): Promise<GetListedSneaker[]>;

  create(p: CreateListedSneakerPayload): Promise<number>;
  handlePurchase(listedSneakerId: number, sellerId: number): Promise<any>;
  updateListedSneakerStatus(
    listedSneakerId: number,
    listedSneakerStatus: Pick<ListedProduct, 'prodStatus'>
  ): Promise<any>;
}

export default ListedSneakerEntity;
