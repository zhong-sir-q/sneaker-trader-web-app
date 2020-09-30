import { Router } from 'express';
import SneakerService from '../../services/SneakerService';

const sneakerRoute = Router();

// NOTE: are there too much going on in this funtion? If so, how can I refactor it?
export default (app: Router, SneakerServiceInstance: SneakerService) => {
  app.use('/sneaker', sneakerRoute);

  sneakerRoute.get('/:nameColorway', (req, res, next) => {
    const { nameColorway } = req.params

    SneakerServiceInstance.getFirstByNameColorway(nameColorway)
      .then((sneaker) => res.json(sneaker))
      .catch(next);
  });

  sneakerRoute.get('/:nameColorway/:size', (req, res, next) => {
    const { nameColorway, size } = req.params;

    SneakerServiceInstance.getByNameColorwaySize(nameColorway, Number(size))
      .then((sneaker) => res.json(sneaker))
      .catch(next);
  });

  sneakerRoute.post('/', (req, res, next) => {
    const sneaker = req.body;

    SneakerServiceInstance.create(sneaker)
      .then((sneakerId) => res.json(sneakerId))
      .catch(next);
  });
};
