"use strict";

const twit = require("twit");
const createDenyList = require("./createDenyList");
const createSpeciesSeenList = require("./createSpeciesSeenList");
const writeObservation = require("./writeObservation");
const tweetObservation = require("./tweetObservation");

module.exports =  async function locationHandler(allObservations, location, s3) {
  // List of species that we do not want to Tweet, e.g. common species or introduced. This will expand over time
  const denyList = createDenyList(location);
  // List of species that have already been tweeted in the last 
  const speciesSeen = await createSpeciesSeenList(s3, location);
  // TODO: refactor variable names to make explicit that must be subnational2 (e.g. California Counties)
  const countyObservations = allObservations.filter(obs => obs.subnational2Code === location);
  // Filter out species seen
  const newObservations = countyObservations.filter(obs => !speciesSeen[obs.speciesCode]);
  // Filter out deny list
  const observations = newObservations.filter(obs => !denyList[obs.speciesCode]);

  for (let i = 0; i < observations.length; i++) {
    let observation = observations[i];
    console.log("sending tweet for species: " + observation.speciesCode);
    await writeObservation(observation, location, s3);
    await tweetObservation(observation, location, twit);
  }
};