import * as puppeteer from "puppeteer"
import * as request from 'request'
import * as DomParser from 'dom-parser';


export class Scraper {
    constructor() {

    }

    init(): Promise<Scraper> {
        return new Promise((resolve) => {
            puppeteer.launch({}).then(browser => {
                resolve(this);
            })
        })

    }

    async scrap(fn: (arg) => any, pageUrl, interval?) {
        const browser = await puppeteer.launch({});
        const page = await browser.newPage();
        await page.goto(pageUrl, { waitUntil: 'networkidle2' });

        const fns = async () => {
            const x = await page.evaluate(() => {
                let arr = [];

                document.querySelectorAll(".event__match").forEach((match: any) => {

                    const home = match.querySelector(".event__participant--home").innerText;
                    const away = match.querySelector(".event__participant--away").innerText;
                    const results = match.querySelector(".event__scores").querySelectorAll('span');
                    arr.push({
                        home: {
                            team: home,
                            score: results[0] ? parseInt(results[0].innerText) : 0
                        },
                        away: {
                            team: away,
                            score: results[1] ? parseInt(results[1].innerText) : 0
                        }
                    })
                })
                return JSON.stringify(arr);
            })

            fn(JSON.parse(x))

        }
        if (interval) {
            setInterval(async () => {
                fns()
            }, 1000)
        } else {
            fns();
        }
    }
}

// new Scraper().init().then(re => {
//     re.scrap((results) => {
//         console.log(results, new Date());
//         process.abort();
//     }, "https://www.diretta.it").then();
// });
