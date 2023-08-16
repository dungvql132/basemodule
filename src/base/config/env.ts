import * as dotenv from "dotenv";
dotenv.config();

export default {
  DATABASE_URL: process.env.DATABASE_URL,
  PORT: process.env.PORT,
  JWTSECRET: process.env.JWTSECRET,
  NODE_ENV: process.env.NODE_ENV,
};
