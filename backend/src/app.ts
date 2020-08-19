import express from 'express';
import cors from 'cors';

import { initMysqlDb } from './config/mysql';

// routes
import apiRoutes from './api';

const app = express();

// register all middleware, refer to the guide for loader best practices
// enable cors
app.use(cors());
app.use('/api', express.json()); // parsing application/json
app.use('/api', apiRoutes());

app.get('/', (_req, res) => res.send('Homepage is here'));

const PORT = 4000;
app.listen(PORT, () => {
  initMysqlDb();
  console.log(`Listening at http://localhost:${PORT}`)
});
