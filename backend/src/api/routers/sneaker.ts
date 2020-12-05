import { Router } from 'express';
import SneakerService from '../../services/SneakerService';
import { ExpressHandler } from '../../@types/express';

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

  const getGallerySneakers: ExpressHandler = (_req, res, next) => {
    sneakerService
      .getGallerySneakers()
      .then((sneakers) => res.json(sneakers))
      .catch(next);
  };

  const updateDisplayImage: ExpressHandler = (req, res, next) => {
    const { id } = req.params;
    const { imageUrls } = req.body;

    sneakerService
      .updateDisplayImage(Number(id), imageUrls)
      .then((r) => res.json(r))
      .catch(next);
  };

  return { create, getSneakerByQuery, getGallerySneakers, updateDisplayImage };
};

const sneakerRoute = Router();

export default (app: Router, sneakerService: SneakerService) => {
  app.use('/sneaker', sneakerRoute);

  const { create, getSneakerByQuery, getGallerySneakers, updateDisplayImage } = createSneakerHandlers(sneakerService);

  sneakerRoute.route('/').post(create).get(getSneakerByQuery);
  sneakerRoute.route('/updateImage/:id').put(updateDisplayImage);
  sneakerRoute.route('/gallery').get(getGallerySneakers);
};
