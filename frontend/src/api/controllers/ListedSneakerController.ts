import {
  AppListedSneaker,
  GallerySneaker,
  SizeMinPriceGroupType,
  SneakerAsk,
  SellerListedSneaker,
  ListedProduct,
  GetListedSneaker,
  CreateListedSneakerPayload,
} from '../../../../shared';

import ListedSneakerEntity from '../../../../shared/@types/domains/entities/ListedSneakerEntity';

import formatApiEndpoint, { concatPaths } from '../../utils/formatApiEndpoint';
import formatRequestOptions from '../../utils/formatRequestOptions';

export class ListedSneakerController implements ListedSneakerEntity {
  listedSneakerPath: string;

  constructor() {
    this.listedSneakerPath = formatApiEndpoint('listedSneaker');
  }

  create = (listedSneaker: AppListedSneaker) =>
    fetch(this.listedSneakerPath, formatRequestOptions(listedSneaker)).then((res) => res.json());

  getAllListedSneakers = (): Promise<GetListedSneaker[]> => fetch(this.listedSneakerPath).then((res) => res.json());

  getGallerySneakers = (sellerId: number, limit?: number, offset?: number): Promise<GallerySneaker[]> => {
    // TODO: use a out of box solution or define a custom function to build the query
    let query = '';
    if (limit !== undefined) query = `limit=${limit}`;
    if (offset !== undefined) query = `${query}&offset=${offset}`;
    if (query) query = '?' + query;

    return fetch(concatPaths(this.listedSneakerPath, 'gallery', sellerId + query)).then((res) => res.json());
  };

  getSizeMinPriceGroupByNameColorway = (nameColorway: string, sellerId: number): Promise<SizeMinPriceGroupType> =>
    fetch(concatPaths(this.listedSneakerPath, 'sizeMinPriceGroup', nameColorway, sellerId)).then((res) => res.json());

  getGallerySneakersBySize = (sellerId: number, size: number): Promise<GallerySneaker[]> =>
    fetch(concatPaths(this.listedSneakerPath, 'gallery', 'size', sellerId, size)).then((res) => res.json());

  getAllAsksByNameColorway = (nameColorway: string): Promise<SneakerAsk[]> =>
    fetch(this.listedSneakerPath + `/allAsks?nameColorway=${nameColorway}`).then((res) => res.json());

  getBySellerId = (sellerId: number): Promise<SellerListedSneaker[]> =>
    fetch(this.listedSneakerPath + `/all/${sellerId}`).then((res) => res.json());

  getAll = (): Promise<{ name: string; colorway: string; brand: string; imageUrls: string }[]> =>
    fetch(concatPaths(this.listedSneakerPath, 'history')).then((r) => r.json());

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

  update = (listedSneakerId: number, listedSneaker: CreateListedSneakerPayload): Promise<ListedProduct> =>
    fetch(
      concatPaths(this.listedSneakerPath, 'one', listedSneakerId),
      formatRequestOptions(listedSneaker, undefined, 'PUT')
    ).then((r) => r.json());

  removeListing = (listedSneakerId: number) =>
    fetch(
      concatPaths(this.listedSneakerPath, 'one', listedSneakerId),
      formatRequestOptions(undefined, undefined, 'DELETE')
    ).then((r) => r.json());
}

const ListedSneakerControllerInstance = new ListedSneakerController();

export default ListedSneakerControllerInstance;
