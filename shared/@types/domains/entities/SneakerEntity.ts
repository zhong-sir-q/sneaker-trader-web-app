import { Sneaker } from '../../..';
import { AppSneaker } from '../sneaker';

interface SneakerEntity {
  getByNameColorwaySize(nameColorway: string, size: number): Promise<Sneaker | null>;
  getFirstByNameColorway(nameColorway: string): Promise<Sneaker | null>;
  create(sneaker: AppSneaker): Promise<number>;
}

export default SneakerEntity;
