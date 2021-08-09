// const puppeteer = require("puppeteer-extra");
// const StealthPlugin = require("puppeteer-extra-plugin-stealth");

// const URL = "https://www.walmart.com/";
// const searchString = "laptop";
// const encodedString = encodeURI(searchString);

// puppeteer.use(StealthPlugin());

// async function solveCaptcha(page, url) {
//   const currentPage = await page.evaluate(() => location.href);
//   if (currentPage != url) {
//     await page.waitForSelector("#px-captcha");
//     await page.waitForTimeout(3000);
//     await page.keyboard.press("Tab");
//     await page.keyboard.press("Tab");
//     await page.keyboard.press("Enter", { delay: 10000 });
//     await page.waitForTimeout(5000);
//   }
//   return;
// }

// async function solveSecondCaptcha(page, url, searchQuery) {
//   const currentPage = await page.evaluate(() => location.href);
//   if (currentPage != `${url}search/?query=${searchQuery}`) {
//     await page.waitForSelector("#px-captcha");
//     await page.waitForTimeout(3000);
//     await page.keyboard.press("Tab");
//     await page.keyboard.press("Tab");
//     await page.keyboard.press("Enter", { delay: 10000 });
//     await page.keyboard.up("Enter");
//     await page.waitForTimeout(5000);
//   }
//   return;
// }

// async function getOrganicResults(url, searchQuery) {
//   const browser = await puppeteer.launch(
//     {
//       headless: false,
//     },
//     { args: ["--no-sandbox", "--disabled-setuid-sandbox"] }
//   );

//   const page = await browser.newPage();

//   await page.setDefaultNavigationTimeout(60000);
//   await page.goto(url);
//   await solveCaptcha(page, url);
//   await page.waitForSelector(".bo_b");
//   await page.type(".bo_b", searchQuery, { delay: 10 });
//   await page.keyboard.press("Enter");
//   await page.waitForTimeout(10000);
//   await solveSecondCaptcha(page, url, searchQuery);
//   await page.waitForSelector(".search-result-gridview-item-wrapper");
//   await page.waitForTimeout(5000);

//   const products = [];

//   const links = await page.evaluate(function () {
//     return Array.from(
//       document.querySelectorAll(
//         ".search-result-gridview-item-wrapper .product-title-link"
//       )
//     ).map((el) => el.getAttribute("href"));
//   });

//   const titles = await page.evaluate(function () {
//     return Array.from(
//       document.querySelectorAll(
//         ".search-result-gridview-item-wrapper .product-title-link span"
//       )
//     ).map((el) => el.innerText);
//   });

//   const prices = await page.evaluate(function () {
//     return Array.from(
//       document.querySelectorAll(
//         ".search-result-gridview-item-wrapper .price-main-block .price-group"
//       )
//     ).map((el) => el.innerText);
//   });

//   await browser.close();

//   for (let i = 0; i < links.length; i++) {
//     products[i] = {
//       link: url + links[i].slice(1),
//       title: titles[i],
//       price: prices[i],
//     };
//   }
//   return products;
// }

// async function getProductsSpecs(product) {
//   const url = product.link;
//   const browser = await puppeteer.launch(
//     {
//       headless: false,
//     },
//     { args: ["--no-sandbox", "--disabled-setuid-sandbox"] }
//   );
//   const page = await browser.newPage();
//   await page.setDefaultNavigationTimeout(60000);
//   await page.goto(url);
//   await solveCaptcha(page, url);
//   await page.waitForTimeout(10000);
//   const selectors1 = await page.$$(".product-specification-table td");
//   const productInfo = {};
//   let keys = [];
//   let values = [];

//   if (selectors1.length > 1) {
//     keys = await page.evaluate(function () {
//       return Array.from(
//         document.querySelectorAll(".product-specification-table td:first-child")
//       ).map((el) => el.innerText);
//     });
//     values = await page.evaluate(function () {
//       return Array.from(
//         document.querySelectorAll(".product-specification-table td:last-child")
//       ).map((el) => el.innerText);
//     });
//   } else {
//     keys = await page.evaluate(function () {
//       return Array.from(document.querySelectorAll(".nt1 .pb2 h3")).map(
//         (el) => el.innerText
//       );
//     });
//     values = await page.evaluate(function () {
//       return Array.from(document.querySelectorAll(".nt1 .pb2 p span")).map(
//         (el) => el.innerText
//       );
//     });
//   }

//   await browser.close();
//   productInfo.link = url;
//   productInfo.title = product.title;
//   productInfo.price = product.price;
//   productInfo.specifications = {};
//   for (let i = 0; i < keys.length; i++) {
//     productInfo.specifications[`${keys[i]}`] = values[i].trim();
//   }

//   console.log(productInfo);
//   return productInfo;
// }

// async function getAllSpecs(url, searchQuery) {
//   const mainProductInfo = await getOrganicResults(url, searchQuery);
//   const products = [];
//   for (let i = 0; i < mainProductInfo.length; i++) {
//     products.push(await getProductsSpecs(mainProductInfo[i]));
//   }
// }

// getAllSpecs(URL, encodedString);

const fetch = require("node-fetch");

fetch(
  "https://www.walmart.com/terra-firma/fetch?rgs=REVIEWS_FIELD,QUESTIONS_FIELD,CARE_PLANS_MAP,HOME_SERVICES_MAP,BUY_BOX_PRODUCT_IDML,CHECKOUT_COMMENTS_FIELD",
  {
    headers: {
      "content-type": "application/json",
    },

    body: '{"itemId":"905863480","categoryPathId":"0:3944:4131277:8460364:7994599","paginationContext":{"selected":false,"selectedCatalogSellerId":null},"storeFrontIds":[{"usStoreId":"2648","preferred":false,"semStore":false,"lastPickupStore":false,"distance":15.22},{"usStoreId":"5434","preferred":false,"semStore":false,"lastPickupStore":false,"distance":16.96},{"usStoreId":"2031","preferred":false,"semStore":false,"lastPickupStore":false,"distance":19.87},{"usStoreId":"2280","preferred":false,"semStore":false,"lastPickupStore":false,"distance":23.22},{"usStoreId":"5426","preferred":false,"semStore":false,"lastPickupStore":false,"distance":25.3}]}',
    method: "POST",
  }
).then(({ body }) => console.log(body));
