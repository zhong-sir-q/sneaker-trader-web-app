import dotenv from 'dotenv';

// load variables from .env to process.env
dotenv.config({ path: './.env.' + process.env.environment });

const config = {
  sqlConnectionConfig: {
    host: process.env.host,
    user: process.env.user,
    password: process.env.dbPassword,
    database: process.env.database,
  },
  stripeSecretKey: process.env.stripeSecretKey as string,
  userPoolId: process.env.USER_POOL_ID as string,
  region: process.env.REGION as string
};

export default config;
