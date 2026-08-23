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
    _provider = new SupabaseProvider();
  }

  return _provider;
}

export type { StorageProvider, StorageResult } from "./types";
