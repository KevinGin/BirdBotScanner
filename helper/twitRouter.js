"use strict";

const SANTA_CLARA_COUNTY = "US-CA-085";
const DEVELOPMENT = "DEV";

module.exports = function twitRouter(location) {
  const prefix = location.replace(/-/g,"_") + "_";

  return {
      consumer_key: process.env[prefix + "CONSUMER_KEY"],
      consumer_secret: process.env[prefix + "CONSUMER_SECRET"],
      access_token: process.env[prefix + "ACCESS_TOKEN"],
      access_token_secret: process.env[prefix + "ACCESS_TOKEN_SECRET"]
    };
};