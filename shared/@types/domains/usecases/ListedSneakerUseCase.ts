import { SneakerAsk, GallerySneaker, SizeMinPriceGroupType, AppSneaker } from '..';
import { ListedProduct } from '../../models';
import { SellerListedSneaker } from '../sneaker';

interface ListedSneakerUseCase {
  getBySize(size: string): Promise<GallerySneaker>;
  getBySellerId(sellerId: number): Promise<SellerListedSneaker[]>;
  getAllAsksByNameColorway(nameColorway: string): Promise<SneakerAsk[]>;
  getGallerySneakers(): Promise<GallerySneaker[]>;
  getSizeMinPriceGroupByName(name: string): Promise<SizeMinPriceGroupType>;
  getAllListedSneakers(): Promise<AppSneaker[]>;

  handleCreate(p: ListedProduct): Promise<void>;
  handlePurchase(listedSneakerId: number, sellerId: number): Promise<void>;
  updateListedSneakerStatus(
    listedSneakerId: number,
    listedSneakerStatus: Pick<ListedProduct, 'prodStatus'>
  ): Promise<void>;
}

export default ListedSneakerUseCase;
