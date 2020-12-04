"use strict";

module.exports =  async function tweetObservation(observation, twit) {
  console.log("called tweet observation");
  
  //TO DO: take config as parameter, so can tweet to multiple bots
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

  await Twitter.post("statuses/update", { status: tweet }, function(err, data, response) {
    if (err) {
      console.log("failed to Tweet " + commonName);
      console.log(err);
    } else {
      console.log("tweet posted for " + commonName);
    }});
};