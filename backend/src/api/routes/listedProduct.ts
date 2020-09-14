import { Router } from 'express';
import ListedProductService from '../../services/listedProduct';
import { getMysqlDb } from '../../config/mysql';

const listedProductRoute = Router();

// TODO: refactor the try catch block into 1 wrapper
export default (app: Router) => {
  app.use('/listed_product', listedProductRoute);

  listedProductRoute.get('/', async (req, res, next) => {
    const sneakerSize = req.query.sizes as string;
    const sneakerName = req.query.name as string;
    const ListedProductServiceInstance = new ListedProductService(getMysqlDb());

    if (sneakerName) {
      ListedProductServiceInstance.getSizeMinPriceGroupByName(sneakerName)
        .then((r) => res.json(r))
        .catch(next);
    } else if (sneakerSize) {
      ListedProductServiceInstance.getBySize(sneakerSize)
        .then((r) => res.json(r))
        .catch(next);
    } else {
      ListedProductServiceInstance.getAllListedProducts()
        .then((r) => res.json(r))
        .catch(next);
    }
  });

  listedProductRoute.get('/allAsks', (req, res, next) => {
    const { nameColorway } = req.query;

    const ListedProductServiceInstance = new ListedProductService(getMysqlDb());
    ListedProductServiceInstance.getAllAsksByNameColorway(nameColorway as string)
      .then((result) => res.json(result))
      .catch(next);
  });

  listedProductRoute.get('/gallery', new ListedProductService(getMysqlDb()).getGallerySneakers);

  listedProductRoute.post('/', new ListedProductService(getMysqlDb()).handleCreate);
};
