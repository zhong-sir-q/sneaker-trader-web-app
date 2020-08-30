import express from 'express';
import cors from 'cors';

import { initMysqlDb } from './config/mysql';

// routes
import apiRoutes from './api';

// NOTE: is it good practice to init the db here?
initMysqlDb();

const app = express();

// register all middleware, refer to the guide for loader best practices
app.use(cors()); // enable cors
// enable file upload
app.use('api', express.json()); // parsing application/json
app.use('/api', apiRoutes());

app.get('/', (_req, res) => res.send('Hello, this is the home page of SneakerTrader server'));

const PORT = 4000;
app.listen(PORT, () => console.log(`Listening at http://localhost:${PORT}`));
