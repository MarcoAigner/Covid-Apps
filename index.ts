//const googleScraper = require ("google-play-scraper");
//const appleScraper = require("app-store-scraper");
//const converter = require("json-2-csv");
//const fs = require("fs");

import * as googleScraper from "google-play-scraper";
import * as appleScraper from "app-store-scraper";
import * as converter from "json-2-csv";
import * as fs from "fs";
import * as prompt from "prompt-sync";
import {AppStore, GoogleApp, AppleApp, CombinedApp} from "./interfaces";



// Apps stores are represented with an app-store-title and an array of apps, found for given search-terms
let googlePlayStore: AppStore = {
  title: 'Google Play Store',
  short: 'google',
  scraper: googleScraper,
  apps: []
}

let appleAppStore: AppStore = {
  title: 'Apple App Store',
  short: 'apple',
  scraper: appleScraper,
  apps: []
}

// TODO: Prompt-Sync doesn't work anymore with Typescript => Either hardcode or workaround

//Prompt for search-strings and get rid of eventual (trailing) commas and spaces
//const searchTerms: Array<string> = prompt(
//  "👋Hi! Please enter the terms that you want to scrape for, separated by commas:"
//)
//  .split(/\s*,\s*/)
//  .filter((searchTerm) => searchTerm !== "");
//console.log(`Input: ${searchTerms}`);

//const searchTerms: Array<string> = ['Corona', 'Contact tracing'];
const searchTerms: Array<string> = ['Corona', 'Corona App', 'Corona Warning App', 'Covid-19', 'Covid-19 App', 'Covid-19 App english', 'Contact data', 'Contact details', 'Contact tracing', 'Center for Disease control', 'SARS-CoV-2' ];

async function scrape (appStore: AppStore, searchTerm: string): Promise<Object> {
  let apps = await appStore.scraper.search({
    term: searchTerm,
    num: 250
  })

  apps.forEach(app => app.searchTerm = searchTerm);

  console.log(`Array length for searchTerm ${searchTerm} searching the ${appStore.title}: ${apps.length}`);

  return apps;
}

async function saveToCsv (iterable: Array<Object>, fileName: string) {
  const csvData = await converter.json2csvAsync(iterable, {emptyFieldValue: ''});

  fs.writeFile(`scrapedData/${fileName}.csv`, csvData, (err) => {
    if (err) throw err;
    console.log(`✍🏽 wrote data to ./scrapedData/${fileName}.csv`);
  } );
}

async function saveToJson (iterable: Array<Object>, fileName: string) {
  const jsonData = JSON.stringify(iterable);
  fs.writeFile(`scrapedData/${fileName}.json`, jsonData, (err) => {
    if (err) throw err;
    console.log(`✍🏽 wrote data to ./scrapedData/${fileName}.json`);
  } );

}

// https://developer.mozilla.org/de/docs/Web/JavaScript/Reference/Global_Objects/Array/flat
function flattenRecursively(array): Array<Object> {
  return array.reduce((acc, val) => Array.isArray(val) ? acc.concat(flattenRecursively(val)) : acc.concat(val), []);
}

// Anonymous function that wraps async logic around top-level code
(async () => {
  const googleApps = await Promise.all(searchTerms.map(searchTerm => scrape(googlePlayStore, searchTerm)));
  const appleApps = await Promise.all(searchTerms.map(searchTerm => scrape(appleAppStore, searchTerm)));

  //saveToCsv(googleApps, 'GoogleApps');
  //saveToCsv(appleApps, 'Apple Apps');

  

  //let allApps = [].concat.apply([], [googleApps, appleApps]);
  const allApps = flattenRecursively([googleApps, appleApps]);

  //  return arr1.reduce((acc, val) => Array.isArray(val) ? acc.concat(flattenDeep(val)) : acc.concat(val), []);

  //saveToJson(allApps, 'Google Apps NEW');

  //console.log(JSON.stringify(googleApps, null, 2));

  saveToCsv(allApps, 'Apps');

  
})()