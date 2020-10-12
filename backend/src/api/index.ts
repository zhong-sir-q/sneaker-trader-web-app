import { Router } from 'express';

import user from './routers/user';
import seller from './routers/seller';
import address from './routers/address';

import sneaker from './routers/sneaker';
import listedSneaker from './routers/listedSneaker';

import mail from './routers/mail';
import aws from './routers/aws';
import poli from './routers/poli';
import stripe from './routers/stripe';

import helperInfo from './routers/helperInfo';

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
import StripeService from '../services/external/StripeService';

import AddressService from '../services/AddressService';
import AddressVerificationCodeService from '../services/AddressVerificationCodeService';

export default () => {
  const app = Router();
  // app will use the following routes as middleware at the respective routes

  // external apis
  mail(app, new MailService());
  aws(app, new CustomAwsService());
  stripe(app, new StripeService());
  poli(app);

  user(app, new UserService());
  seller(app, new SellerService());
  address(app, new AddressService(new AddressVerificationCodeService()));

  sneaker(app, new SneakerService());
  listedSneaker(app, new ListedSneakerService());

  helperInfo(app, new HelperInfoService());

  wallet(app, new WalletService());
  transaction(app, new TransactionService());

  return app;
};
