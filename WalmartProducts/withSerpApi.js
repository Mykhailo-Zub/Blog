const SerpApi = require("google-search-results-nodejs");
const search = new SerpApi.GoogleSearch(
  "db088c5746dae73c45b3c1ce6cde6278af0e7aa38d2f0c0180db26174b5027dc"
);

function getMainInfo() {
  const paramsSearch = {
    engine: "walmart",
    query: "laptop",
  };

  const callback = async function (data) {
    const mainProductInfo = await data.organic_results;
    const goodProductInfo = mainProductInfo.map((el) => {
      if (el.product_id) {
        return el;
      }
    });
    const paramsProduct = {
      engine: "walmart_product",
    };
    for (let i = 0; i < goodProductInfo.length; i++) {
      console.log(goodProductInfo[i].product_id);

      paramsProduct.product_id = goodProductInfo[i].product_id;

      const productInfo = {};
      productInfo.link = goodProductInfo[i].product_page_url;
      productInfo.title = goodProductInfo[i].title;
      productInfo.price = goodProductInfo[i].price_per_unit?.amount;
      productInfo.specifications = {};
      const callback = async function (data) {
        const specificationHighlights = await data.product_result
          .specification_highlights;
        for (let i = 0; i < specificationHighlights.length; i++) {
          productInfo.specifications[
            `${specificationHighlights[i].display_name}`
          ] = specificationHighlights[i].value;
        }
        console.log(productInfo);
      };

      await search.json(paramsProduct, callback);
    }
  };

  search.json(paramsSearch, callback);
}

getMainInfo();
