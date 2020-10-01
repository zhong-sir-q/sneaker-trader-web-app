import { Router } from 'express';
import MailService from '../../services/external/MailService';

const mailRoute = Router();

export default (app: Router, MailServiceInstance: MailService) => {
  app.use('/mail', mailRoute);

  mailRoute.post('/confirmPurchase', MailServiceInstance.handleConfirmPurchase);
};
