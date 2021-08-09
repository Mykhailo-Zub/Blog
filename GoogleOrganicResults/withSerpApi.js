const SerpApi = require("google-search-results-nodejs");
const search = new SerpApi.GoogleSearch(process.env["API_KEY"]);

const params = {
  engine: "google",
  q: "google",
  location: "Austin, Texas, United States",
  google_domain: "google.com",
  gl: "us",
  hl: "en",
};

const callback = function (data) {
  console.log("SerpApi results:");
  console.log(data.organic_results);
};

exports.searchOrganic = () => search.json(params, callback);
