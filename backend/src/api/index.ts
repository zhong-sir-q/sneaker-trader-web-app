import { Router } from 'express';

import createUserRouters from './routers/user';
import createUserRegistrationRoutes from './routers/userRegistration';
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
import portfolio from './routers/portfolio';
import PortfolioSneakerService from '../services/PortfolioSneakerService';
import createAuthRoutes from './routers/auth';

export default () => {
  const app = Router();
  // app will use the following routes as middleware at the respective routes

  // external apis
  mail(app, new MailService());
  aws(app, new CustomAwsService());
  stripe(app, new StripeService());
  poli(app);

  const userService = new UserService()
  const walletService = new WalletService()

  const userRoutes = createUserRouters(userService);
  const userRegistrationRoutes = createUserRegistrationRoutes(userService, walletService);

  app.use('/user', userRoutes.router);
  app.use('/user-registration', userRegistrationRoutes.router);

  const authRoutes = createAuthRoutes();
  app.use('/auth', authRoutes);

  seller(app, new SellerService());
  address(app, new AddressService(new AddressVerificationCodeService()));

  sneaker(app, new SneakerService());
  listedSneaker(app, new ListedSneakerService());
  portfolio(app, new PortfolioSneakerService());

  helperInfo(app, new HelperInfoService());

  wallet(app, walletService);
  transaction(app, new TransactionService());

  return app;
};
