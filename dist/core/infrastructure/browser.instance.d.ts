import { LaunchOptions, Page } from "playwright";
export type BrowserInstanceConstructorInput = {
    authFilePath: string;
    launchOptions?: LaunchOptions;
};
export declare class BrowserInstance {
    private authFilePath;
    private launchOptions;
    private browserContext;
    private page;
    private UPLOAD_URL;
    private HOME_URL;
    constructor({ authFilePath, launchOptions, }: BrowserInstanceConstructorInput);
    launch: () => Promise<void>;
    openBrowser: (initConfig?: {
        browserType?: "chromium" | "firefox";
        headless?: boolean;
        setAuth?: boolean;
        locale?: string;
    }) => Promise<void>;
    closeBrowser: () => Promise<void>;
    private getAuth;
    checkValidLogin: () => Promise<void>;
    private openPage;
    private browserLaunchCheck;
    goto: (url: string) => Promise<void>;
    private internalGoto;
    goLoginPage: () => Promise<Page>;
    saveAuthFile: () => Promise<void>;
    getPage: () => Page;
    goUploadPage: () => Promise<void>;
}
