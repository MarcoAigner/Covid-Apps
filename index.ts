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
  let apps: AppleApp[] | GoogleApp[] = await appStore.scraper.search({
    term: searchTerm,
    num: 250
  })

  apps.forEach(app => app.searchTerm = [searchTerm]);

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
// TODO: Union Parameter mit Google- und Apple-Apps und folgendem Type-Checking per If-Statement einfügen
function flattenRecursively<AppType>(array): Array<AppType> {
  return array.reduce((acc, val) => Array.isArray(val) ? acc.concat(flattenRecursively(val)) : acc.concat(val), []);
}

function isGoogleApp(app: unknown): app is GoogleApp {
  return Object.prototype.hasOwnProperty.call(app, 'summary');
}

function assertGoogleApp (apps: Array<any>) {
  apps.forEach(app => {
    const googleApp = app as GoogleApp;
  })
}

function transformGoogleApps (apps: Array<Object>) {
  let googleApps: Array<GoogleApp> = [];
  apps.forEach(app => {
    if (isGoogleApp (app)) googleApps.push(app);
  })
  return googleApps;
}

// function transformToCombinedApp(app: GoogleApp | AppleApp): CombinedApp {
//   if (isGoogleApp(app)) {
//     return {
//       titleGoogle: app.title,
//       appIdGoogle: app.appId,
//       developerGoogle: app.developer,
//       urlGoogle: app.url,
//       searchTermsGoogle: app.searchTerm ? [app.searchTerm] : []
//     }
//   }
//   else {
// return {
//   titleApple: app.title,
//   appIdApple: app.appId,
//   developerApple: app.developer,
//   urlApple: app.url,
//   searchTermsApple: app.searchTerm,
// }
//   }
// }

// Anonymous function that wraps async logic around top-level code
(async () => {
  const googleApps: Array<GoogleApp> = (await Promise.all(searchTerms.map(searchTerm => scrape(googlePlayStore, searchTerm))) as Array<GoogleApp>).flat()
  const googleAppsByTitle: { [title: string]: GoogleApp } = {}

  for (const googleApp of googleApps) {
    if (googleAppsByTitle[googleApp.title]) {
      googleAppsByTitle[googleApp.title].searchTerm.push(googleApp.searchTerm[0])
    } else {
      googleAppsByTitle[googleApp.title] = googleApp
    }
  }



  const appleApps: Array<AppleApp> = (await Promise.all(searchTerms.map(searchTerm => scrape(appleAppStore, searchTerm))) as Array<AppleApp>).flat()
  const appleAppsByTitle: { [title: string]: AppleApp } = {}

  for (const appleApp of appleApps) {
    if (appleAppsByTitle[appleApp.title]) {
      appleAppsByTitle[appleApp.title].searchTerm.push(appleApp.searchTerm[0])
    } else {
      appleAppsByTitle[appleApp.title] = appleApp
    }
  }

  const combinedApps: { [title: string]: CombinedApp }  = {}

// TODO: title immer identisch, auch id als identifier??

  for (const googleApp of googleApps) {
    combinedApps[googleApp.title] = {
      titleGoogle: googleApp.title,
      titleApple: null,
      appIdGoogle: googleApp.appId,
      appIdApple: null,
      developerGoogle: googleApp.developer,
      developerApple: null,
      urlGoogle: googleApp.url,
      urlApple: null,
      searchTermsGoogle: googleApp.searchTerm,
      searchTermsApple: null,
      covidRelation: null,
      bothAppsStores: false,
    }
  }

  for (const appleApp of appleApps) {
    if (combinedApps[appleApp.title]) {
      const existingGoogleAppEntry = combinedApps[appleApp.title]

      existingGoogleAppEntry.bothAppsStores = true
      existingGoogleAppEntry.titleApple = appleApp.title
      existingGoogleAppEntry.appIdApple = appleApp.appId
      existingGoogleAppEntry.developerApple = appleApp.developer
      existingGoogleAppEntry.urlApple = appleApp.url
      existingGoogleAppEntry.searchTermsApple = appleApp.searchTerm
    } else {
      combinedApps[appleApp.title] = {
        titleGoogle: null,
        titleApple: appleApp.title,
        appIdGoogle: null,
        appIdApple: appleApp.appId,
        developerGoogle: null,
        developerApple: appleApp.developer,
        urlGoogle: null,
        urlApple: appleApp.url,
        searchTermsGoogle: null,
        searchTermsApple: appleApp.searchTerm,
        covidRelation: null,
        bothAppsStores: false,
      }
    }
  }


  // const allApps: Array<CombinedApp> = [...googleApps, ...appleApps].map(transformToCombinedApp)


  //saveToCsv(googleApps, 'GoogleApps');
  //saveToCsv(appleApps, 'Apple Apps');

  // googleApps = flattenRecursively<GoogleApp>(googleApps);
  // googleApps = transformGoogleApps(googleApps);

  //let allApps = [].concat.apply([], [googleApps, appleApps]);
  // const allApps: Array<AppleApp | GoogleApp> = flattenRecursively([googleApps, appleApps]);

  //  return arr1.reduce((acc, val) => Array.isArray(val) ? acc.concat(flattenDeep(val)) : acc.concat(val), []);

  //saveToJson(allApps, 'Google Apps NEW');

  //console.log(JSON.stringify(googleApps, null, 2));

  // console.log(isGoogleApp(googleApps[0]));

  saveToCsv(Object.values(combinedApps), 'Apps');

  
})()