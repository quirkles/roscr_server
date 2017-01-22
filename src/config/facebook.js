const config = process.env.IS_HEROKU_ENV ?
  {
    FACEBOOK_APP_ID: process.env.FACEBOOK_APP_ID,
    FACEBOOK_APP_SECRET: process.env.FACEBOOK_APP_SECRET
  } :
  require('./facebook.local').default;

export const {FACEBOOK_APP_ID, FACEBOOK_APP_SECRET} = config;
