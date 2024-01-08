import { BrowserInstance } from "../infrastructure/browser.instance";
import { BrowserVideoUpload } from "../infrastructure/browser.video.upload";

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

export class VideoService {
  private browserVideoUpload: BrowserVideoUpload;
  constructor(private browserInstance: BrowserInstance) {
    this.browserVideoUpload = new BrowserVideoUpload(this.browserInstance);
  }

  upload = async (dto: UploadVideoDto) => {
    await this.browserVideoUpload.run(dto);
  };
}
