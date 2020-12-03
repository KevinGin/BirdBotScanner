"use strict";

const request = require("request");
  // const SANTA_CLARA COUNTY = "US-CA-085";

module.exports.scan = async event => {


  console.log("called scan");

  var options = {
    "method": "GET",
    "url": "https://api.ebird.org/v2/data/obs/US-CA-085/recent/notable?detail=full",
    "headers": {
      "X-eBirdApiToken": process.env.EBIRD_API_TOKEN
    }
  };

  request(options, function (error, response) {
    if (error) throw new Error(error);
    const body = JSON.parse(response.body);


    // const seen = {
    //   "pagplo": true,
    //   "westan": true
    // };

    // const denyList = {
    //   "nutman": true,

    // }

    const observations = JSON.parse(response.body).filter(x => !seen[x.speciesCode])

    observations.forEach(x => console.log(x));


  });


  console.log("scanner returning");
  return {
    statusCode: 200,
    body: JSON.stringify(
      {
        message: "Go Serverless v1.0! Your function executed successfully!",
        input: event,
      },
      null,
      2
    ),
  };

  // Use this code if you don't use the http event with the LAMBDA-PROXY integration
  // return { message: 'Go Serverless v1.0! Your function executed successfully!', event };
};
