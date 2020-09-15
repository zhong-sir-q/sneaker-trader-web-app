import { RequestHandler, Response, NextFunction } from 'express';

import { formateGetColumnsQuery, formatInsertColumnsQuery } from '../utils/formatDbQuery';

import { PromisifiedConnection } from '../config/mysql';
import { SNEAKER_NAMES, COLORWAYS, BRANDS } from '../config/tables';

import { Brand, SneakerName, Colorway } from '../../../shared';

const duplicateKeyHandler = (err: any, res: Response<any>, next: NextFunction, key: string) => {
  if (err.message.split(':')[0] === 'ER_DUP_ENTRY') res.json(`${key} already exists`);
  else next(err);
};

class HelperInfoService {
  connection: PromisifiedConnection;

  constructor(conn: PromisifiedConnection) {
    this.connection = conn;
  }

  getSneakerNames: RequestHandler = (_req, res, next) => {
    this.connection
      .query(formateGetColumnsQuery(SNEAKER_NAMES))
      .then((names) => res.json(names))
      .catch(next);
  };

  getColorways: RequestHandler = (_req, res, next) => {
    this.connection
      .query(formateGetColumnsQuery(COLORWAYS))
      .then((colors) => res.json(colors))
      .catch(next);
  };

  getBrands: RequestHandler = (_req, res, next) => {
    this.connection
      .query(formateGetColumnsQuery(BRANDS))
      .then((brands) => res.json(brands))
      .catch(next);
  };

  createBrand: RequestHandler = (req, res, next) => {
    const brand: Brand = req.body;

    this.connection
      .query(formatInsertColumnsQuery(BRANDS, brand))
      .then(() => res.json('Brand inserted'))
      .catch((err) => duplicateKeyHandler(err, res, next, brand.brand));
  };

  createSneakerName: RequestHandler = (req, res, next) => {
    const name: SneakerName = req.body;

    this.connection
      .query(formatInsertColumnsQuery(SNEAKER_NAMES, name))
      .then(() => res.json('Sneaker name inserted'))
      .catch((err) => duplicateKeyHandler(err, res, next, name.name));
  };

  createColorway: RequestHandler = (req, res, next) => {
    const colorway: Colorway = req.body;

    this.connection
      .query(formatInsertColumnsQuery(COLORWAYS, colorway))
      .then(() => res.json('Coloway inserted'))
      .catch((err) => duplicateKeyHandler(err, res, next, colorway.colorway));
  };
}

export default HelperInfoService;
