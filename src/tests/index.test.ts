import { UploadVideoDto } from "../core/service/video.service";
import { TiktokVideoUploader } from "../index";
import dotenv from "dotenv";
dotenv.config();

describe("index", () => {
  let tiktokVideoUploader: TiktokVideoUploader;

  beforeAll(() => {
    tiktokVideoUploader = new TiktokVideoUploader({
      authFilePath: process.env.AUTH_FILE_PATH!,
      launchOptions: { headless: false },
    });
  }, 30000);

  test.skip("login", async () => {
    const { isLogin } = await tiktokVideoUploader.login();

    expect(isLogin).toEqual(true);
  }, 60000);

  describe("video", () => {
    test("upload", async () => {
      await tiktokVideoUploader.login();
      const dto: UploadVideoDto = {
        filePath: {
          video: process.env.VIDEO_FILE_PATH!,
        },
        meta: {
          title: "test",
          tags: ["tagone", "tagtwo"],
        },
        config: {
          copyrightCheck: true,
          visibility: "private",
        },
      };

      await tiktokVideoUploader.video.upload(dto);
    }, 180000);
  });
});
