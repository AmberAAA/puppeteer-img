import puppeteer, { Page, Response } from 'puppeteer';
import redis from "redis";
const { promisify } = require("util");
import url, { resolve } from 'url';
import { launchConfig, AppConfig, redisConfig } from './config';
import fs from  "fs";

const client = redis.createClient(redisConfig);

const getAsync = promisify(client.get).bind(client);
const setAsync = promisify(client.set).bind(client);
const saddAsync = promisify(client.sadd).bind(client);
const spopAsync = promisify(client.spop).bind(client);
const shasAsync = promisify(client.sismember).bind(client);

const stopMs = (timer: number) => {
    return new Promise((resolve) => {
        setTimeout(() => resolve(null), timer);
    })
}


(async function () {
    const brower = await puppeteer.launch(launchConfig);
    const page = await brower.newPage();
    const startUrl = AppConfig.startUrl;
    const urlObj = url.parse(startUrl, true);
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
        start(page);
    })
    page.on("response",async (e, ...arr) => {
        await handleResponse(e, page);
    });
    page.on("error", (e) => {
        console.error(e);
    });
    await start(page)
})()


async function  start(page: Page) {
    const url = await spopAsync("undo");
    if (url) {
        try {
            console.log("停止10秒钟， 下一个页面：" + url)
            await stopMs(10 * 1000)
            await page.goto(url, { timeout: 1000 * 60 });
        } catch (e) {
            console.error(e);
            start(page);
        }
        saddAsync("do", url);
    } else {
        await page.goto(AppConfig.startUrl);
        saddAsync("do", AppConfig.startUrl);
    }
    await page.waitForNavigation();
}

async function getTitleName(page: Page): Promise<string> {
    return page.evaluate("document.title") as Promise<string>;
}



async function handleResponse(e: Response, page: Page) {
    const url = e.url();
    if (isImageUrl(url)) {
        const buffer = await e.buffer();
        const size = buffer.byteLength / 1024 / 1024;
        if (size > AppConfig.minSizeMb) {
            const name = url.split("/").pop() as string;
            const nameFix = await getTitleName(page); 
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