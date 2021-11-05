import * as googleScraper from "google-play-scraper";
import * as appleScraper from "app-store-scraper"

export interface AppStore {
  title: string,
  short: string,
  scraper: typeof googleScraper | typeof appleScraper,
  apps: Array<Object>
}

export interface GoogleApp {
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
  searchTerm?: string
}

export interface AppleApp {
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
  searchTerm?: string
}

export interface CombinedApp {
  titleGoogle: string,
  titleApple: string,
  developerGoogle: string,
  developerApple: string,
  urlGoogle: string,
  urlApple: string,
  searchTermsGoogle: Array<string>,
  searchTermsApple: Array<string>,
  covidRelation?: boolean,
}