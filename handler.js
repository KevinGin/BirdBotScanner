"use strict";

// todo -- clean up dependencies
const request = require("request");
const AWS = require("aws-sdk");
const getObservations = require("./helper/getObservations");
const locationHandler = require("./helper/locationHandler");
const SANTA_CLARA_COUNTY = "US-CA-085"; // Santa Clara County, California, US

module.exports.scan = async event => {
  AWS.config.update({region: "us-west-2"});
  const s3 = new AWS.S3({ apiVersion: "2006-03-01" });

  const locations=[SANTA_CLARA_COUNTY];

  // Make call to eBird for notable observations
  const response = await getObservations();
  const observations = response.data;

  // TODO(kevingin): Create S3 bucket for observations seen, and filter out before calling location handlers

  for (let i = 0; i < locations.length; i++) {
    let location = locations[i];
    await locationHandler(observations,location,s3);
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
