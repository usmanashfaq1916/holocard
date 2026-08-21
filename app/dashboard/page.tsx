"use client";

import { CreditCard, Eye, QrCode, Box, UserPlus, MousePointerClick } from "lucide-react";

const stats = [
  { label: "Total Cards", value: "3", icon: CreditCard, change: "+1 this month" },
  { label: "Profile Views", value: "1,247", icon: Eye, change: "+12% from last week" },
  { label: "QR Scans", value: "89", icon: QrCode, change: "+5% from last week" },
  { label: "AR Sessions", value: "34", icon: Box, change: "+23% from last week" },
  { label: "Contact Saves", value: "56", icon: UserPlus, change: "+8 this week" },
  { label: "Link Clicks", value: "203", icon: MousePointerClick, change: "+15% from last week" },
];

const timeFilters = ["Today", "7 days", "30 days", "90 days"];

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-sm text-muted-foreground">
            Welcome back! Here&apos;s an overview of your cards.
          </p>
        </div>
        <div className="flex gap-2">
          {timeFilters.map((filter, i) => (
            <button
              key={filter}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                i === 1
                  ? "bg-primary/20 text-primary"
                  : "text-muted-foreground hover:bg-accent"
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat) => (
          <div key={stat.label} className="glass rounded-xl p-5">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">{stat.label}</p>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </div>
            <p className="mt-2 text-2xl font-bold">{stat.value}</p>
            <p className="mt-1 text-xs text-primary">{stat.change}</p>
          </div>
        ))}
      </div>

      <div className="glass rounded-xl p-6">
        <h2 className="mb-4 text-lg font-semibold">Activity Overview</h2>
        <div className="flex h-64 items-center justify-center rounded-lg border border-dashed border-border">
          <p className="text-sm text-muted-foreground">
            Analytics chart will appear here
          </p>
        </div>
      </div>
    </div>
  );
}
