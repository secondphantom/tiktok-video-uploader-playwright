# Tiktok Video Uploader Playwright
You can upload a video to TikTok

## Install
```
	npm i https://github.com/secondphantom/tiktok-video-uploader-playwright
```

## Usage

```ts
const tiktokVideoUploader = new TiktokVideoUploader ({
	authFilePath: "./auth.json",
});

await tiktokVideoUploader.login();

const videoUploadDto = {
	filePath: {
		video: './video.mp4',
	},
	meta: {
		title: "title",
		tags: ["tagone", "tagtwo"],
	},
	config: {
		copyrightCheck: true,
		visibility: "public",
	},
};

await tiktokVideoUploader.video.upload(videoUploadDto);
```

## API
### Constructor
#### input
##### `authFilePath`
- Type: `string`
- Required: `true`

The auth file must be included in .gitignore
##### `launchOptions`
- Required: `false`

Browser launch options
### login
If the auth file does not exist, a browser asking for TikTok login will appear. After logging in, pressing enter will generate the auth file.
### video
#### upload
##### input
```ts
type UploadVideoDto = {
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
```
### Dependency
- [playwright](https://playwright.dev/)
- [zod](https://zod.dev/)

