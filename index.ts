import * as googleScraper from "google-play-scraper";
import * as appleScraper from "app-store-scraper";
import * as converter from "json-2-csv";
import * as fs from "fs";
import { AppStore, GoogleApp, AppleApp, CombinedApp } from "./interfaces";
import { stringify } from "querystring";

/**
 * This script scrapes both the Google Play Store and Apple App Store using given search-terms
 * and then exports the data to a .csv-file
 * 
 * For this, facundoolano's "google-play-scraper" and "app-store-scraper" are used.
 * For the latter, JonasKuske's patch for the app-store-scraper is used.
 * 
 * The script auto-generates a filter for apps that are within both app-stores, based on equal app-titles
 * 
 * App total, apps per app-store, number of duplicates per store and number of remaining apps are logged
 * 
 * By now, the search-terms are hard-coded; this is to be replaced by CLI-input
 * 
 * Marco Aigner
 */

// FIXME: Somehow, each run returns a different amount of apps
// Check, if the cause is within the script
// => Only the number of returned Google-Apps differs, apple apps stay the same


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

// Scrape a given app-store for a given search-term
// Return a Promise containing either a GoogleApp or an AppleApp
async function scrape(appStore: AppStore, searchTerm: string): Promise<Object> {
  let apps: Array<GoogleApp> | Array<AppleApp> = await appStore.scraper.search({
    term: searchTerm,
    num: 250,
  });

  apps.forEach((app) => (app.searchTerm = searchTerm)); // append the used search-term as attribute

  //console.log(`Number of apps found searching the ${appStore.title} for ${searchTerm}: ${apps.length}`);

  return apps;
}

// Writes a given iterable to a .csv-file with a given file-name
async function saveToCsv(iterable: Array<Object>, fileName: string) {
  const csvData = await converter.json2csvAsync(iterable, {
    emptyFieldValue: "",
  });

  if (!fs.existsSync('./scrapedData')) fs.mkdirSync('./scrapedData');

  await fs.promises.writeFile(`scrapedData/${fileName}.csv`, csvData);
  console.log(`Wrote ${iterable.length} apps to ./scrapedData/${fileName}.csv`);
}

// Google-App have the attribute "summary", whereas in Apple-Apps it's called "description"
function isGoogleApp(app: GoogleApp | AppleApp): app is GoogleApp {
  return Object.prototype.hasOwnProperty.call(app, "summary");
}

// Anonymous function that wraps async logic around top-level code
(async () => {

  console.log('Scraping the Google Play-Store and Apple App-Store for all given search-terms...\n');

  // 1. Return one array per app-store
  const playStoreArray: Array<GoogleApp> = (
    (await Promise.all(
      searchTerms.map((searchTerm) => scrape(googlePlayStore, searchTerm))
    )) as Array<GoogleApp>
  ).flat();

  const appStoreArray: Array<AppleApp> = (
    (await Promise.all(
      searchTerms.map((searchTerm) => scrape(appleAppStore, searchTerm))
    )) as Array<AppleApp>
  ).flat();

  console.log(`Found apps in total: ${playStoreArray.length + appStoreArray.length}\nGoogle Play Store: ${playStoreArray.length} apps\nApple App Store: ${appStoreArray.length} apps\n`)

    
  // 2. Eliminate duplicates

  const filteredGoogleApps = new Map<string, CombinedApp>();
  const filteredAppleApps = new Map<string, CombinedApp>();

  for (const app of [...playStoreArray]) {
    if (!filteredGoogleApps.has(app.title)) filteredGoogleApps.set(app.title, new CombinedApp())

    const existingApp = filteredGoogleApps.get(app.title)
    existingApp?.addGoogleAppData(app)
  }

  for (const app of [...appStoreArray]) {
    if (!filteredAppleApps.has(app.title)) filteredAppleApps.set(app.title, new CombinedApp())

    const existingApp = filteredAppleApps.get(app.title)
    existingApp?.addAppleAppData(app)
  }

  console.log(`Removed ${playStoreArray.length - filteredGoogleApps.size} duplicates from Google Play Store: ${filteredGoogleApps.size} apps remaining`)
  console.log(`Removed ${appStoreArray.length - filteredAppleApps.size} duplicates from Apple App Store: ${filteredAppleApps.size} apps remaining\n`)
  
  // 3. Add apps from both app stores together
  
  const apps = new Map<string, CombinedApp>();

  for (const app of [...playStoreArray, ...appStoreArray]) {
    // TODO: title immer identisch, auch id als identifier??
    if (!apps.has(app.title)) apps.set(app.title, new CombinedApp());

    const exisitingApp = apps.get(app.title)!;

    if (isGoogleApp(app)) exisitingApp.addGoogleAppData(app);
    else exisitingApp.addAppleAppData(app);
  }

  const appsAsArray = [...apps.values()].map(app => ({ ...app, bothAppStores: Boolean(app.titleApple && app.titleGoogle) }))

  // 4. Save the apps to a .csv-file
  saveToCsv(appsAsArray, "Scraped Apps");
})();
