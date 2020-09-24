import { Router } from 'express';
import SneakerService from '../../services/SneakerService';

const productRoute = Router();

// NOTE: are there too much going on in this funtion? If so, how can I refactor it?
export default (app: Router, SneakerServiceInstance: SneakerService) => {
  app.use('/product', productRoute);

  productRoute.get('/:nameColorway/:size', (req, res, next) => {
    const { nameColorway, size } = req.params;

    SneakerServiceInstance.getByNamecolorwaySize(nameColorway, size)
      .then((sneaker) => res.json(sneaker))
      .catch(next);
  });

  productRoute.post('/', SneakerServiceInstance.handleCreate);
};
