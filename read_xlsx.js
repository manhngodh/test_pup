const XLSX = require('xlsx');
const puppeteer = require('puppeteer')
const fs = require('fs')


const workbook = XLSX.readFile('links_bds.xlsx');
const sheet_name_list = workbook.SheetNames;
const xlData = XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]);
fs.mkdirSync("data", { recursive: true })
async function getInfo(url) {

    const browser = await puppeteer.launch({headless: true})
    const page = await browser.newPage()
    // page.setViewport()
    let number = 0;
    const bdsInfo = {};
    for (const key in xlData) {
        if (xlData.hasOwnProperty(key)) {
            console.log(xlData[key]["link"])

            try {
                await page.goto(xlData[key]["link"])
                const address = await page.evaluate((bdsInfo) => {
                    let addressTag = null

                    try {
                        addressTag = document.querySelector(
                            '#product-other-detail > div:nth-child(2) > div.right').innerText
                    } catch (e) {
                        console.log(e)
                    }

                    return addressTag
                }, bdsInfo);

                if (address) {
                    if (Object.values(bdsInfo).indexOf(address) > -1) {
                        console.log('has ' + address);
                    } else {
                        bdsInfo[`address_${number}`] = address
                        number = number + 1;
                    }
                }
                fs.writeFileSync('data/address.json', `${JSON.stringify(bdsInfo)}\r\n`, {flag: 'w'});
                console.log(bdsInfo)
            } catch (e) {
                console.log(e)
            }
        }

    }
}

(async () => {

    console.log('mana')
    await getInfo(
        'https://batdongsan.com.vn/ban-can-ho-chung-cu-duong-nguyen-huu-tho-phuong-tan-hung-14-prj-sunrise-city/covid-19-lan-2-gia-view-xuong-cham-day-thich-p-de-dau-tu-va-o-0777777284-pr26224152')
    // await getInfo('https://batdongsan.com.vn/ban-nha-rieng-duong-phan-van-hon-xa-ba-diem/sieu-pho-1-0-2-noi-that-dang-cap-ngay-cho-hoc-mon-pr26224565');
})()