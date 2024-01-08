import { LaunchOptions } from "playwright";
import { LoginController } from "./core/controller/login.controller";
import { VideoController } from "./core/controller/video.controller";
import { LoginService } from "./core/service/login.service";
import { BrowserInstance } from "./core/infrastructure/browser.instance";
import { VideoService } from "./core/service/video.service";

export class TiktokVideoUploader {
  private loginController: LoginController;
  video: VideoController;

  constructor({
    authFilePath,
    launchOptions,
  }: {
    authFilePath: string;
    launchOptions: LaunchOptions;
  }) {
    const browserInstance = new BrowserInstance({
      authFilePath,
      launchOptions,
    });

    const loginService = new LoginService(browserInstance);
    const videoService = new VideoService(browserInstance);

    this.loginController = new LoginController(loginService);
    this.video = new VideoController(videoService);
  }

  login = () => this.loginController.login();
}
