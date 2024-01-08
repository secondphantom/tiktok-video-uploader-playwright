"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TiktokVideoUploader = void 0;
const login_controller_1 = require("./core/controller/login.controller");
const video_controller_1 = require("./core/controller/video.controller");
const login_service_1 = require("./core/service/login.service");
const browser_instance_1 = require("./core/infrastructure/browser.instance");
const video_service_1 = require("./core/service/video.service");
class TiktokVideoUploader {
    constructor({ authFilePath, launchOptions, }) {
        this.login = () => this.loginController.login();
        const browserInstance = new browser_instance_1.BrowserInstance({
            authFilePath,
            launchOptions,
        });
        const loginService = new login_service_1.LoginService(browserInstance);
        const videoService = new video_service_1.VideoService(browserInstance);
        this.loginController = new login_controller_1.LoginController(loginService);
        this.video = new video_controller_1.VideoController(videoService);
    }
}
exports.TiktokVideoUploader = TiktokVideoUploader;
