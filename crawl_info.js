const puppeteer = require('puppeteer');
const fs = require('fs');

const obj = JSON.parse(fs.readFileSync('/Users/manhngo/Downloads/labels.json', 'utf8'));
async function doScreenCapture(url, site_name) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  page.setViewport({width: 1280, height: 720});
  await page.goto(url, {waitUntil: 'domcontentloaded'});

  await page.screenshot({
    fullPage: true,
    path:`${site_name}.png`
  });
  await browser.close();
}

function randomNumberPhone(){
  return '0300200304'
}

function randomArea(){
  return '150m2'
}

async function getInfo (url) {
  const site_name = 'test'
  const browser = await puppeteer.launch({headless: true});
  const page = await browser.newPage();
  page.setViewport({width: 1280, height: 720});
  await page.goto(url);
  await page.click("#LeftMainContent__productDetail_contactMobile > div.right.contact-phone")
  const logger = fs.createWriteStream('anotation.txt', {
    flags: 'a' // 'a' means appending (old data will be preserved)
  })

  // const item = items[Math.floor(Math.random() * items.length)];
  for(let i = 0; i < 50; i++){
    for (const key in obj){
      if (obj.hasOwnProperty(key)){
        let bdsInfo = await page.evaluate((address) => {
          document.querySelector("#product-other-detail > div:nth-child(2) > div.right").innerText =  address
          const bdsInfo = []
          bdsInfo[0] = document.querySelector("#product-other-detail > div:nth-child(1) > div.right").innerText
          bdsInfo[1] = document.querySelector("#product-detail > div.kqchitiet > span:nth-child(2) > span:nth-child(2) > strong").innerText
          bdsInfo[2] = document.querySelector("#product-other-detail > div:nth-child(2) > div.right").innerText
          bdsInfo[3] = document.querySelector("#LeftMainContent__productDetail_contactMobile > div.right.contact-phone > span").getAttribute("raw").trim()
          bdsInfo[4] = document.querySelector("#product-detail > div.prd-more-info > div:nth-child(3)").childNodes[2].nodeValue.trim()
          bdsInfo[5] = document.querySelector("#product-detail > div.prd-more-info > div:nth-child(4)").childNodes[2].nodeValue.trim()
          return bdsInfo
        }, obj[key]);
        console.log("mana " + JSON.stringify(bdsInfo))

        const fileName = `${Date.now()}.png`;
        await page.screenshot({
          fullPage: true,
          path:`data/${fileName}`
        });
        logger.write(`${fileName} ${JSON.stringify(bdsInfo)}\r\n`)
      }
    }
  }

  // await browser.close();
}

(async () => {


  console.log("mana")
  await getInfo("https://batdongsan.com.vn/ban-can-ho-chung-cu-duong-nguyen-huu-tho-phuong-tan-hung-14-prj-sunrise-city/covid-19-lan-2-gia-view-xuong-cham-day-thich-p-de-dau-tu-va-o-0777777284-pr26224152")
  // await getInfo('https://batdongsan.com.vn/ban-nha-rieng-duong-phan-van-hon-xa-ba-diem/sieu-pho-1-0-2-noi-that-dang-cap-ngay-cho-hoc-mon-pr26224565');
})()

