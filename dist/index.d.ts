import { LaunchOptions } from "playwright";
import { VideoController } from "./core/controller/video.controller";
export declare class TiktokVideoUploader {
    private loginController;
    video: VideoController;
    constructor({ authFilePath, launchOptions, }: {
        authFilePath: string;
        launchOptions?: LaunchOptions;
    });
    login: () => Promise<{
        isLogin: boolean;
    }>;
}
