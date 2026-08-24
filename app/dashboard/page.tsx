"use client";

import { useEffect, useState } from "react";
import { CreditCard, Eye, QrCode, Box, UserPlus, MousePointerClick } from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface ChartDataPoint {
  date: string;
  views: number;
  scans: number;
}

export default function DashboardPage() {
  const [stats, setStats] = useState({
    totalCards: 0,
    totalViews: 0,
    totalQrScans: 0,
    totalArSessions: 0,
    totalContactSaves: 0,
    totalLinkClicks: 0,
  });
  const [loading, setLoading] = useState(true);
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
  const [timeRange, setTimeRange] = useState("7d");

  useEffect(() => {
    fetch("/api/dashboard/stats")
      .then((r) => r.json())
      .then((data) => {
        setStats(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  useEffect(() => {
    fetch(`/api/analytics/stats?range=${timeRange}`)
      .then((r) => r.json())
      .then((data) => {
        setChartData(data.viewsOverTime || []);
      })
      .catch(() => setChartData([]));
  }, [timeRange]);

  const statCards = [
    { label: "Total Cards", value: stats.totalCards, icon: CreditCard, color: "text-primary" },
    { label: "Profile Views", value: stats.totalViews.toLocaleString(), icon: Eye, color: "text-cyan" },
    { label: "QR Scans", value: stats.totalQrScans, icon: QrCode, color: "text-primary" },
    { label: "AR Sessions", value: stats.totalArSessions, icon: Box, color: "text-cyan" },
    { label: "Contact Saves", value: stats.totalContactSaves, icon: UserPlus, color: "text-primary" },
    { label: "Link Clicks", value: stats.totalLinkClicks, icon: MousePointerClick, color: "text-cyan" },
  ];

  const ranges = [
    { value: "7d", label: "7D" },
    { value: "30d", label: "30D" },
    { value: "90d", label: "90D" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          Welcome back! Here&apos;s an overview of your cards.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {statCards.map((stat) => (
          <div key={stat.label} className="glass rounded-xl p-5">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">{stat.label}</p>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </div>
            <p className="mt-2 text-2xl font-bold">
              {loading ? <span className="inline-block h-7 w-16 animate-pulse rounded bg-muted" /> : stat.value}
            </p>
          </div>
        ))}
      </div>

      <div className="glass rounded-xl p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Activity Overview</h2>
          <div className="flex gap-1">
            {ranges.map((r) => (
              <button
                key={r.value}
                onClick={() => setTimeRange(r.value)}
                className={`rounded-md px-3 py-1 text-xs font-medium transition-colors ${
                  timeRange === r.value
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted"
                }`}
              >
                {r.label}
              </button>
            ))}
          </div>
        </div>
        {chartData.length > 0 ? (
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="viewsGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="oklch(0.58 0.2 260)" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="oklch(0.58 0.2 260)" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="scansGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="oklch(0.65 0.15 195)" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="oklch(0.65 0.15 195)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 12 }}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  tick={{ fontSize: 12 }}
                  tickLine={false}
                  axisLine={false}
                  width={30}
                />
                <Tooltip
                  contentStyle={{
                    background: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                    fontSize: "12px",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="views"
                  stroke="oklch(0.58 0.2 260)"
                  fill="url(#viewsGrad)"
                  strokeWidth={2}
                  name="Views"
                />
                <Area
                  type="monotone"
                  dataKey="scans"
                  stroke="oklch(0.65 0.15 195)"
                  fill="url(#scansGrad)"
                  strokeWidth={2}
                  name="QR Scans"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="flex h-64 items-center justify-center rounded-lg border border-dashed border-border">
            <p className="text-sm text-muted-foreground">
              {loading ? "Loading analytics..." : "No analytics data yet. Share your card to see activity."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
