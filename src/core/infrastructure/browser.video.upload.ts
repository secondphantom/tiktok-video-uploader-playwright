import { FrameLocator, Page } from "playwright";
import { BrowserInstance } from "./browser.instance";
import { UploadVideoDto } from "../service/video.service";

export class BrowserVideoUpload {
  private page: Page;
  constructor(private browserInstance: BrowserInstance) {
    this.page = this.browserInstance.getPage();
  }

  run = async (dto: UploadVideoDto) => {
    if (!this.page) {
      this.page = this.browserInstance.getPage();
    }
    const { filePath, meta, config } = dto;

    await this.browserInstance.goUploadPage();
    await this.delay(5000);

    await this.setVideoFile(filePath.video);
    await this.delay(5000);

    await this.setMeta(meta);

    await this.setConfig(config);
    await this.delay(5000);

    await this.post();
    await this.delay(5000);
  };

  private setVideoFile = async (filePath: string) => {
    const fileChooserPromise = this.page.waitForEvent("filechooser", {
      timeout: 15000,
    });

    const locator = this.page.frameLocator("iframe");
    const uploadBtnLocator = locator.getByLabel("Select file");

    await uploadBtnLocator.click();

    const fileChooser = await fileChooserPromise;
    await fileChooser.setFiles(filePath);
  };

  private setMeta = async ({ title, tags }: UploadVideoDto["meta"]) => {
    const frameLocator = this.page.frameLocator("iframe");
    await this.waitUploadComplete(frameLocator);
    await this.delay(500);
    const captionLocator = frameLocator.getByLabel("Caption");

    let count = 0;
    let limit = 10;
    let tempTitle = (await captionLocator.allInnerTexts())[0];
    while (tempTitle !== "\n") {
      await captionLocator.click();
      await this.page.keyboard.press("Control+A");
      await this.delay(500);
      await this.page.keyboard.press("Backspace");
      await this.delay(500);
      tempTitle = (await captionLocator.allInnerTexts())[0];
      count++;
      if (count > limit) {
        throw new Error("[Set Meta]Fail set title");
      }
    }

    await captionLocator.click();
    // set title
    await this.page.keyboard.type(title);
    // set tag
    if (tags && tags.length > 0) {
      await this.page.keyboard.type(" ");
      for (const tag of tags) {
        await this.page.keyboard.type(`#${tag}`);
        await this.delay(500);
        await this.page.keyboard.type(" ");
        await this.delay(3000);
        await this.page.keyboard.press("Enter");
        await this.delay(500);
      }
    }
    await this.delay(2000);
    await this.page.keyboard.press("Escape");
    return frameLocator;
  };

  private setConfig = async (config?: UploadVideoDto["config"]) => {
    if (!config) return;

    const { visibility, copyrightCheck } = config;
    await this.setCopyrightCheck(copyrightCheck);
    await this.setVisibility(visibility);
  };

  private setVisibility = async (
    visibility: Required<UploadVideoDto>["config"]["visibility"]
  ) => {
    if (!visibility) return;
    if (visibility === "public") return;

    const frameLocator = this.page.frameLocator("iframe");
    const publicDropdownLocator = frameLocator
      .getByText("Public", {
        exact: true,
      })
      .first();
    await publicDropdownLocator.click({ force: true });
    await this.delay(1000);

    const visibilityLocator = frameLocator
      .getByText("Private", {
        exact: true,
      })
      .first();

    await visibilityLocator.click({ force: true });
  };

  private setCopyrightCheck = async (copyrightCheck?: boolean) => {
    if (!copyrightCheck) return;
    const frameLocator = this.page.frameLocator("iframe");
    const copyrightCheckLocator = frameLocator.getByRole("switch").nth(2);
    await copyrightCheckLocator.click();
    await this.delay(3000);
  };

  private post = async () => {
    const frameLocator = this.page.frameLocator("iframe");
    const postBtn = frameLocator
      .getByRole("button")
      .filter({ hasText: "Post" });
    await postBtn.click({ force: true });
  };

  private waitUploadComplete = async (frameLocator: FrameLocator) => {
    let isUploading = await this.getIsUploading(frameLocator);
    while (isUploading) {
      isUploading = await this.getIsUploading(frameLocator);
      await this.delay(500);
    }
  };

  private getIsUploading = async (frameLocator: FrameLocator) => {
    const cancelLocator = frameLocator
      .getByRole("button")
      .filter({ hasText: "Cancel" });

    const cancelTexts = await cancelLocator.allInnerTexts();

    if (cancelTexts.length > 0) return true;
    return false;
  };

  private delay = async (timeout: number) =>
    new Promise((res, rej) => {
      setTimeout(() => {
        res(null);
      }, timeout);
    });
}
