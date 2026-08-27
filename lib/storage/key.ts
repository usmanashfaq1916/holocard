const DRIVER = () => process.env.STORAGE_DRIVER || "supabase";

export function extractStorageKey(url: string): string | null {
  const driver = DRIVER();

  if (driver === "cloudinary") {
    const match = url.match(/upload\/(?:v\d+\/)?(.+?)(?:\.\w+)?$/);
    return match ? `holocard/${match[1]}` : null;
  }

  if (driver === "minio") {
    const prefix = `${process.env.MINIO_BUCKET || "holocard"}/`;
    const idx = url.indexOf(prefix);
    return idx !== -1 ? url.slice(idx + prefix.length) : null;
  }

  const supabasePrefix = "holocard-uploads/";
  const idx = url.indexOf(supabasePrefix);
  return idx !== -1 ? url.slice(idx + supabasePrefix.length) : null;
}
