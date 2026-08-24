"use client";

import { Suspense } from "react";
import { RotateCw, ZoomIn, MousePointer } from "lucide-react";
import { LazyARModelViewer } from "@/lib/lazy-imports";

export function Demo3DCard() {
  return (
    <section className="flex min-h-screen flex-col items-center justify-center px-4 pt-20 pb-24">
      <div className="mx-auto max-w-6xl text-center">
        {/* Step label */}
        <div className="mb-6">
          <span className="rounded-full bg-primary/10 px-4 py-1.5 text-xs font-semibold text-primary">
            01 / 07
          </span>
        </div>

        <h2 className="mb-4 text-4xl font-bold md:text-5xl">
          Interactive <span className="text-gradient">AR HoloCard</span>
        </h2>
        <p className="mx-auto mb-12 max-w-2xl text-lg text-muted-foreground">
          A premium holographic business card with glass effects, dynamic lighting, and real-time
          tilt tracking. Click to flip between front and back.
        </p>

        {/* 3D Card Preview */}
        <div className="mx-auto max-w-2xl">
          <div className="glass rounded-3xl p-3 glow-lg">
            <Suspense
              fallback={
                <div className="flex h-[400px] items-center justify-center rounded-2xl bg-muted/30">
                  <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                </div>
              }
            >
              <LazyARModelViewer
                name="Sarah Chen"
                designation="Lead Designer"
                company="DesignStudio"
                cardColor="#8B5CF6"
                socialLinks={[
                  { platform: "linkedin", url: "#" },
                  { platform: "twitter", url: "#" },
                  { platform: "dribbble", url: "#" },
                ]}
                slug="sarah-chen"
                className="h-[350px] md:h-[420px] rounded-2xl"
              />
            </Suspense>
          </div>

          {/* Feature badges */}
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            {[
              { icon: RotateCw, label: "Drag to rotate" },
              { icon: MousePointer, label: "Click to flip" },
              { icon: ZoomIn, label: "Holographic glass" },
            ].map((item) => (
              <div
                key={item.label}
                className="flex items-center gap-2 rounded-full border border-border bg-background px-4 py-2 text-sm text-muted-foreground"
              >
                <item.icon className="h-4 w-4 text-primary" />
                {item.label}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
