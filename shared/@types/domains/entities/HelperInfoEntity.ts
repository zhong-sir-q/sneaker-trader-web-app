import { Colorway, Brand, SneakerName } from '../../models';
import { HelperInfoType } from '..';

export interface HelperInfoServiceEntity {
  get(info: HelperInfoType): Promise<any>;
  create(info: HelperInfoType, payload: any): Promise<any>;
}

export interface HelperInfoControllerEntity {
  getColorways(): Promise<Colorway[]>;
  getBrands(): Promise<Brand[]>;
  getSneakerNames(): Promise<SneakerName[]>;

  createBrand(brand: Brand): Promise<any>;
  createColorway(colorway: Colorway): Promise<any>;
  createSneakerName(name: SneakerName): Promise<any>;
}
