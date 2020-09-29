import { Router, Response, NextFunction } from 'express';

import HelperInfoService from '../../services/HelperInfoService';
import { Brand, SneakerName, Colorway } from '../../../../shared';

const helperInfoRoute = Router();

const duplicateKeyHandler = (err: any, res: Response<any>, next: NextFunction, key: string) => {
  if (err.message.split(':')[0] === 'ER_DUP_ENTRY') res.json(`${key} already exists`);
  else next(err);
};

export default (app: Router, HelperInfoServiceInstance: HelperInfoService) => {
  app.use('/helper_info', helperInfoRoute);

  helperInfoRoute.get('/sneakerNames', (_req, res, next) => {
    HelperInfoServiceInstance.get('sneakernames')
      .then((names) => res.json(names))
      .catch(next);
  });

  helperInfoRoute.get('/colorways', (_req, res, next) => {
    HelperInfoServiceInstance.get('colorways')
      .then((colors) => res.json(colors))
      .catch(next);
  });

  helperInfoRoute.get('/brands', (_req, res, next) => {
    HelperInfoServiceInstance.get('brands')
      .then((colors) => res.json(colors))
      .catch(next);
  });

  helperInfoRoute.post('/brands', (req, res, next) => {
    const brand: Brand = req.body;

    HelperInfoServiceInstance.create('brands', brand)
      .then(() => res.json('Brand inserted'))
      .catch((err) => duplicateKeyHandler(err, res, next, brand.brand));
  });

  helperInfoRoute.post('/sneakerNames', (req, res, next) => {
    const name: SneakerName = req.body;

    HelperInfoServiceInstance.create('sneakernames', name)
      .then(() => res.json('Sneaker name inserted'))
      .catch((err) => duplicateKeyHandler(err, res, next, name.name));
  });

  helperInfoRoute.post('/colorways', (req, res, next) => {
    const colorway: Colorway = req.body;

    HelperInfoServiceInstance.create('colorways', colorway)
      .then(() => res.json('Coloway inserted'))
      .catch((err) => duplicateKeyHandler(err, res, next, colorway.colorway));
  });
};
