import { resolve } from "node:path";
import { config } from "dotenv";

export const NODE_ENV = process.env.NODE_ENV;

const envPath = {
  development: `.env.development`,
  production: `.env.production`,
};
console.log({ en: envPath[NODE_ENV] });

config({ path: resolve(`./config/${envPath[NODE_ENV]}`) });

export const port = process.env.PORT ?? 7000;

export const DB_URI = process.env.DB_URI;

export const SALT_ROUND = parseInt(process.env.SALT_ROUND ?? "10");
export const ENCRYPTION_SECRET_BITE = process.env.ENCRYPTION_SECRET_BITE;
export const EMAIL_USER = process.env.EMAIL_USER;
export const EMAIL_APP_PASS = process.env.EMAIL_APP_PASS;
export const TOKEN_SECRET_USER_ACCESS = process.env.TOKEN_SECRET_USER_ACCESS;
export const TOKEN_SECRET_SYSTEM_ACCESS =
  process.env.TOKEN_SECRET_SYSTEM_ACCESS;
export const TOKEN_SECRET_USER_REFRESH = process.env.TOKEN_SECRET_USER_REFRESH;
export const TOKEN_SECRET_SYSTEM_REFRESH =
  process.env.TOKEN_SECRET_SYSTEM_REFRESH;
export const ACCESS_TOKEN_EXPIRATION = parseInt(
  process.env.ACCESS_TOKEN_EXPIRATION,
);
export const REFRESH_TOKEN_EXPIRATION = parseInt(
  process.env.REFRESH_TOKEN_EXPIRATION,
);
export const WEB_CLIENT_ID = process.env.WEB_CLIENT_ID;


console.log({ SALT_ROUND });
