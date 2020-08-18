import { Response, Request } from 'express';
import { FormatCreateSessionOptionArgs } from '../@types/utils';
import { BuyingHistory } from '../../../shared';


// TODO: type guard to check the query must specify all columns that we have in the database
// a simple check to make sure the request body is an object
export const hasValidBody = (req: any) => req.body && typeof req.body === 'object';

export const makeDeepCopy = (obj: { [key: string]: any }) => {
  const result: any = {};
  Object.keys(obj).forEach((k) => (result[k] = obj[k]));

  return result;
};

/**
 * @param cb : a express middleware handler
 *
 * if there exists any error during the callback, it passes the
 * first error message to the next middleware router to handle
 *
 * NOTE: in express 5.X, the errors in async middleware handlers will be automatically handled,
 * therefore there is no need for this custom wrapper when the express module gets updated
 */
export const runAsyncWrapper = (cb: any) => (res: Response<any>, req: Request<any>, next: any) => cb(res, req, next).catch(next);

// stripe-specific logic

export const dollarToCent = (price: number) => price * 100;

// TODO: mannualy type the return object or install the type from somewhere
export const formatCreateSessionOption = (args: FormatCreateSessionOptionArgs) => ({
  line_items: [
    {
      price: args.priceId,
      quantity: 1,
    },
  ],
  customer: args.customerId,
  mode: 'payment' as 'payment',
  // this field will be used to create a record in the user's 
  // buying history when the checkout session is completed
  metadata: { productId: args.productId },
  payment_method_types: ['card' as 'card'],
  success_url: process.env.CLIENT_BASE_URI + `success/?session_id={CHECKOUT_SESSION_ID}`,
  cancel_url: process.env.CLIENT_BASE_URI + `cancelled`,
});

// the argument is recieved from the stripe webhook evet
export const formatTransaction = (checkoutSession: any) => {
  const { payment_intent, metadata, customer } = checkoutSession;
  const { productId } = metadata;

  const transaction: BuyingHistory = {
    payment_intent_id: payment_intent,
    customer_id: customer,
    product_id: productId,
    status: 'completed'
  };

  return transaction;
};
