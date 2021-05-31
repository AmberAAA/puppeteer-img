import { LaunchOptions } from "puppeteer";
import { ClientOpts } from "redis";

const isProduct = process.env.NODE_ENV === 'product';

console.log(isProduct);

export const AppConfig = {
    prefix: isProduct ? "/data/" : "./test/",               // 文件路径
    minSizeMb: 0.5,             // 文件最小阈值
    startUrl: process.env.START_URL,
    headless: isProduct ? true :　false,
    executablePath: isProduct ? "/usr/bin/google-chrome-stable" : undefined,
    redis: "127.0.0.1",
    timeout: 5000,
}

export const launchConfig: LaunchOptions = {
    headless: AppConfig.headless,
    executablePath: AppConfig.executablePath,
    args: isProduct ? ["--no-sandbox"] : undefined,
    defaultViewport: {
        width: 1440,
        height: 2000
    }
}


export const redisConfig: ClientOpts  = {
    host: AppConfig.redis,
    db: isProduct ? 1 : 0
}