"use client";

import { BarChart3, Eye, QrCode, Box, UserPlus } from "lucide-react";

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Analytics</h1>
        <p className="text-sm text-muted-foreground">
          Track how your cards are performing.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-4">
        {[
          { label: "Total Views", value: "1,247", icon: Eye, color: "text-primary" },
          { label: "QR Scans", value: "89", icon: QrCode, color: "text-cyan" },
          { label: "AR Sessions", value: "34", icon: Box, color: "text-primary" },
          { label: "Contact Saves", value: "56", icon: UserPlus, color: "text-cyan" },
        ].map((stat) => (
          <div key={stat.label} className="glass rounded-xl p-4">
            <stat.icon className={`h-5 w-5 ${stat.color}`} />
            <p className="mt-2 text-2xl font-bold">{stat.value}</p>
            <p className="text-xs text-muted-foreground">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="glass rounded-xl p-6">
        <h2 className="mb-4 text-lg font-semibold">Views Over Time</h2>
        <div className="flex h-72 items-center justify-center rounded-lg border border-dashed border-border">
          <p className="text-sm text-muted-foreground">
            Analytics chart coming in Phase 4
          </p>
        </div>
      </div>
    </div>
  );
}
