import * as puppeteer from "puppeteer"
import * as request from 'request'
import * as DomParser from 'dom-parser';


export class Scraper {

    browser;
    page;
    constructor(){

    }

    init(page): Promise<Scraper>{
        return new Promise((resolve) => {
            puppeteer.launch({}).then(browser => {
                this.browser = browser;
                this.browser.newPage().then(page => {
                    this.page = page;

                    page.goto('http://www.diretta.it', {waitUntil: 'networkidle2'}).then(re => {
                        resolve(this);
                    });
                })
            })
        })

    }

    evaluate(page): Promise<Array<any>>{
        return new Promise((resolve) => {
            page.evaluate( eva => {

                const arr = [];
                document.querySelectorAll(".event__match").forEach( (match: any) => {
                    const home = match.querySelector(".event__participant--home").innerText;
                    const away = match.querySelector(".event__participant--away").innerText;
                    const results = match.querySelector(".event__scores").querySelectorAll('span');
                    arr.push(home + (results[0] ? ' ' + results[0].innerText : '') + " - "+ (results[1] ?  results[1].innerText + ' ' : '') + away);
                })

                resolve(arr);
            })
        })

    }
    request(){

        const parser = new DomParser();
        request('http://www.diretta.it', function (error, response, body) {

        });
    }

    async scrap(fn: (arg)=> any){
        const browser = await puppeteer.launch({});
        const page = await browser.newPage();
        await page.goto('https://www.diretta.it', {waitUntil: 'networkidle2'});

        console.log("icasdf")
        let results = [] ;

        setInterval(async ()=>{

            const x = await page.evaluate( () => {
                console.log("icasdf")

                let arr = [];
                document.querySelectorAll(".event__match").forEach( (match: any) => {
                    const home = match.querySelector(".event__participant--home").innerText;
                    const away = match.querySelector(".event__participant--away").innerText;
                    const results = match.querySelector(".event__scores").querySelectorAll('span');

                    arr.push({
                        home: {
                            team: home,
                            score: results[0] ? ' ' + results[0].innerText : ''
                        },
                        away:{
                            team: away,
                            score: results[1] ? ' ' + results[1].innerText : ''                        }
                    })

                    console.log(arr);

                })
                return JSON.stringify(arr);
            })

            fn(JSON.parse(x))

        }, 1000)

    }
}

new Scraper().init("https://www.diretta.it").then(re => {
    re.scrap((results)=>{
        console.log(results, new Date());
    }).then();
});
