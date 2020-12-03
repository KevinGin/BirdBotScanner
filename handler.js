"use strict";

const request = require("request");
const AWS = require("aws-sdk");
const twit = require("twit");
const LOCATION = "US-CA-085"; // Santa Clara County, California, US

module.exports.scan = async event => {
  AWS.config.update({region: "us-west-2"});
  const s3 = new AWS.S3({ apiVersion: "2006-03-01" });
  const params = {
    Bucket: LOCATION.toLowerCase()
  };

  const speciesSeen = {};

  function writeObservation(observation) {
    const params = {
      "Bucket": LOCATION.toLowerCase(),
      "Key": observation.speciesCode,
      "Body": JSON.stringify(observation)
    };
    s3.upload(params, function(err, data) {
      if (err) throw new Error(err);
    });
  }

  function tweetObservation(observation) {
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

    let tweet = commonName + " " + url;

    Twitter.post("statuses/update", { status: tweet }, function(err, data, response) {
        if (err) {
          console.log(err);
        } else {
          console.log("tweet posted for " + commonName);
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
    "yesfli",  // Northern Flicker (Yellow-shafted)
  ];

  const denyList = {};
  denyListArray.forEach(x => denyList[x] = true);


  // read S3 bucket for county, to compose set of species that have already been tweeted
  try {
    const response = await s3.listObjects(params).promise();
    const content = response.Contents;
    content.forEach(obj => speciesSeen[obj.Key] = true);
  } catch (err) {
    console.log(err);
    const message = `Error getting object ${key} from bucket ${bucket}. Make sure they exist and your bucket is in the same region as this function.`;
    console.log(message);
    throw new Error(message);
  }


  // fetch notable observations from eBird
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

    const observations = JSON.parse(response.body).filter(obs => !denyList[obs.speciesCode]);

    //TODO(kevingin) handler should: write to S3 (and add to in-memory seen object)
    // S3 write will then trigger lambda to tweet
    observations.forEach(observation => {
      const speciesCode = observation.speciesCode;
      if (!speciesSeen[speciesCode]) {
        speciesSeen[speciesCode] = true;
        try {
          // TODO(kevingin): move tweet action into separate lambda triggered by S3 bucket change
          writeObservation(observation);
          tweetObservation(observation);
        } catch (err) {
          console.log(err);
        }
      }
    });
  });

  // TODO: Don't return 200 if caught exception
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
