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
app.use(express.json()); // parsing application/json
app.use('/api', apiRoutes());

app.get('/', (_req, res) => res.send('Hello, the home page'));

const PORT = 4000;
app.listen(PORT, () => console.log('Listening at port', PORT));
