import { LaunchOptions } from "puppeteer";

const isProduct = process.env.NODE_ENV === 'product';

console.log(isProduct);

export const AppConfig = {
    prefix: isProduct ? "/data/" : "./",               // 文件路径
    minSizeMb: 0,             // 文件最小阈值
    startUrl: "http://www.baidu.com",
    headless: true,
    executablePath: isProduct ? "/usr/bin/google-chrome-stable" : undefined
}

export const launchConfig: LaunchOptions = {
    headless: AppConfig.headless,
    executablePath: AppConfig.executablePath,
    args: isProduct ? ["--no-sandbox"] : undefined
}
