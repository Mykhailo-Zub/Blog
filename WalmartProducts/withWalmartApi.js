//Product data
JSON.parse($("script#item").textContent);

//Specifications
JSON.parse($("script#item").textContent).item.product.buyBox.products[0].idmlSections
  .specifications;

const { promisify } = require("util");
const got = require("got");
const { CookieJar } = require("tough-cookie");
const UserAgent = require("user-agents");

(async function () {
  let sleep = require("util").promisify(setTimeout);
  const instance = got.extend({ followRedirect: true });

  let cookieJar = new CookieJar();
  const userAgent = new UserAgent();

  // Get cookie
  await instance.get("https://www.walmart.com", {
    headers: {
      "user-agent": userAgent.random().toString(),
    },
    cookieJar,
  });

  // Get products
  const productsResponse = instance.get(
    "https://www.walmart.com/search/api/preso?prg=desktop&cat_id=4125&page=1&ps=40&query=bycicle",
    {
      headers: {
        "user-agent": userAgent.random().toString(),
      },
      cookieJar,
    }
  );

  console.log(productsResponse);

  const json = await productsResponse.json();
  console.log(json.items);

  await sleep(1000);

  for (const product in json.items) {
    const singleProductResponse = instance.post(
      "https://www.walmart.com/terra-firma/fetch?rgs=REVIEWS_FIELD,QUESTIONS_FIELD,CARE_PLANS_MAP,HOME_SERVICES_MAP,BUY_BOX_PRODUCT_IDML,CHECKOUT_COMMENTS_FIELD",
      {
        json: {
          itemId: product.usItemId || product.productId || product.upc,
        },
        headers: {
          "user-agent": userAgent.random().toString(),
        },
        cookieJar,
      }
    );

    const json = await singleProductResponse.json();

    console.log(json);

    await sleep(1000);
  }
})();
