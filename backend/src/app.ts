import express, { Request } from 'express';
import cors from 'cors';

// routes
import apiRoutes from './api';

const app = express();

// register all middleware, refer to the guide for loader best practices
app.use(cors()); // enable cors
app.use(express.json()); // parsing application/json
app.use('/api', apiRoutes());

app.get('/', (_req, res) => res.send('Welcome to SneakerTrader Limited!!!'));

export default app;
