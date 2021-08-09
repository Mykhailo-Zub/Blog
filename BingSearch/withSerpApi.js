const SerpApi = require("google-search-results-nodejs");
const search = new SerpApi.GoogleSearch(
  "db088c5746dae73c45b3c1ce6cde6278af0e7aa38d2f0c0180db26174b5027dc"
);

const params = {
  engine: "bing",
  q: "cheerio js",
};

const callback = function (data) {
  console.log("SerpApi results:");
  console.log(data.organic_results);
};

search.json(params, callback);
