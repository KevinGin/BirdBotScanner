"use strict";

const axios = require("axios");

module.exports =  async function getObservations() {
  // all california observations US-CA
  var options = {
    method: "get",
    url: "https://api.ebird.org/v2/data/obs/US-CA/recent/notable?detail=full",
    headers: { 
      "X-eBirdApiToken": process.env.EBIRD_API_TOKEN
    }
  };

  const response = await axios(options);
  return response;
};