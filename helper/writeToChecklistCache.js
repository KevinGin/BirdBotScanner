"use strict";

const CHECKLIST_CACHE_BUCKET = "ebird-checklist-cache";

// TODO(kevingin) figure out a better way to implement a set 
module.exports =  async function writeToChecklistCache(subId, s3) {
  // write the subId, not the checklistId.
  // if two people share the same checklist, it has different subIds (and can contain different species)
  const params = {
    "Bucket": CHECKLIST_CACHE_BUCKET,
    "Key": subId,
    "Body": ""
  };

  await s3.upload(params, function(err, data) {
    if (err) {
      console.log("failed to upload to checklist cache");
      throw new Error(err);
    } else {
      console.log("checklist cache successful: " + subId);
    }
  });
};