"use client";

import {
  Eye, QrCode, Box, UserPlus, MousePointerClick,
  TrendingUp, Smartphone, Monitor,
} from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line,
} from "recharts";

const COLORS = [
  "oklch(0.58 0.2 260)",
  "oklch(0.65 0.15 195)",
  "oklch(0.6 0.18 310)",
  "oklch(0.7 0.15 60)",
  "oklch(0.55 0.2 150)",
];

const statCards = [
  { label: "Total Views", value: "1,247", icon: Eye, color: "text-primary" },
  { label: "QR Scans", value: "89", icon: QrCode, color: "text-cyan" },
  { label: "AR Sessions", value: "23", icon: Box, color: "text-primary" },
  { label: "Contact Saves", value: "45", icon: UserPlus, color: "text-cyan" },
  { label: "Link Clicks", value: "156", icon: MousePointerClick, color: "text-primary" },
];

const eventsByType = [
  { name: "Views", value: 1247, fill: COLORS[0] },
  { name: "QR Scans", value: 89, fill: COLORS[1] },
  { name: "AR Sessions", value: 23, fill: COLORS[2] },
  { name: "Saves", value: 45, fill: COLORS[3] },
  { name: "Clicks", value: 156, fill: COLORS[4] },
];

const viewsOverTime = [
  { date: "Mon", views: 45, scans: 3 },
  { date: "Tue", views: 62, scans: 5 },
  { date: "Wed", views: 89, scans: 8 },
  { date: "Thu", views: 71, scans: 6 },
  { date: "Fri", views: 95, scans: 12 },
  { date: "Sat", views: 110, scans: 15 },
  { date: "Sun", views: 134, scans: 18 },
];

const topLinks = [
  { name: "LinkedIn", clicks: 67 },
  { name: "Portfolio", clicks: 45 },
  { name: "GitHub", clicks: 32 },
  { name: "Email", clicks: 28 },
  { name: "Twitter", clicks: 19 },
];

const deviceBreakdown = [
  { name: "Mobile", value: 78 },
  { name: "Desktop", value: 18 },
  { name: "Tablet", value: 4 },
];

export function DemoAnalytics() {
  return (
    <section className="flex min-h-screen flex-col items-center justify-center px-4 pt-20 pb-24">
      <div className="mx-auto max-w-6xl text-center">
        <div className="mb-6">
          <span className="rounded-full bg-primary/10 px-4 py-1.5 text-xs font-semibold text-primary">
            05 / 07
          </span>
        </div>

        <h2 className="mb-4 text-4xl font-bold md:text-5xl">
          Real-Time <span className="text-gradient">Analytics</span>
        </h2>
        <p className="mx-auto mb-12 max-w-2xl text-lg text-muted-foreground">
          Track views, scans, AR sessions, and engagement. Know who&apos;s interacting
          with your digital identity.
        </p>

        {/* Dashboard preview */}
        <div className="mx-auto max-w-5xl overflow-hidden rounded-2xl border border-border bg-card shadow-xl">
          {/* Dashboard header */}
          <div className="flex items-center justify-between border-b border-border px-6 py-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              <span className="text-sm font-semibold">Analytics Dashboard</span>
            </div>
            <div className="flex gap-1 rounded-lg bg-muted p-0.5">
              {["7d", "30d", "90d"].map((range) => (
                <button
                  key={range}
                  className={`rounded-md px-3 py-1 text-xs font-medium transition-colors ${
                    range === "7d" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground"
                  }`}
                >
                  {range}
                </button>
              ))}
            </div>
          </div>

          <div className="p-6">
            {/* Stat cards */}
            <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-5">
              {statCards.map((stat) => (
                <div key={stat.label} className="rounded-xl border border-border p-3 text-left">
                  <stat.icon className={`mb-1 h-4 w-4 ${stat.color}`} />
                  <p className="text-xl font-bold">{stat.value}</p>
                  <p className="text-[10px] text-muted-foreground">{stat.label}</p>
                </div>
              ))}
            </div>

            {/* Charts grid */}
            <div className="grid gap-4 md:grid-cols-2">
              {/* Views over time */}
              <div className="rounded-xl border border-border p-4">
                <h4 className="mb-3 text-xs font-semibold text-muted-foreground">Views Over Time</h4>
                <ResponsiveContainer width="100%" height={160}>
                  <LineChart data={viewsOverTime}>
                    <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.91 0.005 250)" />
                    <XAxis dataKey="date" tick={{ fontSize: 10 }} />
                    <YAxis tick={{ fontSize: 10 }} />
                    <Tooltip />
                    <Line type="monotone" dataKey="views" stroke={COLORS[0]} strokeWidth={2} dot={false} />
                    <Line type="monotone" dataKey="scans" stroke={COLORS[1]} strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* Events by type */}
              <div className="rounded-xl border border-border p-4">
                <h4 className="mb-3 text-xs font-semibold text-muted-foreground">Events by Type</h4>
                <ResponsiveContainer width="100%" height={160}>
                  <PieChart>
                    <Pie
                      data={eventsByType}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={65}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {eventsByType.map((entry, i) => (
                        <Cell key={i} fill={entry.fill} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Top links */}
              <div className="rounded-xl border border-border p-4">
                <h4 className="mb-3 text-xs font-semibold text-muted-foreground">Top Links</h4>
                <ResponsiveContainer width="100%" height={160}>
                  <BarChart data={topLinks} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.91 0.005 250)" />
                    <XAxis type="number" tick={{ fontSize: 10 }} />
                    <YAxis type="category" dataKey="name" tick={{ fontSize: 10 }} width={60} />
                    <Tooltip />
                    <Bar dataKey="clicks" fill={COLORS[0]} radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Device breakdown */}
              <div className="rounded-xl border border-border p-4">
                <h4 className="mb-3 text-xs font-semibold text-muted-foreground">Device Breakdown</h4>
                <div className="flex items-center gap-4">
                  <ResponsiveContainer width="50%" height={140}>
                    <PieChart>
                      <Pie
                        data={deviceBreakdown}
                        cx="50%"
                        cy="50%"
                        innerRadius={30}
                        outerRadius={55}
                        paddingAngle={3}
                        dataKey="value"
                      >
                        {deviceBreakdown.map((_, i) => (
                          <Cell key={i} fill={COLORS[i]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="space-y-2">
                    {deviceBreakdown.map((item, i) => (
                      <div key={item.name} className="flex items-center gap-2 text-xs">
                        <div className="h-2.5 w-2.5 rounded-full" style={{ background: COLORS[i] }} />
                        <span className="text-muted-foreground">{item.name}</span>
                        <span className="font-semibold">{item.value}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
