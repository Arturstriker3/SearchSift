// This Puppeteer script enables you to scrape search results from Amazon.
// It returns scraping results to external JSON file (scrapedData.json).
// Remember to change parameters searchPhrase and scrapeToPage according to your needs.

// VIDEO TUTORIAL
// Complete video guide available on my YouTube: https://youtu.be/ArRMJhdEweg

// INFO
// If you like my work, please subscirbe to my YouTube channel: https://www.youtube.com/@workfloows
// And/or to my newsletter: https://workfloows.com/
// Follow me on X: https://twitter.com/workfloows 

// Thank you for your support! 



const puppeteer = require('puppeteer');
const fs = require('fs');

// Function to handle cookies window
async function handleCookiesPopup(page) {
    const cookiesButton = await page.$('#sp-cc-accept');
    if (cookiesButton) {
        await cookiesButton.click();
    }
}

(async () => {
    const browser = await puppeteer.launch({
        headless: false,
        defaultViewport: null,
    });

    // Open a new page
    const page = await browser.newPage();

    const searchPhrase = 'mate cup'; // Set your search phrase here
    const scrapeToPage = 3; // Set the desired page to scrape to

    console.log('Search phrase:', searchPhrase); // Log searchPhrase
    console.log('Scrape to page:', scrapeToPage); // Log scrapeToPage
    // Navigate to Amazon's cart page
    const homeUrl = 'https://www.amazon.com/gp/cart/view.html';
    await page.goto(homeUrl);

    await handleCookiesPopup(page); // Call the function to handle cookies window
    await page.waitForSelector('#twotabsearchtextbox');
    // Type the search phrase and click the search button
    await page.type('#twotabsearchtextbox', searchPhrase);
    await page.click('#nav-search-submit-button');

    // Wait for the search results page to load
    await page.waitForSelector('.s-widget-container');

    const url = page.url(); // Get the current URL after the search

    const cardData = [];

    async function scrapePage(url, currentPage = 1, scrapeToPage = null) {
        console.log("Scraping page " + currentPage + "...");
        if (scrapeToPage !== null && currentPage > scrapeToPage) {
            return; // Stop scraping if the current page exceeds the target page
        }
        //  Navigate to the URL
        await page.goto(url);

        await handleCookiesPopup(page); // Call the function to handle cookies window

        //  Wait for selector
        await page.waitForSelector('.s-widget-container');

        const pageCardData = await page.evaluate(() => {
            const cards = Array.from(document.querySelectorAll('.s-widget-container'));

            const cardInfo = cards.map(card => {

                // Product name
                const productName = card.querySelector('h2')?.textContent.trim();

                // Sponsored tag
                const sponsoredTag = card.querySelector('.puis-sponsored-label-text');
                const sponsored = sponsoredTag ? "yes" : "no";

                // Badge
                const badgeElement = card.querySelector('span.a-badge-label-inner');
                const badge = badgeElement ? badgeElement.textContent : "N/A";

                // Price 
                const priceElement = card.querySelector('.a-price .a-offscreen');
                const price = priceElement ? priceElement.textContent : "N/A";

                // Base price (without discount)
                const basePriceElement = card.querySelector('span.a-price.a-text-price > span.a-offscreen');
                const basePrice = basePriceElement ? basePriceElement.textContent : "N/A";

                // Rating
                const ratingElement = card.querySelector('.a-row > span:nth-child(1)[aria-label]');
                const decimalRegex = /^\d+([,.]\d+)?$/;
                const ariaLabel = ratingElement ? ratingElement.getAttribute('aria-label') : "N/A";
                const firstThreeCharacters = ariaLabel.substring(0, 3);
                const rating = decimalRegex.test(firstThreeCharacters) ? firstThreeCharacters.replace(',', '.') : "N/A";

                // Ratings number
                const ratingsNumberElement = card.querySelector('.a-row > span:nth-child(2)[aria-label]');
                const numberRegex = /^-?\d+(\.\d+)?$/;
                const numberFormated = ratingsNumberElement ? ratingsNumberElement.getAttribute('aria-label').replace(/[\s.,]+/g, '') : "N/A";
                const ratingsNumber = numberRegex.test(numberFormated) ? numberFormated : "N/A";

                // Quantity sold last month
                const boughtPastMonthElement = card.querySelector('.a-row.a-size-base > .a-size-base.a-color-secondary');
                const textContent = boughtPastMonthElement ? boughtPastMonthElement.textContent : "N/A";
                const plusSignRegex = /\b.*?\+/; // Regular expression to match text up to and including the "+" sign 
                                                // (e.g. value "300+" from text "300+ bought in past month")
                const plusSignText = textContent.match(plusSignRegex);
                const boughtPastMonth = plusSignRegex.test(plusSignText) ? plusSignText[0] : "N/A";

                if (productName) {
                    return {
                        productName,
                        sponsored,
                        badge,
                        price,
                        basePrice,
                        rating,
                        ratingsNumber,
                        boughtPastMonth
                    };
                } else {
                    return null; // Return null for empty items
                }
            }).filter(card => card !== null);

            return cardInfo;
        });

        cardData.push(...pageCardData);

        if (scrapeToPage === null || currentPage < scrapeToPage) {
            const nextPageButton = await page.$('.s-pagination-next');
            if (nextPageButton) {
                const isDisabled = await page.evaluate(btn => btn.hasAttribute('aria-disabled'), nextPageButton);
                if (!isDisabled) {
                    const nextPageUrl = encodeURI(await page.evaluate(nextBtn => nextBtn.href, nextPageButton));
                    await scrapePage(nextPageUrl, currentPage + 1, scrapeToPage);
                } else {
                    console.log("All available pages scraped:", currentPage);
                }
            } else if (!scrapeToPage || currentPage < scrapeToPage) {
                console.log("All available pages scraped:", currentPage);
            }

        }
    }

    await scrapePage(url, 1, scrapeToPage);

    console.log('Scraping finished.');

    // Save JSON to file
    const outputFilename = 'scrapedData.json';
    fs.writeFileSync(outputFilename, JSON.stringify(cardData, null, 2), 'utf8'); // Write the JSON data to a file
    console.log(`Data saved to ${outputFilename}`);

    // Close the browser
    await browser.close();
})();