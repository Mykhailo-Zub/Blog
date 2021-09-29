const puppeteer = require("puppeteer-extra");
const StealthPlugin = require("puppeteer-extra-plugin-stealth");

puppeteer.use(StealthPlugin());

const searchString = "psy";
const encodedString = encodeURI(searchString);

exports.getSearchResults = async function getSearchResults() {
  const browser = await puppeteer.launch({
    headless: false,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  const page = await browser.newPage();

  await page.setDefaultNavigationTimeout(60000);
  await page.goto(`https://www.youtube.com/results?search_query=${encodedString}&gl=US&hl=EN`);
  await page.waitForSelector("#contents > ytd-video-renderer");
  await page.waitForTimeout(5000);

  const organicResult = await page.evaluate(function () {
    return Array.from(document.querySelectorAll("#contents > ytd-video-renderer")).map((el) => ({
      link: "https://www.youtube.com" + el.querySelector("a#thumbnail").getAttribute("href"),
      title: el.querySelector("a#video-title").textContent.trim(),
      description: el.querySelector(".metadata-snippet-container > yt-formatted-string").textContent.trim(),
      views: el.querySelectorAll("#metadata-line > span")[0].textContent.trim(),
      published_date: el.querySelectorAll("#metadata-line > span")[1].textContent.trim(),
      channel: {
        name: el.querySelector("#channel-info #channel-name a").textContent.trim(),
        link: "https://www.youtube.com" + el.querySelector("#channel-info #channel-name a").getAttribute("href"),
      },
    }));
  });

  await browser.close();

  console.log("Puppeteer results:");
  console.log(organicResult);
  return organicResult;
};
