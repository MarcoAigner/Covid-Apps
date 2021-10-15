const googleScraper = require('google-play-scraper');
const appleScraper = require('app-store-scraper');
const converter = require('json-2-csv');
const fs = require('fs');

const searchTerms = ['Corona', 'Corona App', 'Corona Warning App', 'Covid-19', 'Covid-19 App', 'Covid-19 App english', 'Contact data', 'Contact details', 'Contact tracing', 'Center for Disease control', 'SARS-CoV-2' ];

let counter = 0;

searchTerms.forEach(searchTerm => {
  counter++;
  googleScraper.search({
    term: searchTerm,
    num: 250
  }).then(searchTermResult => {
    searchTermResult.forEach(element => {
      element.searchTerm = searchTerm;
    })
    converter.json2csv(searchTermResult, (err, csv) => {
      if (err) {
        throw err;
      }
      
      let fileName = 'google_' +searchTerm.toLowerCase().replaceAll(' ', '_');

      //export results to csv
      fs.writeFileSync(`./scrapedData/${fileName}.csv`, csv);

      console.log(`Exported scraped apps for search term ${searchTerm} to ${fileName}.csv`);
    })
  }, (error) => console.log(error));
})


