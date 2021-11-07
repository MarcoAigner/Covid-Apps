import * as googleScraper from "google-play-scraper";
import * as appleScraper from "app-store-scraper"

export interface AppStore extends Object {
  title: string,
  short: string,
  scraper: typeof googleScraper | typeof appleScraper,
  apps: Array<Object>
}

// TODO: Implement top-level interface for Google and Apple App
// Danach sollten Google- und Apple-Apps mithilfe des Union-Operators Funktionen übergeben werden können

export interface App extends Object {
  
}

export interface GoogleApp extends App {
  title: string,
  appId: string,
  url: string,
  icon: string,
  developer: string,
  developerId: string,
  priceText: string,
  currency: string,
  price: number,
  free: boolean,
  summary: string,
  scoreText: string,
  score: number,
  searchTerm: Array<string>
}

export interface AppleApp extends App {
  id: number,
  appId: string,
  title: string,
  url: string,
  description: string,
  icon: string,
  genres: Array<string>,
  genreIds: Array<string>,
  primaryGenre: string,
  primaryGenreId: number,
  contentRating: string,
  languages: Array<string>,
  size: string,
  requiredOsVersion: string,
  released: string,
  updated: string,
  releaseNotes: string,
  version: string,
  price: number,
  currency: string,
  free: boolean,
  developerId: number,
  developer: string,
  developerUrl: string,
  developerWebsite: string,
  score: number,
  reviews: number,
  currentVersionScore: number,
  currentVersionReviews: number,
  screenshots: Array<string>,
  ipadScreenshots: Array<string>,
  appletvScreenshots: Array<string>,
  supportedDevices: Array<string>,
  searchTerm: Array<string>
}

/*export class GoogleApp {
  title: string;
  appId: string;
  url: string;
  icon: string;
  developer: string;
  developerId: string;
  priceText: string;
  currency: string;
  price: number;
  free: boolean;
  summary: string;
  scoreText: string;
  score: number;
  searchTerm?: string;

  constructor(title: string,
    appId: string,
    url: string,
    icon: string,
    developer: string,
    developerId: string,
    priceText: string,
    currency: string,
    price: number,
    free: boolean,
    summary: string,
    scoreText: string,
    score: number,
    searchTerm?: string) {
    this.title = title;
    this.appId = appId;
    this.url = url;
    this.icon = icon;
    this.developer = developer;
    this.developerId = developerId;
    this.priceText = priceText;
    this.currency = currency;
    this.price = price;
    this.free = free;
    this.summary = summary;
    this.scoreText = scoreText;
    this.score = score;
    this.searchTerm = searchTerm;

  }
}*/

export interface CombinedApp extends Object {
  titleGoogle: string | null,
  titleApple: string | null,
  appIdGoogle: string | null,
  appIdApple: string | null,
  developerGoogle: string | null,
  developerApple: string | null,
  urlGoogle: string | null,
  urlApple: string | null,
  searchTermsGoogle: Array<string> | null,
  searchTermsApple: Array<string> | null,
  covidRelation: boolean | null | null,
  bothAppsStores: boolean | null,
}


// export class CombinedApp {
//   titleGoogle: string | null
//   titleApple: string | null
//   appIdGoogle: string | null
//   appIdApple: string | null
//   developerGoogle: string | null
//   developerApple: string | null
//   urlGoogle: string | null
//   urlApple: string | null
//   searchTermsGoogle: Array<string> | null
//   searchTermsApple: Array<string> | null
//   covidRelation: boolean | null | null

//   get bothAppsStores() {
//     return this.titleApple && this.titleApple
//   }

//   addGoogleAppData(googleApp: GoogleApp) {
//     // this....
//   }

//   addAppleAppData(appleApp: AppleApp) {

//   }


// }

