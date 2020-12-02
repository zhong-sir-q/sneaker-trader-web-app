import { Router } from 'express';
import SneakerService from '../../services/SneakerService';
import { ExpressHandler } from '../../@types/express';

const sneakerRoute = Router();

const createSneakerHandlers = (sneakerService: SneakerService) => {
  const getSneakerByQuery: ExpressHandler = (req, res, next) => {
    const { name, colorway, size, brand } = req.query;

    if (name && colorway && size) {
      sneakerService
        .getByNameColorwaySize(name as string, colorway as string, Number(size))
        .then((sneaker) => res.json(sneaker))
        .catch(next);
    } else if (name && colorway && brand) {
      sneakerService
        .getFirstByNameBrandColorway(name as string, brand as string, colorway as string)
        .then((sneaker) => res.json(sneaker))
        .catch(next);
    } else if (name && colorway) {
      sneakerService
        .getFirstByNameColorway(name as string, colorway as string)
        .then((sneaker) => res.json(sneaker))
        .catch(next);
    } else next(new Error('Invalid query at the get sneaker route'));
  };

  const create: ExpressHandler = (req, res, next) => {
    const sneaker = req.body;

    sneakerService
      .create(sneaker)
      .then((sneakerId) => res.json(sneakerId))
      .catch(next);
  };

  return { create, getSneakerByQuery };
};
export default (app: Router, sneakerService: SneakerService) => {
  app.use('/sneaker', sneakerRoute);

  const { create, getSneakerByQuery } = createSneakerHandlers(
    sneakerService
  );

  sneakerRoute.route('/').post(create).get(getSneakerByQuery);
};
