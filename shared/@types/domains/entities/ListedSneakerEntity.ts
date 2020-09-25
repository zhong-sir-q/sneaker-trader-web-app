import { SneakerAsk, GallerySneaker, SizeMinPriceGroupType, AppSneaker } from '..';
import { ListedProduct } from '../../models';
import { SellerListedSneaker } from '../sneaker';

interface ListedSneakerEntity {
  getGallerySneakersBySize(size: number): Promise<GallerySneaker[]>;
  getBySellerId(sellerId: number): Promise<SellerListedSneaker[]>;
  getAllAsksByNameColorway(nameColorway: string): Promise<SneakerAsk[]>;
  getGallerySneakers(): Promise<GallerySneaker[]>;
  getSizeMinPriceGroupByName(name: string): Promise<SizeMinPriceGroupType>;
  getAllListedSneakers(): Promise<AppSneaker[]>;

  create(p: ListedProduct): Promise<any>;
  handlePurchase(listedSneakerId: number, sellerId: number): Promise<any>;
  updateListedSneakerStatus(
    listedSneakerId: number,
    listedSneakerStatus: Pick<ListedProduct, 'prodStatus'>
  ): Promise<any>;
}

export default ListedSneakerEntity;
