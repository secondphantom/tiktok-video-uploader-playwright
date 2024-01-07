import { BrowserInstance } from "../infrastructure/browser.instance";
import { BrowserVideoUpload } from "../infrastructure/browser.video.upload";

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

export class VideoService {
  private browserVideoUpload: BrowserVideoUpload;
  constructor(private browserInstance: BrowserInstance) {
    this.browserVideoUpload = new BrowserVideoUpload(this.browserInstance);
  }

  upload = async (dto: UploadVideoDto) => {
    await this.browserVideoUpload.run(dto);
  };
}
