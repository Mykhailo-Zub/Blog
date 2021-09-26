const SerpApi = require("google-search-results-nodejs");
const search = new SerpApi.GoogleSearch("db088c5746dae73c45b3c1ce6cde6278af0e7aa38d2f0c0180db26174b5027dc");

function getMainInfo() {
  return new Promise((resolve, reject) => {
    const paramsSearch = {
      engine: "walmart",
      query: "laptop",
    };

    const hadnleSearchResults = function (data) {
      const organicResults = data.organic_results;
      const goodProductInfo = organicResults.map((el) => {
        if (el.product_id) {
          return el;
        }
      });

      resolve(goodProductInfo);
      reject("Get main info error");
    };

    search.json(paramsSearch, hadnleSearchResults);
  });
}

function getProductSpec(product) {
  const allProducts = [];
  for (organicResults of product) {
    allProducts.push(
      new Promise((resolve, reject) => {
        const paramsProduct = {
          engine: "walmart_product",
        };
        organicResults.product_id;
        paramsProduct.product_id = organicResults.product_id;
        const productInfo = {};
        productInfo.link = organicResults.product_page_url;
        productInfo.title = organicResults.title;
        productInfo.price = organicResults.price_per_unit?.amount ? organicResults.price_per_unit.amount : "unknown";
        const handleProductResult = function (data) {
          productInfo.specifications = {};
          const specificationHighlights = data.product_result?.specification_highlights;
          if (specificationHighlights) {
            for (let i = 0; i < specificationHighlights.length; i++) {
              productInfo.specifications[`${specificationHighlights[i].display_name}`] = specificationHighlights[i].value;
            }
          } else productInfo.specifications = "no detailed specifications";
          console.log(productInfo);
          resolve(productInfo);
          reject("Get products info error");
        };

        search.json(paramsProduct, handleProductResult);
      })
    );
  }
  return new Promise((resolve, reject) => {
    Promise.all(allProducts).then(resolve);
  });
}

getMainInfo().then(getProductSpec).then(console.log);
