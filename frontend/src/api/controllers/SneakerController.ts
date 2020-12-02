import SneakerEntity from '../../../../shared/@types/domains/entities/SneakerEntity';
import formatApiEndpoint from 'utils/formatApiEndpoint';
import { AppSneaker, Sneaker } from '../../../../shared';

import formatRequestOptions from 'utils/formatRequestOptions';

import queryString from 'query-string';

export class SneakerController implements SneakerEntity {
  sneakerPath: string;

  constructor() {
    this.sneakerPath = formatApiEndpoint('sneaker');
  }

  create = (sneaker: AppSneaker): Promise<number> =>
    fetch(this.sneakerPath, formatRequestOptions(sneaker)).then((res) => res.json());

  getFirstByNameColorway = (name: string, colorway: string): Promise<Sneaker | null> => {
    console.log(this.sneakerPath + `?${queryString.stringify({ name, colorway })}`);
    return fetch(this.sneakerPath + `?${queryString.stringify({ name, colorway })}`).then((res) => res.json());
  };

  getFirstByNameBrandColorway = (name: string, brand: string, colorway: string): Promise<Sneaker | null> => {
    console.log(this.sneakerPath + `?${queryString.stringify({ name, brand, colorway })}`);
    return fetch(this.sneakerPath + `?${queryString.stringify({ name, brand, colorway })}`).then((res) => res.json());
  };

  getByNameColorwaySize = (name: string, colorway: string, size: number): Promise<Sneaker | null> =>
    fetch(this.sneakerPath + `?${queryString.stringify({ name, colorway, size })}`).then((res) => res.json());
}

const SneakerControllerInstance = new SneakerController();

export default SneakerControllerInstance;
