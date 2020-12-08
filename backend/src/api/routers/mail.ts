import { Router } from 'express';
import MailService from '../../services/external/MailService';
import { ExpressHandler } from '../../@types/express';

const createMailHandlers = (mailService: MailService) => {
  const onNewSneakerRequest: ExpressHandler = (req, res, next) => {
    const { user, listedSneaker } = req.body;

    mailService
      .handleNewSneakerRequest(user, listedSneaker)
      .then(() => res.json('Mail sent to admin about the new sneaker request'))
      .catch(next);
  };

  return { onNewSneakerRequest };
};

const createMailRoutes = (mailService: MailService) => {
  const router = Router();

  const { onNewSneakerRequest } = createMailHandlers(mailService);

  router.route('/newSneakerRequest').post(onNewSneakerRequest);
  router.route('/confirmPurchase').post(mailService.handleConfirmPurchase);

  return { router };
};

export default createMailRoutes
