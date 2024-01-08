import { UploadVideoDto, VideoService } from "../service/video.service";
export declare class VideoController {
    private videoService;
    constructor(videoService: VideoService);
    private uploadVideoDtoSchema;
    upload: (dto: UploadVideoDto) => Promise<void>;
}
