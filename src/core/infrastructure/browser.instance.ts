import {
  Browser,
  BrowserContext,
  LaunchOptions,
  Page,
  chromium,
  firefox,
} from "playwright";
import fs from "fs";

export type BrowserInstanceConstructorInput = {
  authFilePath: string;
  launchOptions?: LaunchOptions;
};

export class BrowserInstance {
  private authFilePath: string;
  private launchOptions: LaunchOptions;
  private browserContext: BrowserContext | undefined;
  private page: Page | undefined;
  private UPLOAD_URL =
    "https://www.tiktok.com/creator-center/upload?from=upload&lang=en";

  constructor({
    authFilePath,
    launchOptions,
  }: BrowserInstanceConstructorInput) {
    this.authFilePath = authFilePath;
    this.launchOptions = launchOptions ? launchOptions : {};
    this.launchOptions.args = ["--disable-blink-features=AutomationControlled"];
    this.launchOptions.ignoreDefaultArgs = [
      "--disable-component-extensions-with-background-pages",
    ];
  }

  launch = async () => {
    await this.closeBrowser();

    try {
      await this.openBrowser({ setAuth: true });
      await this.checkValidLogin();
    } catch (error: any) {
      await this.closeBrowser();
      throw new Error(error.message);
    }

    this.page = await this.openPage();
    await this.goto(this.UPLOAD_URL);
  };

  openBrowser = async (initConfig?: {
    browserType?: "chromium" | "firefox";
    headless?: boolean;
    setAuth?: boolean;
  }) => {
    const defaultInitConfig = {
      headless: true,
      setAuth: true,
      browserType: "firefox",
    };
    const { headless, setAuth, browserType } = {
      ...defaultInitConfig,
      ...initConfig,
    };
    if (this.browserContext) return;

    let browser: Browser;
    if (browserType === "chromium") {
      browser = await chromium.launch({
        headless,
        ...this.launchOptions,
      });
    } else {
      browser = await firefox.launch({
        headless,
        ...this.launchOptions,
      });
    }

    if (setAuth) {
      const auth = await this.getAuth();
      this.browserContext = await browser.newContext({
        storageState: auth,
        userAgent:
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36",
        locale: "en",
      });
    } else {
      this.browserContext = await browser.newContext({
        userAgent:
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36",
        locale: "en",
      });
    }
  };

  closeBrowser = async () => {
    if (!this.browserContext) return;
    await this.browserContext.close();
    this.browserContext = undefined;
  };

  private getAuth = async () => {
    try {
      const auth = await fs.promises
        .readFile(this.authFilePath, { encoding: "utf-8" })
        .then(JSON.parse);
      return auth as ReturnType<BrowserContext["storageState"]>;
    } catch (error) {
      throw new Error(`[ERROR] Cannot Get AuthFile`);
    }
  };

  checkValidLogin = async () => {
    const page = await this.openPage();
    const url = this.UPLOAD_URL;
    await this.internalGoto(url, page);

    const pageUrl = page.url();
    if (pageUrl !== url) {
      throw new Error(`[ERROR] BrowserInstance: Login required`);
    }
    await page.close();
  };

  private openPage = async () => {
    this.browserLaunchCheck();
    const page = await this.browserContext!.newPage();
    return page;
  };

  private browserLaunchCheck = () => {
    if (!this.browserContext) {
      throw new Error(`[ERROR] Browser Instance: Browser Not Launched`);
    }
  };

  goto = async (url: string) => {
    if (!this.page) throw new Error(`[ERROR] Page Not Launched`);
    await this.page.goto(url, { waitUntil: "networkidle" });
  };

  private internalGoto = async (url: string, page: Page) => {
    await page.goto(url, { waitUntil: "networkidle" });
  };

  goLoginPage = async () => {
    await this.closeBrowser();
    await this.openBrowser({
      headless: false,
      setAuth: false,
      browserType: "chromium",
    });
    const page = await this.openPage();
    await this.internalGoto(this.UPLOAD_URL, page);
    return page;
  };

  saveAuthFile = async () => {
    this.browserLaunchCheck();
    const auth = await this.browserContext!.storageState();
    await fs.promises.writeFile(this.authFilePath, JSON.stringify(auth));
  };

  getPage = () => this.page!;

  goUploadPage = async () => {
    await this.page!.goto(this.UPLOAD_URL, { waitUntil: "networkidle" });
  };
}
