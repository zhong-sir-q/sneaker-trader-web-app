import { Router } from 'express';
import ListedProductService from '../../services/listedProduct';
import { getMysqlDb } from '../../config/mysql';

const listedProductRoute = Router();

export default (app: Router) => {
  app.use('/listed_product', listedProductRoute);

  // TODO: NAME THE ROUTE
  listedProductRoute.get('/', async (req, res) => {
    const sneakerColorName = req.query.colorName;

    if (sneakerColorName) {
      const ListedProductServiceInstance = new ListedProductService(getMysqlDb());
      const userSizeGroupedPrice = await ListedProductServiceInstance.getUserSizeGroupedPriceByColorName(sneakerColorName as string);
      res.json(userSizeGroupedPrice);
    } else {
      res.status(404).json('Recieved invalid parameters');
    }
  });

  listedProductRoute.get('/gallery', new ListedProductService(getMysqlDb()).getGallerySneakers);

  listedProductRoute.post('/', new ListedProductService(getMysqlDb()).handleCreate);
};
