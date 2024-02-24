const puppeteer = require('puppeteer');
const cheerio = require("cheerio");
 
const PAGE_URL = 'https://www.amazon.com/s?k=iphone&crid=2ULXMEKI8IBMH&sprefix=iphone%2Caps%2C187&ref=nb_sb_noss_2';
 
const main = async () => {
    const browser = await puppeteer.launch({ headless: 'new' });
    const page = await browser.newPage();
 
    await page.goto(PAGE_URL);
 
    const html = await page.content();
    await browser.close();
 
    const $ = cheerio.load(html);
    const products = [];
 
    $('.s-widget-container').each((i, element) => {
        const titleElement = $(element).find('.s-title-instructions-style');
        const priceElement = $(element).find('.a-price > span').first();
 
        const title = titleElement.text();
        const price = parseInt(priceElement.text().replace(/[$,]/g, ""), 10);
 
        if (!title || isNaN(price)) {
            return;
        }
 
        products.push({
            title,
            price,
            priceInDollarFormat:  priceElement.text(),
        })
    });
 
    const sortedProducts = products.slice().sort((p1, p2) => p2.price - p1.price);
 
    console.log(sortedProducts);
}
 
main();