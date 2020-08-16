import { loadStripe, Stripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY as string) as Promise<Stripe>;

export default stripePromise;
