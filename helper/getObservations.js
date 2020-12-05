"use strict";

const axios = require("axios");

module.exports =  async function getObservations() {
  // all california observations US-CA in previous 2 days
  var options = {
    method: "get",
    url: "https://api.ebird.org/v2/data/obs/US-CA/recent/notable?detail=full&back=2",
    headers: { 
      "X-eBirdApiToken": process.env.EBIRD_API_TOKEN
    }
  };

  const response = await axios(options);
  return response;
};