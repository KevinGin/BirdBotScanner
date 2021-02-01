"use strict";

const twitRouter = require("./twitRouter");

module.exports =  async function tweetObservation(observation, location, twit) {
  console.log("called tweet observation");

  let config = twitRouter(location);
  const Twitter = new twit(config);
  const commonName = observation.comName;
  const locationName = observation.locName;
  const TWITTER_CHARACTER_LIMIT = 280;
  const LINK_CHARACTERS = 23;
  const url = "https://ebird.org/checklist/" + observation.subId;

  let tweet = commonName + " " + url;

  try {
    console.log("inside try block");
    let tweetWithLocation = commonName + " at " + locationName + ". " + url; 
    if (tweetWithLocation.length <= TWITTER_CHARACTER_LIMIT) {
      tweet = tweetWithLocation;
    }
    const firstName = observation.firstName;
    const lastInitial = observation.lastName[0];
    const observer = firstName + " " + lastInitial + ".";
    let tweetWithObserver = commonName + " at " + locationName + " (" + observer + "). " + url;
    if (tweetWithObserver.length <= TWITTER_CHARACTER_LIMIT) {
      tweet = tweetWithObserver;
    }
    console.log("Tweet: " + tweet);
  } catch (err) {
    console.log("catch");
    console.log(err);
  }

  await Twitter.post("statuses/update", { status: tweet }, function(err, data, response) {
    if (err) {
      console.log("failed to Tweet " + commonName);
      console.log(err);
    } else {
      console.log("tweet posted for " + commonName);
    }});
};