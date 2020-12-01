import { Router, Request, Response, NextFunction } from 'express';
import ListedSneakerService from '../../services/ListedSneakerService';
import { ExpressHandler } from '../../@types/express';

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
      .then(r => r.length > 0 ? r[0] : null)
      .then((r) => res.json(r))
      .catch(next);
  };

  const getAll: ExpressHandler = (_req, res, next) => {
    listedSneakerService
      .getAll()
      .then((r) => res.json(r))
      .catch(next);
  };

  const remove: ExpressHandler = (req, res, next) => {
    const { id } = req.params;

    listedSneakerService
      .remove(Number(id))
      .then(r => res.json(r))
      .catch(next)
  }

  const getGallerySneakersBySellerId: ExpressHandler = (req, res, next) => {
    const { sellerId } = req.params;
    const { limit, offset } = req.query;

    listedSneakerService
      .getGallerySneakers(Number(sellerId), Number(limit), Number(offset))
      .then((gallerySneakers) => res.json(gallerySneakers))
      .catch(next);
  };

  return {
    update,
    get,
    getAll,
    remove,
    getGallerySneakersBySellerId,
  };
};

export default (app: Router, ListedSneakerServiceInstance: ListedSneakerService) => {
  const {
    update,
    get,
    getAll,
    remove,
    getGallerySneakersBySellerId
  } = createListedSneakerHandlers(ListedSneakerServiceInstance);

  const router = Router();

  app.use('/listedSneaker', router);

  router.route('/history').get(getAll);
  router.route('/one/:id').get(get).put(update).delete(remove);
  router.route('/gallery/:sellerId').get(getGallerySneakersBySellerId);

  router.get('/', async (_req, res, next) => {
    ListedSneakerServiceInstance.getAllListedSneakers()
      .then((r) => res.json(r))
      .catch((err) => next(err));
  });

  router.get('/sizeMinPriceGroup/:nameColorway/:sellerId', (req, res, next) => {
    const { nameColorway, sellerId } = req.params;

    ListedSneakerServiceInstance.getSizeMinPriceGroupByNameColorway(nameColorway, Number(sellerId))
      .then((r) => res.json(r))
      .catch(next);
  });

  router.get('/gallery/size/:sellerId/:size', (req, res, next) => {
    const { sellerId, size } = req.params;

    ListedSneakerServiceInstance.getGallerySneakersBySize(Number(sellerId), Number(size))
      .then((r) => res.json(r))
      .catch(next);
  });

  router.get('/all/:sellerId', (req, res, next) => {
    const { sellerId } = req.params;

    ListedSneakerServiceInstance.getBySellerId(Number(sellerId))
      .then((sellerListedSneakers) => res.json(sellerListedSneakers))
      .catch(next);
  });

  router.get('/allAsks', (req, res, next) => {
    const { nameColorway } = req.query;

    ListedSneakerServiceInstance.getAllAsksByNameColorway(nameColorway as string)
      .then((result) => res.json(result))
      .catch(next);
  });

  router.post('/', (req, res, next) => {
    const listedSneaker = req.body;

    ListedSneakerServiceInstance.create(listedSneaker)
      .then((listedSneakerId) => res.json(listedSneakerId))
      .catch(next);
  });

  router.put('/purchase', (req, res, next) => {
    const { id, sellerId } = req.body;

    ListedSneakerServiceInstance.handlePurchase(id, sellerId)
      .then(() => res.json('Purchase completed'))
      .catch(next);
  });

  router.put('/status/:id', (req, res, next) => {
    const { id } = req.params;
    const listedSneakerStatus = req.body;

    ListedSneakerServiceInstance.updateListedSneakerStatus(Number(id), listedSneakerStatus)
      .then(() => res.json('Sneaker status updated'))
      .catch(next);
  });
};
