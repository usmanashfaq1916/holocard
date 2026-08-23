import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
  HeadObjectCommand,
  ListObjectsV2Command,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import type { StorageProvider, StorageResult } from "./types";

export class MinIOProvider implements StorageProvider {
  private client: S3Client;
  private bucket: string;
  private publicUrl: string;

  constructor() {
    const endpoint = process.env.MINIO_ENDPOINT || "http://localhost:9000";
    const accessKeyId = process.env.MINIO_ACCESS_KEY || "";
    const secretAccessKey = process.env.MINIO_SECRET_KEY || "";
    this.bucket = process.env.MINIO_BUCKET || "holocard";
    this.publicUrl = process.env.MINIO_PUBLIC_URL || endpoint;

    this.client = new S3Client({
      endpoint,
      region: "us-east-1",
      credentials: { accessKeyId, secretAccessKey },
      forcePathStyle: true,
    });
  }

  async upload(key: string, buffer: Buffer, mimeType: string): Promise<StorageResult> {
    await this.client.send(
      new PutObjectCommand({
        Bucket: this.bucket,
        Key: key,
        Body: buffer,
        ContentType: mimeType,
      })
    );

    return {
      url: this.getUrl(key),
      key,
      size: buffer.length,
      mimeType,
    };
  }

  async delete(key: string): Promise<void> {
    await this.client.send(
      new DeleteObjectCommand({
        Bucket: this.bucket,
        Key: key,
      })
    );
  }

  getUrl(key: string): string {
    return `${this.publicUrl}/${this.bucket}/${key}`;
  }

  async getSignedUrl(key: string, expiresIn = 3600): Promise<string> {
    const command = new PutObjectCommand({
      Bucket: this.bucket,
      Key: key,
    });
    return getSignedUrl(this.client, command, { expiresIn });
  }

  async exists(key: string): Promise<boolean> {
    try {
      await this.client.send(
        new HeadObjectCommand({
          Bucket: this.bucket,
          Key: key,
        })
      );
      return true;
    } catch {
      return false;
    }
  }

  async list(prefix: string): Promise<{ key: string; size: number; lastModified: Date }[]> {
    const response = await this.client.send(
      new ListObjectsV2Command({
        Bucket: this.bucket,
        Prefix: prefix,
      })
    );

    return (response.Contents || []).map((item) => ({
      key: item.Key || "",
      size: item.Size || 0,
      lastModified: item.LastModified || new Date(),
    }));
  }
}
