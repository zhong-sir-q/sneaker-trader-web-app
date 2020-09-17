import { Router } from 'express';

import user from './routes/user';
import sellers from './routes/sellers';

import product from './routes/product';
import listedProduct from './routes/listedProduct';

import aws from './routes/aws';

import helperInfo from './routes/helperInfo';
import mail from './routes/mail';

import UserService from '../services/user';
import SellersService from '../services/sellers';

import ListedProductService from '../services/listedProduct';
import ProductService from '../services/product';
import HelperInfoService from '../services/helperInfo';

import CustomAwsService from '../services/external/aws';
import MailService from '../services/external/mail';

import { getMysqlDb } from '../config/mysql';
import wallet from './routes/wallet';
import WalletService from '../services/wallet';
import transaction from './routes/transaction';
import TransactionService from '../services/transaction';

import TransactionsService from '../services/transactions';
import transactions from './routes/transactions';

export default () => {
  const app = Router();
  const sqlConnection = getMysqlDb();

  // app will use the following routes as middleware at the respective routes
  
  product(app, new ProductService(sqlConnection));
  listedProduct(app, new ListedProductService(sqlConnection));

  user(app, new UserService(sqlConnection));
  sellers(app, new SellersService(sqlConnection));
  helperInfo(app, new HelperInfoService(sqlConnection));

  wallet(app, new WalletService(sqlConnection))
  transaction(app, new TransactionService(sqlConnection))
  transactions(app, new TransactionsService(sqlConnection))

  // external apis
  mail(app, new MailService());
  aws(app, new CustomAwsService());

  return app;
};
