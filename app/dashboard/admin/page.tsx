"use client";

import { useEffect, useState } from "react";
import {
  Users,
  CreditCard,
  Layout,
  Box,
  Shield,
} from "lucide-react";

interface AdminData {
  stats: {
    totalUsers: number;
    totalCards: number;
    totalTemplates: number;
    totalArAssets: number;
  };
  recentUsers: {
    id: string;
    name: string | null;
    email: string | null;
    createdAt: string;
  }[];
  recentCards: {
    id: string;
    title: string;
    slug: string;
    createdAt: string;
    user: { name: string | null; email: string | null };
  }[];
}

export default function AdminPage() {
  const [data, setData] = useState<AdminData | null>(null);
  const [loading, setLoading] = useState(true);
  const [unauthorized, setUnauthorized] = useState(false);

  useEffect(() => {
    fetch("/api/admin")
      .then((r) => {
        if (r.status === 403) {
          setUnauthorized(true);
          setLoading(false);
          return null;
        }
        return r.json();
      })
      .then((d) => {
        if (d) {
          setData(d);
          setLoading(false);
        }
      })
      .catch(() => setLoading(false));
  }, []);

  if (unauthorized) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Shield className="h-12 w-12 text-destructive" />
        <h1 className="mt-4 text-xl font-bold">Access Denied</h1>
        <p className="text-sm text-muted-foreground">
          You need admin privileges to access this page.
        </p>
      </div>
    );
  }

  const statCards = data
    ? [
        { label: "Users", value: data.stats.totalUsers, icon: Users, color: "text-primary" },
        { label: "Cards", value: data.stats.totalCards, icon: CreditCard, color: "text-cyan" },
        { label: "Templates", value: data.stats.totalTemplates, icon: Layout, color: "text-primary" },
        { label: "AR Assets", value: data.stats.totalArAssets, icon: Box, color: "text-cyan" },
      ]
    : [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <p className="text-sm text-muted-foreground">Platform overview and management.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat) => (
          <div key={stat.label} className="glass rounded-xl p-4">
            <stat.icon className={`h-5 w-5 ${stat.color}`} />
            <p className="mt-2 text-2xl font-bold">
              {loading ? (
                <span className="inline-block h-7 w-12 animate-pulse rounded bg-muted" />
              ) : (
                stat.value.toLocaleString()
              )}
            </p>
            <p className="text-xs text-muted-foreground">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent users */}
        <div className="glass rounded-xl p-6">
          <h2 className="mb-4 text-lg font-semibold">Recent Users</h2>
          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-10 animate-pulse rounded bg-muted" />
              ))}
            </div>
          ) : data?.recentUsers?.length ? (
            <div className="space-y-3">
              {data.recentUsers.map((user) => (
                <div key={user.id} className="flex items-center justify-between rounded-lg border border-border p-3">
                  <div>
                    <p className="text-sm font-medium">{user.name || "No name"}</p>
                    <p className="text-xs text-muted-foreground">{user.email}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <select
                      defaultValue="USER"
                      onChange={async (e) => {
                        await fetch(`/api/admin/users/${user.id}`, {
                          method: "PATCH",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({ plan: e.target.value }),
                        });
                      }}
                      className="rounded-md border border-border bg-background px-2 py-1 text-xs"
                    >
                      <option value="FREE">Free</option>
                      <option value="PRO">Pro</option>
                      <option value="BUSINESS">Business</option>
                    </select>
                    <span className="text-xs text-muted-foreground">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No users yet.</p>
          )}
        </div>

        {/* Recent cards */}
        <div className="glass rounded-xl p-6">
          <h2 className="mb-4 text-lg font-semibold">Recent Cards</h2>
          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-10 animate-pulse rounded bg-muted" />
              ))}
            </div>
          ) : data?.recentCards?.length ? (
            <div className="space-y-3">
              {data.recentCards.map((card) => (
                <div key={card.id} className="flex items-center justify-between rounded-lg border border-border p-3">
                  <div>
                    <p className="text-sm font-medium">{card.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {card.user.name || card.user.email} · /{card.slug}
                    </p>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {new Date(card.createdAt).toLocaleDateString()}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No cards yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}
