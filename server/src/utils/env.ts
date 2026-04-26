import dotenv from "dotenv";

dotenv.config({
  path: ".env",
});

export const ENV = {
  PORT: process.env.PORT || 4000,
  CLIENT_URL: process.env.CLIENT_URL,
  MONGODB_URL: process.env.MONGODB_URL,
  NODE_ENV: process.env.NODE_ENV,
};
