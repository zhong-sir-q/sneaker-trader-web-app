import { Router } from 'express';
import SellersService from '../../services/sellers';

const sellersRoute = Router();

export default (app: Router, SellersServiceInstance: SellersService) => {
  app.use('/sellers', sellersRoute)

  sellersRoute.get('/', async (req, res, next) => {
    const { sneakerName, size } = req.query

    if (sneakerName && size) {
      try {
        const sellersBySneakerNameSize = await SellersServiceInstance.getSellersBySneakerNameSize(sneakerName as string, Number(size))
        res.json(sellersBySneakerNameSize)
      } catch (err) {
        next(err)
      }
    } else res.status(404).json('Invalid params recieved at /sellers')
  })
};
