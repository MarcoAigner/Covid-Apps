import * as googleScraper from "google-play-scraper";
import * as appleScraper from "app-store-scraper"

export class CombinedApp {
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
    if (this.titleGoogle) this.searchTermsGoogle?.push(googleApp.searchTerm); // Result is already saved => Only add search-term under which the app was found
    else { // Create a new result-entry for a Google-App
      this.titleGoogle = googleApp.title;
      this.appIdGoogle = googleApp.appId;
      this.developerGoogle = googleApp.developer;
      this.urlGoogle = googleApp.url;
      this.searchTermsGoogle = [googleApp.searchTerm];
    }
  }

  addAppleAppData(appleApp: AppleApp) {
    if (this.titleApple) this.searchTermsApple?.push(appleApp.searchTerm); // Result is already saved => Only add search-term under which the app was found
    else { // Create a new result-entry for an Apple-App
      this.titleApple = appleApp.title;
      this.appIdApple = appleApp.appId;
      this.developerApple = appleApp.developer;
      this.urlApple = appleApp.url;
      this.searchTermsApple = [appleApp.searchTerm];
    }
  }
}

export interface AppStore {
  title: string,
  short: string,
  scraper: typeof googleScraper | typeof appleScraper,
}

export class App {

}

export class GoogleApp extends App {
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
  searchTerm: string;
}

export class AppleApp extends App  {
  id: number;
  appId: string;
  title: string;
  url: string;
  description: string;
  icon: string;
  genres: Array<string>;
  genreIds: Array<string>;
  primaryGenre: string;
  primaryGenreId: number;
  contentRating: string;
  languages: Array<string>;
  size: string;
  requiredOsVersion: string;
  released: string;
  updated: string;
  releaseNotes: string;
  version: string;
  price: number;
  currency: string;
  free: boolean;
  developerId: number;
  developer: string;
  developerUrl: string;
  developerWebsite: string;
  score: number;
  reviews: number;
  currentVersionScore: number;
  currentVersionReviews: number;
  screenshots: Array<string>;
  ipadScreenshots: Array<string>;
  appletvScreenshots: Array<string>;
  supportedDevices: Array<string>;
  searchTerm: string
}

