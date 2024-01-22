"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BrowserInstance = void 0;
const playwright_1 = require("playwright");
const fs_1 = __importDefault(require("fs"));
class BrowserInstance {
    constructor({ authFilePath, launchOptions, }) {
        this.UPLOAD_URL = "https://www.tiktok.com/creator-center/upload?from=upload&lang=en";
        this.HOME_URL = "https://www.tiktok.com";
        this.launch = () => __awaiter(this, void 0, void 0, function* () {
            yield this.closeBrowser();
            try {
                yield this.openBrowser({ setAuth: true });
                yield this.checkValidLogin();
            }
            catch (error) {
                yield this.closeBrowser();
                throw new Error(error.message);
            }
            this.page = yield this.openPage();
            yield this.goto(this.UPLOAD_URL);
        });
        this.openBrowser = (initConfig) => __awaiter(this, void 0, void 0, function* () {
            const defaultInitConfig = {
                headless: true,
                setAuth: true,
                browserType: "firefox",
                locale: "en",
            };
            const { headless, setAuth, browserType, locale } = Object.assign(Object.assign({}, defaultInitConfig), initConfig);
            if (this.browserContext)
                return;
            let browser;
            if (browserType === "chromium") {
                browser = yield playwright_1.chromium.launch(Object.assign(Object.assign({}, this.launchOptions), { headless }));
            }
            else {
                browser = yield playwright_1.firefox.launch(Object.assign(Object.assign({}, this.launchOptions), { headless }));
            }
            if (setAuth) {
                const auth = yield this.getAuth();
                this.browserContext = yield browser.newContext({
                    storageState: auth,
                    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36",
                    locale,
                });
            }
            else {
                this.browserContext = yield browser.newContext({
                    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36",
                    locale,
                });
            }
        });
        this.closeBrowser = () => __awaiter(this, void 0, void 0, function* () {
            if (!this.browserContext)
                return;
            yield this.browserContext.close();
            this.browserContext = undefined;
        });
        this.getAuth = () => __awaiter(this, void 0, void 0, function* () {
            try {
                const auth = yield fs_1.default.promises
                    .readFile(this.authFilePath, { encoding: "utf-8" })
                    .then(JSON.parse);
                return auth;
            }
            catch (error) {
                throw new Error(`[ERROR] Cannot Get AuthFile`);
            }
        });
        this.checkValidLogin = () => __awaiter(this, void 0, void 0, function* () {
            const page = yield this.openPage();
            const url = this.UPLOAD_URL;
            yield this.internalGoto(url, page);
            const pageUrl = page.url();
            if (pageUrl !== url) {
                throw new Error(`[ERROR] BrowserInstance: Login required`);
            }
            yield page.close();
        });
        this.openPage = () => __awaiter(this, void 0, void 0, function* () {
            this.browserLaunchCheck();
            const page = yield this.browserContext.newPage();
            return page;
        });
        this.browserLaunchCheck = () => {
            if (!this.browserContext) {
                throw new Error(`[ERROR] Browser Instance: Browser Not Launched`);
            }
        };
        this.goto = (url) => __awaiter(this, void 0, void 0, function* () {
            if (!this.page)
                throw new Error(`[ERROR] Page Not Launched`);
            yield this.page.goto(url, { waitUntil: "networkidle" });
        });
        this.internalGoto = (url, page) => __awaiter(this, void 0, void 0, function* () {
            yield page.goto(url, { waitUntil: "networkidle" });
        });
        this.goLoginPage = () => __awaiter(this, void 0, void 0, function* () {
            yield this.closeBrowser();
            yield this.openBrowser({
                headless: false,
                setAuth: false,
                browserType: "chromium",
                locale: undefined,
            });
            const page = yield this.openPage();
            yield this.internalGoto(this.HOME_URL, page);
            return page;
        });
        this.saveAuthFile = () => __awaiter(this, void 0, void 0, function* () {
            this.browserLaunchCheck();
            const auth = yield this.browserContext.storageState();
            yield fs_1.default.promises.writeFile(this.authFilePath, JSON.stringify(auth));
        });
        this.getPage = () => this.page;
        this.goUploadPage = () => __awaiter(this, void 0, void 0, function* () {
            yield this.page.goto(this.UPLOAD_URL, { waitUntil: "networkidle" });
        });
        this.authFilePath = authFilePath;
        this.launchOptions = launchOptions ? launchOptions : {};
        this.launchOptions.args = ["--disable-blink-features=AutomationControlled"];
        this.launchOptions.ignoreDefaultArgs = [
            "--disable-component-extensions-with-background-pages",
        ];
    }
}
exports.BrowserInstance = BrowserInstance;
