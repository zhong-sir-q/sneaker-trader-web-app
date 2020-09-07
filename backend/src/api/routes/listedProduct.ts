import { Router } from 'express';
import ListedProductService from '../../services/listedProduct';
import { getMysqlDb } from '../../config/mysql';

const listedProductRoute = Router();

export default (app: Router) => {
  app.use('/listed_product', listedProductRoute);

  // TODO: NAME THE ROUTE
  listedProductRoute.get('/', async (req, res) => {
    const sneakerSize = req.query.sizes as string
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
      const sneakersBySize = await ListedProductServiceInstance.getBySize(sneakerSize);
      res.json(sneakersBySize);
    } else {
      res.status(404).json('Recieved invalid parameters');
    }
  });

  listedProductRoute.get('/gallery', new ListedProductService(getMysqlDb()).getGallerySneakers);

  listedProductRoute.post('/', new ListedProductService(getMysqlDb()).handleCreate);
};
