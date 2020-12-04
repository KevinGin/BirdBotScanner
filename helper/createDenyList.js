"use strict";

/* Creates a deny list -- bires to not tweet (e.g. exotics, common). List will evolve over time.
 * TODO(kevingin): read from S3 and make async
 * TODO(kevingin): send in location as pamater, so deny list can vary by location
 */
module.exports = function createDenyList(location) {
  // TODO: make county specific...
  const denyList = {};
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
  denyListArray.forEach(x => denyList[x] = true);
  return denyList;
};