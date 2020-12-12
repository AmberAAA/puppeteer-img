import { LaunchOptions } from "puppeteer";
import { ClientOpts } from "redis";

const isProduct = process.env.NODE_ENV === 'product';

console.log(isProduct);

export const AppConfig = {
    prefix: isProduct ? "/data/" : "./test/",               // 文件路径
    minSizeMb: 0.1,             // 文件最小阈值
    startUrl: "https://www.nvshens.org/",
    headless: isProduct ? true :　false,
    executablePath: isProduct ? "/usr/bin/google-chrome-stable" : undefined,
    redis: isProduct ? "127.0.0.1" : "192.168.0.166"
}

export const launchConfig: LaunchOptions = {
    headless: AppConfig.headless,
    executablePath: AppConfig.executablePath,
    args: isProduct ? ["--no-sandbox"] : undefined
}


export const redisConfig: ClientOpts  = {
    host: AppConfig.redis,
    db: isProduct ? 1 : 0
}