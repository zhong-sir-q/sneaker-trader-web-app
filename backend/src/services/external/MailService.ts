import { RequestHandler } from 'express';

import { MailAfterPurchasePayload, User, Sneaker, ListedProduct, NewRequestSneaker } from '../../../../shared';
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

const newSneakerRequestMessage = (body: { user: User; listedSneaker: NewRequestSneaker }) => {
  const { user, listedSneaker } = body;
  const { id: userId, username, email, firstName, lastName } = user;
  const { id: listedSneakerId, productId, name: sneakerName, colorway, size, mainDisplayImage } = listedSneaker;

  const values = [
    userId,
    username,
    email,
    firstName,
    lastName,
    listedSneakerId,
    productId,
    sneakerName,
    colorway,
    size,
    mainDisplayImage,
  ];

  const nullIdx = values.findIndex((v) => v === undefined);

  // throw error if an undefined value is found
  if (nullIdx > -1) throw new Error('Incomplete information for the new sneaker request');

  return `<html>
      <body>
        <h2>The following user wants to make a new sneaker request:</h2>
        <ul style='list-style:none;'>
          <li>User Id: ${userId}</li>
          <li>Username: ${username}</li>
          <li>Email: ${email}</li>
          <li>
            Full name: ${firstName} ${lastName}
          </li>
        </ul>
        <p>The requested sneaker is:</p>
        <div>
          <img src=${mainDisplayImage} alt=${sneakerName} />
        </div>
        <ul style='list-style:none;'>
          <li>Listed sneaker Id: ${listedSneakerId}</li>
          <li>Product Id: ${productId}</li>
          <li>Sneaker Name: ${sneakerName}</li>
          <li>Colorway: ${colorway}</li>
          <li>Size: ${size}</li>
        </ul>
      </body>
    </html>`;
};

const TO_SELLER_SUBJECT_AFTER_PURCHASE = 'A buyer wants to buy your listed sneakers!';
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
      from: 'hello@sneakertrader.com',
      subject: TO_SELLER_SUBJECT_AFTER_PURCHASE,
      html: formatToSellerHtmlMessage({ sellerUserName, buyerUserName, buyerEmail, productName }),
    };

    const toBuyerMsg = {
      to: `${buyerEmail}`,
      from: 'hello@sneakertrader.com',
      subject: TO_BUYER_SUBJECT_AFTER_PURCHASE,
      html: formatToBuyerHtmlMessage({ sellerUserName, buyerUserName, productName, sellerEmail }),
    };

    sendgridMail.send(toSellerMsg).catch(next);

    sendgridMail
      .send(toBuyerMsg)
      .then((result) => res.status(result[0].statusCode).json('Email sent to both buyer and seller'))
      .catch(next);
  };

  handleNewSneakerRequest = (user: User, newSneaker: Sneaker & ListedProduct) => {
    const msg = {
      to: 'hello@sneakertrader.com',
      from: 'hello@sneakertrader.com',
      subject: 'User new sneaker request',
      html: newSneakerRequestMessage({ user, listedSneaker: newSneaker }),
    };

    return sendgridMail.send(msg);
  };
}

export default MailService;
