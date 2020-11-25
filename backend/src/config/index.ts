import dotenv from 'dotenv';
import Stripe from 'stripe';

// load variables from .env to process.env
const { NODE_ENV } = process.env
const suffix = !NODE_ENV ? '' : `.${NODE_ENV}`
dotenv.config({ path: `.env${suffix}` });

const config = {
  sqlConnectionConfig: {
    host: process.env.host,
    user: process.env.user,
    password: process.env.dbPassword,
    database: process.env.database,
  },
  region: process.env.REGION as string,
  imageBucket: process.env.IMAGE_UPLOADS_BUCKET as string,
  sendgridApiKey: process.env.SENDGRID_API_KEY as string,
  poliAuthKey: Buffer.from(`${process.env.POLI_MERCH_CODE}:${process.env.POLI_AUTH_CODE}`).toString('base64'),
  stripeSecretKey: process.env.STRIPE_SECRET_KEY as string,
  googleOauth2: {
    client_id: process.env.GOOGLE_CLIENT_ID as string,
    client_secret: process.env.GOOGLE_CLIENT_SECRET as string,
    redirect_uri: process.env.GOOGLE_REDIRECT_URI as string,
  }
};

export const StripeObj = new Stripe(config.stripeSecretKey, { apiVersion: '2020-08-27' });

export default config;
