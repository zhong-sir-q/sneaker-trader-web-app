import { Router } from 'express';
import SellersService from '../../services/SellersService';

const sellersRoute = Router();

export default (app: Router, SellersServiceInstance: SellersService) => {
  app.use('/sellers', sellersRoute);

  sellersRoute.get('/', async (req, res, next) => {
    const { sneakerName, size } = req.query;

    if (sneakerName && size) {
      SellersServiceInstance.getSellersBySneakerNameSize(sneakerName as string, Number(size))
        .then((sellers) => res.json(sellers))
        .catch(next);
    } else res.status(404).json('Invalid params recieved at /sellers');
  });
};
