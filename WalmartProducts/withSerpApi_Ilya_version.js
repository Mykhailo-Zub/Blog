const util = require("util");

const { GoogleSearch } = require("google-search-results-nodejs");
const search = new GoogleSearch("db088c5746dae73c45b3c1ce6cde6278af0e7aa38d2f0c0180db26174b5027dc");

const getJson = search.json.bind(search);

getJson[util.promisify.custom] = (params) => {
  return new Promise((resolve, reject) => {
    getJson(params, resolve, reject);
  });
};

const promisifiedGetJson = util.promisify(getJson);

async function getMainInfo() {
  const paramsSearch = {
    engine: "walmart",
    query: "laptop",
  };

  const data = await promisifiedGetJson(paramsSearch);
  const organicResults = data.organic_results;

  const productResultsPromises = organicResults.map((organicResult) => {
    if (!(organicResult.us_item_id || organicResult.upc || organicResult.product_id)) {
      return null;
    }

    const paramsProduct = {
      engine: "walmart_product",
      product_id: organicResult.us_item_id || organicResult.upc || organicResult.product_id,
    };

    return promisifiedGetJson(paramsProduct);
  });

  await Promise.all(productResultsPromises).then((productResults) => {
    const fullProductsSpecs = [];
    productResults.forEach((el, i) => {
      fullProductsSpecs[i] = {
        link: el.search_metadata.walmart_product_url,
        title: el.product_result.title,
        price: el.product_result.price_map.price,
        specifications: {},
      };
      const specificationHighlights = el.product_result?.specification_highlights;
      if (specificationHighlights) {
        for (let j = 0; j < specificationHighlights.length; j++) {
          fullProductsSpecs[i].specifications[`${specificationHighlights[j].display_name}`] = specificationHighlights[j].value;
        }
      } else productInfo.specifications = "no detailed specifications";
    });
    console.log(fullProductsSpecs);
  });
}
getMainInfo();
