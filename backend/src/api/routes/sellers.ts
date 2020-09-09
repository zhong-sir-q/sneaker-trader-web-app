import { Router } from 'express';
import { getMysqlDb } from '../../config/mysql';
import SellersService from '../../services/sellers';

const sellersRoute = Router();

export default (app: Router) => {
  app.use('/sellers', sellersRoute)

  sellersRoute.get('/', async (req, res, next) => {
    const { sneakerName, size } = req.query

    const SellersServiceInstance = new SellersService(getMysqlDb())
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
