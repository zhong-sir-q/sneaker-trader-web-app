import { Router } from 'express';
import sendgridMail from '@sendgrid/mail';
import config from '../../config';
import { ContactSellerMailPayload } from '../../../../shared';

sendgridMail.setApiKey(config.sendgridApiKey);

const mailRoute = Router();

export default (app: Router) => {
  app.use('/mail', mailRoute);

  mailRoute.post('/seller', (req, res, next) => {
    const { sellerUserName, buyerUserName, sellerEmail, buyerEmail, productName } = req.body as ContactSellerMailPayload;

    const TO_SELLER_SUBJECT_AFTER_PURCHASE = 'Someone has requested a purchase of your product!!!';

    const formatHtmlMessage = () => `
      <html>
        <body>
          Hello, ${sellerUserName}, ${buyerUserName} wants to buy ${productName} from you. Please get in touch with the seller
          via ${buyerEmail}.

          <br />
          <br />
          Best regards, xD
          <br />
          From the Sneaker Trader Team
        </body>
      </html>
    `;

    const msg = {
      to: `${sellerEmail}`,
      from: 'alex.zhong@sneakertrader.com',
      subject: TO_SELLER_SUBJECT_AFTER_PURCHASE,
      html: formatHtmlMessage(),
    };

    sendgridMail
      .send(msg)
      .then((result) => res.status(result[0].statusCode).json('An email is successfully sent'))
      .catch(next);
  });
};
