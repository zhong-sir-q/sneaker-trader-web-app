import formatApiEndpoint, { concatPaths } from 'utils/formatApiEndpoint';
import formatRequestOptions from 'utils/formatRequestOptions';

import { HelperInfoControllerEntity, Brand, SneakerName, Colorway } from '../../../../shared';

export class HelperInfoController implements HelperInfoControllerEntity {
  helperInfoPath: string;

  constructor() {
    this.helperInfoPath = formatApiEndpoint('helperInfo');
  }

  getBrands = (): Promise<string[]> =>
    fetch(concatPaths(this.helperInfoPath, 'brands'))
      .then((res) => res.json())
      .then((brands: Brand[]) => brands.map((b) => b.brand));

  getSneakerNames = (): Promise<string[]> =>
    fetch(concatPaths(this.helperInfoPath, 'sneakerNames'))
      .then((res) => res.json())
      .then((names) => names.map((n: SneakerName) => n.name));

  getColorways = (): Promise<string[]> =>
    fetch(concatPaths(this.helperInfoPath, 'colorways'))
      .then((res) => res.json())
      .then((colorways: Colorway[]) => colorways.map((cw) => cw.colorway));

  createBrand = (brand: Brand): Promise<any> =>
    fetch(concatPaths(this.helperInfoPath, 'brands'), formatRequestOptions(brand));

  createSneakerName = (name: SneakerName): Promise<any> =>
    fetch(concatPaths(this.helperInfoPath, 'sneakerNames'), formatRequestOptions(name));

  createColorway = (colorway: Colorway): Promise<any> =>
    fetch(concatPaths(this.helperInfoPath, 'colorways'), formatRequestOptions(colorway));
}

const HelperInfoControllerInstance = new HelperInfoController();

export default HelperInfoControllerInstance;
