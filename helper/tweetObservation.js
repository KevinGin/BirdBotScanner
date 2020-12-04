"use strict";

const twitRouter = require("./twitRouter");

module.exports =  async function tweetObservation(observation, location, twit) {
  console.log("called tweet observation");

  let config = twitRouter(location);
  const Twitter = new twit(config);
  const commonName = observation.comName;
  const url = "https://ebird.org/checklist/" + observation.subId;

  let tweet = commonName + " " + url;

  await Twitter.post("statuses/update", { status: tweet }, function(err, data, response) {
    if (err) {
      console.log("failed to Tweet " + commonName);
      console.log(err);
    } else {
      console.log("tweet posted for " + commonName);
    }});
};