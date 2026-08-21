"use client";

import { useState } from "react";

const PRESET_THEMES = [
  { name: "Modern", primaryColor: "#2563EB", bgStyle: "solid" },
  { name: "Corporate", primaryColor: "#1E40AF", bgStyle: "solid" },
  { name: "Neon", primaryColor: "#22D3EE", bgStyle: "gradient" },
  { name: "Minimal", primaryColor: "#6B7280", bgStyle: "solid" },
  { name: "Glass", primaryColor: "#8B5CF6", bgStyle: "glass" },
  { name: "Executive", primaryColor: "#1E293B", bgStyle: "gradient" },
  { name: "Dark", primaryColor: "#0F172A", bgStyle: "solid" },
  { name: "Light", primaryColor: "#F8FAFC", bgStyle: "solid" },
];

interface ThemeConfig {
  primaryColor: string;
  bgStyle: string;
  fontFamily: string;
  borderRadius: string;
  shadow: string;
}

interface ThemeSelectorProps {
  value: ThemeConfig;
  onChange: (config: ThemeConfig) => void;
}

export function ThemeSelector({ value, onChange }: ThemeSelectorProps) {
  const [customColor, setCustomColor] = useState(value.primaryColor);

  return (
    <div className="space-y-4">
      <div>
        <label className="mb-2 block text-sm font-medium">Preset Theme</label>
        <div className="grid grid-cols-4 gap-2">
          {PRESET_THEMES.map((theme) => (
            <button
              key={theme.name}
              onClick={() => onChange({ ...value, primaryColor: theme.primaryColor, bgStyle: theme.bgStyle })}
              className={`flex flex-col items-center gap-1.5 rounded-lg border p-3 transition-all ${
                value.primaryColor === theme.primaryColor && value.bgStyle === theme.bgStyle
                  ? "border-primary bg-primary/10"
                  : "border-border hover:bg-accent"
              }`}
            >
              <div
                className="h-6 w-6 rounded-full"
                style={{ backgroundColor: theme.primaryColor }}
              />
              <span className="text-xs">{theme.name}</span>
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium">Custom Color</label>
        <div className="flex items-center gap-3">
          <input
            type="color"
            value={customColor}
            onChange={(e) => {
              setCustomColor(e.target.value);
              onChange({ ...value, primaryColor: e.target.value });
            }}
            className="h-10 w-10 cursor-pointer rounded-lg border border-border"
          />
          <input
            type="text"
            value={customColor}
            onChange={(e) => {
              setCustomColor(e.target.value);
              if (/^#[0-9A-Fa-f]{6}$/.test(e.target.value)) {
                onChange({ ...value, primaryColor: e.target.value });
              }
            }}
            className="flex-1 rounded-lg border border-border bg-background px-3 py-2 text-sm"
            placeholder="#2563EB"
          />
        </div>
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium">Background Style</label>
        <div className="flex gap-2">
          {["solid", "gradient", "glass"].map((style) => (
            <button
              key={style}
              onClick={() => onChange({ ...value, bgStyle: style })}
              className={`rounded-lg border px-4 py-2 text-xs font-medium capitalize transition-colors ${
                value.bgStyle === style
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border text-muted-foreground hover:bg-accent"
              }`}
            >
              {style}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium">Border Radius</label>
        <div className="flex gap-2">
          {["0.5rem", "0.75rem", "1rem", "1.5rem"].map((r) => (
            <button
              key={r}
              onClick={() => onChange({ ...value, borderRadius: r })}
              className={`rounded-lg border px-3 py-2 text-xs font-medium transition-colors ${
                value.borderRadius === r
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border text-muted-foreground hover:bg-accent"
              }`}
              style={{ borderRadius: r }}
            >
              {r}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
