const puppeteer = require('puppeteer')
async function doScreenCapture(url, site_name) {
    const browser = await puppeteer.launch()
    const page = await browser.newPage()
    await page.setViewport({width: 1920, height: 1080})
    await page.goto(url)

    await page.screenshot({
        fullPage: true,
        path: `${site_name}.png`,
    })
    await browser.close()
}

(async () => {
    doScreenCapture("https://homedy.com/nha-pho-bien-2-mat-tien-thanh-long-bay-thanh-long-bay-pj90133739", "manh")
})()


