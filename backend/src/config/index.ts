import dotenv from 'dotenv';

// load variables from .env to process.env
dotenv.config();

const config = {
  sqlConnectionConfig: {
    host: process.env.host,
    user: process.env.user,
    password: process.env.dbPassword,
    database: process.env.database,
  },
  stripeSecretKey: process.env.stripeSecretKey as string,
};

export default config;
