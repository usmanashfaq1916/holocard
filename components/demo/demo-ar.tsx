"use client";

import Link from "next/link";
import { Smartphone, ArrowRight, UserPlus, Share2, QrCode } from "lucide-react";

export function DemoAR() {
  return (
    <section className="flex min-h-screen flex-col items-center justify-center px-4 pt-20 pb-24">
      <div className="mx-auto max-w-6xl text-center">
        <div className="mb-6">
          <span className="rounded-full bg-primary/10 px-4 py-1.5 text-xs font-semibold text-primary">
            02 / 07
          </span>
        </div>

        <h2 className="mb-4 text-4xl font-bold md:text-5xl">
          Immersive <span className="text-gradient">AR Experience</span>
        </h2>
        <p className="mx-auto mb-12 max-w-2xl text-lg text-muted-foreground">
          Your profile comes alive with a holographic card, interactive buttons, social links, and
          one-tap contact saving. All from a single QR scan.
        </p>

        {/* Phone mockup with AR preview */}
        <div className="mx-auto max-w-sm">
          <div className="relative rounded-[2.5rem] border-4 border-gray-800 bg-gray-900 p-2 shadow-2xl">
            {/* Notch */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 h-6 w-32 rounded-b-2xl bg-gray-800" />

            {/* Screen */}
            <div className="overflow-hidden rounded-[2rem] bg-background">
              {/* AR Header */}
              <div className="flex items-center justify-between border-b border-border px-4 py-3">
                <span className="text-xs text-muted-foreground">← Back</span>
                <span className="text-xs font-medium">AR Experience</span>
                <span className="text-xs text-muted-foreground">QR</span>
              </div>

              {/* Profile section */}
              <div className="p-6 text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-primary to-cyan text-lg font-bold text-white">
                  SC
                </div>
                <h3 className="mt-3 text-sm font-bold">Sarah Chen</h3>
                <p className="text-xs text-muted-foreground">Lead Designer at DesignStudio</p>
              </div>

              {/* 3D card placeholder */}
              <div className="mx-4 mb-4 h-32 rounded-xl bg-gradient-to-br from-primary/10 to-cyan/10 border border-border flex items-center justify-center">
                <div className="text-center">
                  <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                  <p className="mt-2 text-[10px] text-muted-foreground">AR HoloCard</p>
                </div>
              </div>

              {/* Action buttons */}
              <div className="grid grid-cols-3 gap-2 px-4 pb-4">
                <div className="flex flex-col items-center gap-1 rounded-lg bg-primary/10 p-2">
                  <UserPlus className="h-4 w-4 text-primary" />
                  <span className="text-[10px]">Save</span>
                </div>
                <div className="flex flex-col items-center gap-1 rounded-lg bg-primary/10 p-2">
                  <Share2 className="h-4 w-4 text-primary" />
                  <span className="text-[10px]">Share</span>
                </div>
                <div className="flex flex-col items-center gap-1 rounded-lg bg-primary/10 p-2">
                  <QrCode className="h-4 w-4 text-primary" />
                  <span className="text-[10px]">QR</span>
                </div>
              </div>
            </div>
          </div>

          {/* Feature callouts */}
          <div className="mt-8 grid grid-cols-2 gap-4">
            {[
              { icon: Smartphone, title: "Mobile First", desc: "Optimized for smartphones" },
              { icon: UserPlus, title: "Save Contact", desc: "One-tap vCard download" },
              { icon: Share2, title: "Share Instantly", desc: "Web Share API + fallbacks" },
              { icon: QrCode, title: "QR Access", desc: "Scan to open any card" },
            ].map((item) => (
              <div key={item.title} className="glass rounded-xl p-4 text-left">
                <item.icon className="mb-2 h-5 w-5 text-primary" />
                <h4 className="text-sm font-semibold">{item.title}</h4>
                <p className="text-xs text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>

          <Link
            href="/ar/usman-ashfaq"
            className="mt-8 inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
          >
            Try Live AR Experience
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
