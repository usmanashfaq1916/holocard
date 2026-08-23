import type { StorageProvider } from "./types";
import { MinIOProvider } from "./minio";
import { SupabaseProvider } from "./supabase";

let _provider: StorageProvider | null = null;

export function getStorage(): StorageProvider {
  if (_provider) return _provider;

  const driver = process.env.STORAGE_DRIVER || "supabase";

  _provider = driver === "minio"
    ? new MinIOProvider()
    : new SupabaseProvider();

  return _provider;
}

export type { StorageProvider, StorageResult } from "./types";
