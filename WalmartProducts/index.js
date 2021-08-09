const puppeteer = require("puppeteer-extra");
const StealthPlugin = require("puppeteer-extra-plugin-stealth");

const URL = "https://www.walmart.com/";
const searchString = "laptop";
const encodedString = encodeURI(searchString);

puppeteer.use(StealthPlugin());

async function solveCaptcha(page, url) {
  const currentPage = await page.evaluate(() => location.href);
  if (currentPage != url) {
    await page.waitForSelector("#px-captcha");
    await page.waitForTimeout(3000);
    await page.keyboard.press("Tab");
    await page.keyboard.press("Tab");
    await page.keyboard.press("Enter", { delay: 10000 });
    await page.waitForTimeout(5000);
  }
  return;
}

async function solveSecondCaptcha(page, url, searchQuery) {
  const currentPage = await page.evaluate(() => location.href);
  if (currentPage.indexOf("?query=") != "-1") {
    if (currentPage != `${url}search/?query=${searchQuery}`) {
      await page.waitForSelector("#px-captcha");
      await page.waitForTimeout(3000);
      await page.keyboard.press("Tab");
      await page.keyboard.press("Tab");
      await page.keyboard.press("Enter", { delay: 10000 });
      await page.keyboard.up("Enter");
      await page.waitForTimeout(5000);
    }
  }
  if (currentPage.indexOf("?q=") != "-1") {
    if (currentPage != `${url}search?q=${searchQuery}`) {
      await page.waitForSelector("#px-captcha");
      await page.waitForTimeout(3000);
      await page.keyboard.press("Tab");
      await page.keyboard.press("Tab");
      await page.keyboard.press("Enter", { delay: 10000 });
      await page.keyboard.up("Enter");
      await page.waitForTimeout(5000);
    }
  }
  return;
}

async function getOrganicResults(url, searchQuery) {
  browser = await puppeteer.launch({
    headless: false,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  const page = await browser.newPage();

  await page.setDefaultNavigationTimeout(60000);
  await page.goto(url);
  await solveCaptcha(page, url);
  await page.waitForSelector(".bo_b, input[name='q']");
  await page.type(".bo_b, input[name='q']", searchQuery, { delay: 10 });
  await page.keyboard.press("Enter");
  await page.waitForTimeout(10000);
  await solveSecondCaptcha(page, url, searchQuery);
  await page.waitForSelector(".search-result-gridview-item-wrapper, div[data-item-id]");
  await page.waitForTimeout(5000);

  const products = await page.evaluate(function () {
    return Array.from(
      document.querySelectorAll(
        ".search-result-gridview-item-wrapper, div[data-stack-index] div[data-item-id]"
      )
    ).map((el) => ({
      link:
        "https://www.walmart.com" +
        el.querySelector(".product-title-link, a[link-identifier]").getAttribute("href"),
      title: el.querySelector(".product-title-link span, .w_3:first-child").innerText,
      price: el
        .querySelector(
          ".price-main-block .price-main:first-child, .secondary-price-prefix .sub-title-list-price, .w_CV span"
        )
        .innerText.replace("current price $", "")
        .slice(0, 7),
    }));
  });

  return products;
}

async function getProductsSpecs(product) {
  const url = product.link;
  const page = await browser.newPage();
  await page.setDefaultNavigationTimeout(60000);
  await page.goto(url);
  await solveCaptcha(page, url);
  await page.waitForTimeout(10000);
  const selectors1 = await page.$$(".product-specification-table td");
  const productInfo = {};
  let keys = [];
  let values = [];

  if (selectors1.length > 1) {
    keys = await page.evaluate(function () {
      return Array.from(
        document.querySelectorAll(".product-specification-table td:first-child")
      ).map((el) => el.innerText);
    });
    values = await page.evaluate(function () {
      return Array.from(
        document.querySelectorAll(".product-specification-table td:last-child")
      ).map((el) => el.innerText);
    });
  } else {
    keys = await page.evaluate(function () {
      return Array.from(document.querySelectorAll(".nt1 .pb2 h3")).map((el) => el.innerText);
    });
    values = await page.evaluate(function () {
      return Array.from(document.querySelectorAll(".nt1 .pb2 p span")).map((el) => el.innerText);
    });
  }

  await page.close();
  productInfo.link = url;
  productInfo.title = product.title;
  productInfo.price = product.price;
  productInfo.specifications = {};
  for (let i = 0; i < keys.length; i++) {
    productInfo.specifications[`${keys[i]}`] = values[i].trim();
  }

  console.log(productInfo);
  return productInfo;
}

async function getAllSpecs(url, searchQuery) {
  const mainProductInfo = await getOrganicResults(url, searchQuery);
  const products = [];
  for (let i = 0; i < mainProductInfo.length; i++) {
    products.push(await getProductsSpecs(mainProductInfo[i]));
  }
  await browser.close();
}

getAllSpecs(URL, encodedString);
