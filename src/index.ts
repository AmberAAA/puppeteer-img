import puppeteer from 'puppeteer';


(async function () {
    await puppeteer.launch({
        headless: false
    });
})()