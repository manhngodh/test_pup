const puppeteer = require('puppeteer');
async function doScreenCapture(url, site_name) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(url, {waitUntil: 'domcontentloaded'});
  await page.screenshot({
    fullPage: true,
    path:`${site_name}.png`
  });
  await browser.close();
}
const news_sites = [
  {
    name: 'reuters',
    url: 'https://youhomes.vn/ban/4555-can-ho-chung-cu-mullberry-lane-2pn-116m2-nhieu-anh-sang-4-05-ty.html'
  }, {
    name: 'reuters_china',
    url: 'https://batdongsan.com.vn/cho-thue-nha-mat-pho-quan-3/tien-380-nguyen-thi-minh-khai-3-khu-dong-duc-dan-cu-va-cac-nganh-nghe-giai-tri-pr26219566'
  }
];
for (var i = 0; i < news_sites.length; i++) {
  doScreenCapture(news_sites[i]['url'], news_sites[i]['name']);
}