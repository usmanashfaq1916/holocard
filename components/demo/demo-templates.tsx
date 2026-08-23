"use client";

import { useEffect, useState } from "react";
import { Star, ArrowRight } from "lucide-react";

interface Template {
  id: string;
  name: string;
  slug: string;
  style: string;
  description: string | null;
  isPremium: boolean;
  config: { primaryColor?: string; bgStyle?: string };
}

const fallbackTemplates: Template[] = [
  { id: "1", name: "Corporate", slug: "corporate", style: "CORPORATE", description: "Professional blue tones for corporate environments", isPremium: false, config: { primaryColor: "#2563EB", bgStyle: "solid" } },
  { id: "2", name: "Executive", slug: "executive", style: "EXECUTIVE", description: "Elegant dark theme for executives", isPremium: true, config: { primaryColor: "#1E293B", bgStyle: "gradient" } },
  { id: "3", name: "Developer", slug: "developer", style: "DEVELOPER", description: "Monospace accents for developers", isPremium: false, config: { primaryColor: "#22D3EE", bgStyle: "solid" } },
  { id: "4", name: "Data Analyst", slug: "data-analyst", style: "DATA_ANALYST", description: "Clean and modern for data professionals", isPremium: false, config: { primaryColor: "#8B5CF6", bgStyle: "solid" } },
  { id: "5", name: "Designer", slug: "designer", style: "DESIGNER", description: "Creative and colorful for designers", isPremium: true, config: { primaryColor: "#EC4899", bgStyle: "gradient" } },
  { id: "6", name: "Freelancer", slug: "freelancer", style: "FREELANCER", description: "Bold and versatile for freelancers", isPremium: false, config: { primaryColor: "#F59E0B", bgStyle: "solid" } },
  { id: "7", name: "Startup Founder", slug: "startup-founder", style: "STARTUP_FOUNDER", description: "Innovative and sleek for founders", isPremium: true, config: { primaryColor: "#10B981", bgStyle: "gradient" } },
  { id: "8", name: "Real Estate", slug: "real-estate", style: "REAL_ESTATE", description: "Trust and authority for real estate", isPremium: false, config: { primaryColor: "#059669", bgStyle: "solid" } },
  { id: "9", name: "Sales", slug: "sales", style: "SALES", description: "Dynamic and engaging for salespeople", isPremium: false, config: { primaryColor: "#EF4444", bgStyle: "solid" } },
  { id: "10", name: "Minimal", slug: "minimal", style: "MINIMAL", description: "Simple and refined", isPremium: false, config: { primaryColor: "#6B7280", bgStyle: "solid" } },
];

export function DemoTemplates() {
  const [templates, setTemplates] = useState<Template[]>(fallbackTemplates);

  useEffect(() => {
    fetch("/api/templates")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) setTemplates(data);
      })
      .catch(() => {});
  }, []);

  return (
    <section className="flex min-h-screen flex-col items-center justify-center px-4 pt-20 pb-24">
      <div className="mx-auto max-w-6xl text-center">
        <div className="mb-6">
          <span className="rounded-full bg-primary/10 px-4 py-1.5 text-xs font-semibold text-primary">
            06 / 07
          </span>
        </div>

        <h2 className="mb-4 text-4xl font-bold md:text-5xl">
          <span className="text-gradient">10+</span> Professional Templates
        </h2>
        <p className="mx-auto mb-12 max-w-2xl text-lg text-muted-foreground">
          Pick from professionally designed templates to match your brand.
          Each template is fully customizable.
        </p>

        {/* Template grid */}
        <div className="mx-auto grid max-w-5xl gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
          {templates.map((template) => (
            <div
              key={template.id}
              className="group glass cursor-pointer rounded-xl p-4 text-left transition-all hover:glow-sm hover:scale-105"
            >
              {/* Color swatch */}
              <div
                className="mb-3 h-16 rounded-lg"
                style={{
                  background: template.config.bgStyle === "gradient"
                    ? `linear-gradient(135deg, ${template.config.primaryColor}, ${template.config.primaryColor}88)`
                    : template.config.primaryColor,
                }}
              />

              <div className="flex items-start justify-between">
                <h3 className="text-sm font-semibold">{template.name}</h3>
                {template.isPremium && (
                  <Star className="h-3.5 w-3.5 shrink-0 fill-amber-400 text-amber-400" />
                )}
              </div>
              <p className="mt-1 text-[10px] text-muted-foreground line-clamp-2">
                {template.description}
              </p>
            </div>
          ))}
        </div>

        <p className="mt-6 text-sm text-muted-foreground">
          <Star className="mr-1 inline-block h-3 w-3 fill-amber-400 text-amber-400" />
          = Premium template
        </p>
      </div>
    </section>
  );
}
