import { Router, Request, Response, NextFunction } from 'express';
import ListedSneakerService from '../../services/ListedSneakerService';
import { ExpressHandler } from '../../@types/express';

const listedSneakerRoute = Router();

const createListedSneakerHandlers = (listedSneakerService: ListedSneakerService) => {
  const update: ExpressHandler = (req, res, next) => {
    const { id } = req.params;

    const listedSneaker = req.body;

    listedSneakerService
      .update(Number(id), listedSneaker)
      .then(() => res.json(listedSneaker))
      .catch(next);
  };

  const get: ExpressHandler = (req, res, next) => {
    const { id } = req.params;

    listedSneakerService
      .getById(Number(id))
      .then((r) => res.json(r))
      .catch(next);
  };

  return { get, update };
};

export default (app: Router, ListedSneakerServiceInstance: ListedSneakerService) => {
  const { get, update } = createListedSneakerHandlers(ListedSneakerServiceInstance);

  app.use('/listedSneaker', listedSneakerRoute);

  listedSneakerRoute.get('/', async (_req, res, next) => {
    ListedSneakerServiceInstance.getAllListedSneakers()
      .then((r) => res.json(r))
      .catch((err) => next(err));
  });

  listedSneakerRoute.get('/sizeMinPriceGroup/:nameColorway/:sellerId', (req, res, next) => {
    const { nameColorway, sellerId } = req.params;

    ListedSneakerServiceInstance.getSizeMinPriceGroupByNameColorway(nameColorway, Number(sellerId))
      .then((r) => res.json(r))
      .catch(next);
  });

  listedSneakerRoute.get('/gallery/size/:sellerId/:size', (req, res, next) => {
    const { sellerId, size } = req.params;

    ListedSneakerServiceInstance.getGallerySneakersBySize(Number(sellerId), Number(size))
      .then((r) => res.json(r))
      .catch(next);
  });

  listedSneakerRoute.get('/all/:sellerId', (req, res, next) => {
    const { sellerId } = req.params;

    ListedSneakerServiceInstance.getBySellerId(Number(sellerId))
      .then((sellerListedSneakers) => res.json(sellerListedSneakers))
      .catch(next);
  });

  listedSneakerRoute.get('/allAsks', (req, res, next) => {
    const { nameColorway } = req.query;

    ListedSneakerServiceInstance.getAllAsksByNameColorway(nameColorway as string)
      .then((result) => res.json(result))
      .catch(next);
  });

  listedSneakerRoute.get('/gallery/:sellerId', (req, res, next) => {
    const { sellerId } = req.params;

    ListedSneakerServiceInstance.getGallerySneakers(Number(sellerId))
      .then((gallerySneakers) => res.json(gallerySneakers))
      .catch(next);
  });

  listedSneakerRoute.post('/', (req, res, next) => {
    const listedSneaker = req.body;

    ListedSneakerServiceInstance.create(listedSneaker)
      .then((listedSneakerId) => res.json(listedSneakerId))
      .catch(next);
  });

  listedSneakerRoute.put('/purchase', (req, res, next) => {
    const { id, sellerId } = req.body;

    ListedSneakerServiceInstance.handlePurchase(id, sellerId)
      .then(() => res.json('Purchase completed'))
      .catch(next);
  });

  listedSneakerRoute.put('/status/:id', (req, res, next) => {
    const { id } = req.params;
    const listedSneakerStatus = req.body;

    ListedSneakerServiceInstance.updateListedSneakerStatus(Number(id), listedSneakerStatus)
      .then(() => res.json('Sneaker status updated'))
      .catch(next);
  });

  listedSneakerRoute.route('/:id').get(get).put(update);
};
