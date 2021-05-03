"use strict";

const fs = require("fs");
const util = require("util");

/* Creates a deny list -- bires to not tweet (e.g. exotics, common). List will evolve over time.
 */
module.exports = async function createDenyList(location) {
  // return everything before first space
  // e.g.   'manduc  // Mandarin Duck',
  function trim(line) {
    return line.split(" ")[0];
  }

  async function createDenyListArray(location) {
    const readFile = util.promisify(fs.readFile);
    await readFile("./denyList/"+location+".txt").then(data => {
      denyListArray = data.toString().split("\n").map(trim);
    });
  }

  const denyList = {};
  let denyListArray = [];
  try {
    await createDenyListArray(location, denyListArray);
  } catch (e) {
    console.log(e);
    console.log("could not load denyList for " + location);
    return {};
  }
 
  denyListArray.forEach(x => denyList[x] = true);
  return denyList;
};