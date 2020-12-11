import puppeteer, { Response } from 'puppeteer';
import { launchConfig, AppConfig } from './config';
import fs from  "fs";
let i = 0;

(async function () {
    const brower = await puppeteer.launch(launchConfig);
    const page = await brower.newPage();
    page.on("response",async (e, ...arr) => {
        await handleResponse(e);
        i++;
        if (i >= 5) {
            console.log("END........");
            process.exit(0);
        }
    })
    page.goto(AppConfig.startUrl);
})()


async function handleResponse(e: Response) {
    const url = e.url();
    if (isImageUrl(url)) {
        const buffer = await e.buffer();
        const size = buffer.byteLength / 1024 / 1024;
        if (size > AppConfig.minSizeMb) {
            const name = url.split("/").pop() as string;
            console.log(name)
            fs.writeFile(`${AppConfig.prefix}${name}`, await e.buffer(), null, () => {})
        }
    }
}


function isImageUrl (url: string) :boolean {
    return (/\.(jpg|png|svg)$/i).test(url)
}