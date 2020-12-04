"use strict";

const axios = require("axios");

module.exports =  async function getObservations() {
  var options = {
    method: "get",
    url: "https://api.ebird.org/v2/data/obs/US-CA-085/recent/notable?detail=full",
    headers: { 
      "X-eBirdApiToken": process.env.EBIRD_API_TOKEN
    }
  };

  const response = await axios(options);
  return response;
};