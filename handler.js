"use strict";



const request = require("request");

const AWS = require("aws-sdk");
const SANTA_CLARA_COUNTY = "US-CA-085";




module.exports.scan = async event => {


  AWS.config.update({region: "us-west-2"});
  const s3 = new AWS.S3({ apiVersion: '2006-03-01' });
  const params = {
        Bucket: SANTA_CLARA_COUNTY.toLowerCase()
    };

  const speciesSeen = {};

   // read S3 bucket for county, to compose set of species that have already been tweeted
   try {
        const response = await s3.listObjects(params).promise();
        const content = response.Contents;
        content.forEach(obj => speciesSeen[obj.Key] = true);
    } catch (err) {
        console.log(err);
        const message = `Error getting object ${key} from bucket ${bucket}. Make sure they exist and your bucket is in the same region as this function.`;
        console.log(message);
        throw new Error(message);
    }


  // // List of species that we do not want to Tweet, e.g. common species or introduced. This will expand over time.
  // // TODO(kevingin): read in from S3
  const denyListArray = [
    "nutman",  // Scaly-breasted Munia i.e. Nutmeg Mannikin
    "westan",  // Western Tanager
    "manduc",  // Mandarin Duck
    "chispa",  // Chipping Sparrow
    "rucspa",  // Rufous-crowned Sparrow
    "x00048",  // Glaucous-winged x Glaucous Gull (hybrid)
    "x00050",  // Herring x Glaucous-winged Gull (hybrid)
    "sxrgoo1", // Snow x Ross's Goose (hybrid)
    "houwre",  // House Wren
    "yesfli",  // Northern Flicker (Yellow-shafted)
  ];

  const denyList = {};
  denyListArray.forEach(x => denyList[x] = true);

  var options = {
    "method": "GET",
    "url": "https://api.ebird.org/v2/data/obs/US-CA-085/recent/notable?detail=full",
    "headers": {
      "X-eBirdApiToken": process.env.EBIRD_API_TOKEN
    }
  };


  // make request to eBird
  request(options, function (error, response) {
    if (error) throw new Error(error);
    const body = JSON.parse(response.body);


    console.log("MAKING EBIRD REQUEST");
    const observations = JSON.parse(response.body).filter(obs => !speciesSeen[obs.speciesCode]).filter(obs => !denyList[obs.speciesCode]);

    console.log("MADE EBIRD REQUEST");
    //TODO(kevingin) handler should: write to S3 (and add to in-memory seen object)
    // S3 write will then trigger lambda to tweet
    observations.forEach(x => console.log(x));


  });

  return {
    statusCode: 200,
    body: JSON.stringify(
      {
        message: "Go Serverless v1.0! Your function executed successfully!",
        input: event,
      },
      null,
      2
    ),
  };

  // Use this code if you don't use the http event with the LAMBDA-PROXY integration
  // return { message: 'Go Serverless v1.0! Your function executed successfully!', event };
};
