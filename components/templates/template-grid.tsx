"use client";

import { useState } from "react";
import Link from "next/link";
import { Eye, Sparkles, X } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";

interface Template {
  id: string;
  name: string;
  style: string;
  premium: boolean;
  gradient: string;
  accent: string;
  layout: "centered" | "left";
  description: string;
}

export function TemplateGrid({ templates }: { templates: Template[] }) {
  const [preview, setPreview] = useState<Template | null>(null);

  return (
    <>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {templates.map((template) => (
          <div
            key={template.id}
            className="glass group overflow-hidden rounded-xl transition-all hover:glow-sm"
          >
            {/* Mini Card Preview */}
            <div className={`relative h-52 bg-gradient-to-br ${template.gradient} p-6`}>
              <div className="absolute inset-0 bg-black/10" />
              <div className="relative flex h-full flex-col items-center justify-center rounded-xl bg-white/10 p-4 backdrop-blur-sm">
                {/* Profile circle */}
                <div className="mb-2 h-10 w-10 rounded-full bg-white/30" />
                {/* Name */}
                <div className="mb-1 h-3 w-24 rounded bg-white/40" />
                {/* Title */}
                <div className="mb-3 h-2 w-16 rounded bg-white/25" />
                {/* Buttons */}
                <div className="flex gap-1.5">
                  <div className="h-2 w-12 rounded-full bg-white/30" />
                  <div className="h-2 w-12 rounded-full bg-white/30" />
                </div>
                {/* Social icons */}
                <div className="mt-3 flex gap-1">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-3 w-3 rounded-full bg-white/25" />
                  ))}
                </div>
              </div>
              {/* Layout indicator */}
              <div className="absolute bottom-2 right-2 rounded bg-black/30 px-1.5 py-0.5 text-[10px] text-white/70">
                {template.layout}
              </div>
            </div>

            {/* Info + Actions */}
            <div className="p-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">{template.name}</h3>
                {template.premium ? (
                  <span className="flex items-center gap-1 rounded-full bg-primary/20 px-2 py-0.5 text-xs text-primary">
                    <Sparkles className="h-3 w-3" /> Pro
                  </span>
                ) : (
                  <span className="rounded-full bg-success/10 px-2 py-0.5 text-xs text-success">
                    Free
                  </span>
                )}
              </div>
              <p className="mt-1 text-sm text-muted-foreground">
                {template.style}
              </p>
              <div className="mt-3 flex gap-2">
                <button
                  onClick={() => setPreview(template)}
                  className={buttonVariants({ variant: "outline", size: "sm" })}
                >
                  <Eye className="mr-1 h-3 w-3" /> Preview
                </button>
                <Link
                  href={`/dashboard/cards/new?template=${template.id}`}
                  className={buttonVariants({ variant: "default", size: "sm" })}
                >
                  Use Template
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Preview Modal */}
      {preview && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
          onClick={() => setPreview(null)}
        >
          <div
            className="relative w-full max-w-md overflow-hidden rounded-2xl bg-background shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setPreview(null)}
              className="absolute right-3 top-3 z-10 rounded-full bg-black/30 p-1.5 text-white transition-colors hover:bg-black/50"
            >
              <X className="h-4 w-4" />
            </button>

            {/* Preview Card */}
            <div className={`relative h-80 bg-gradient-to-br ${preview.gradient} p-6`}>
              <div className="absolute inset-0 bg-black/10" />
              <div className={`relative flex h-full flex-col ${preview.layout === "left" ? "items-start" : "items-center"} justify-center rounded-xl bg-white/10 p-6 backdrop-blur-sm`}>
                <div className="mb-3 h-16 w-16 rounded-full bg-white/30" />
                <div className={`mb-1 h-4 w-32 rounded bg-white/40 ${preview.layout === "left" ? "ml-0" : ""}`} />
                <div className={`mb-1 h-3 w-24 rounded bg-white/25 ${preview.layout === "left" ? "ml-0" : ""}`} />
                <div className={`mb-4 h-2 w-40 rounded bg-white/20 ${preview.layout === "left" ? "ml-0" : ""}`} />
                <div className="flex gap-2">
                  <div className="h-3 w-20 rounded-full bg-white/30" />
                  <div className="h-3 w-20 rounded-full bg-white/30" />
                </div>
                <div className="mt-4 flex gap-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="h-4 w-4 rounded-full bg-white/25" />
                  ))}
                </div>
              </div>
            </div>

            {/* Template Info */}
            <div className="p-6">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold">{preview.name}</h3>
                {preview.premium && (
                  <span className="flex items-center gap-1 rounded-full bg-primary/20 px-2 py-0.5 text-xs text-primary">
                    <Sparkles className="h-3 w-3" /> Pro
                  </span>
                )}
              </div>
              <p className="mt-1 text-sm text-muted-foreground">{preview.description}</p>
              <div className="mt-1 flex items-center gap-3 text-xs text-muted-foreground">
                <span className="capitalize">{preview.layout} layout</span>
                <span>·</span>
                <span>Accent: {preview.accent}</span>
              </div>
              <div className="mt-4 flex gap-3">
                <Link
                  href={`/dashboard/cards/new?template=${preview.id}`}
                  className={buttonVariants({ variant: "default" })}
                >
                  Use This Template
                </Link>
                <button
                  onClick={() => setPreview(null)}
                  className={buttonVariants({ variant: "outline" })}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
