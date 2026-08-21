"use client";

import { useEffect, useState } from "react";
import { Check, X, Crown, Zap, Building2 } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { PLANS, type PlanTier } from "@/lib/plans";

interface UserData {
  id: string;
  name: string | null;
  email: string | null;
  company: string | null;
  designation: string | null;
  plan: PlanTier;
  _count: { cards: number };
}

const planIcons: Record<PlanTier, typeof Crown> = {
  FREE: Zap,
  PRO: Crown,
  BUSINESS: Building2,
};

export default function SettingsPage() {
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/dashboard/stats")
      .then((r) => r.json())
      .then((data) => {
        if (data.user) {
          setUser(data.user);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const currentPlan = user?.plan || "FREE";
  const planConfig = PLANS[currentPlan];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-sm text-muted-foreground">
          Manage your account and plan.
        </p>
      </div>

      {/* Current Plan */}
      <div className="glass max-w-2xl rounded-xl p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-semibold">Current Plan</h2>
            <p className="text-sm text-muted-foreground">
              {planConfig.name} plan
            </p>
          </div>
          <div className="flex items-center gap-2">
            {(() => {
              const Icon = planIcons[currentPlan];
              return <Icon className="h-5 w-5 text-primary" />;
            })()}
            <span className="text-lg font-bold">{planConfig.name}</span>
          </div>
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <div className="rounded-lg border border-border p-3">
            <p className="text-xs text-muted-foreground">Cards</p>
            <p className="text-sm font-medium">
              {user?._count?.cards || 0} / {planConfig.maxCards === -1 ? "Unlimited" : planConfig.maxCards}
            </p>
          </div>
          <div className="rounded-lg border border-border p-3">
            <p className="text-xs text-muted-foreground">Storage</p>
            <p className="text-sm font-medium">{planConfig.maxStorage}</p>
          </div>
        </div>

        <div className="mt-4 space-y-2">
          {(
            Object.entries(planConfig) as [string, unknown][]
          ).filter(([key]) => !["name", "maxCards", "maxStorage"].includes(key)).map(([key, value]) => (
            <div key={key} className="flex items-center gap-2 text-sm">
              {value ? (
                <Check className="h-4 w-4 text-green-400" />
              ) : (
                <X className="h-4 w-4 text-muted-foreground" />
              )}
              <span className={value ? "" : "text-muted-foreground"}>
                {key.replace(/([A-Z])/g, " $1").replace(/^./, (s: string) => s.toUpperCase())}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Plan Comparison */}
      <div className="glass max-w-4xl rounded-xl p-6">
        <h2 className="mb-4 font-semibold">Compare Plans</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          {(Object.entries(PLANS) as [PlanTier, typeof PLANS[PlanTier]][]).map(([tier, config]) => {
            const Icon = planIcons[tier];
            const isCurrent = tier === currentPlan;
            return (
              <div
                key={tier}
                className={`rounded-xl border p-4 ${
                  isCurrent ? "border-primary bg-primary/5" : "border-border"
                }`}
              >
                <div className="flex items-center gap-2">
                  <Icon className="h-5 w-5 text-primary" />
                  <h3 className="font-semibold">{config.name}</h3>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                  {config.maxCards === -1 ? "Unlimited" : `${config.maxCards} card${config.maxCards === 1 ? "" : "s"}`}
                </p>
                <div className="mt-3 space-y-1.5">
                  {(["premiumTemplates", "aiFeatures", "prioritySupport"] as const).map((feat) => (
                    <div key={feat} className="flex items-center gap-1.5 text-xs">
                      {config[feat] ? (
                        <Check className="h-3 w-3 text-green-400" />
                      ) : (
                        <X className="h-3 w-3 text-muted-foreground" />
                      )}
                      <span className={config[feat] ? "" : "text-muted-foreground"}>
                        {feat.replace(/([A-Z])/g, " $1").replace(/^./, (s: string) => s.toUpperCase())}
                      </span>
                    </div>
                  ))}
                </div>
                {isCurrent && (
                  <p className="mt-3 text-xs font-medium text-primary">Current Plan</p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
