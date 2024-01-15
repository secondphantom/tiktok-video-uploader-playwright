import { BrowserInstance } from "../../../core/infrastructure/browser.instance";
import {
  UploadVideoDto,
  VideoService,
} from "../../../core/service/video.service";
import { LoginService } from "../../../core/service/login.service";
import dotenv from "dotenv";
dotenv.config();

describe("Video Service", () => {
  let browserInstance: BrowserInstance;
  let loginService: LoginService;
  let videoService: VideoService;

  beforeAll(async () => {
    browserInstance = new BrowserInstance({
      authFilePath: process.env.AUTH_FILE_PATH!,
      launchOptions: { headless: false },
    });
    loginService = new LoginService(browserInstance);
    await loginService.login();
    videoService = new VideoService(browserInstance);
  }, 30000);

  afterAll(async () => {
    await browserInstance.closeBrowser();
  });

  test("Upload", async () => {
    const dto: UploadVideoDto = {
      filePath: {
        video: process.env.VIDEO_FILE_PATH!,
      },
      meta: {
        title: "test",
        tags: ["leagueoflegends", "리그오브레전드"],
      },
      config: {
        copyrightCheck: true,
        visibility: "private",
      },
    };

    await videoService.upload(dto);
  }, 180000);
});
