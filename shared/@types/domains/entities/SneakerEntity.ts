import { Sneaker } from '../../..';
import { AppSneaker } from '../sneaker';

interface SneakerEntity {
  getByNameColorwaySize(name: string, colorway: string, size: number): Promise<Sneaker | null>;
  getFirstByNameColorway(name: string, colorway: string): Promise<Sneaker | null>;
  getFirstByNameBrandColorway(name: string, brand: string, colorway: string): Promise<Sneaker | null>;
  getGallerySneakers(): Promise<Sneaker[]>;
  create(sneaker: AppSneaker): Promise<number>;
  updateDisplayImage(id: number, imgUrl: string): Promise<any>;
}

export default SneakerEntity;
