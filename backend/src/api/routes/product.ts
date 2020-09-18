import { Router } from 'express';
import ProductService from '../../services/product';

const productRoute = Router();

// NOTE: are there too much going on in this funtion? If so, how can I refactor it?
export default (app: Router, ProductServiceInstance: ProductService) => {
  app.use('/product', productRoute);

  productRoute.get('/:nameColorway/:size', (req, res, next) => {
    const { nameColorway, size } = req.params;

    ProductServiceInstance.getByNamecolorwaySize(nameColorway, size)
      .then((sneaker) => res.json(sneaker))
      .catch(next);
  });

  productRoute.post('/', ProductServiceInstance.handleCreate);
};
