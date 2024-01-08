import { BrowserInstance } from "./browser.instance";
import { UploadVideoDto } from "../service/video.service";
export declare class BrowserVideoUpload {
    private browserInstance;
    private page;
    constructor(browserInstance: BrowserInstance);
    run: (dto: UploadVideoDto) => Promise<void>;
    private setVideoFile;
    private setMeta;
    private setConfig;
    private setVisibility;
    private setCopyrightCheck;
    private post;
    private waitUploadComplete;
    private getIsUploading;
    private delay;
}
