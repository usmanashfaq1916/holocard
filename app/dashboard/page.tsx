"use client";

import { useEffect, useState } from "react";
import { CreditCard, Eye, QrCode, Box, UserPlus, MousePointerClick } from "lucide-react";

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

  useEffect(() => {
    fetch("/api/dashboard/stats")
      .then((r) => r.json())
      .then((data) => {
        setStats(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const statCards = [
    { label: "Total Cards", value: stats.totalCards, icon: CreditCard, color: "text-primary" },
    { label: "Profile Views", value: stats.totalViews.toLocaleString(), icon: Eye, color: "text-cyan" },
    { label: "QR Scans", value: stats.totalQrScans, icon: QrCode, color: "text-primary" },
    { label: "AR Sessions", value: stats.totalArSessions, icon: Box, color: "text-cyan" },
    { label: "Contact Saves", value: stats.totalContactSaves, icon: UserPlus, color: "text-primary" },
    { label: "Link Clicks", value: stats.totalLinkClicks, icon: MousePointerClick, color: "text-cyan" },
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
        <h2 className="mb-4 text-lg font-semibold">Activity Overview</h2>
        <div className="flex h-64 items-center justify-center rounded-lg border border-dashed border-border">
          <p className="text-sm text-muted-foreground">
            Analytics charts coming in Phase 4
          </p>
        </div>
      </div>
    </div>
  );
}
