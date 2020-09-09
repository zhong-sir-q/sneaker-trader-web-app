import { Router } from 'express';
import { getMysqlDb } from '../../config/mysql';

const helperInfoRoute = Router();

export default (app: Router) => {
  app.use('/helperInfo', helperInfoRoute);

  helperInfoRoute.get('/sneakerNames', async (req, res) => {
    const dbConnection = getMysqlDb();
    const names = await dbConnection.query('SELECT * FROM SneakerNames');
    res.json(names);
  });

  helperInfoRoute.get('/colorways', async (req, res) => {
    const dbConnection = getMysqlDb();
    const colors = await dbConnection.query('SELECT * FROM Colorways');
    res.json(colors);
  });

  helperInfoRoute.get('/brands', async (req, res) => {
    const dbConnection = getMysqlDb();
    const brandNames = await dbConnection.query('SELECT * FROM Brands');
    res.json(brandNames);
  });
};
