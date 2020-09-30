import { Router } from 'express';
import SellerService from '../../services/SellerService';

const sellersRoute = Router();

export default (app: Router, SellerServiceInstance: SellerService) => {
  app.use('/seller', sellersRoute);

  sellersRoute.get('/:currentUserId', async (req, res, next) => {
    const { currentUserId } = req.params;
    const { sneakerName, size } = req.query;

    if (sneakerName && size) {
      SellerServiceInstance.getSellersBySneakerNameSize(Number(currentUserId), sneakerName as string, Number(size))
        .then((sellers) => res.json(sellers))
        .catch(next);
    } else res.status(404).json('Invalid params recieved at /sellers');
  });
};
