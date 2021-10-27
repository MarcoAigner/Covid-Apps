const googleScraper = require('google-play-scraper');
const appleScraper = require('app-store-scraper');
const converter = require('json-2-csv');
const fs = require('fs');
const prompt = require('prompt-sync')({sigint: true});

// Apps stores are represented with an app-store-title and an array of apps, found for given search-terms
let googlePlayStore = {
  appStoreTitle: 'Google Play Store',
  apps: []
}
  
let appleAppStore = {
  appStoreTitle: 'Apple App Store',
  apps: []
}

// Users input search terms at the beginning
const searchTerms = prompt('👋Hi! Please enter the terms that you want to scrape for, separated by commas:').split(',');

//const searchTerms = ['Corona', 'Corona App', 'Corona Warning App', 'Covid-19', 'Covid-19 App', 'Covid-19 App english', 'Contact data', 'Contact details', 'Contact tracing', 'Center for Disease control', 'SARS-CoV-2' ];

// Requires an app-store and a scraper, then scrapes set store usingn the input search-terms
// Finally writes the apps found to a .csv-file
async function scrapeStore(appStore, scraper) {
  console.log(`🧐 Beginning to scrape ${appStore.appStoreTitle}`);
  
  for(const searchTerm of searchTerms) {
    const foundApps = await scraper.search({
      term: searchTerm,
      num: 250
    })

    console.log(`😎 Found ${foundApps.length} apps looking for "${searchTerm}" in ${appStore.appStoreTitle}`);
    
    // TODO formatting: Deleting unnecessary colums etc.
    foundApps.forEach(foundApp => {
      foundApp.searchTerm = searchTerm;
      const matchingApp = appStore.apps.find(element => element.title === foundApp.title);
      if(matchingApp) matchingApp.searchTerm += `, ${foundApp.searchTerm}`;
      else appStore.apps.push(foundApp);
    });

  }

  // Convert and export the array of scraped apps to a .csv-file
  converter.json2csv(appStore.apps, (err, csv) => {
    if (err) throw err;
    fs.writeFile(`./scrapedData/${appStore.appStoreTitle}.csv`, csv, (err, bytesWritten, buffer) => {
      console.log(`✍️ Saved ${appStore.apps.length} apps found in ${appStore.appStoreTitle} to ./scrapedData/${appStore.appStoreTitle}.csv`)
    })
  })
}

scrapeStore(googlePlayStore, googleScraper);
scrapeStore(appleAppStore, appleScraper);