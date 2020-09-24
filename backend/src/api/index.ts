import { Router } from 'express';

import user from './routes/user';
import sellers from './routes/sellers';

import sneaker from './routes/sneaker';
import listedSneaker from './routes/listedSneaker';

import aws from './routes/aws';

import helperInfo from './routes/helperInfo';
import mail from './routes/mail';

import wallet from './routes/wallet';
import transaction from './routes/transaction';
import transactions from './routes/transactions';

import UserService from '../services/UserService';
import SellersService from '../services/SellersService';

import ListedSneakerService from '../services/ListedSneakerService';
import SneakerService from '../services/SneakerService';
import HelperInfoService from '../services/HelperInfoService';

import CustomAwsService from '../services/external/aws';
import MailService from '../services/external/mail';

import WalletService from '../services/WalletService';
import TransactionService from '../services/TransactionService';

import TransactionsService from '../services/TransactionsService';

export default () => {
  const app = Router();

  // app will use the following routes as middleware at the respective routes

  sneaker(app, new SneakerService());
  listedSneaker(app, new ListedSneakerService());

  user(app, new UserService());
  sellers(app, new SellersService());
  helperInfo(app, new HelperInfoService());

  wallet(app, new WalletService());
  transaction(app, new TransactionService());
  transactions(app, new TransactionsService());

  // external apis
  mail(app, new MailService());
  aws(app, new CustomAwsService());

  return app;
};
