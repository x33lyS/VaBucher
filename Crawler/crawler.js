const puppeteer = require('puppeteer');

(async () => {
    const browser = await puppeteer.launch({headless: true});
    const page = await browser.newPage();
    await page.goto('https://github.com/x33lyS');
    // await page.screenshot({path: 'example.png'});
    console.log("node js crawler")
    await browser.close();
})();