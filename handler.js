"use strict";

// todo -- clean up dependencies
const request = require("request");
const AWS = require("aws-sdk");
const getObservations = require("./helper/getObservations");
const locationHandler = require("./helper/locationHandler");
const getChecklistCache = require("./helper/getChecklistCache");
const writeToChecklistCache = require("./helper/writeToChecklistCache");
const SANTA_CLARA_COUNTY = "US-CA-085"; // Santa Clara County, California, US

module.exports.scan = async event => {
  AWS.config.update({region: "us-west-2"});
  const s3 = new AWS.S3({ apiVersion: "2006-03-01" });

  const locations=[SANTA_CLARA_COUNTY];

  // Make call to eBird for notable observations
  const response = await getObservations();
  const observations = response.data;

  // Create Cache of all checklists previously handled
  const checklistCache = await getChecklistCache(s3);

  const unhandledObservations = observations.filter(obs => !checklistCache[obs.subId]);

  console.log("observations: " + observations.length);
  console.log("checklists: " + Object.keys(checklistCache).length);
  console.log("unhandled: " + unhandledObservations.length);

  unhandledObservations.forEach(obs => {
    console.log("  ");
    console.log(obs);
    console.log("  ");

  });

  // handle observations ==> Tweet
  for (let i = 0; i < locations.length; i++) {
    let location = locations[i];
    await locationHandler(unhandledObservations,location,s3);
  }

  // TODO(kevingin) ensure tweet doesn't fail before adding to cache

  // (Bug) if a checklist w/ 1 rare bird is submitted, then a new rare bird is added to same checklist, will not tweet new bird
  // Living with the tradeoff for now. TODO(kevingin) fix this

  // find unique checklists to limit calls to S3 (single checklist can have multiple birds)
  const uniqueUnhandledChecklists = {};

  for (let i = 0; i < unhandledObservations.length; i++) {
    let observation = unhandledObservations[i];
    uniqueUnhandledChecklists[observation.subId] = true;
  }

  // TODO: can we batch this call?
  for (let subId in uniqueUnhandledChecklists) {
    writeToChecklistCache(subId, s3);
  }

  // TODO: Don't return 200 if caught exception
  return {
    statusCode: 200,
    body: JSON.stringify(
      {
        message: "execution successful",
        input: event,
      },
      null,
      2
    ),
  };

  // Use this code if you don't use the http event with the LAMBDA-PROXY integration
  // return { message: 'Go Serverless v1.0! Your function executed successfully!', event };
};
