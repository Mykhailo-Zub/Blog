const puppeteer = require("puppeteer");

const searchString = "cheerio js";
const encodedString = encodeURI(searchString);

async function getOrganicResults() {
  const browser = await puppeteer.launch({
    headless: false,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  const page = await browser.newPage();

  await page.setDefaultNavigationTimeout(60000);
  await page.goto(`https://bing.com/search?q=${encodedString}&setmkt=en-WW&setlang=en`);
  await page.waitForSelector(".b_pag");
  const numberOfResults = await page.$$("#b_results > li");
  for (let i = 1; i <= numberOfResults.length; i++) {
    await page.hover(`#b_results > li:nth-child(${i})`);
    await page.waitForTimeout(1000);
  }
  await page.hover(".b_pag");

  const result = await page.evaluate(function () {
    return Array.from(document.querySelectorAll("li.b_algo")).map((el) => ({
      link: el.querySelector("h2 > a").getAttribute("href"),
      title: el.querySelector("h2 > a").innerText,
      snippet: el.querySelector("p, .b_mText div").innerText,
    }));
  });

  await browser.close();

  console.log(result);
  return result;
}

getOrganicResults();
