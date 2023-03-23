import * as dotenv from 'dotenv'
dotenv.config()

const config = {
  PORT: process.env.PORT ?? '3000',
  S3_ACCESS_KEY_ID: process.env.S3_ACCESS_KEY_ID,
  S3_SECRET_ACCESS_KEY: process.env.S3_SECRET_ACCESS_KEY,
  S3_URL: process.env.S3_URL,
  S3_BUCKET: process.env.S3_BUCKET
}

export default config
