import { BrowserInstance } from "../infrastructure/browser.instance";
export declare class LoginService {
    private browserInstance;
    private rl;
    constructor(browserInstance: BrowserInstance);
    login: () => Promise<{
        isLogin: boolean;
    }>;
    private updateAuth;
}
