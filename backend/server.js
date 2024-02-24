const express = require('express');
const puppeteer = require('puppeteer');
const cheerio = require('cheerio');
const cors = require('cors');

const swaggerAutogen = require('swagger-autogen')();
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger-output.json');

const app = express();
const PORT = 3000;
app.use(cors());

// Function to simulate random delay between requests
const randomDelay = () => {
    return Math.floor(Math.random() * 2000) + 1000;
};

app.get('/api/scrape', async (req, res) => {
    try {
        const keyword = req.query.keyword;
        const PAGE_URL = `https://www.amazon.com/s?k=${keyword}&crid=2ULXMEKI8IBMH&sprefix=${keyword}%2Caps%2C187&ref=nb_sb_noss_2`;
        
        const browser = await puppeteer.launch({ headless: true });
        const page = await browser.newPage();

        // Define a custom User-Agent
        await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.182 Safari/537.36');
        
        await page.goto(PAGE_URL);
        
        // Wait for a random delay before continuing to simulate human behavior
        await new Promise(resolve => setTimeout(resolve, randomDelay()));
        
        const html = await page.content();
        await browser.close();
        
        const $ = cheerio.load(html);
        const products = [];
        
        $('.s-result-item').each((i, element) => {
          const title = $(element).find('h2 span').text();
          // Check only products with name
          if (title.trim() !== '') {
              // Treat and check the rating between 0 and 5
              const ratingElement = $(element).find('.a-icon-star-small');
              let rating = ratingElement.length > 0 ? parseFloat(ratingElement.text().trim()) : 0;
              
              // Remove "," and convert to number or 0 if empty
              const numReviewsText = $(element).find('.a-size-small .a-size-base').text();
              let numReviews = numReviewsText.trim() !== '' ? parseInt(numReviewsText.replace(/,/g, ''), 10) : 0;

              const image = $(element).find('img').attr('src');
      
              products.push({
                  id: i,
                  title,
                  rating,
                  numReviews,
                  image
              });
          }
        });
        
        res.json(products);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Documentation
app.use('/api/doc', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});