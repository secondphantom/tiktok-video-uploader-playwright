"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BrowserVideoUpload = void 0;
class BrowserVideoUpload {
    constructor(browserInstance) {
        this.browserInstance = browserInstance;
        this.run = (dto) => __awaiter(this, void 0, void 0, function* () {
            if (!this.page) {
                this.page = this.browserInstance.getPage();
            }
            const { filePath, meta, config } = dto;
            yield this.browserInstance.goUploadPage();
            yield this.delay(5000);
            yield this.setVideoFile(filePath.video);
            yield this.delay(5000);
            yield this.setMeta(meta);
            yield this.setConfig(config);
            yield this.delay(5000);
            yield this.post();
            yield this.delay(5000);
        });
        this.setVideoFile = (filePath) => __awaiter(this, void 0, void 0, function* () {
            const fileChooserPromise = this.page.waitForEvent("filechooser", {
                timeout: 15000,
            });
            const locator = this.page.frameLocator("iframe");
            const uploadBtnLocator = locator.getByLabel("Select file");
            yield uploadBtnLocator.click();
            const fileChooser = yield fileChooserPromise;
            yield fileChooser.setFiles(filePath);
        });
        this.setMeta = ({ title, tags }) => __awaiter(this, void 0, void 0, function* () {
            const frameLocator = this.page.frameLocator("iframe");
            yield this.waitUploadComplete(frameLocator);
            yield this.delay(500);
            const captionLocator = frameLocator.getByLabel("Caption");
            let count = 0;
            let limit = 10;
            let tempTitle = (yield captionLocator.allInnerTexts())[0];
            while (tempTitle !== "\n") {
                yield captionLocator.click();
                yield this.page.keyboard.press("Control+A");
                yield this.delay(500);
                yield this.page.keyboard.press("Backspace");
                yield this.delay(500);
                tempTitle = (yield captionLocator.allInnerTexts())[0];
                count++;
                if (count > limit) {
                    throw new Error("[Set Meta]Fail set title");
                }
            }
            yield captionLocator.click();
            // set title
            yield this.page.keyboard.type(title);
            // set tag
            if (tags && tags.length > 0) {
                yield this.page.keyboard.type(" ");
                for (const tag of tags) {
                    yield this.page.keyboard.type(`#${tag}`);
                    yield this.delay(3000);
                    yield this.page.keyboard.press("Enter");
                    yield this.delay(500);
                }
            }
            yield this.delay(2000);
            yield this.page.keyboard.press("Escape");
            return frameLocator;
        });
        this.setConfig = (config) => __awaiter(this, void 0, void 0, function* () {
            if (!config)
                return;
            const { visibility, copyrightCheck } = config;
            yield this.setCopyrightCheck(copyrightCheck);
            yield this.setVisibility(visibility);
        });
        this.setVisibility = (visibility) => __awaiter(this, void 0, void 0, function* () {
            if (!visibility)
                return;
            if (visibility === "public")
                return;
            const frameLocator = this.page.frameLocator("iframe");
            const publicDropdownLocator = frameLocator
                .getByText("Public", {
                exact: true,
            })
                .first();
            yield publicDropdownLocator.click({ force: true });
            yield this.delay(1000);
            const visibilityLocator = frameLocator
                .getByText("Private", {
                exact: true,
            })
                .first();
            yield visibilityLocator.click({ force: true });
        });
        this.setCopyrightCheck = (copyrightCheck) => __awaiter(this, void 0, void 0, function* () {
            if (!copyrightCheck)
                return;
            const frameLocator = this.page.frameLocator("iframe");
            const copyrightCheckLocator = frameLocator.getByRole("switch").nth(2);
            yield copyrightCheckLocator.click();
            yield this.delay(3000);
        });
        this.post = () => __awaiter(this, void 0, void 0, function* () {
            const frameLocator = this.page.frameLocator("iframe");
            const postBtn = frameLocator
                .getByRole("button")
                .filter({ hasText: "Post" });
            yield postBtn.click({ force: true });
        });
        this.waitUploadComplete = (frameLocator) => __awaiter(this, void 0, void 0, function* () {
            let isUploading = yield this.getIsUploading(frameLocator);
            while (isUploading) {
                isUploading = yield this.getIsUploading(frameLocator);
                yield this.delay(500);
            }
        });
        this.getIsUploading = (frameLocator) => __awaiter(this, void 0, void 0, function* () {
            const cancelLocator = frameLocator
                .getByRole("button")
                .filter({ hasText: "Cancel" });
            const cancelTexts = yield cancelLocator.allInnerTexts();
            if (cancelTexts.length > 0)
                return true;
            return false;
        });
        this.delay = (timeout) => __awaiter(this, void 0, void 0, function* () {
            return new Promise((res, rej) => {
                setTimeout(() => {
                    res(null);
                }, timeout);
            });
        });
        this.page = this.browserInstance.getPage();
    }
}
exports.BrowserVideoUpload = BrowserVideoUpload;
