import { BrowserInstance } from "../infrastructure/browser.instance";
export interface UploadConfig {
    config?: {
        visibility?: "public" | "private";
        copyrightCheck?: boolean;
    };
}
export interface VideoFileSchema {
    filePath: {
        video: string;
    };
}
export interface VideoMetaSchema {
    meta: {
        title: string;
        tags?: string[];
    };
}
export type UploadVideoDto = VideoFileSchema & VideoMetaSchema & UploadConfig;
export declare class VideoService {
    private browserInstance;
    private browserVideoUpload;
    constructor(browserInstance: BrowserInstance);
    upload: (dto: UploadVideoDto) => Promise<void>;
}
