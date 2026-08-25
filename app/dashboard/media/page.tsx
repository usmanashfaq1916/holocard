"use client";

import { useEffect, useState } from "react";
import {
  Upload,
  HardDrive,
  FileImage,
  FileVideo,
  FileBox,
  Crosshair,
  Trash2,
  Calendar,
  Image as ImageIcon,
  Film,
  Box,
  Pencil,
  CreditCard,
} from "lucide-react";
import { buttonVariants } from "@/components/ui/button";

interface MediaItem {
  id: string;
  filename: string;
  url: string;
  type: string;
  size: number | null;
  width: number | null;
  height: number | null;
  duration: number | null;
  mimeType: string | null;
  createdAt: string;
}

type FilterType = "ALL" | "IMAGE" | "VIDEO" | "MODEL_3D";

const filterOptions: { value: FilterType; label: string; icon: typeof ImageIcon }[] = [
  { value: "ALL", label: "All", icon: Image as any },
  { value: "IMAGE", label: "Images", icon: FileImage },
  { value: "VIDEO", label: "Videos", icon: FileVideo },
  { value: "MODEL_3D", label: "3D Models", icon: FileBox },
];

const typeIcons: Record<string, typeof ImageIcon> = {
  IMAGE: FileImage,
  VIDEO: FileVideo,
  MODEL_3D: FileBox,
  AR_TARGET: Crosshair,
};

const typeColors: Record<string, string> = {
  IMAGE: "text-success",
  VIDEO: "text-warning",
  MODEL_3D: "text-primary",
  AR_TARGET: "text-cyan",
};

function formatSize(bytes: number | null) {
  if (!bytes) return "Unknown";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function MediaPage() {
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [filter, setFilter] = useState<FilterType>("ALL");
  const [renamingId, setRenamingId] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState("");

  useEffect(() => {
    fetch("/api/media")
      .then((r) => r.json())
      .then((data) => {
        setMedia(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const filtered = filter === "ALL" ? media : media.filter((m) => m.type === filter);

  const totalSize = media.reduce((acc, m) => acc + (m.size || 0), 0);
  const storageUsed = formatSize(totalSize);
  const storagePercent = Math.min((totalSize / (1024 * 1024 * 1024)) * 100, 100);

  const deleteMedia = async (id: string) => {
    if (!confirm("Delete this media file? This cannot be undone.")) return;
    try {
      const res = await fetch(`/api/media?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        setMedia(media.filter((m) => m.id !== id));
      }
    } catch {
      // Silently fail - file may already be deleted
    }
  };

  const renameMedia = async (id: string) => {
    if (!renameValue.trim()) return;
    try {
      const res = await fetch(`/api/media?id=${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ filename: renameValue.trim() }),
      });
      if (res.ok) {
        setMedia(media.map((m) => m.id === id ? { ...m, filename: renameValue.trim() } : m));
      }
      setRenamingId(null);
    } catch {}
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("purpose", "upload");

      const uploadRes = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!uploadRes.ok) {
        const err = await uploadRes.json();
        alert(err.error || "Upload failed");
        return;
      }

      const { id, url, filename, mimeType, size } = await uploadRes.json();

      const newMedia: MediaItem = {
        id,
        filename,
        url,
        type: mimeType?.startsWith("video/") ? "VIDEO" : mimeType?.startsWith("model/") ? "MODEL_3D" : "IMAGE",
        size,
        width: null,
        height: null,
        duration: null,
        mimeType,
        createdAt: new Date().toISOString(),
      };

      setMedia([newMedia, ...media]);
    } catch {
      alert("Upload failed.");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Media</h1>
          <p className="text-sm text-muted-foreground">
            Manage your uploaded images, videos, and 3D models.
          </p>
        </div>
        <label className={buttonVariants({ variant: "default", className: "cursor-pointer" })}>
          <Upload className="mr-2 h-4 w-4" />
          {uploading ? "Uploading..." : "Upload"}
          <input
            type="file"
            className="hidden"
            accept="image/*,video/*,.glb,.gltf"
            onChange={handleUpload}
            disabled={uploading}
          />
        </label>
      </div>

      {/* Storage bar */}
      <div className="glass rounded-xl p-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2 text-sm">
            <HardDrive className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium">Storage</span>
          </div>
          <span className="text-xs text-muted-foreground">
            {storageUsed} / 1 GB
          </span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-muted">
          <div
            className="h-full rounded-full bg-gradient-to-r from-primary to-cyan transition-all"
            style={{ width: `${storagePercent}%` }}
          />
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2">
        {filterOptions.map((opt) => (
          <button
            key={opt.value}
            onClick={() => setFilter(opt.value)}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
              filter === opt.value
                ? "bg-primary/20 text-primary"
                : "text-muted-foreground hover:bg-accent"
            }`}
          >
            <opt.icon className="h-3.5 w-3.5" />
            {opt.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="glass animate-pulse rounded-xl p-4">
              <div className="aspect-square rounded-lg bg-muted" />
              <div className="mt-3 h-4 w-3/4 rounded bg-muted" />
              <div className="mt-2 h-3 w-1/2 rounded bg-muted" />
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="glass flex flex-col items-center justify-center rounded-xl p-12">
          <FileImage className="h-12 w-12 text-muted-foreground" />
          <h3 className="mt-4 font-semibold">
            {media.length === 0 ? "No media yet" : "No matching files"}
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">
            {media.length === 0
              ? "Upload images, videos, or 3D models to use in your cards."
              : "Try a different filter."}
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((item) => {
            const Icon = typeIcons[item.type] || FileImage;
            const color = typeColors[item.type] || "text-muted-foreground";
            const isImage = item.type === "IMAGE" && item.mimeType?.startsWith("image/");
            const isVideo = item.type === "VIDEO" || item.mimeType?.startsWith("video/");

            return (
              <div key={item.id} className="glass rounded-xl overflow-hidden group">
                {/* Thumbnail */}
                <div className="relative aspect-square bg-muted">
                  {isImage ? (
                    <img
                      src={item.url}
                      alt={item.filename}
                      className="h-full w-full object-cover"
                    />
                  ) : isVideo ? (
                    <div className="flex h-full w-full items-center justify-center">
                      <Film className="h-12 w-12 text-muted-foreground" />
                    </div>
                  ) : (
                    <div className="flex h-full w-full items-center justify-center">
                      <Box className="h-12 w-12 text-muted-foreground" />
                    </div>
                  )}
                  <button
                    onClick={() => deleteMedia(item.id)}
                    className="absolute top-2 right-2 rounded-lg bg-background/80 p-1.5 text-muted-foreground opacity-0 group-hover:opacity-100 hover:text-destructive transition-opacity"
                    aria-label="Delete media"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>

                {/* Info */}
                <div className="p-3">
                  {renamingId === item.id ? (
                    <div className="flex gap-1">
                      <input
                        type="text"
                        value={renameValue}
                        onChange={(e) => setRenameValue(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") renameMedia(item.id);
                          if (e.key === "Escape") setRenamingId(null);
                        }}
                        className="flex-1 rounded border border-border bg-background px-2 py-0.5 text-sm outline-none focus:ring-1 focus:ring-primary"
                        autoFocus
                      />
                      <button
                        onClick={() => renameMedia(item.id)}
                        className="rounded bg-primary px-2 py-0.5 text-xs text-primary-foreground hover:bg-primary/90"
                      >
                        Save
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1">
                      <p className="flex-1 truncate text-sm font-medium">{item.filename}</p>
                      <button
                        onClick={() => {
                          setRenamingId(item.id);
                          setRenameValue(item.filename);
                        }}
                        className="rounded p-0.5 text-muted-foreground hover:text-foreground"
                        aria-label="Rename"
                      >
                        <Pencil className="h-3 w-3" />
                      </button>
                    </div>
                  )}
                  <div className="mt-1 flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Icon className={`h-3 w-3 ${color}`} />
                      <span className="uppercase">{item.type.replace("_3D", " 3D")}</span>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {formatSize(item.size)}
                    </span>
                  </div>
                  <div className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    {new Date(item.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
