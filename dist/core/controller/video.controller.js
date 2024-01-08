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
exports.VideoController = void 0;
const zod_1 = require("zod");
class VideoController {
    constructor(videoService) {
        this.videoService = videoService;
        this.uploadVideoDtoSchema = zod_1.z.object({
            filePath: zod_1.z.object({
                video: zod_1.z.string(),
            }),
            meta: zod_1.z.object({
                title: zod_1.z.string(),
                tags: zod_1.z.array(zod_1.z.string()).optional(),
            }),
            config: zod_1.z
                .object({
                visibility: zod_1.z
                    .union([zod_1.z.literal("public"), zod_1.z.literal("private")])
                    .optional(),
                copyrightCheck: zod_1.z.boolean().optional(),
            })
                .optional(),
        });
        this.upload = (dto) => __awaiter(this, void 0, void 0, function* () {
            const validDto = this.uploadVideoDtoSchema.parse(dto);
            yield this.videoService.upload(validDto);
        });
    }
}
exports.VideoController = VideoController;
