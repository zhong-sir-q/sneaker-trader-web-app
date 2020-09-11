import { Router } from 'express';
import ListedProductService from '../../services/listedProduct';
import { getMysqlDb } from '../../config/mysql';

const listedProductRoute = Router();

// TODO: refactor the try catch block into 1 wrapper
export default (app: Router) => {
  app.use('/listed_product', listedProductRoute);

  listedProductRoute.get('/', async (req, res) => {
    const sneakerSize = req.query.sizes as string;
    const sneakerName = req.query.name as string;
    const ListedProductServiceInstance = new ListedProductService(getMysqlDb());

    if (sneakerName) {
      try {
        const sizeMinPriceGroup = await ListedProductServiceInstance.getSizeMinPriceGroupByName(sneakerName);
        res.json(sizeMinPriceGroup);
      } catch (err) {
        res.status(404).json(err.message);
      }
    } else if (sneakerSize) {
      try {
        const sneakersBySize = await ListedProductServiceInstance.getBySize(sneakerSize);
        res.json(sneakersBySize);
      } catch (err) {
        res.status(404).json(err.message);
      }
    } else {
      try {
        const allListedProducts = await ListedProductServiceInstance.getAllListedProducts();
        res.json(allListedProducts);
      } catch (err) {
        res.status(404).json(err.message);
      }
    }
  });

  listedProductRoute.get('/gallery', new ListedProductService(getMysqlDb()).getGallerySneakers);

  listedProductRoute.post('/', new ListedProductService(getMysqlDb()).handleCreate);
};
