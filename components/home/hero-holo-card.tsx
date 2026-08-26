"use client";

import { Suspense } from "react";
import { LazyARModelViewer } from "@/lib/lazy-imports";
import { DEMO_SLUG } from "@/lib/config";

export function HeroHoloCard() {
  return (
    <div className="relative">
      <div className="glass animate-float rounded-2xl p-2 glow-md">
        <LazyARModelViewer
          name="Usman Ashfaq"
          designation="Data Analyst"
          company="Tech Corp"
          cardColor="#2563EB"
          socialLinks={[
            { platform: "linkedin", url: "#" },
            { platform: "twitter", url: "#" },
            { platform: "github", url: "#" },
          ]}
          slug={DEMO_SLUG}
          className="h-[300px] w-full md:h-[350px]"
        />
      </div>

      {/* Floating badges */}
      <div className="absolute -left-4 top-8 hidden animate-float md:block">
        <div className="glass rounded-lg px-3 py-1.5 text-xs font-medium shadow-sm">
          <span className="mr-1 inline-block h-2 w-2 rounded-full bg-green-500" />
              Interactive AR
        </div>
      </div>
      <div className="absolute -right-4 top-16 hidden animate-float delay-1000 md:block">
        <div className="glass rounded-lg px-3 py-1.5 text-xs font-medium shadow-sm">
          AR Ready
        </div>
      </div>
    </div>
  );
}

export function HeroHoloCardSkeleton() {
  return (
    <div className="glass rounded-2xl p-2 glow-md">
      <div className="flex h-[300px] w-full items-center justify-center rounded-xl bg-muted/30 md:h-[350px]">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          <span className="text-sm text-muted-foreground">        Loading AR preview...</span>
        </div>
      </div>
    </div>
  );
}
