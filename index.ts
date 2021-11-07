import * as googleScraper from "google-play-scraper";
import * as appleScraper from "app-store-scraper";
import * as converter from "json-2-csv";
import * as fs from "fs";
import { AppStore, GoogleApp, AppleApp } from "./interfaces";
import * as prompt from "prompt-sync";

// FIXME: Somehow, each run returns a different amount of apps
// Check, if the cause is within the script

class CombinedApp {
  titleGoogle?: string = undefined;
  titleApple?: string = undefined;
  urlGoogle?: string = undefined;
  urlApple?: string = undefined;
  enUs?: boolean = undefined;
  covidRelation?: boolean = undefined;
  additionalProductsRequired?: boolean = undefined;
  regional?: boolean = undefined;
  state?: boolean = undefined;
  pilot?: boolean = undefined;
  organisational?: boolean = undefined;
  limitedLiability?: boolean = undefined;
  comment?: string = undefined;
  appIdGoogle?: string = undefined;
  appIdApple?: string = undefined;
  developerGoogle?: string = undefined;
  developerApple?: string = undefined;
  searchTermsGoogle?: Array<string> = undefined;
  searchTermsApple?: Array<string> = undefined;

  addGoogleAppData(googleApp: GoogleApp) {
    if (this.titleGoogle) this.searchTermsGoogle?.push(googleApp.searchTerm);
    else {
      this.titleGoogle = googleApp.title;
      this.appIdGoogle = googleApp.appId;
      this.developerGoogle = googleApp.developer;
      this.urlGoogle = googleApp.url;
      this.searchTermsGoogle = [googleApp.searchTerm];
    }
  }

  addAppleAppData(appleApp: AppleApp) {
    if (this.titleApple) this.searchTermsApple?.push(appleApp.searchTerm);
    else {
      this.titleApple = appleApp.title;
      this.appIdApple = appleApp.appId;
      this.developerApple = appleApp.developer;
      this.urlApple = appleApp.url;
      this.searchTermsApple = [appleApp.searchTerm];
    }
  }
}

// Apps stores are represented with an app-store-title and an array of apps, found for given search-terms
let googlePlayStore: AppStore = {
  title: "Google Play Store",
  short: "google",
  scraper: googleScraper
};

let appleAppStore: AppStore = {
  title: "Apple App Store",
  short: "apple",
  scraper: appleScraper
};

// TODO: Implement CLI-based User-Interface

//Prompt for search-strings and get rid of eventual (trailing) commas and spaces
//const searchTerms: Array<string> = prompt(
//  "👋Hi! Please enter the terms that you want to scrape for, separated by commas:"
//)
//  .split(/\s*,\s*/)
//  .filter((searchTerm) => searchTerm !== "");
//console.log(`Input: ${searchTerms}`);

// As long as no user input is possible, searchTerms remain hardcoded
const searchTerms: Array<string> = [
  "Corona",
  "Corona App",
  "Corona Warning App",
  "Covid-19",
  "Covid-19 App",
  "Covid-19 App english",
  "Contact data",
  "Contact details",
  "Contact tracing",
  "Center for Disease control",
  "SARS-CoV-2",
];

// Scrapes a given app-store for a given search-term
// Returns a Promise containing either a GoogleApp or an AppleApp
async function scrape(appStore: AppStore, searchTerm: string): Promise<Object> {
  let apps: Array<GoogleApp> | Array<AppleApp> = await appStore.scraper.search({
    term: searchTerm,
    num: 250,
  });

  apps.forEach((app) => (app.searchTerm = searchTerm)); // append the used search-term as attribute

  console.log(`Number of apps found searching the ${appStore.title} for ${searchTerm}: ${apps.length}`);

  return apps;
}

// Writes a given iterable to a .csv-file with a given file-name
async function saveToCsv(iterable: Array<Object>, fileName: string) {
  const csvData = await converter.json2csvAsync(iterable, {
    emptyFieldValue: "",
  });

  if(!fs.existsSync('./scrapedData')) fs.mkdirSync('./scrapedData');

  await fs.promises.writeFile(`scrapedData/${fileName}.csv`, csvData);
  console.log(`\n✍🏽 Wrote ${iterable.length} apps to ./scrapedData/${fileName}.csv`);
}

// Google-App have the attribute "summary", whereas in Apple-Apps it's called "description"
function isGoogleApp(app: GoogleApp | AppleApp): app is GoogleApp {
  return Object.prototype.hasOwnProperty.call(app, "summary");
}

// Anonymous function that wraps async logic around top-level code
(async () => {

  console.log('🧐 Beginning to scrape the Google Play-Store and Apple App-Store\n');

  const googleApps: Array<GoogleApp> = (
    (await Promise.all(
      searchTerms.map((searchTerm) => scrape(googlePlayStore, searchTerm))
    )) as Array<GoogleApp>
  ).flat();

  const appleApps: Array<AppleApp> = (
    (await Promise.all(
      searchTerms.map((searchTerm) => scrape(appleAppStore, searchTerm))
    )) as Array<AppleApp>
  ).flat();

  // Combine both Google- and Apple-Apps in here
  const apps = new Map<string, CombinedApp>();

  for (const app of [...googleApps, ...appleApps]) {
    // TODO: title immer identisch, auch id als identifier??
    if (!apps.has(app.title)) apps.set(app.title, new CombinedApp());

    const exisitingApp = apps.get(app.title)!;

    if (isGoogleApp(app)) exisitingApp.addGoogleAppData(app);
    else exisitingApp.addAppleAppData(app);
  }

  const appsAsArray = [...apps.values()].map(app => ({ ...app, bothAppStores: Boolean(app.titleApple && app.titleGoogle) }))

  saveToCsv(appsAsArray, "Scraped Apps");
})();
