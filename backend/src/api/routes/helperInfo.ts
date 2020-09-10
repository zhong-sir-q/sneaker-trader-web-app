import { Router } from 'express';
import { getMysqlDb } from '../../config/mysql';

import { formatInsertColumnsQuery, formateGetColumnsQuery } from '../../utils/formatDbQuery';

import { BRANDS, COLORWAYS, SNEAKER_NAMES } from '../../config/tables';
import { Colorway, SneakerName, Brand } from '../../../../shared';

const helperInfoRoute = Router();

// TODO: ask for advice, is the then catch syntax more clean than the try catch?
export default (app: Router) => {
  app.use('/helperInfo', helperInfoRoute);

  helperInfoRoute.get('/sneakerNames', (_req, res, next) => {
    const dbConnection = getMysqlDb();

    dbConnection
      .query(formateGetColumnsQuery(SNEAKER_NAMES))
      .then((names) => res.json(names))
      .catch(next);
  });

  helperInfoRoute.get('/colorways', (_req, res, next) => {
    const dbConnection = getMysqlDb();

    dbConnection
      .query(formateGetColumnsQuery(COLORWAYS))
      .then((colors) => res.json(colors))
      .catch(next);
  });

  helperInfoRoute.get('/brands', (_req, res, next) => {
    const dbConnection = getMysqlDb();
    dbConnection
      .query(formateGetColumnsQuery(BRANDS))
      .then((brandNames) => res.json(brandNames))
      .catch(next);
  });

  helperInfoRoute.post('/brands', (req, res) => {
    const dbConnection = getMysqlDb();
    const brand: Brand = req.body;

    dbConnection
      .query(formatInsertColumnsQuery(BRANDS, brand))
      .then(() => res.json('Brand inserted'))
      .catch(() => res.status(404).json(`Recieved invalid body at /brands`));
  });

  helperInfoRoute.post('/sneakerNames', (req, res) => {
    const dbConnection = getMysqlDb();
    const name: SneakerName = req.body;

    dbConnection
      .query(formatInsertColumnsQuery(SNEAKER_NAMES, name))
      .then(() => res.json('Sneaker name inserted'))
      .catch(() => res.status(404).json(`Recieved invalid body at /sneakerNames`));
  });

  helperInfoRoute.post('/colorways', (req, res) => {
    const dbConnection = getMysqlDb();
    const colorway: Colorway = req.body;

    dbConnection
      .query(formatInsertColumnsQuery(COLORWAYS, colorway))
      .then(() => res.json('Coloway inserted'))
      .catch(() => res.status(404).json(`Recieved invalid body at /colorways`));
  });
};
