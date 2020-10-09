import {
  AppListedSneaker,
  AppSneaker,
  GallerySneaker,
  SizeMinPriceGroupType,
  SneakerAsk,
  SellerListedSneaker,
  ListedProduct,
} from '../../../../shared';

import ListedSneakerEntity from '../../../../shared/@types/domains/entities/ListedSneakerEntity';

import formatApiEndpoint, { concatPaths } from '../formatApiEndpoint';
import formatRequestOptions from '../formatRequestOptions';

class ListedSneakerController implements ListedSneakerEntity {
  listedSneakerPath: string;

  constructor() {
    this.listedSneakerPath = formatApiEndpoint('listedSneaker');
  }

  create = (listedSneaker: AppListedSneaker) =>
    fetch(this.listedSneakerPath, formatRequestOptions(listedSneaker)).then((res) => res.json());

  getAllListedSneakers = (): Promise<AppSneaker[]> => fetch(this.listedSneakerPath).then((res) => res.json());

  getGallerySneakers = (sellerId: number): Promise<GallerySneaker[]> =>
    fetch(concatPaths(this.listedSneakerPath, 'gallery', sellerId)).then((res) => res.json());

  getSizeMinPriceGroupByNameColorway = (nameColorway: string, sellerId: number): Promise<SizeMinPriceGroupType> =>
    fetch(concatPaths(this.listedSneakerPath, 'sizeMinPriceGroup', nameColorway, sellerId)).then((res) => res.json());

  getGallerySneakersBySize = (sellerId: number, size: number): Promise<GallerySneaker[]> =>
    fetch(concatPaths(this.listedSneakerPath, 'gallery', 'size', sellerId, size)).then((res) => res.json());

  getAllAsksByNameColorway = (nameColorway: string): Promise<SneakerAsk[]> =>
    fetch(this.listedSneakerPath + `/allAsks?nameColorway=${nameColorway}`).then((res) => res.json());

  getBySellerId = (sellerId: number): Promise<SellerListedSneaker[]> =>
    fetch(this.listedSneakerPath + `/all/${sellerId}`).then((res) => res.json());

  handlePurchase = (id: number, sellerId: number) =>
    fetch(this.listedSneakerPath + '/purchase', formatRequestOptions({ id, sellerId }, undefined, 'PUT')).then((r) =>
      r.json()
    );

  updateListedSneakerStatus = (listedProductId: number, status: Pick<ListedProduct, 'prodStatus'>) =>
    fetch(
      this.listedSneakerPath + `/status/${listedProductId}`,
      formatRequestOptions(status, undefined, 'PUT')
    ).then((r) => r.json());

  getUnsoldListedSneakers = async (sellerId: number) =>
    (await this.getBySellerId(sellerId)).filter((p) => p.prodStatus !== 'sold');

  getSoldListedSneakers = async (sellerId: number) =>
    (await this.getBySellerId(sellerId)).filter((p) => p.prodStatus === 'sold');
}

const ListedSneakerControllerInstance = new ListedSneakerController();

export default ListedSneakerControllerInstance;
