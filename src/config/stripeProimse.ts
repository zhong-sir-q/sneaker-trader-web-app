import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(process.env.GATSBY_STRIPE_PUBLISHABLE_KEY);

export default stripePromise;
