"use strict";

/*
 * Writes observation to S3 bucket. Bucket naming convention is with locaiton. Key is species code, and body is observation.
 */
module.exports = async function writeObservation(observation, location, s3) {
  console.log("called write observation");
  const params = {
    "Bucket": location.toLowerCase(),
    "Key": observation.speciesCode,
    "Body": JSON.stringify(observation)
  };
  await s3.upload(params, function(err, data) {
    if (err) {
      console.log("failed to upload");
      throw new Error(err);
    } else {
      console.log("WRITE SUCCESS");
    }
  });
};