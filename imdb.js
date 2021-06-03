const puppeteer = require("puppeteer");
const scrap = require("./scrap");
let id; //Input id
let pw; //Input password
async function login(){
  let browser = await puppeteer.launch({
    headless: false,
    defaultViewport: null,
    args: ["--start-maximized"],
  })

  // Homepage
  let pages = await browser.pages();
  let tab = pages[0];
  await tab.goto("https://www.imdb.com");
  await tab.waitForTimeout(1000);

  // Login
  await tab.waitForSelector(".ipc-button.ipc-button--single-padding.ipc-button--center-align-content.ipc-button--default-height.ipc-button--core-baseAlt.ipc-button--theme-baseAlt.ipc-button--on-textPrimary.ipc-text-button.imdb-header__signin-text");
  await tab.click(".ipc-button.ipc-button--single-padding.ipc-button--center-align-content.ipc-button--default-height.ipc-button--core-baseAlt.ipc-button--theme-baseAlt.ipc-button--on-textPrimary.ipc-text-button.imdb-header__signin-text");
  
  await tab.waitForSelector(".list-group-item");
  let login = await tab.$$(".list-group-item");
  let loglink = await tab.evaluate(function(elem){return elem.getAttribute("href")},login[0]);
  await tab.goto(loglink);
  
  await tab.type("#ap_email", id);
  await tab.type("#ap_password", pw);
  await tab.click("#signInSubmit");
  
  
  await tab.waitForSelector(".ipc-icon.ipc-icon--menu.ipc-button__icon.ipc-button__icon--pre");
  await tab.click(".ipc-icon.ipc-icon--menu.ipc-button__icon.ipc-button__icon--pre");

  // Data Function
  await scrapData(browser,tab);
  
  await tab.waitForTimeout(2000);
  // Watchlist Function
  await addToWatchList(browser,tab);

  // Go To Updated WatchList 
   await tab.waitForTimeout(200);
  await tab.waitForSelector(".NavWatchlistButton-sc-1b65w5j-0.kaVyhF.imdb-header__watchlist-button");
  await tab.click(".NavWatchlistButton-sc-1b65w5j-0.kaVyhF.imdb-header__watchlist-button");

}
login();


 async function scrapData(browser,tab){
  // Go to Best Picture Winners
  
  await tab.waitForSelector('.ipc-list__item.nav-link.nav-link--hideXS.nav-link--hideS.nav-link--hideM.NavLink-sc-19k0khm-0.dvLykY.ipc-list__item--indent-one',{visible : true});
  let allATags = await tab.$$('.ipc-list__item.nav-link.nav-link--hideXS.nav-link--hideS.nav-link--hideM.NavLink-sc-19k0khm-0.dvLykY.ipc-list__item--indent-one');
  await tab.waitForTimeout(2000);
  let link = await tab.evaluate(function(res){return res.getAttribute("href")},allATags[7]);
  await tab.goto(link);
  
  // Scrap Data
  await tab.waitForTimeout(6000);
  
  await scrap(link); 

 }

 async function addToWatchList(browser,tab){
  await tab.waitForSelector('.lister-top-right');
   let addButtons = await tab.$$(".lister-top-right");
  
  for(let i = 0; i<addButtons.length;i++){
    await tab.waitForSelector(".wl-ribbon.standalone.touch.retina.inWL");
     await tab.waitForTimeout(200);
    await tab.click(".wl-ribbon.standalone.touch.retina.inWL");
  
  }
   
 }
