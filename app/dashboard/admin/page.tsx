"use client";

import { useEffect, useState, useCallback } from "react";
import {
  Users,
  CreditCard,
  Layout,
  Box,
  Shield,
  Trash2,
  Search,
  ChevronLeft,
  ChevronRight,
  Eye,
  EyeOff,
  Archive,
} from "lucide-react";
import { toast } from "sonner";

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
    plan: string;
    createdAt: string;
  }[];
  recentCards: {
    id: string;
    name: string;
    slug: string;
    status: string;
    createdAt: string;
    user: { name: string | null; email: string | null };
  }[];
  totalUsers: number;
  totalCards: number;
}

export default function AdminPage() {
  const [data, setData] = useState<AdminData | null>(null);
  const [loading, setLoading] = useState(true);
  const [unauthorized, setUnauthorized] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [dbConnected, setDbConnected] = useState<boolean | null>(null);
  const [userPage, setUserPage] = useState(1);
  const [cardPage, setCardPage] = useState(1);
  const [users, setUsers] = useState<AdminData["recentUsers"]>([]);
  const [cards, setCards] = useState<AdminData["recentCards"]>([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalCards, setTotalCards] = useState(0);
  const pageSize = 10;

  useEffect(() => {
    fetch("/api/admin")
      .then((r) => {
        if (r.status === 403) {
          setUnauthorized(true);
          setLoading(false);
          return null;
        }
        setDbConnected(true);
        return r.json();
      })
      .then((d) => {
        if (d) {
          setData(d);
          setTotalUsers(d.totalUsers || d.stats.totalUsers);
          setTotalCards(d.totalCards || d.stats.totalCards);
          setLoading(false);
        }
      })
      .catch(() => {
        setDbConnected(false);
        setLoading(false);
      });
  }, []);

  const fetchUsers = useCallback(async (page: number) => {
    try {
      const res = await fetch(`/api/admin?users=true&page=${page}&limit=${pageSize}`);
      if (res.ok) {
        const d = await res.json();
        if (d.recentUsers) setUsers(d.recentUsers);
      }
    } catch {}
  }, []);

  const fetchCards = useCallback(async (page: number) => {
    try {
      const res = await fetch(`/api/admin?cards=true&page=${page}&limit=${pageSize}`);
      if (res.ok) {
        const d = await res.json();
        if (d.recentCards) setCards(d.recentCards);
      }
    } catch {}
  }, []);

  useEffect(() => {
    if (data) {
      fetchUsers(userPage);
      fetchCards(cardPage);
    }
  }, [data, userPage, cardPage, fetchUsers, fetchCards]);

  const deleteUser = async (userId: string) => {
    if (!confirm("Are you sure you want to delete this user? This cannot be undone.")) return;
    try {
      const res = await fetch(`/api/admin/users/${userId}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("User deleted");
        setUsers((prev) => prev.filter((u) => u.id !== userId));
        setTotalUsers((prev) => prev - 1);
      } else {
        const data = await res.json();
        toast.error(data.error || "Failed to delete user");
      }
    } catch {
      toast.error("Failed to delete user");
    }
  };

  const moderateCard = async (cardId: string, status: string) => {
    try {
      const res = await fetch(`/api/admin/cards/${cardId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        toast.success(`Card ${status.toLowerCase()}`);
        setCards((prev) => prev.map((c) => c.id === cardId ? { ...c, status } : c));
      }
    } catch {
      toast.error("Failed to update card");
    }
  };

  const deleteCard = async (cardId: string) => {
    if (!confirm("Delete this card permanently?")) return;
    try {
      const res = await fetch(`/api/admin/cards/${cardId}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("Card deleted");
        setCards((prev) => prev.filter((c) => c.id !== cardId));
        setTotalCards((prev) => prev - 1);
      }
    } catch {
      toast.error("Failed to delete card");
    }
  };

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
        { label: "Cards", value: data.stats.totalCards, icon: CreditCard, color: "text-cyan-500" },
        { label: "Templates", value: data.stats.totalTemplates, icon: Layout, color: "text-primary" },
        { label: "AR Assets", value: data.stats.totalArAssets, icon: Box, color: "text-cyan-500" },
      ]
    : [];

  const userPages = Math.ceil(totalUsers / pageSize);
  const cardPages = Math.ceil(totalCards / pageSize);

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

      <div className="glass rounded-xl p-6">
        <h2 className="mb-4 text-lg font-semibold">System Health</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="flex items-center gap-2">
            <div className={`h-2 w-2 rounded-full ${dbConnected === false ? "bg-red-500" : "bg-green-500"}`} />
            <span className="text-sm">Database</span>
            <span className="text-xs text-muted-foreground">
              {dbConnected === null ? "Checking..." : dbConnected ? "Connected" : "Disconnected"}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm">Total Users</span>
            <span className="text-xs text-muted-foreground">
              {loading ? "..." : totalUsers.toLocaleString()}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm">Total Cards</span>
            <span className="text-xs text-muted-foreground">
              {loading ? "..." : totalCards.toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Users */}
        <div className="glass rounded-xl p-6">
          <h2 className="mb-4 text-lg font-semibold">Users</h2>
          <div className="relative mb-3">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-md border border-border bg-background pl-9 pr-3 py-2 text-sm"
            />
          </div>
          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-10 animate-pulse rounded bg-muted" />
              ))}
            </div>
          ) : users.length ? (
            <>
              <div className="space-y-2">
                {users
                  .filter((user) => {
                    if (!searchQuery) return true;
                    const q = searchQuery.toLowerCase();
                    return user.name?.toLowerCase().includes(q) || user.email?.toLowerCase().includes(q);
                  })
                  .map((user) => (
                    <div key={user.id} className="flex items-center justify-between rounded-lg border border-border p-3">
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium truncate">{user.name || "No name"}</p>
                        <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                      </div>
                      <div className="flex items-center gap-2 ml-2">
                        <select
                          defaultValue={user.plan}
                          onChange={async (e) => {
                            await fetch(`/api/admin/users/${user.id}`, {
                              method: "PATCH",
                              headers: { "Content-Type": "application/json" },
                              body: JSON.stringify({ plan: e.target.value }),
                            });
                            toast.success(`Plan updated to ${e.target.value}`);
                          }}
                          className="rounded-md border border-border bg-background px-2 py-1 text-xs"
                        >
                          <option value="FREE">Free</option>
                          <option value="PRO">Pro</option>
                          <option value="BUSINESS">Business</option>
                        </select>
                        <button
                          onClick={() => deleteUser(user.id)}
                          className="rounded-md p-1 text-destructive hover:bg-destructive/10"
                          aria-label="Delete user"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
              {userPages > 1 && (
                <div className="mt-3 flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">
                    Page {userPage} of {userPages}
                  </span>
                  <div className="flex gap-1">
                    <button
                      onClick={() => setUserPage((p) => Math.max(1, p - 1))}
                      disabled={userPage === 1}
                      className="rounded border p-1 disabled:opacity-50"
                    >
                      <ChevronLeft className="h-3 w-3" />
                    </button>
                    <button
                      onClick={() => setUserPage((p) => Math.min(userPages, p + 1))}
                      disabled={userPage === userPages}
                      className="rounded border p-1 disabled:opacity-50"
                    >
                      <ChevronRight className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              )}
            </>
          ) : (
            <p className="text-sm text-muted-foreground">No users yet.</p>
          )}
        </div>

        {/* Cards */}
        <div className="glass rounded-xl p-6">
          <h2 className="mb-4 text-lg font-semibold">Cards</h2>
          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-10 animate-pulse rounded bg-muted" />
              ))}
            </div>
          ) : cards.length ? (
            <>
              <div className="space-y-2">
                {cards.map((card) => (
                  <div key={card.id} className="flex items-center justify-between rounded-lg border border-border p-3">
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium truncate">{card.name}</p>
                      <p className="text-xs text-muted-foreground truncate">
                        {card.user.name || card.user.email} · /{card.slug}
                      </p>
                    </div>
                    <div className="flex items-center gap-1 ml-2">
                      <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                        card.status === "ACTIVE" ? "bg-green-100 text-green-700" :
                        card.status === "DRAFT" ? "bg-yellow-100 text-yellow-700" :
                        "bg-muted text-foreground"
                      }`}>
                        {card.status}
                      </span>
                      <button
                        onClick={() => moderateCard(card.id, card.status === "ACTIVE" ? "DRAFT" : "ACTIVE")}
                        className="rounded p-1 hover:bg-muted"
                        aria-label={card.status === "ACTIVE" ? "Deactivate card" : "Activate card"}
                      >
                        {card.status === "ACTIVE" ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                      </button>
                      <button
                        onClick={() => moderateCard(card.id, "ARCHIVED")}
                        className="rounded p-1 hover:bg-muted"
                        aria-label="Archive card"
                      >
                        <Archive className="h-3 w-3" />
                      </button>
                      <button
                        onClick={() => deleteCard(card.id)}
                        className="rounded p-1 text-destructive hover:bg-destructive/10"
                        aria-label="Delete card"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              {cardPages > 1 && (
                <div className="mt-3 flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">
                    Page {cardPage} of {cardPages}
                  </span>
                  <div className="flex gap-1">
                    <button
                      onClick={() => setCardPage((p) => Math.max(1, p - 1))}
                      disabled={cardPage === 1}
                      className="rounded border p-1 disabled:opacity-50"
                    >
                      <ChevronLeft className="h-3 w-3" />
                    </button>
                    <button
                      onClick={() => setCardPage((p) => Math.min(cardPages, p + 1))}
                      disabled={cardPage === cardPages}
                      className="rounded border p-1 disabled:opacity-50"
                    >
                      <ChevronRight className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              )}
            </>
          ) : (
            <p className="text-sm text-muted-foreground">No cards yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}
