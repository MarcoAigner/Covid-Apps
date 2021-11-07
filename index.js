"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
exports.__esModule = true;
var googleScraper = require("google-play-scraper");
var appleScraper = require("app-store-scraper");
var converter = require("json-2-csv");
var fs = require("fs");
var CombinedApp = /** @class */ (function () {
    function CombinedApp() {
        this.titleGoogle = undefined;
        this.titleApple = undefined;
        this.urlGoogle = undefined;
        this.urlApple = undefined;
        this.enUs = undefined;
        this.covidRelation = undefined;
        this.additionalProductsRequired = undefined;
        this.regional = undefined;
        this.state = undefined;
        this.pilot = undefined;
        this.organisational = undefined;
        this.limitedLiability = undefined;
        this.comment = undefined;
        this.appIdGoogle = undefined;
        this.appIdApple = undefined;
        this.developerGoogle = undefined;
        this.developerApple = undefined;
        this.searchTermsGoogle = undefined;
        this.searchTermsApple = undefined;
    }
    CombinedApp.prototype.addGoogleAppData = function (googleApp) {
        var _a;
        if (this.titleGoogle)
            (_a = this.searchTermsGoogle) === null || _a === void 0 ? void 0 : _a.push(googleApp.searchTerm);
        else {
            this.titleGoogle = googleApp.title;
            this.appIdGoogle = googleApp.appId;
            this.developerGoogle = googleApp.developer;
            this.urlGoogle = googleApp.url;
            this.searchTermsGoogle = [googleApp.searchTerm];
        }
    };
    CombinedApp.prototype.addAppleAppData = function (appleApp) {
        var _a;
        if (this.titleApple)
            (_a = this.searchTermsApple) === null || _a === void 0 ? void 0 : _a.push(appleApp.searchTerm);
        else {
            this.titleApple = appleApp.title;
            this.appIdApple = appleApp.appId;
            this.developerApple = appleApp.developer;
            this.urlApple = appleApp.url;
            this.searchTermsApple = [appleApp.searchTerm];
        }
    };
    return CombinedApp;
}());
// Apps stores are represented with an app-store-title and an array of apps, found for given search-terms
var googlePlayStore = {
    title: "Google Play Store",
    short: "google",
    scraper: googleScraper
};
var appleAppStore = {
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
var searchTerms = [
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
                    apps.forEach(function (app) { return (app.searchTerm = searchTerm); }); // append the used search-term as attribute
                    console.log("Number of apps found searching the " + appStore.title + " for " + searchTerm + ": " + apps.length);
                    return [2 /*return*/, apps];
            }
        });
    });
}
// Writes a given iterable to a .csv-file with a given file-name
function saveToCsv(iterable, fileName) {
    return __awaiter(this, void 0, void 0, function () {
        var csvData;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, converter.json2csvAsync(iterable, {
                        emptyFieldValue: ""
                    })];
                case 1:
                    csvData = _a.sent();
                    if (!fs.existsSync('./scrapedData'))
                        fs.mkdirSync('./scrapedData');
                    return [4 /*yield*/, fs.promises.writeFile("scrapedData/" + fileName + ".csv", csvData)];
                case 2:
                    _a.sent();
                    console.log("\n\u270D\uD83C\uDFFD Wrote " + iterable.length + " apps to ./scrapedData/" + fileName + ".csv");
                    return [2 /*return*/];
            }
        });
    });
}
// Google-App have the attribute "summary", whereas in Apple-Apps it's called "description"
function isGoogleApp(app) {
    return Object.prototype.hasOwnProperty.call(app, "summary");
}
// Anonymous function that wraps async logic around top-level code
(function () { return __awaiter(void 0, void 0, void 0, function () {
    var googleApps, appleApps, apps, _a, _b, app, exisitingApp, appsAsArray;
    var e_1, _c;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                console.log('🧐 Beginning to scrape the Google Play-Store and Apple App-Store\n');
                return [4 /*yield*/, Promise.all(searchTerms.map(function (searchTerm) { return scrape(googlePlayStore, searchTerm); }))];
            case 1:
                googleApps = (_d.sent()).flat();
                return [4 /*yield*/, Promise.all(searchTerms.map(function (searchTerm) { return scrape(appleAppStore, searchTerm); }))];
            case 2:
                appleApps = (_d.sent()).flat();
                apps = new Map();
                try {
                    for (_a = __values(__spreadArray(__spreadArray([], __read(googleApps), false), __read(appleApps), false)), _b = _a.next(); !_b.done; _b = _a.next()) {
                        app = _b.value;
                        // TODO: title immer identisch, auch id als identifier??
                        if (!apps.has(app.title))
                            apps.set(app.title, new CombinedApp());
                        exisitingApp = apps.get(app.title);
                        if (isGoogleApp(app))
                            exisitingApp.addGoogleAppData(app);
                        else
                            exisitingApp.addAppleAppData(app);
                    }
                }
                catch (e_1_1) { e_1 = { error: e_1_1 }; }
                finally {
                    try {
                        if (_b && !_b.done && (_c = _a["return"])) _c.call(_a);
                    }
                    finally { if (e_1) throw e_1.error; }
                }
                appsAsArray = __spreadArray([], __read(apps.values()), false).map(function (app) { return (__assign(__assign({}, app), { bothAppStores: Boolean(app.titleApple && app.titleGoogle) })); });
                saveToCsv(appsAsArray, "Scraped Apps");
                return [2 /*return*/];
        }
    });
}); })();
