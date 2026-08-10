import { Injectable } from "@nestjs/common";
import { Client as MinioClient } from "minio";

@Injectable()
export class StorageService {
  private readonly defaultBucket =
    process.env.STORAGE_DEFAULT_BUCKET ??
    process.env.MINIO_BUCKET_NAME ??
    "media";
  private readonly publicEndpoint =
    process.env.STORAGE_PUBLIC_URL ?? process.env.MINIO_PUBLIC_URL ?? "";
  private readonly defaultExpirySeconds = Number(
    process.env.STORAGE_PRESIGNED_EXPIRY_SECONDS ?? 900,
  );
  private readonly minioClient: MinioClient | null;

  constructor() {
    const endPoint = process.env.STORAGE_ENDPOINT ?? process.env.MINIO_ENDPOINT;
    const accessKey =
      process.env.STORAGE_ACCESS_KEY ?? process.env.MINIO_ACCESS_KEY;
    const secretKey =
      process.env.STORAGE_SECRET_KEY ?? process.env.MINIO_SECRET_KEY;
    const port = Number(
      process.env.STORAGE_PORT ?? process.env.MINIO_PORT ?? 9000,
    );
    const useSSL =
      (process.env.STORAGE_USE_SSL ?? process.env.MINIO_USE_SSL ?? "false") ===
      "true";

    if (!endPoint || !accessKey || !secretKey) {
      this.minioClient = null;
      return;
    }

    this.minioClient = new MinioClient({
      endPoint,
      port,
      useSSL,
      accessKey,
      secretKey,
    });
  }

  isConfigured(): boolean {
    return this.minioClient !== null;
  }

  getObjectUrl(key: string, bucket?: string): string {
    if (!key) return "";
    if (key.startsWith("http://") || key.startsWith("https://") || key.startsWith("data:")) {
      return key;
    }
    const b = bucket || this.defaultBucket;
    if (this.publicEndpoint) {
      return `${this.publicEndpoint.replace(/\/$/, "")}/${b}/${key.replace(/^\//, "")}`;
    }
    return key;
  }

  async getPresignedUploadUrl(
    key: string,
    bucket?: string,
    expirySeconds?: number,
  ): Promise<string> {
    if (!this.minioClient) {
      return this.getObjectUrl(key, bucket);
    }

    const b = bucket || this.defaultBucket;
    const expiry = expirySeconds || this.defaultExpirySeconds;

    try {
      return await this.minioClient.presignedPutObject(b, key, expiry);
    } catch {
      return this.getObjectUrl(key, b);
    }
  }

  async getPresignedObjectUrl(
    key: string,
    bucket?: string,
    expirySeconds?: number,
  ): Promise<string> {
    if (!this.minioClient) {
      return this.getObjectUrl(key, bucket);
    }

    const b = bucket || this.defaultBucket;
    const expiry = expirySeconds || this.defaultExpirySeconds;

    try {
      return await this.minioClient.presignedGetObject(b, key, expiry);
    } catch {
      return this.getObjectUrl(key, b);
    }
  }
}
