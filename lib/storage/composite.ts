import type { StorageProvider, StorageResult } from "./types";

export class CompositeStorageProvider implements StorageProvider {
  private primary: StorageProvider;
  private fallback: StorageProvider | null = null;
  private fallbackName: string;

  constructor(primary: StorageProvider, fallback: StorageProvider | null, fallbackName: string) {
    this.primary = primary;
    this.fallback = fallback;
    this.fallbackName = fallbackName;
  }

  async upload(key: string, buffer: Buffer, mimeType: string): Promise<StorageResult> {
    try {
      return await this.primary.upload(key, buffer, mimeType);
    } catch (error) {
      if (!this.fallback) throw error;
      console.warn(`Primary storage failed, falling back to ${this.fallbackName}:`, error);
      return await this.fallback.upload(key, buffer, mimeType);
    }
  }

  async delete(key: string): Promise<void> {
    try {
      await this.primary.delete(key);
    } catch (error) {
      if (!this.fallback) throw error;
      console.warn(`Primary delete failed, trying ${this.fallbackName}:`, error);
      try {
        await this.fallback.delete(key);
      } catch {
        // Both failed, silent
      }
    }
  }

  getUrl(key: string): string {
    return this.primary.getUrl(key);
  }

  async getSignedUrl(key: string, expiresIn?: number): Promise<string> {
    try {
      return await this.primary.getSignedUrl(key, expiresIn);
    } catch (error) {
      if (!this.fallback) throw error;
      return await this.fallback.getSignedUrl(key, expiresIn);
    }
  }

  async exists(key: string): Promise<boolean> {
    const primaryExists = await this.primary.exists(key);
    if (primaryExists) return true;
    if (!this.fallback) return false;
    return this.fallback.exists(key);
  }

  async list(prefix: string): Promise<{ key: string; size: number; lastModified: Date }[]> {
    return this.primary.list(prefix);
  }
}
