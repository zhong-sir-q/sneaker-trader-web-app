import { Router } from 'express';

import user from './routers/user';
import seller from './routers/seller';

import sneaker from './routers/sneaker';
import listedSneaker from './routers/listedSneaker';

import aws from './routers/aws';

import helperInfo from './routers/helperInfo';
import mail from './routers/mail';

import wallet from './routers/wallet';
import transaction from './routers/transaction';

import UserService from '../services/UserService';
import SellerService from '../services/SellerService';

import ListedSneakerService from '../services/ListedSneakerService';
import SneakerService from '../services/SneakerService';
import HelperInfoService from '../services/HelperInfoService';

import CustomAwsService from '../services/external/AwsService';
import MailService from '../services/external/MailService';

import WalletService from '../services/WalletService';
import TransactionService from '../services/TransactionService';

export default () => {
  const app = Router();

  // app will use the following routes as middleware at the respective routes

  sneaker(app, new SneakerService());
  listedSneaker(app, new ListedSneakerService());

  user(app, new UserService());
  seller(app, new SellerService());
  helperInfo(app, new HelperInfoService());

  wallet(app, new WalletService());
  transaction(app, new TransactionService());

  // external apis
  mail(app, new MailService());
  aws(app, new CustomAwsService());

  return app;
};
