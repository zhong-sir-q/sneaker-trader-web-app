import { RequestHandler } from 'express';

import { MailAfterPurchasePayload } from '../../../../shared';
import sendgridMail from '../../config/sendgridMail';

// refactor: define the types
// extract the footer as a separate message
const formatToSellerHtmlMessage = (body: {
  sellerUserName: string;
  buyerUserName: string;
  productName: string;
  buyerEmail: string;
}) => `
  <html>
    <body>
      Hello, ${body.sellerUserName}, ${body.buyerUserName} wants to buy ${body.productName}
      from you. Please get in touch with the buyer via ${body.buyerEmail}.

      <br />
      <br />
      Best regards, xD
      <br />
      From the Sneaker Trader Team
    </body>
  </html>
`;

const formatToBuyerHtmlMessage = (body: {
  sellerUserName: string;
  buyerUserName: string;
  productName: string;
  sellerEmail: string;
}) => `
  <html>
    <body>
      Hello, ${body.buyerUserName}, thank you for buying ${body.productName} from 
      ${body.sellerUserName}. Please get in touch with the seller via ${body.sellerEmail}.

      <br />
      <br />
      Best regards, xD
      <br />
      From the Sneaker Trader Team
    </body>
  </html>
`;

const TO_SELLER_SUBJECT_AFTER_PURCHASE = 'Someone has requested a purchase of your product!!!';
const TO_BUYER_SUBJECT_AFTER_PURCHASE = 'Purchase at Sneaker Trader confirmation';

class MailService {
  // send both the seller and the buyer an email
  handleConfirmPurchase: RequestHandler = (req, res, next) => {
    const {
      sellerUserName,
      buyerUserName,
      sellerEmail,
      buyerEmail,
      productName,
    } = req.body as MailAfterPurchasePayload;

    const toSellerMsg = {
      to: `${sellerEmail}`,
      from: 'alex.zhong@sneakertrader.com',
      subject: TO_SELLER_SUBJECT_AFTER_PURCHASE,
      html: formatToSellerHtmlMessage({ sellerUserName, buyerUserName, buyerEmail, productName }),
    };

    const toBuyerMsg = {
      to: `${buyerEmail}`,
      from: 'alex.zhong@sneakertrader.com',
      subject: TO_BUYER_SUBJECT_AFTER_PURCHASE,
      html: formatToBuyerHtmlMessage({ sellerUserName, buyerUserName, productName, sellerEmail }),
    };

    sendgridMail.send(toSellerMsg).catch(next);

    sendgridMail
      .send(toBuyerMsg)
      .then((result) => res.status(result[0].statusCode).json('Email sent to both buyer and seller'))
      .catch(next);
  };
}

export default MailService;
