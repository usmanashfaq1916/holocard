"use client";

import { useEffect, useState } from "react";
import { Check, X, Crown, Zap, Building2 } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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

function Toggle({
  checked,
  onCheckedChange,
}: {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onCheckedChange(!checked)}
      className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${
        checked ? "bg-primary" : "bg-input"
      }`}
    >
      <span
        className={`pointer-events-none block h-4 w-4 rounded-full bg-background shadow-lg ring-0 transition-transform duration-200 ease-in-out ${
          checked ? "translate-x-4" : "translate-x-0"
        }`}
      />
    </button>
  );
}

export default function SettingsPage() {
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [designation, setDesignation] = useState("");

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [emailNotifications, setEmailNotifications] = useState(true);
  const [marketingEmails, setMarketingEmails] = useState(false);
  const [productUpdates, setProductUpdates] = useState(true);

  const [showInSearch, setShowInSearch] = useState(true);
  const [allowAnalytics, setAllowAnalytics] = useState(false);
  const [showContactOnCard, setShowContactOnCard] = useState(true);

  const [theme, setTheme] = useState<"light" | "dark" | "system">("light");
  const [deleteConfirmation, setDeleteConfirmation] = useState("");

  useEffect(() => {
    fetch("/api/dashboard/stats")
      .then((r) => r.json())
      .then((data) => {
        if (data.user) {
          setUser(data.user);
          setName(data.user.name || "");
          setCompany(data.user.company || "");
          setDesignation(data.user.designation || "");
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const currentPlan = user?.plan || "FREE";
  const planConfig = PLANS[currentPlan];

  function applyTheme(newTheme: "light" | "dark" | "system") {
    setTheme(newTheme);
    if (newTheme === "system") {
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      document.documentElement.classList.toggle("dark", prefersDark);
    } else if (newTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-muted-foreground">Loading settings...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-sm text-muted-foreground">
          Manage your account, preferences, and subscription.
        </p>
      </div>

      <Tabs defaultValue="profile" orientation="horizontal">
        <TabsList className="w-full flex-wrap h-auto gap-1 bg-muted p-1">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="privacy">Privacy</TabsTrigger>
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
          <TabsTrigger value="subscription">Subscription</TabsTrigger>
          <TabsTrigger value="delete">Delete Account</TabsTrigger>
        </TabsList>

        {/* Profile */}
        <TabsContent value="profile">
          <div className="glass rounded-xl p-6 space-y-6">
            <div>
              <h2 className="text-lg font-semibold">Profile</h2>
              <p className="text-sm text-muted-foreground">
                Update your personal information.
              </p>
            </div>

            <div className="grid gap-4 max-w-lg">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  value={user?.email || ""}
                  readOnly
                  disabled
                  className="opacity-60 cursor-not-allowed"
                />
                <p className="text-xs text-muted-foreground">
                  Email cannot be changed here. Contact support to update your email.
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="company">Company</Label>
                <Input
                  id="company"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  placeholder="Your company"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="designation">Designation</Label>
                <Input
                  id="designation"
                  value={designation}
                  onChange={(e) => setDesignation(e.target.value)}
                  placeholder="Your role"
                />
              </div>

              <div>
                <Button>Save Changes</Button>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Account */}
        <TabsContent value="account">
          <div className="glass rounded-xl p-6 space-y-6">
            <div>
              <h2 className="text-lg font-semibold">Account</h2>
              <p className="text-sm text-muted-foreground">
                Manage your account credentials.
              </p>
            </div>

            <div className="grid gap-6 max-w-lg">
              <div className="space-y-2">
                <Label>Current Email</Label>
                <p className="text-sm font-medium">{user?.email || "Not available"}</p>
              </div>

              <div className="border-t border-border pt-6 space-y-4">
                <h3 className="font-medium">Change Password</h3>

                <div className="space-y-2">
                  <Label htmlFor="current-password">Current Password</Label>
                  <Input
                    id="current-password"
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Enter current password"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="new-password">New Password</Label>
                  <Input
                    id="new-password"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirm New Password</Label>
                  <Input
                    id="confirm-password"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm new password"
                  />
                </div>

                <div>
                  <Button>Update Password</Button>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Security */}
        <TabsContent value="security">
          <div className="glass rounded-xl p-6 space-y-6">
            <div>
              <h2 className="text-lg font-semibold">Security</h2>
              <p className="text-sm text-muted-foreground">
                Manage your active sessions and security settings.
              </p>
            </div>

            <div className="grid gap-6 max-w-lg">
              <div className="space-y-3">
                <h3 className="font-medium">Active Sessions</h3>
                <div className="rounded-lg border border-border p-4">
                  <p className="text-sm text-muted-foreground">
                    You are currently logged in on 1 device. Session management is not yet available.
                  </p>
                </div>
              </div>

              <div>
                <Button variant="destructive">Log out all sessions</Button>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Notifications */}
        <TabsContent value="notifications">
          <div className="glass rounded-xl p-6 space-y-6">
            <div>
              <h2 className="text-lg font-semibold">Notifications</h2>
              <p className="text-sm text-muted-foreground">
                Choose what notifications you receive.
              </p>
            </div>

            <div className="grid gap-5 max-w-lg">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Email notifications</Label>
                  <p className="text-xs text-muted-foreground">
                    Receive email updates about your account activity.
                  </p>
                </div>
                <Toggle checked={emailNotifications} onCheckedChange={setEmailNotifications} />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Marketing emails</Label>
                  <p className="text-xs text-muted-foreground">
                    Receive tips, product updates, and inspiration.
                  </p>
                </div>
                <Toggle checked={marketingEmails} onCheckedChange={setMarketingEmails} />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Product updates</Label>
                  <p className="text-xs text-muted-foreground">
                    Get notified about new features and improvements.
                  </p>
                </div>
                <Toggle checked={productUpdates} onCheckedChange={setProductUpdates} />
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Privacy */}
        <TabsContent value="privacy">
          <div className="glass rounded-xl p-6 space-y-6">
            <div>
              <h2 className="text-lg font-semibold">Privacy</h2>
              <p className="text-sm text-muted-foreground">
                Control your privacy and data sharing preferences.
              </p>
            </div>

            <div className="grid gap-5 max-w-lg">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Show profile in search engines</Label>
                  <p className="text-xs text-muted-foreground">
                    Allow your profile to appear in search engine results.
                  </p>
                </div>
                <Toggle checked={showInSearch} onCheckedChange={setShowInSearch} />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Allow analytics collection</Label>
                  <p className="text-xs text-muted-foreground">
                    Help us improve by sharing anonymous usage data.
                  </p>
                </div>
                <Toggle checked={allowAnalytics} onCheckedChange={setAllowAnalytics} />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Show contact information on public card</Label>
                  <p className="text-xs text-muted-foreground">
                    Display your contact details on your public HoloCard.
                  </p>
                </div>
                <Toggle checked={showContactOnCard} onCheckedChange={setShowContactOnCard} />
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Appearance */}
        <TabsContent value="appearance">
          <div className="glass rounded-xl p-6 space-y-6">
            <div>
              <h2 className="text-lg font-semibold">Appearance</h2>
              <p className="text-sm text-muted-foreground">
                Customize the look and feel of the application.
              </p>
            </div>

            <div className="grid gap-4 max-w-lg">
              <Label>Theme</Label>
              <div className="flex gap-2">
                {(["light", "dark", "system"] as const).map((t) => (
                  <Button
                    key={t}
                    variant={theme === t ? "default" : "outline"}
                    onClick={() => applyTheme(t)}
                    className="capitalize"
                  >
                    {t}
                  </Button>
                ))}
              </div>
              <p className="text-xs text-muted-foreground">
                {theme === "system"
                  ? "Following your system preference."
                  : `Using ${theme} theme.`}
              </p>
            </div>
          </div>
        </TabsContent>

        {/* Subscription */}
        <TabsContent value="subscription">
          <div className="glass rounded-xl p-6 space-y-6">
            <div>
              <h2 className="text-lg font-semibold">Subscription</h2>
              <p className="text-sm text-muted-foreground">
                Manage your plan and billing.
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="rounded-lg border border-border p-3">
                  {(() => {
                    const Icon = planIcons[currentPlan];
                    return <Icon className="h-5 w-5 text-primary" />;
                  })()}
                </div>
                <div>
                  <p className="font-medium">Current Plan: {planConfig.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {user?._count?.cards || 0} card{(user?._count?.cards || 0) === 1 ? "" : "s"} created
                  </p>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                {(Object.entries(PLANS) as [PlanTier, (typeof PLANS)[PlanTier]][]).map(
                  ([tier, config]) => {
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
                          {config.maxCards === -1
                            ? "Unlimited"
                            : `${config.maxCards} card${config.maxCards === 1 ? "" : "s"}`}
                        </p>
                        <div className="mt-3 space-y-1.5">
                          {(["premiumTemplates", "aiFeatures", "prioritySupport"] as const).map(
                            (feat) => (
                              <div key={feat} className="flex items-center gap-1.5 text-xs">
                                {config[feat] ? (
                                  <Check className="h-3 w-3 text-green-400" />
                                ) : (
                                  <X className="h-3 w-3 text-muted-foreground" />
                                )}
                                <span className={config[feat] ? "" : "text-muted-foreground"}>
                                  {feat
                                    .replace(/([A-Z])/g, " $1")
                                    .replace(/^./, (s: string) => s.toUpperCase())}
                                </span>
                              </div>
                            )
                          )}
                        </div>
                        {isCurrent && (
                          <p className="mt-3 text-xs font-medium text-primary">
                            Current Plan
                          </p>
                        )}
                      </div>
                    );
                  }
                )}
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Delete Account */}
        <TabsContent value="delete">
          <div className="glass rounded-xl p-6 space-y-6">
            <div>
              <h2 className="text-lg font-semibold text-destructive">Delete Account</h2>
              <p className="text-sm text-muted-foreground">
                Permanently delete your account and all associated data.
              </p>
            </div>

            <div className="grid gap-4 max-w-lg">
              <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4">
                <p className="text-sm text-destructive font-medium">Warning</p>
                <p className="text-sm text-muted-foreground mt-1">
                  This action is irreversible. All your cards, data, and account information
                  will be permanently deleted. You will lose access to your current plan and
                  any associated content.
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="delete-confirm">
                  Type <span className="font-mono font-bold">DELETE</span> to confirm
                </Label>
                <Input
                  id="delete-confirm"
                  value={deleteConfirmation}
                  onChange={(e) => setDeleteConfirmation(e.target.value)}
                  placeholder="DELETE"
                />
              </div>

              <div>
                <Button
                  variant="destructive"
                  disabled={deleteConfirmation !== "DELETE"}
                >
                  Delete Account
                </Button>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
