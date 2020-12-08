import SneakerEntity from '../../../../shared/@types/domains/entities/SneakerEntity';
import formatApiEndpoint, { concatPaths } from 'utils/formatApiEndpoint';
import { AppSneaker, Sneaker } from '../../../../shared';

import formatRequestOptions from 'utils/formatRequestOptions';

import queryString from 'query-string';

export class SneakerController implements SneakerEntity {
  private sneakerPath: string;

  constructor() {
    this.sneakerPath = formatApiEndpoint('sneaker');
  }

  create = (sneaker: AppSneaker): Promise<number> =>
    fetch(this.sneakerPath, formatRequestOptions(sneaker)).then((res) => res.json());

  getFirstByNameColorway = (name: string, colorway: string): Promise<Sneaker | null> =>
    fetch(this.sneakerPath + `?${queryString.stringify({ name, colorway })}`).then((res) => res.json());

  getFirstByNameBrandColorway = (name: string, brand: string, colorway: string): Promise<Sneaker | null> =>
    fetch(this.sneakerPath + `?${queryString.stringify({ name, brand, colorway })}`).then((res) => res.json());

  getByNameColorwaySize = (name: string, colorway: string, size: number): Promise<Sneaker | null> =>
    fetch(this.sneakerPath + `?${queryString.stringify({ name, colorway, size })}`).then((res) => res.json());

  getGallerySneakers = (): Promise<Sneaker[]> => fetch(concatPaths(this.sneakerPath, 'gallery')).then((r) => r.json());

  updateDisplayImage = (id: number, imageUrls: string): Promise<any> =>
    fetch(
      concatPaths(this.sneakerPath, 'updateImage', id),
      formatRequestOptions({ imageUrls }, undefined, 'PUT')
    ).then((r) => r.json());

  getById = (id: number): Promise<Sneaker | null> =>
    fetch(concatPaths(this.sneakerPath, 'one', id)).then((r) => r.json());
}

const SneakerControllerInstance = new SneakerController();

export default SneakerControllerInstance;
