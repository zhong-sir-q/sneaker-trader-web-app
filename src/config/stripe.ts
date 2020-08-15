import Stripe from 'stripe';
import config from '.';

const stripe = new Stripe(config.stripeSecretKey, { apiVersion: '2020-03-02' });

export default stripe;
