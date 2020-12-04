"use strict";

// todo -- clean up dependencies
const request = require("request");

const AWS = require("aws-sdk");
const twit = require("twit");
const writeObservation = require("./helper/writeObservation");
const tweetObservation = require("./helper/tweetObservation");
const createDenyList = require("./helper/createDenyList");
const createSpeciesSeenList = require("./helper/createSpeciesSeenList");
const getObservations = require("./helper/getObservations");
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


  // List of species that we do not want to Tweet, e.g. common species or introduced. This will expand over time
  const denyList = createDenyList();
  // List of species that have already been tweeted in the last 
  const speciesSeen = await createSpeciesSeenList(s3, params);

  // Make call to eBird for notable observations
  const response = await getObservations();
  const data = response.data;

  const observations = data.filter(obs => !denyList[obs.speciesCode]);

  for (let i = 0; i < observations.length; i++) {
    let observation = observations[i];
    const speciesCode = observation.speciesCode;
    if (!speciesSeen[speciesCode]) {
      speciesSeen[speciesCode] = true;
      console.log("species: " + speciesCode);
      await writeObservation(observation, LOCATION, s3);
      await tweetObservation(observation, twit);
    }
  }

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
