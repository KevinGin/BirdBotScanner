"use strict";

module.exports =  async function createSpeciesSeenList(s3, params) {
  const speciesSeen = {};

  const response = await s3.listObjects(params).promise();
  const content = response.Contents;
  content.forEach(obj => speciesSeen[obj.Key] = true);
  return speciesSeen;
};