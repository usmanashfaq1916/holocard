import { createClient, SupabaseClient } from "@supabase/supabase-js";
import type { StorageProvider, StorageResult } from "./types";

const BUCKET_NAME = "holocard-uploads";

export class SupabaseProvider implements StorageProvider {
  private client: SupabaseClient;
  private bucket: string;

  constructor() {
    const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error(
        "Storage not configured: set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY. " +
        "Create a free project at https://app.supabase.com → Settings → API."
      );
    }

    this.client = createClient(supabaseUrl, supabaseServiceKey, {
      auth: { persistSession: false },
    });
    this.bucket = BUCKET_NAME;
  }

  async upload(key: string, buffer: Buffer, mimeType: string): Promise<StorageResult> {
    const { error } = await this.client.storage
      .from(this.bucket)
      .upload(key, buffer, { contentType: mimeType, upsert: false });

    if (error) throw new Error(`Supabase upload failed: ${error.message}`);

    const { data } = this.client.storage.from(this.bucket).getPublicUrl(key);

    return {
      url: data.publicUrl,
      key,
      size: buffer.length,
      mimeType,
    };
  }

  async delete(key: string): Promise<void> {
    const { error } = await this.client.storage.from(this.bucket).remove([key]);
    if (error) throw new Error(`Supabase delete failed: ${error.message}`);
  }

  getUrl(key: string): string {
    const { data } = this.client.storage.from(this.bucket).getPublicUrl(key);
    return data.publicUrl;
  }

  async getSignedUrl(key: string, expiresIn = 3600): Promise<string> {
    const { data, error } = await this.client.storage
      .from(this.bucket)
      .createSignedUrl(key, expiresIn);
    if (error) throw new Error(`Supabase signed URL failed: ${error.message}`);
    return data.signedUrl;
  }

  async exists(key: string): Promise<boolean> {
    try {
      await this.client.storage.from(this.bucket).list(key.split("/").slice(0, -1).join("/"), {
        limit: 1,
        search: key.split("/").pop(),
      });
      return true;
    } catch {
      return false;
    }
  }

  async list(prefix: string): Promise<{ key: string; size: number; lastModified: Date }[]> {
    const folder = prefix.replace(/\/$/, "");
    const { data, error } = await this.client.storage.from(this.bucket).list(folder);
    if (error) throw new Error(`Supabase list failed: ${error.message}`);

    return (data || []).map((item) => ({
      key: `${folder}/${item.name}`,
      size: item.metadata?.size || 0,
      lastModified: new Date(item.created_at || Date.now()),
    }));
  }
}
