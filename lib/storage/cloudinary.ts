import { v2 as cloudinary } from "cloudinary";
import type { StorageProvider, StorageResult } from "./types";

const FOLDER = "holocard";

export class CloudinaryProvider implements StorageProvider {
  constructor() {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
      secure: true,
    });
  }

  private getMimeType(buffer: Buffer): string {
    const hex = buffer.subarray(0, 4).toString("hex");
    if (hex.startsWith("ffd8ff")) return "image/jpeg";
    if (hex.startsWith("89504e47")) return "image/png";
    if (hex.startsWith("47494638")) return "image/gif";
    if (hex.startsWith("52494646")) return "image/webp";
    if (hex.startsWith("676c5446")) return "model/gltf-binary";
    if (hex.startsWith("1a45dfa3")) return "video/mp4";
    return "application/octet-stream";
  }

  private getExtension(mimeType: string): string {
    const map: Record<string, string> = {
      "image/jpeg": "jpg",
      "image/png": "png",
      "image/gif": "gif",
      "image/webp": "webp",
      "model/gltf-binary": "glb",
      "video/mp4": "mp4",
    };
    return map[mimeType] || "bin";
  }

  async upload(key: string, buffer: Buffer, mimeType: string): Promise<StorageResult> {
    const ext = this.getExtension(mimeType);
    const publicId = `${FOLDER}/${key.replace(/\.[^.]+$/, "")}`;

    const result = await new Promise<CloudinaryUploadResult>((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          public_id: publicId,
          resource_type: "auto",
          format: ext,
          folder: FOLDER,
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result as CloudinaryUploadResult);
        }
      );
      stream.end(buffer);
    });

    return {
      url: result.secure_url,
      key: result.public_id,
      size: buffer.length,
      mimeType,
    };
  }

  async delete(key: string): Promise<void> {
    await cloudinary.uploader.destroy(key, { resource_type: "auto" });
  }

  getUrl(key: string): string {
    return cloudinary.url(key, { secure: true });
  }

  async getSignedUrl(key: string, expiresIn = 3600): Promise<string> {
    const timestamp = Math.floor(Date.now() / 1000) + expiresIn;
    const url = cloudinary.url(key, {
      secure: true,
      sign_url: true,
      timestamp,
    });
    return url;
  }

  async exists(key: string): Promise<boolean> {
    try {
      await cloudinary.api.resource(key);
      return true;
    } catch {
      return false;
    }
  }

  async list(prefix: string): Promise<{ key: string; size: number; lastModified: Date }[]> {
    try {
      const result = await cloudinary.api.resources({
        type: "upload",
        prefix: `${FOLDER}/${prefix}`,
        max_results: 100,
      });

      return result.resources.map((r: CloudinaryResource) => ({
        key: r.public_id,
        size: r.bytes,
        lastModified: new Date(r.created_at),
      }));
    } catch {
      return [];
    }
  }
}

interface CloudinaryUploadResult {
  secure_url: string;
  public_id: string;
}

interface CloudinaryResource {
  public_id: string;
  bytes: number;
  created_at: string;
}
