import { Router } from 'express';
import SellerService from '../../services/SellerService';

const sellersRoute = Router();

export default (app: Router, SellerServiceInstance: SellerService) => {
  app.use('/seller', sellersRoute);

  sellersRoute.get('/:currentUserId/:name/:colorway/:size', async (req, res, next) => {
    const { currentUserId, name, colorway, size } = req.params;

    SellerServiceInstance.getSellersBySneakerNameSize(Number(currentUserId), name, colorway, Number(size))
      .then((sellers) => res.json(sellers))
      .catch(next);
  });
};
