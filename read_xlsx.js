const XLSX = require('xlsx');
const puppeteer = require('puppeteer')
const fs = require('fs')

const ROOT_DIR = "/content/drive/Shared drives/UNLIMITED/dataset/address"


async function getInfo() {
    // fs.mkdirSync("data", {recursive: true})
    const workbook = XLSX.readFile('links_bds.xlsx');
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const range = XLSX.utils.decode_range(sheet['!ref']);
    const browser = await puppeteer.launch({headless: true})
    const page = await browser.newPage()

    let number = 0;
    let rowNum = 0
    try{
        const content = fs.readFileSync(`${ROOT_DIR}/log.json`, 'utf8');
        const logInfo = JSON.parse(content)
        number = logInfo['addressID']
        rowNum = logInfo['rowNum']
        console.log(rowNum + " " + number)
    }catch (e) {}
    let bdsInfo = {}
    try{
        const content = fs.readFileSync(`${ROOT_DIR}/address.json`, 'utf8');
        bdsInfo = JSON.parse(content)
    }catch (e) {}

    for (rowNum; rowNum <= range.e.r; rowNum++) {
        // Example: Get second cell in each row, i.e. Column "B"
        const secondCell = sheet[XLSX.utils.encode_cell({r: rowNum, c: 0})];
        console.log(secondCell['v'])

        try {
            await page.goto(secondCell['v'])
            const address = await page.evaluate(() => {
                let addressTag = null

                try {
                    addressTag = document.querySelector(
                        '#product-other-detail > div:nth-child(2) > div.right').innerText
                } catch (e) {
                    console.log(e)
                }

                return addressTag
            });

            if (address) {
                if (Object.values(bdsInfo).indexOf(address) > -1) {
                    console.log('existed ' + address);
                } else {
                    console.log('added ' + address);
                    bdsInfo[`address_${number}`] = address
                    number = number + 1;
                }
            }
            fs.writeFileSync(`${ROOT_DIR}/address.json`, `${JSON.stringify(bdsInfo)}\r\n`, {flag: 'w'});
            fs.writeFileSync(`${ROOT_DIR}/log.json`, `{"addressID": ${number}, "rowNum": ${rowNum}}`, {flag: 'w'});
            // console.log(bdsInfo)
        } catch (e) {
            console.log(e)
        }
    }

}

(async () => {
    await getInfo()
    // await getInfo('https://batdongsan.com.vn/ban-nha-rieng-duong-phan-van-hon-xa-ba-diem/sieu-pho-1-0-2-noi-that-dang-cap-ngay-cho-hoc-mon-pr26224565');
})()