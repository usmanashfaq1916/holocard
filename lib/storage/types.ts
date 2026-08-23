export interface StorageResult {
  url: string;
  key: string;
  size: number;
  mimeType: string;
}

export interface StorageProvider {
  upload(key: string, buffer: Buffer, mimeType: string): Promise<StorageResult>;
  delete(key: string): Promise<void>;
  getUrl(key: string): string;
  getSignedUrl(key: string, expiresIn?: number): Promise<string>;
  exists(key: string): Promise<boolean>;
  list(prefix: string): Promise<{ key: string; size: number; lastModified: Date }[]>;
}
