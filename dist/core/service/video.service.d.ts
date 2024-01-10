import { BrowserInstance } from "../infrastructure/browser.instance";
export type UploadVideoDto = {
    filePath: {
        video: string;
    };
    meta: {
        title: string;
        tags?: string[];
    };
    config?: {
        visibility?: "public" | "private";
        copyrightCheck?: boolean;
    };
};
export declare class VideoService {
    private browserInstance;
    private browserVideoUpload;
    constructor(browserInstance: BrowserInstance);
    upload: (dto: UploadVideoDto) => Promise<void>;
}
