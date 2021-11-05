const googleScraper = require("google-play-scraper");
const appleScraper = require("app-store-scraper");
const converter = require("json-2-csv");
const fs = require("fs");
const search = require("app-store-scraper/lib/search");
const prompt = require("prompt-sync")({ sigint: true });

// Apps stores are represented with an app-store-title and an array of apps, found for given search-terms
let googlePlayStore = {
  appStoreTitle: "Google Play Store",
  short: "google",
  scraper: googleScraper,
  apps: [],
};

let appleAppStore = {
  appStoreTitle: "Apple App Store",
  short: "apple",
  scraper: appleScraper,
  apps: [],
};

let apps = [];

// Requires an app-store, then scrapes set store usingn the input search-terms
// Finally writes the apps found to a .csv-file
async function scrapeStore(appStore) {
  console.log(`🧐 Beginning to scrape the US-american ${appStore.appStoreTitle}`);

  for (const searchTerm of searchTerms) {
    const foundApps = await appStore.scraper.search({
      term: searchTerm,
      num: 250,
    });

    console.log(
      `Found ${foundApps.length} apps looking for "${searchTerm}" in ${appStore.appStoreTitle}`
    );

    // TODO: Get rid of unnecessary attributes

    // Push apps that have not already been found into the appStore's array
    foundApps.forEach((foundApp) => {
      // App has already been saved (for example using another search-term)
      const matchingApp = appStore.apps.find((app) => app.title.match(foundApp.title));

      if (matchingApp) {
        // Add the current search-term to the app, if it isn't already saved within
        if (!matchingApp.searchTerms.includes(searchTerm)) matchingApp.searchTerms.push(searchTerm);
      } else {
        let newEntry = {
          title: foundApp.title,
          developer: foundApp.developer,
          appId: foundApp.appId,
          url: foundApp.url,
          searchTerms: [searchTerm],
          store: appStore.short,
        };
        appStore.apps.push(newEntry);
      }
    });
  }

  console.log(appStore.apps);

  // Convert and export the array of scraped apps to a .csv-file
  converter.json2csv(appStore.apps, (err, csv) => {
    if (err) throw err;
    fs.writeFile(
      `./scrapedData/${appStore.appStoreTitle}.csv`,
      csv,
      (err, bytesWritten, buffer) => {
        console.log(
          `✍️ Saved ${appStore.apps.length} apps found in ${appStore.appStoreTitle} to ./scrapedData/${appStore.appStoreTitle}.csv`
        );
      }
    );
  });
}


// TODO: Aggregate Google and Apple data

// Prompt for search-strings and get rid of eventual (trailing) commas and spaces
//const searchTerms = prompt(
//  "👋Hi! Please enter the terms that you want to scrape for, separated by commas:"
//)
//  .split(/\s*,\s*/)
//  .filter((searchTerm) => searchTerm !== "");
//console.log(`Input: ${searchTerms}`);

//const searchTerms = ['Corona', 'Contact tracing'];
const searchTerms = ['Corona', 'Corona App', 'Corona Warning App', 'Covid-19', 'Covid-19 App', 'Covid-19 App english', 'Contact data', 'Contact details', 'Contact tracing', 'Center for Disease control', 'SARS-CoV-2' ];

async function scrape (appStore, searchTerm) {
  let apps = await appStore.scraper.search({
    term: searchTerm,
    num: 250
  })

  apps.forEach(app => app.searchTerm = searchTerm);

  console.log(`Array length for searchTerm ${searchTerm} searching the ${appStore.appStoreTitle}: ${apps.length}`);

  return apps;
}

async function saveToCsv (iterable, fileName) {
  const csvData = await converter.json2csvAsync(iterable, {emptyFieldValue: ''});

  fs.writeFile(`scrapedData/${fileName}.csv`, csvData, (err) => {
    if (err) throw err;
    console.log(`✍🏽 wrote data to ./scrapedData/${fileName}.csv`);
  } );
}

async function saveToJson (iterable, fileName) {
  const jsonData = JSON.stringify(iterable);
  fs.writeFile(`scrapedData/${fileName}.json`, jsonData, (err) => {
    if (err) throw err;
    console.log(`✍🏽 wrote data to ./scrapedData/${fileName}.json`);
  } );

}

//scrape(googlePlayStore, 'Contact tracing');


(async () => {
  const googleApps = await Promise.all(searchTerms.map(searchTerm => scrape(googlePlayStore, searchTerm)));
  const appleApps = await Promise.all(searchTerms.map(searchTerm => scrape(appleAppStore, searchTerm)));

  //saveToCsv(googleApps, 'GoogleApps');
  //saveToCsv(appleApps, 'Apple Apps');

  //saveToJson(googleApps, 'Google Apps');

  let allApps = [].concat.apply([], [googleApps, appleApps]);
  allApps = allApps.flat();

  //console.log(JSON.stringify(googleApps, null, 2));

  saveToCsv(allApps, 'Apps');

  
})()

//scrapeStore(googlePlayStore);
//scrapeStore(appleAppStore);
