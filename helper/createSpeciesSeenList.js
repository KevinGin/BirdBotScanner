"use strict";

module.exports =  async function createSpeciesSeenList(s3, location) {
  const speciesSeen = {};

  const params = {
    Bucket: location.toLowerCase()
  };

  const response = await s3.listObjects(params).promise();
  const content = response.Contents;
  content.forEach(obj => speciesSeen[obj.Key] = true);
  return speciesSeen;
};