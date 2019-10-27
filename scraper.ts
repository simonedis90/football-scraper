import * as puppeteer from "puppeteer"
import * as request from 'request'
import * as DomParser from 'dom-parser';

export class Scraper {

    browser;
    page;
    constructor(){

    }

    init(page): Promise<boolean>{
        return new Promise((resolve) => {
            puppeteer.launch({}).then(browser => {
                this.browser = browser;
                this.browser.newPage().then(page => {
                    this.page = page;

                    page.goto('http://www.diretta.it', {waitUntil: 'networkidle2'}).then(re => {
                        resolve(true);
                    });
                })
            })
        })

    }

    evaluate(page): Promise<Array<any>>{
        return new Promise((resolve) => {
            page.evaluate().then( eva => {

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

    async scrap(){
            console.log(new Date(), "start")
            const browser = await puppeteer.launch({});
            console.log(new Date(), "launched")
            const page = await browser.newPage();
            console.log(new Date(), "new page")
            await page.goto('https://www.diretta.it', {waitUntil: 'networkidle2'});
            console.log(new Date(), "goto")

            const results = [] ;

            console.log(new Date(), "evalute1")

            const text = await page.evaluate( () => {

                let arr = [];
                document.querySelectorAll(".event__match").forEach( (match: any) => {
                    const home = match.querySelector(".event__participant--home").innerText;
                    const away = match.querySelector(".event__participant--away").innerText;
                    const results = match.querySelector(".event__scores").querySelectorAll('span');
                    arr.push(home + (results[0] ? ' ' + results[0].innerText : '') + " - "+ (results[1] ?  results[1].innerText + ' ' : '') + away);

                })
                return arr;
            })
        console.log(new Date(), "end evaluta")

        setInterval(()=>{
            page.evaluate()
            page.evaluate( () => {

                let arr = [];
                document.querySelectorAll(".event__match").forEach( (match: any) => {
                    const home = match.querySelector(".event__participant--home").innerText;
                    const away = match.querySelector(".event__participant--away").innerText;
                    const results = match.querySelector(".event__scores").querySelectorAll('span');
                    arr.push(home + (results[0] ? ' ' + results[0].innerText : '') + " - "+ (results[1] ?  results[1].innerText + ' ' : '') + away);

                })
                console.log(arr, new Date().getSeconds() );
            })

        }, 2000)

        console.log(text)
    }
}

new Scraper().init("https://www.diretta.it").then(re => {
    /*
    re.evaluate().then(res => {
        console.log(res);
    })

     */
});
