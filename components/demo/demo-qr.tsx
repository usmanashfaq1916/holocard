"use client";

import { useState } from "react";
import { Download, Palette } from "lucide-react";
import { QRGenerator } from "@/components/cards/qr-generator";

export function DemoQR() {
  const [size, setSize] = useState(200);
  const [slug, setSlug] = useState("sarah-chen");

  return (
    <section className="flex min-h-screen flex-col items-center justify-center px-4 pt-20 pb-24">
      <div className="mx-auto max-w-6xl text-center">
        <div className="mb-6">
          <span className="rounded-full bg-primary/10 px-4 py-1.5 text-xs font-semibold text-primary">
            03 / 07
          </span>
        </div>

        <h2 className="mb-4 text-4xl font-bold md:text-5xl">
          Instant <span className="text-gradient">QR Codes</span>
        </h2>
        <p className="mx-auto mb-12 max-w-2xl text-lg text-muted-foreground">
          Generate unique QR codes for every card. Download as PNG or SVG for
          print-ready business cards and networking materials.
        </p>

        <div className="mx-auto grid max-w-4xl gap-8 md:grid-cols-2">
          {/* QR Preview */}
          <div className="flex items-center justify-center">
            <div className="glass rounded-3xl p-8 glow-md">
              <QRGenerator slug={slug} size={size} />
              <div className="mt-4 flex justify-center gap-2">
                <button className="flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs font-medium transition-colors hover:bg-accent">
                  <Download className="h-3 w-3" />
                  PNG
                </button>
                <button className="flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs font-medium transition-colors hover:bg-accent">
                  <Download className="h-3 w-3" />
                  SVG
                </button>
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="flex flex-col justify-center gap-6 text-left">
            <div>
              <label className="mb-2 block text-sm font-medium">Card Slug</label>
              <input
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="e.g. sarah-chen"
              />
              <p className="mt-1 text-xs text-muted-foreground">
                Generates: yoursite.com/card/{slug || "..."}
              </p>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">
                Size: {size}px
              </label>
              <input
                type="range"
                min={100}
                max={400}
                value={size}
                onChange={(e) => setSize(Number(e.target.value))}
                className="w-full accent-primary"
              />
              <div className="mt-1 flex justify-between text-xs text-muted-foreground">
                <span>100px</span>
                <span>400px</span>
              </div>
            </div>

            <div className="glass rounded-xl p-4">
              <div className="flex items-center gap-2 text-sm font-medium">
                <Palette className="h-4 w-4 text-primary" />
                Auto-adapts to dark mode
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                QR colors automatically invert for dark/light themes.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
