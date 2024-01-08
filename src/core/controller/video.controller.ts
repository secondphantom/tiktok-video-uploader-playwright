import { UploadVideoDto, VideoService } from "../service/video.service";
import { z } from "zod";

export class VideoController {
  constructor(private videoService: VideoService) {}

  private uploadVideoDtoSchema = z.object({
    filePath: z.object({
      video: z.string(),
    }),
    meta: z.object({
      title: z.string(),
      tags: z.array(z.string()).optional(),
    }),
    config: z
      .object({
        visibility: z
          .union([z.literal("public"), z.literal("private")])
          .optional(),
        copyrightCheck: z.boolean().optional(),
      })
      .optional(),
  });

  upload = async (dto: UploadVideoDto) => {
    const validDto = this.uploadVideoDtoSchema.parse(dto);
    await this.videoService.upload(validDto);
  };
}
