"use strict";

// todo -- clean up dependencies
const request = require("request");
const axios = require("axios");
const AWS = require("aws-sdk");
const twit = require("twit");
const LOCATION = "US-CA-085"; // Santa Clara County, California, US

module.exports.scan = async event => {
  console.log("running scanner");
  let status = 200;
  let message = "**Your function executed successfully!";

  AWS.config.update({region: "us-west-2"});
  const s3 = new AWS.S3({ apiVersion: "2006-03-01" });
  const params = {
    Bucket: LOCATION.toLowerCase()
  };

  const speciesSeen = {};

  async function writeObservation(observation) {
    console.log('called write observation')
    const params = {
      "Bucket": LOCATION.toLowerCase(),
      "Key": observation.speciesCode,
      "Body": JSON.stringify(observation)
    };
    await s3.upload(params, function(err, data) {
      if (err) {
        console.log("failed to upload");
        status = 500;
        message = "failed to upload";
        throw new Error(err);
      } else {
        console.log("WRITE SUCCESS");
      }
    });
  }

  async function tweetObservation(observation) {
    console.log('called tweet observation');
    let config = {
      consumer_key: process.env.CONSUMER_KEY,
      consumer_secret: process.env.CONSUMER_SECRET,
      access_token: process.env.ACCESS_TOKEN,
      access_token_secret: process.env.ACCESS_TOKEN_SECRET
    };

    console.log(observation);

    const Twitter = new twit(config);
    const commonName = observation.comName;
    const url = "https://ebird.org/checklist/" + observation.subId;

    let tweet = commonName + " " + Math.random().toPrecision(4);

    await Twitter.post("statuses/update", { status: tweet }, function(err, data, response) {
      if (err) {
        console.log("failed to Tweet " + commonName);
        console.log(err);
        status = 500;
        message = "failed to tweet";
      } else {
        console.log("tweet posted for " + commonName);
        message = "tweeted : " + commonName;
      }});
  }

  // // List of species that we do not want to Tweet, e.g. common species or introduced. This will expand over time.
  // // TODO(kevingin): read in from S3
  const denyListArray = [
    "nutman",  // Scaly-breasted Munia i.e. Nutmeg Mannikin
    "westan",  // Western Tanager
    "manduc",  // Mandarin Duck
    "chispa",  // Chipping Sparrow
    "rucspa",  // Rufous-crowned Sparrow
    "x00048",  // Glaucous-winged x Glaucous Gull (hybrid)
    "x00050",  // Herring x Glaucous-winged Gull (hybrid)
    "sxrgoo1", // Snow x Ross's Goose (hybrid)
    "houwre",  // House Wren
    // commented out for development
    // "yesfli",  // Northern Flicker (Yellow-shafted)
  ];

  const denyList = {};
  denyListArray.forEach(x => denyList[x] = true);


  // read S3 bucket for county, to compose set of species that have already been tweeted
  try {
    console.log("making S3 read");
    const response = await s3.listObjects(params).promise();
    const content = response.Contents;
    content.forEach(obj => speciesSeen[obj.Key] = true);
  } catch (err) {
    console.log(err);
    status = 500;
    message = "failed to read from S3";
    throw new Error(message);
  }

  console.log("finished successfully reading S3");

  var options = {
    method: "get",
    url: "https://api.ebird.org/v2/data/obs/US-CA-085/recent/notable?detail=full",
    headers: { 
      "X-eBirdApiToken": process.env.EBIRD_API_TOKEN
    }
  };
  
  await axios(options)
    .then(async function (response) {
      console.log("inside callback");
      const data = response.data;
      const observations = data.filter(obs => !denyList[obs.speciesCode]);
      for (let i = 0; i < observations.length; i++) {
      let observation = observations[i];
      const speciesCode = observation.speciesCode;
      if (!speciesSeen[speciesCode]) {
        speciesSeen[speciesCode] = true;
        console.log("species: " + speciesCode);
          await writeObservation(observation);
          await tweetObservation(observation);
      }
    }
    })
    .catch(function (error) {
      console.log(error);
    });


  // TODO: Don't return 200 if caught exception
  return {
    statusCode: status,
    body: JSON.stringify(
      {
        message: message,
        input: event,
      },
      null,
      2
    ),
  };

  // Use this code if you don't use the http event with the LAMBDA-PROXY integration
  // return { message: 'Go Serverless v1.0! Your function executed successfully!', event };
};
