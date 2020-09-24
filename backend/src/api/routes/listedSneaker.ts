import { Router } from 'express';
import ListedSneakerService from '../../services/ListedSneakerService';

const listedSneakerRoute = Router();

// TODO: refactor the try catch block into 1 wrapper
export default (app: Router, ListedSneakerServiceInstance: ListedSneakerService) => {
  app.use('/listedSneaker', listedSneakerRoute);

  listedSneakerRoute.get('/', async (req, res, next) => {
    const sneakerSize = req.query.sizes as string;
    const sneakerName = req.query.name as string;

    try {
      if (sneakerName) ListedSneakerServiceInstance.getSizeMinPriceGroupByName(sneakerName).then((r) => res.json(r));
      else if (sneakerSize) ListedSneakerServiceInstance.getBySize(sneakerSize).then((r) => res.json(r));
      else ListedSneakerServiceInstance.getAllListedSneakers().then((r) => res.json(r));
    } catch (err) {
      next(err);
    }
  });

  listedSneakerRoute.get('/allAsks', (req, res, next) => {
    const { nameColorway } = req.query;

    ListedSneakerServiceInstance.getAllAsksByNameColorway(nameColorway as string)
      .then((result) => res.json(result))
      .catch(next);
  });

  listedSneakerRoute.get('/gallery', (_req, res, next) => {
    ListedSneakerServiceInstance.getGallerySneakers()
      .then((gallerySneakers) => res.json(gallerySneakers))
      .catch(next);
  });

  listedSneakerRoute.post('/', (req, res, next) => {
    const listedSneaker = req.body;

    ListedSneakerServiceInstance.handleCreate(listedSneaker)
      .then(() => res.json('A sneaker is listed'))
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

    ListedSneakerServiceInstance.updateListedSneakerStatus(Number(id), listedSneakerStatus);
  });
};
