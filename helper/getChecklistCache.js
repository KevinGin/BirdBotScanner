"use strict";

const CHECKLIST_CACHE_BUCKET = "ebird-checklist-cache";

module.exports =  async function getChecklistCache(s3) {
  const checklistCache = {};

  const params = {
    Bucket: CHECKLIST_CACHE_BUCKET,
  };

  // (BUG) TODO: Create cache different way, returns max 1000 keys 
  const response = await s3.listObjects(params).promise();
  const content = response.Contents;
  content.forEach(obj => checklistCache[obj.Key] = true);
  return checklistCache;

};