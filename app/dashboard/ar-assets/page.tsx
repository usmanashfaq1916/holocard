"use client";

import { useEffect, useState } from "react";
import {
  Box,
  Upload,
  Trash2,
  FileVideo,
  FileImage,
  FileBox,
  Calendar,
} from "lucide-react";
import { buttonVariants } from "@/components/ui/button";

interface ARAsset {
  id: string;
  name: string;
  type: string;
  fileUrl: string;
  fileSize: number | null;
  mimeType: string | null;
  createdAt: string;
}

const typeIcons: Record<string, typeof Box> = {
  glb: FileBox,
  gltf: FileBox,
  "image-target": FileImage,
  png: FileImage,
  jpg: FileImage,
  jpeg: FileImage,
  mp4: FileVideo,
};

const typeColors: Record<string, string> = {
  glb: "text-primary",
  gltf: "text-primary",
  "image-target": "text-cyan",
  png: "text-success",
  jpg: "text-success",
  jpeg: "text-success",
  mp4: "text-warning",
};

function formatFileSize(bytes: number | null) {
  if (!bytes) return "Unknown";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function ARAssetsPage() {
  const [assets, setAssets] = useState<ARAsset[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetch("/api/ar-assets")
      .then((r) => r.json())
      .then((data) => {
        setAssets(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const deleteAsset = async (id: string) => {
    if (!confirm("Delete this asset?")) return;
    await fetch(`/api/ar-assets/${id}`, { method: "DELETE" });
    setAssets(assets.filter((a) => a.id !== id));
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("purpose", "model");

      // Upload file to Supabase Storage via API
      const uploadRes = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!uploadRes.ok) {
        const err = await uploadRes.json();
        alert(err.error || "Upload failed");
        return;
      }

      const { url, filename, mimeType, size } = await uploadRes.json();

      // Create AR asset record
      const type = file.name.split(".").pop() || "unknown";
      const res = await fetch("/api/ar-assets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: filename,
          type,
          fileUrl: url,
          fileSize: size,
          mimeType,
        }),
      });

      if (res.ok) {
        const asset = await res.json();
        setAssets([asset, ...assets]);
      }
    } catch {
      alert("Upload failed. Make sure SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are configured.");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">AR Assets</h1>
          <p className="text-sm text-muted-foreground">
            Manage your 3D models, image targets, and AR resources.
          </p>
        </div>
        <label className={buttonVariants({ variant: "default", className: "cursor-pointer" })}>
          <Upload className="mr-2 h-4 w-4" />
          {uploading ? "Uploading..." : "Upload Asset"}
          <input
            type="file"
            className="hidden"
            accept=".glb,.gltf,.png,.jpg,.jpeg,.mp4"
            onChange={handleUpload}
            disabled={uploading}
          />
        </label>
      </div>

      {/* Supported formats */}
      <div className="glass rounded-xl p-4">
        <h3 className="mb-2 text-sm font-medium">Supported Formats</h3>
        <div className="flex flex-wrap gap-2">
          {["GLB", "GLTF", "PNG (Image Target)", "JPG (Image Target)", "MP4"].map(
            (fmt) => (
              <span
                key={fmt}
                className="rounded-full bg-muted px-3 py-1 text-xs text-muted-foreground"
              >
                {fmt}
              </span>
            )
          )}
        </div>
        <p className="mt-2 text-xs text-muted-foreground">
          Maximum file size: 50MB. Models should be optimized for web (draco compression recommended).
        </p>
      </div>

      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="glass animate-pulse rounded-xl p-5">
              <div className="h-24 rounded-lg bg-muted" />
              <div className="mt-3 h-4 w-32 rounded bg-muted" />
            </div>
          ))}
        </div>
      ) : assets.length === 0 ? (
        <div className="glass flex flex-col items-center justify-center rounded-xl p-12">
          <Box className="h-12 w-12 text-muted-foreground" />
          <h3 className="mt-4 font-semibold">No assets yet</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Upload GLB, GLTF, image targets, or videos for your AR experiences.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {assets.map((asset) => {
            const Icon = typeIcons[asset.type] || Box;
            const color = typeColors[asset.type] || "text-muted-foreground";
            return (
              <div key={asset.id} className="glass rounded-xl p-5">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`flex h-10 w-10 items-center justify-center rounded-lg bg-muted ${color}`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-medium text-sm">{asset.name}</h3>
                      <p className="text-xs text-muted-foreground uppercase">
                        {asset.type} · {formatFileSize(asset.fileSize)}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => deleteAsset(asset.id)}
                    className="rounded-lg p-1.5 text-muted-foreground hover:bg-accent hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                <div className="mt-3 flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Calendar className="h-3 w-3" />
                  {new Date(asset.createdAt).toLocaleDateString()}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
