import { LaunchOptions } from "puppeteer";

export const AppConfig = {
    prefix: "./",               // 文件路径
    minSizeMb: 0,             // 文件最小阈值
    startUrl: "http://www.baidu.com",
    headless: true
}

export const launchConfig: LaunchOptions = {
    headless: AppConfig.headless
}
