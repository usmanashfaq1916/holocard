"use client";

import { useState } from "react";
import Link from "next/link";
import {
  User, Palette, Link2, Image, MousePointerClick, Search,
  ArrowRight,
} from "lucide-react";

const tabs = [
  { id: "profile", label: "Profile", icon: User, fields: ["Name", "Slug", "Designation", "Company", "Bio"] },
  { id: "design", label: "Design", icon: Palette, fields: ["Template", "Accent Color", "Background Style", "Font Family"] },
  { id: "social", label: "Social", icon: Link2, fields: ["LinkedIn", "Twitter/X", "GitHub", "Instagram", "Facebook"] },
  { id: "media", label: "Media", icon: Image, fields: ["Profile Image", "Cover Image", "3D Model"] },
  { id: "buttons", label: "Buttons", icon: MousePointerClick, fields: ["Custom Links", "Action Buttons", "Order & Visibility"] },
  { id: "seo", label: "SEO", icon: Search, fields: ["Meta Title", "Meta Description", "Visibility", "Indexing"] },
];

const demoData: Record<string, Record<string, string>> = {
  profile: { Name: "Sarah Chen", Slug: "sarah-chen", Designation: "Lead Designer", Company: "DesignStudio", Bio: "Passionate about creating intuitive user experiences..." },
  design: { Template: "Designer", "Accent Color": "#EC4899", "Background Style": "gradient", "Font Family": "Inter" },
  social: { LinkedIn: "linkedin.com/in/sarahchen", "Twitter/X": "@sarahchen", GitHub: "github.com/sarahchen", Instagram: "@sarah.designs", Facebook: "—" },
  media: { "Profile Image": "uploaded ✓", "Cover Image": "uploaded ✓", "3D Model": "not set" },
  buttons: { "Custom Links": "3 active", "Action Buttons": "Portfolio, Resume", "Order & Visibility": "drag to reorder" },
  seo: { "Meta Title": "Sarah Chen | Lead Designer", "Meta Description": "Design leader at DesignStudio...", Visibility: "PUBLIC", Indexing: "allowed" },
};

export function DemoBuilder() {
  const [activeTab, setActiveTab] = useState("profile");

  return (
    <section className="flex min-h-screen flex-col items-center justify-center px-4 pt-20 pb-24">
      <div className="mx-auto max-w-6xl text-center">
        <div className="mb-6">
          <span className="rounded-full bg-primary/10 px-4 py-1.5 text-xs font-semibold text-primary">
            04 / 07
          </span>
        </div>

        <h2 className="mb-4 text-4xl font-bold md:text-5xl">
          Powerful <span className="text-gradient">Card Builder</span>
        </h2>
        <p className="mx-auto mb-12 max-w-2xl text-lg text-muted-foreground">
          A tabbed editor with everything you need. Profile, design, social links,
          media, custom buttons, and SEO — all in one place.
        </p>

        {/* Editor preview */}
        <div className="mx-auto max-w-5xl overflow-hidden rounded-2xl border border-border bg-card shadow-xl">
          {/* Editor header */}
          <div className="flex items-center gap-2 border-b border-border px-4 py-3">
            <div className="flex gap-1.5">
              <div className="h-3 w-3 rounded-full bg-red-400" />
              <div className="h-3 w-3 rounded-full bg-yellow-400" />
              <div className="h-3 w-3 rounded-full bg-green-400" />
            </div>
            <span className="ml-2 text-sm text-muted-foreground">Card Editor</span>
          </div>

          <div className="flex flex-col md:flex-row">
            {/* Tab sidebar */}
            <div className="flex md:flex-col gap-1 border-b md:border-b-0 md:border-r border-border p-2 md:w-48 overflow-x-auto">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 whitespace-nowrap rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                    activeTab === tab.id
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-accent"
                  }`}
                >
                  <tab.icon className="h-4 w-4 shrink-0" />
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Content */}
            <div className="flex-1 p-6">
              <div className="space-y-4">
                {tabs
                  .find((t) => t.id === activeTab)
                  ?.fields.map((field) => (
                    <div key={field} className="text-left">
                      <label className="mb-1.5 block text-sm font-medium">{field}</label>
                      <div className="rounded-lg border border-border bg-background px-4 py-2.5 text-sm text-muted-foreground">
                        {demoData[activeTab]?.[field] || "—"}
                      </div>
                    </div>
                  ))}
              </div>

              <div className="mt-6 flex items-center justify-between">
                <span className="text-xs text-muted-foreground">
                  Read-only preview
                </span>
                <Link
                  href="/register"
                  className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
                >
                  Start Building
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
