import { Controller, Post, Get, Body, Query, UseGuards } from "@nestjs/common";
import { StorageService } from "./storage.service";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";

@Controller("storage")
export class StorageController {
  constructor(private readonly storageService: StorageService) {}

  @UseGuards(JwtAuthGuard)
  @Post("presigned-upload")
  async getPresignedUpload(
    @Body("key") key: string,
    @Body("bucket") bucket?: string,
  ) {
    const url = await this.storageService.getPresignedUploadUrl(key, bucket);
    return { key, bucket, uploadUrl: url };
  }

  @Get("object-url")
  async getObjectUrl(
    @Query("key") key: string,
    @Query("bucket") bucket?: string,
  ) {
    const url = await this.storageService.getPresignedObjectUrl(key, bucket);
    return { key, url };
  }
}
