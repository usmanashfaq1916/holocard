import type { StorageProvider } from "./types";

let _provider: StorageProvider | null = null;

export async function getStorage(): Promise<StorageProvider> {
  if (_provider) return _provider;

  const driver = process.env.STORAGE_DRIVER || "supabase";

  if (driver === "cloudinary") {
    const { CloudinaryProvider } = await import("./cloudinary");
    _provider = new CloudinaryProvider();
  } else if (driver === "minio") {
    const { MinIOProvider } = await import("./minio");
    _provider = new MinIOProvider();
  } else {
    const { SupabaseProvider } = await import("./supabase");
    const primary = new SupabaseProvider();

    if (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET) {
      const { CloudinaryProvider } = await import("./cloudinary");
      const fallback = new CloudinaryProvider();
      const { CompositeStorageProvider } = await import("./composite");
      _provider = new CompositeStorageProvider(primary, fallback, "cloudinary");
    } else {
      _provider = primary;
    }
  }

  return _provider;
}

export type { StorageProvider, StorageResult } from "./types";
