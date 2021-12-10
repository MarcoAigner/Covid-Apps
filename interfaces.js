"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
exports.AppleApp = exports.GoogleApp = exports.App = exports.CombinedApp = void 0;
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
            (_a = this.searchTermsGoogle) === null || _a === void 0 ? void 0 : _a.push(googleApp.searchTerm); // Result is already saved => Only add search-term under which the app was found
        else { // Create a new result-entry for a Google-App
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
            (_a = this.searchTermsApple) === null || _a === void 0 ? void 0 : _a.push(appleApp.searchTerm); // Result is already saved => Only add search-term under which the app was found
        else { // Create a new result-entry for an Apple-App
            this.titleApple = appleApp.title;
            this.appIdApple = appleApp.appId;
            this.developerApple = appleApp.developer;
            this.urlApple = appleApp.url;
            this.searchTermsApple = [appleApp.searchTerm];
        }
    };
    return CombinedApp;
}());
exports.CombinedApp = CombinedApp;
var App = /** @class */ (function () {
    function App() {
    }
    return App;
}());
exports.App = App;
var GoogleApp = /** @class */ (function (_super) {
    __extends(GoogleApp, _super);
    function GoogleApp() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return GoogleApp;
}(App));
exports.GoogleApp = GoogleApp;
var AppleApp = /** @class */ (function (_super) {
    __extends(AppleApp, _super);
    function AppleApp() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return AppleApp;
}(App));
exports.AppleApp = AppleApp;
