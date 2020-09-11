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
  region: process.env.REGION as string,
  imageBucket: process.env.IMAGE_UPLOADS_BUCKET as string,
  sendgridApiKey: process.env.SENDGRID_API_KEY as string,
};

export default config;
