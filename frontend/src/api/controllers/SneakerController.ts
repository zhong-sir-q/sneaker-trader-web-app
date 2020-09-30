import SneakerEntity from '../../../../shared/@types/domains/entities/SneakerEntity';
import formatApiEndpoint, { concatPaths } from 'api/formatApiEndpoint';
import { AppSneaker, Sneaker } from '../../../../shared';
import formatRequestOptions from 'api/formatRequestOptions';

class SneakerController implements SneakerEntity {
  sneakerPath: string;

  constructor() {
    this.sneakerPath = formatApiEndpoint('sneaker');
  }

  create = (sneaker: AppSneaker): Promise<number> =>
    fetch(this.sneakerPath, formatRequestOptions(sneaker)).then((res) => res.json());

  getFirstByNameColorway = (nameColorway: string): Promise<Sneaker | null> =>
    fetch(concatPaths(this.sneakerPath, nameColorway)).then((res) => res.json());

  getByNameColorwaySize = (nameColorway: string, size: number): Promise<Sneaker | null> =>
    fetch(concatPaths(this.sneakerPath, nameColorway, size)).then((res) => res.json());
}

const SneakerControllerInstance = new SneakerController();

export default SneakerControllerInstance;
