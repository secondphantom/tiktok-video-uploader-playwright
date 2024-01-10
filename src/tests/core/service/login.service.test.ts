import { BrowserInstance } from "../../../core/infrastructure/browser.instance";
import { LoginService } from "../../../core/service/login.service";
import dotenv from "dotenv";
dotenv.config();
describe("Login Service", () => {
  let browserInstance: BrowserInstance;
  let loginService: LoginService;

  beforeAll(() => {
    browserInstance = new BrowserInstance({
      authFilePath: process.env.AUTH_FILE_PATH!,
      launchOptions: { headless: false },
    });
    loginService = new LoginService(browserInstance);
  });

  afterAll(async () => {
    await browserInstance.closeBrowser();
  });

  test("Login", async () => {
    const { isLogin } = await loginService.login();

    expect(isLogin).toEqual(true);
  }, 180000);
});
