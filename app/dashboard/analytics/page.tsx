"use client";

import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts";
import {
  Eye,
  QrCode,
  Box,
  UserPlus,
  MousePointerClick,
  TrendingUp,
  Calendar,
  Smartphone,
  Monitor,
  Globe,
} from "lucide-react";

interface AnalyticsData {
  totalViews: number;
  totalQrScans: number;
  totalArSessions: number;
  totalContactSaves: number;
  totalLinkClicks: number;
  eventsByType: { name: string; value: number; fill: string }[];
  viewsOverTime: { date: string; views: number; scans: number }[];
  topLinks: { name: string; clicks: number }[];
  deviceBreakdown: { name: string; value: number }[];
}

const COLORS = [
  "oklch(0.58 0.2 260)",   // chart-1 (blue)
  "oklch(0.65 0.15 195)",  // chart-2 (cyan)
  "oklch(0.6 0.18 310)",   // chart-3 (purple)
  "oklch(0.7 0.15 60)",    // chart-5 (amber)
  "oklch(0.55 0.2 150)",   // chart-4 (green)
  "oklch(0.65 0.2 25)",    // destructive (red)
];

export default function AnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState("7d");

  useEffect(() => {
    fetch(`/api/analytics/stats?range=${timeRange}`)
      .then((r) => r.json())
      .then((d) => {
        setData(d);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, [timeRange]);

  const statCards = data
    ? [
        { label: "Total Views", value: data.totalViews.toLocaleString(), icon: Eye, color: "text-primary" },
        { label: "QR Scans", value: data.totalQrScans.toLocaleString(), icon: QrCode, color: "text-cyan" },
        { label: "AR Sessions", value: data.totalArSessions.toLocaleString(), icon: Box, color: "text-primary" },
        { label: "Contact Saves", value: data.totalContactSaves.toLocaleString(), icon: UserPlus, color: "text-cyan" },
        { label: "Link Clicks", value: data.totalLinkClicks.toLocaleString(), icon: MousePointerClick, color: "text-primary" },
      ]
    : [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Analytics</h1>
          <p className="text-sm text-muted-foreground">
            Track how your cards are performing.
          </p>
        </div>
        <div className="flex gap-2">
          {[
            { value: "7d", label: "7 days" },
            { value: "30d", label: "30 days" },
            { value: "90d", label: "90 days" },
          ].map((option) => (
            <button
              key={option.value}
              onClick={() => setTimeRange(option.value)}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                timeRange === option.value
                  ? "bg-primary/20 text-primary"
                  : "text-muted-foreground hover:bg-accent"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-5">
        {statCards.map((stat) => (
          <div key={stat.label} className="glass rounded-xl p-4">
            <stat.icon className={`h-5 w-5 ${stat.color}`} />
            <p className="mt-2 text-2xl font-bold">
              {loading ? (
                <span className="inline-block h-7 w-16 animate-pulse rounded bg-muted" />
              ) : (
                stat.value
              )}
            </p>
            <p className="text-xs text-muted-foreground">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Views over time */}
        <div className="glass rounded-xl p-6">
          <h2 className="mb-4 text-lg font-semibold">Views Over Time</h2>
          {loading ? (
            <div className="flex h-64 items-center justify-center">
              <div className="h-full w-full animate-pulse rounded bg-muted" />
            </div>
          ) : data?.viewsOverTime?.length ? (
            <ResponsiveContainer width="100%" height={256}>
              <LineChart data={data.viewsOverTime}>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.91 0.005 250)" />
                <XAxis dataKey="date" tick={{ fontSize: 12, fill: "oklch(0.45 0.02 250)" }} />
                <YAxis tick={{ fontSize: 12, fill: "oklch(0.45 0.02 250)" }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "var(--card)",
                    border: "1px solid var(--border)",
                    borderRadius: "8px",
                  }}
                />
                <Line type="monotone" dataKey="views" stroke="oklch(0.58 0.2 260)" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="scans" stroke="oklch(0.65 0.15 195)" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex h-64 items-center justify-center text-sm text-muted-foreground">
              No data yet. Share your card to start tracking.
            </div>
          )}
        </div>

        {/* Events by type */}
        <div className="glass rounded-xl p-6">
          <h2 className="mb-4 text-lg font-semibold">Events by Type</h2>
          {loading ? (
            <div className="flex h-64 items-center justify-center">
              <div className="h-full w-full animate-pulse rounded bg-muted" />
            </div>
          ) : data?.eventsByType?.length ? (
            <ResponsiveContainer width="100%" height={256}>
              <PieChart>
                <Pie
                  data={data.eventsByType}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  dataKey="value"
                  label={({ name, percent }: { name?: string; percent?: number }) => `${name ?? ""} ${((percent ?? 0) * 100).toFixed(0)}%`}
                >
                  {data.eventsByType.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex h-64 items-center justify-center text-sm text-muted-foreground">
              No events recorded yet.
            </div>
          )}
        </div>

        {/* Top links */}
        <div className="glass rounded-xl p-6">
          <h2 className="mb-4 text-lg font-semibold">Top Links</h2>
          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-8 animate-pulse rounded bg-muted" />
              ))}
            </div>
          ) : data?.topLinks?.length ? (
            <ResponsiveContainer width="100%" height={256}>
              <BarChart data={data.topLinks} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.91 0.005 250)" />
                <XAxis type="number" tick={{ fontSize: 12, fill: "oklch(0.45 0.02 250)" }} />
                <YAxis type="category" dataKey="name" tick={{ fontSize: 12, fill: "oklch(0.45 0.02 250)" }} width={100} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "var(--card)",
                    border: "1px solid var(--border)",
                    borderRadius: "8px",
                  }}
                />
                <Bar dataKey="clicks" fill="oklch(0.58 0.2 260)" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex h-64 items-center justify-center text-sm text-muted-foreground">
              No link clicks yet.
            </div>
          )}
        </div>

        {/* Device breakdown */}
        <div className="glass rounded-xl p-6">
          <h2 className="mb-4 text-lg font-semibold">Device Breakdown</h2>
          {loading ? (
            <div className="flex h-64 items-center justify-center">
              <div className="h-full w-full animate-pulse rounded bg-muted" />
            </div>
          ) : data?.deviceBreakdown?.length ? (
            <ResponsiveContainer width="100%" height={256}>
              <PieChart>
                <Pie
                  data={data.deviceBreakdown}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  dataKey="value"
                  label={({ name, percent }: { name?: string; percent?: number }) => `${name ?? ""} ${((percent ?? 0) * 100).toFixed(0)}%`}
                >
                  {data.deviceBreakdown.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex h-64 items-center justify-center text-sm text-muted-foreground">
              No device data yet.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
