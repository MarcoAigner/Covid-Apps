"use strict";
//const googleScraper = require ("google-play-scraper");
//const appleScraper = require("app-store-scraper");
//const converter = require("json-2-csv");
//const fs = require("fs");
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var googleScraper = require("google-play-scraper");
var appleScraper = require("app-store-scraper");
var converter = require("json-2-csv");
var fs = require("fs");
var prompt = require("prompt-sync");
// Apps stores are represented with an app-store-title and an array of apps, found for given search-terms
var googlePlayStore = {
    title: 'Google Play Store',
    short: 'google',
    scraper: googleScraper,
    apps: []
};
var appleAppStore = {
    title: 'Apple App Store',
    short: 'apple',
    scraper: appleScraper,
    apps: []
};
//let apps : Array<Object>= [];
//Prompt for search-strings and get rid of eventual (trailing) commas and spaces
var searchTerms = prompt("👋Hi! Please enter the terms that you want to scrape for, separated by commas:")
    .split(/\s*,\s*/)
    .filter(function (searchTerm) { return searchTerm !== ""; });
console.log("Input: " + searchTerms);
//const searchTerms: Array<string> = ['Corona', 'Contact tracing'];
//const searchTerms: Array<string> = ['Corona', 'Corona App', 'Corona Warning App', 'Covid-19', 'Covid-19 App', 'Covid-19 App english', 'Contact data', 'Contact details', 'Contact tracing', 'Center for Disease control', 'SARS-CoV-2' ];
function scrape(appStore, searchTerm) {
    return __awaiter(this, void 0, void 0, function () {
        var apps;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, appStore.scraper.search({
                        term: searchTerm,
                        num: 250
                    })];
                case 1:
                    apps = _a.sent();
                    apps.forEach(function (app) { return app.searchTerm = searchTerm; });
                    console.log("Array length for searchTerm " + searchTerm + " searching the " + appStore.title + ": " + apps.length);
                    return [2 /*return*/, apps];
            }
        });
    });
}
function saveToCsv(iterable, fileName) {
    return __awaiter(this, void 0, void 0, function () {
        var csvData;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, converter.json2csvAsync(iterable, { emptyFieldValue: '' })];
                case 1:
                    csvData = _a.sent();
                    fs.writeFile("scrapedData/" + fileName + ".csv", csvData, function (err) {
                        if (err)
                            throw err;
                        console.log("\u270D\uD83C\uDFFD wrote data to ./scrapedData/" + fileName + ".csv");
                    });
                    return [2 /*return*/];
            }
        });
    });
}
function saveToJson(iterable, fileName) {
    return __awaiter(this, void 0, void 0, function () {
        var jsonData;
        return __generator(this, function (_a) {
            jsonData = JSON.stringify(iterable);
            fs.writeFile("scrapedData/" + fileName + ".json", jsonData, function (err) {
                if (err)
                    throw err;
                console.log("\u270D\uD83C\uDFFD wrote data to ./scrapedData/" + fileName + ".json");
            });
            return [2 /*return*/];
        });
    });
}
// https://developer.mozilla.org/de/docs/Web/JavaScript/Reference/Global_Objects/Array/flat
function flattenRecursively(array) {
    return array.reduce(function (acc, val) { return Array.isArray(val) ? acc.concat(flattenRecursively(val)) : acc.concat(val); }, []);
}
// Anonymous function that wraps async logic around top-level code
(function () { return __awaiter(void 0, void 0, void 0, function () {
    var googleApps, appleApps, allApps;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, Promise.all(searchTerms.map(function (searchTerm) { return scrape(googlePlayStore, searchTerm); }))];
            case 1:
                googleApps = _a.sent();
                return [4 /*yield*/, Promise.all(searchTerms.map(function (searchTerm) { return scrape(appleAppStore, searchTerm); }))];
            case 2:
                appleApps = _a.sent();
                allApps = flattenRecursively([googleApps, appleApps]);
                //  return arr1.reduce((acc, val) => Array.isArray(val) ? acc.concat(flattenDeep(val)) : acc.concat(val), []);
                //saveToJson(allApps, 'Google Apps NEW');
                //console.log(JSON.stringify(googleApps, null, 2));
                saveToCsv(allApps, 'Apps');
                return [2 /*return*/];
        }
    });
}); })();
//scrapeStore(googlePlayStore);
//scrapeStore(appleAppStore);
