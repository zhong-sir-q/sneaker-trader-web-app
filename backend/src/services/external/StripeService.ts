import Stripe from 'stripe';
import { StripeObj } from '../../config';

class StripeService {
  stripe: Stripe;

  constructor() {
    this.stripe = StripeObj
  }

  createPaymentIntent(amount: number) {
    return this.stripe.paymentIntents.create({
      amount,
      currency: 'nzd',
      metadata: { integration_check: 'accept_a_payment' },
    });
  }
}

export default StripeService;
