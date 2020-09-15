import { Router } from 'express';
import ListedProductService from '../../services/listedProduct';

const listedProductRoute = Router();

// TODO: refactor the try catch block into 1 wrapper
export default (app: Router, ListedProductServiceInstance: ListedProductService) => {
  app.use('/listed_product', listedProductRoute);

  listedProductRoute.get('/', async (req, res, next) => {
    const sneakerSize = req.query.sizes as string;
    const sneakerName = req.query.name as string;

    try {
      if (sneakerName) ListedProductServiceInstance.getSizeMinPriceGroupByName(sneakerName).then((r) => res.json(r));
      else if (sneakerSize) ListedProductServiceInstance.getBySize(sneakerSize).then((r) => res.json(r));
      else ListedProductServiceInstance.getAllListedProducts().then((r) => res.json(r));
    } catch (err) {
      next(err);
    }
  });

  listedProductRoute.get('/allAsks', (req, res, next) => {
    const { nameColorway } = req.query;

    ListedProductServiceInstance.getAllAsksByNameColorway(nameColorway as string)
      .then((result) => res.json(result))
      .catch(next);
  });

  listedProductRoute.get('/gallery', ListedProductServiceInstance.getGallerySneakers);

  listedProductRoute.post('/', ListedProductServiceInstance.handleCreate);

  listedProductRoute.put('/purchase', ListedProductServiceInstance.handlePurchase)
};
