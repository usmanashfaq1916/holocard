import { createClient, SupabaseClient } from "@supabase/supabase-js";

let _client: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient {
  if (_client) return _client;

  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error(
      "Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY environment variables. " +
      "Create a free Supabase project at https://app.supabase.com and add these to your .env."
    );
  }

  _client = createClient(supabaseUrl, supabaseServiceKey, {
    auth: { persistSession: false },
  });

  return _client;
}

export const BUCKET_NAME = "holocard-uploads";

const ALLOWED_MIME_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
  "model/gltf-binary",
  "model/gltf+json",
  "video/mp4",
]);

const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB

export function validateUpload(file: File): { valid: boolean; error?: string } {
  if (!ALLOWED_MIME_TYPES.has(file.type)) {
    return { valid: false, error: `File type ${file.type} is not allowed. Allowed: JPEG, PNG, GIF, WebP, GLB, GLTF, MP4.` };
  }
  if (file.size > MAX_FILE_SIZE) {
    return { valid: false, error: `File size ${(file.size / 1024 / 1024).toFixed(1)}MB exceeds 50MB limit.` };
  }
  return { valid: true };
}
