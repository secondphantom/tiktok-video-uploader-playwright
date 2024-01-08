import {
  UploadVideoDto,
  VideoService,
} from "../../../core/service/video.service";

import { VideoController } from "../../../core/controller/video.controller";
import { BrowserInstance } from "../../../core/infrastructure/browser.instance";

describe("Video Controller", () => {
  let videoService: VideoService;
  let videoController: VideoController;

  beforeAll(() => {
    videoService = {} as any;
    videoController = new VideoController(videoService);
  });

  describe("upload video dto", () => {
    test.each<{
      params: any;
      message: string;
      isError: boolean;
    }>([
      {
        params: {
          filePath: {
            video: "filePath",
          },
          meta: {
            title: "title",
            tags: ["tag1", "tag2"],
          },
          config: {
            copyrightCheck: true,
            visibility: "public",
          },
        },
        message: "valid input",
        isError: false,
      },
      {
        params: {
          filePath: {
            video: "filePath",
          },
          meta: {
            title: "title",
            tags: ["tag1", "tag2"],
          },
          // config: {
          //   copyrightCheck: true,
          //   visibility: "public",
          // },
        },
        message: "valid input",
        isError: false,
      },
      {
        params: {
          filePath: {
            video: "filePath",
          },
          meta: {
            title: "title",
            // tags: ["tag1", "tag2"],
          },
          config: {
            copyrightCheck: true,
            visibility: "public",
          },
        },
        message: "valid input",
        isError: false,
      },
      {
        params: {
          filePath: {
            // video: "filePath",
          },
          meta: {
            title: "title",
            tags: ["tag1", "tag2"],
          },
          config: {
            copyrightCheck: true,
            visibility: "public",
          },
        },
        message: "video filepath is required",
        isError: true,
      },
      {
        params: {
          filePath: {
            video: "filePath",
          },
          meta: {
            // title: "title",
            tags: ["tag1", "tag2"],
          },
          config: {
            copyrightCheck: true,
            visibility: "public",
          },
        },
        message: "meta title is required",
        isError: true,
      },
      {
        params: {
          filePath: {
            video: "filePath",
          },
          // meta: {
          //   title: "title",
          //   tags: ["tag1", "tag2"],
          // },
          config: {
            copyrightCheck: true,
            visibility: "public",
          },
        },
        message: "meta is required",
        isError: true,
      },
      {
        params: {
          // filePath: {
          //   video: "filePath",
          // },
          meta: {
            title: "title",
            tags: ["tag1", "tag2"],
          },
          config: {
            copyrightCheck: true,
            visibility: "public",
          },
        },
        message: "filepath is required",
        isError: true,
      },
    ])(`$message`, ({ params, isError }) => {
      const checkErrorFn = jest.fn();
      try {
        const result = videoController["uploadVideoDtoSchema"].parse(params);
        expect(result).toEqual(params);
      } catch (e) {
        checkErrorFn();
      }
      if (isError) {
        expect(checkErrorFn).toBeCalled();
      } else {
        expect(checkErrorFn).not.toBeCalled();
      }
    });
  });
});
