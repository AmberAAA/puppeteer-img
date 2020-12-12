import puppeteer, { Page, Response } from 'puppeteer';
import redis from "redis";
const { promisify } = require("util");
import url from 'url';
import { launchConfig, AppConfig } from './config';
import fs from  "fs";

const client = redis.createClient({
    host: AppConfig.redis,
    db: 1
});

const getAsync = promisify(client.get).bind(client);
const setAsync = promisify(client.set).bind(client);
const saddAsync = promisify(client.sadd).bind(client);
const spopAsync = promisify(client.spop).bind(client);
const shasAsync = promisify(client.sismember).bind(client);


(async function () {
    const brower = await puppeteer.launch(launchConfig);
    const page = await brower.newPage();
    const startUrl = AppConfig.startUrl;
    const urlObj = url.parse(startUrl, true);
    let nameFix: string | null = null;
    page.on("domcontentloaded", (e) => {
    })
    page.on("load", async (e) => {
        const a = await page.$$eval("a", nodes => nodes.map(e => e.getAttribute("href")));
        for(let i = 0; i < a.length; i++) {
            const item = a[i];
            if (item && !/(#|javascript)/.test(item)) {
                const aimUrl = url.resolve(urlObj.href, item);
                if (await shasAsync("do", aimUrl)) {
                } else {
                    await saddAsync("undo", aimUrl);
                }
            }
        }
        nameFix = null;
        start(page);
    })
    page.on("response",async (e, ...arr) => {
        if (nameFix === null) {
            nameFix = await getTitleName(page);
        }
        await handleResponse(e, nameFix);
    });
    page.on("error", (e) => {
        console.error(e);
    });
    await start(page)
})()


async function  start(page: Page) {
    const url = await spopAsync("undo");
    if (url) {
        page.goto(url);
        saddAsync("do", url);
    } else {
        page.goto(AppConfig.startUrl);
        saddAsync("do", AppConfig.startUrl);
    }
}

async function getTitleName(page: Page): Promise<string> {
    return page.evaluate("document.title") as Promise<string>;
}



async function handleResponse(e: Response, nameFix: string) {
    const url = e.url();
    if (isImageUrl(url)) {
        const buffer = await e.buffer();
        const size = buffer.byteLength / 1024 / 1024;
        if (size > AppConfig.minSizeMb) {
            const name = url.split("/").pop() as string;
            fs.mkdir(`${AppConfig.prefix}${nameFix}`, { recursive:　true }, async code => {
                console.log(`${AppConfig.prefix}${nameFix}/${name}`)
                fs.writeFile(`${AppConfig.prefix}${nameFix}/${name}`, await e.buffer(), null, () => {})
            })
            
        }
    }
}


function isImageUrl (url: string) :boolean {
    return (/\.(jpg|png|svg)$/i).test(url)
}