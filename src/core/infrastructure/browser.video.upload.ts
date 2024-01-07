import { FrameLocator, Page } from "playwright";
import { BrowserInstance } from "./browser.instance";
import { UploadVideoDto } from "../service/video.service";

export class BrowserVideoUpload {
  private page: Page;
  constructor(private browserInstance: BrowserInstance) {
    this.page = this.browserInstance.getPage();
  }

  run = async (dto: UploadVideoDto) => {
    const { filePath, meta, config } = dto;

    await this.browserInstance.goUploadPage();
    await this.delay(1000);

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
    await locator.getByRole("button").first().click();

    const fileChooser = await fileChooserPromise;
    await fileChooser.setFiles(filePath);
  };

  private setMeta = async ({ title, tags }: UploadVideoDto["meta"]) => {
    const frameLocator = this.page.frameLocator("iframe");
    await this.waitUploadComplete(frameLocator);
    await this.delay(500);
    const tagStr = tags ? tags.map((v) => `#${v}`).join(" ") : "";
    const inputStr = `${title} ${tagStr}`;
    const captionLocator = frameLocator.getByLabel("Caption");
    await captionLocator.click();
    await this.page.keyboard.press("Control+A");
    await this.delay(500);
    await this.page.keyboard.press("Backspace");
    await this.delay(500);
    await captionLocator.click();
    await this.page.keyboard.type(inputStr);
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
