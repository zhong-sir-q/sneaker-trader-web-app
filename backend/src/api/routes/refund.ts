import { Router, Response, Request } from 'express';
import stripe from '../../config/stripe';
import { runAsyncWrapper } from '../../utils';
import { getMysqlDb } from '../../config/mysql';
import RefundService from '../../services/refund';

const refundRoute = Router();

export default (app: Router) => {
  app.use('/refund', refundRoute);

  refundRoute.get(
    '/:paymentIntentId',
    runAsyncWrapper(async (req: Request<any>, res: Response<any>) => {
      const paymentIntentId = req.params.paymentIntentId;
      const response = await stripe.refunds.create({
        payment_intent: paymentIntentId,
      });

      // NOTE: for now, I am assuming the refund is irreversible i.e. once
      // the user requested and completed the refund, they cannot cancel that

      // if the refund is successful, update the status in the
      // transaction to refunded can do this in a Pub/Sub manner
      if (response.status === 'succeeded') {
        const mysqlConnection = getMysqlDb();
        const RefundServiceInstance = new RefundService(mysqlConnection);
        RefundServiceInstance.updateRefundStatusSuccessful(paymentIntentId);
      }

      res.json({ response: response.status });
    })
  );
};
