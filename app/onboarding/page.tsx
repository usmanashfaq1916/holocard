"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  User,
  Palette,
  Link2,
  Phone,
  Box,
  QrCode,
  Rocket,
  ChevronLeft,
  ChevronRight,
  Check,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { QRGenerator } from "@/components/cards/qr-generator";
import { toast } from "sonner";

const TOTAL_STEPS = 7;

const STEP_CONFIG = [
  { num: 1, title: "Personal Info", icon: User },
  { num: 2, title: "Template", icon: Palette },
  { num: 3, title: "Social Links", icon: Link2 },
  { num: 4, title: "Contact", icon: Phone },
  { num: 5, title: "AR Model", icon: Box },
  { num: 6, title: "QR Code", icon: QrCode },
  { num: 7, title: "Publish", icon: Rocket },
];

const TEMPLATES = [
  { name: "Corporate", color: "from-emerald-600 to-teal-700", style: "Professional" },
  { name: "Minimal", color: "from-stone-400 to-stone-600", style: "Clean & Simple" },
  { name: "Neon", color: "from-cyan-400 to-purple-500", style: "Bold & Vibrant" },
  { name: "Creative", color: "from-pink-500 to-orange-400", style: "Artistic" },
  { name: "Dark", color: "from-stone-700 to-stone-900", style: "Sleek & Modern" },
  { name: "Gradient", color: "from-emerald-400 to-cyan-500", style: "Fresh & Dynamic" },
];

const AR_MODELS = [
  { id: "default", name: "Default Card", desc: "Standard floating card" },
  { id: "hologram", name: "Hologram", desc: "Holographic effect" },
  { id: "cube", name: "3D Cube", desc: "Rotating cube display" },
  { id: "upload", name: "Upload Custom", desc: "Your own 3D model" },
];

interface OnboardingData {
  name: string;
  email: string;
  company: string;
  designation: string;
  template: string;
  linkedin: string;
  github: string;
  twitter: string;
  phone: string;
  contactEmail: string;
  website: string;
  arModel: string;
}

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [publishing, setPublishing] = useState(false);
  const [data, setData] = useState<OnboardingData>({
    name: "",
    email: "",
    company: "",
    designation: "",
    template: "",
    linkedin: "",
    github: "",
    twitter: "",
    phone: "",
    contactEmail: "",
    website: "",
    arModel: "default",
  });

  const skipOnboarding = () => {
    router.push("/dashboard");
  };

  const handlePublish = async () => {
    if (!data.name.trim()) {
      toast.error("Please enter your name");
      setStep(1);
      return;
    }
    setPublishing(true);
    try {
      const res = await fetch("/api/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.name,
          company: data.company,
          designation: data.designation,
          card: {
            name: data.name,
            designation: data.designation,
            company: data.company,
            phone: data.phone,
            email: data.contactEmail || data.email,
            website: data.website,
            linkedin: data.linkedin,
            twitter: data.twitter,
            status: "ACTIVE",
          },
          publish: true,
        }),
      });
      if (!res.ok) throw new Error("Failed to publish");
      toast.success("Card published!");
      router.push("/dashboard");
    } catch {
      toast.error("Failed to publish card. Please try again.");
    } finally {
      setPublishing(false);
    }
  };

  const update = (field: keyof OnboardingData, value: string) => {
    setData((prev) => ({ ...prev, [field]: value }));
  };

  const next = () => setStep((s) => Math.min(s + 1, TOTAL_STEPS));
  const prev = () => setStep((s) => Math.max(s - 1, 1));

  const progress = ((step - 1) / (TOTAL_STEPS - 1)) * 100;

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="ob-name">Full Name</Label>
                <Input
                  id="ob-name"
                  value={data.name}
                  onChange={(e) => update("name", e.target.value)}
                  placeholder="John Doe"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="ob-email">Email</Label>
                <Input
                  id="ob-email"
                  type="email"
                  value={data.email}
                  onChange={(e) => update("email", e.target.value)}
                  placeholder="john@example.com"
                />
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="ob-company">Company</Label>
                <Input
                  id="ob-company"
                  value={data.company}
                  onChange={(e) => update("company", e.target.value)}
                  placeholder="Acme Inc."
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="ob-designation">Designation</Label>
                <Input
                  id="ob-designation"
                  value={data.designation}
                  onChange={(e) => update("designation", e.target.value)}
                  placeholder="Software Engineer"
                />
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {TEMPLATES.map((t) => (
              <button
                key={t.name}
                type="button"
                onClick={() => update("template", t.name)}
                className={`glass overflow-hidden rounded-xl text-left transition-all hover:glow-sm ${
                  data.template === t.name ? "ring-2 ring-primary" : ""
                }`}
              >
                <div className={`h-24 bg-gradient-to-br ${t.color} p-4 flex items-center justify-center`}>
                  <span className="text-lg font-bold text-white/90">{t.name}</span>
                </div>
                <div className="p-3">
                  <p className="text-sm font-medium">{t.name}</p>
                  <p className="text-xs text-muted-foreground">{t.style}</p>
                  {data.template === t.name && (
                    <div className="mt-1 flex items-center gap-1 text-xs text-primary">
                      <Check className="h-3 w-3" />
                      Selected
                    </div>
                  )}
                </div>
              </button>
            ))}
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="ob-linkedin">LinkedIn</Label>
              <Input
                id="ob-linkedin"
                value={data.linkedin}
                onChange={(e) => update("linkedin", e.target.value)}
                placeholder="https://linkedin.com/in/..."
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ob-github">GitHub</Label>
              <Input
                id="ob-github"
                value={data.github}
                onChange={(e) => update("github", e.target.value)}
                placeholder="https://github.com/..."
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ob-twitter">Twitter / X</Label>
              <Input
                id="ob-twitter"
                value={data.twitter}
                onChange={(e) => update("twitter", e.target.value)}
                placeholder="https://twitter.com/..."
              />
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="ob-phone">Phone</Label>
              <Input
                id="ob-phone"
                value={data.phone}
                onChange={(e) => update("phone", e.target.value)}
                placeholder="+1 (555) 000-0000"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ob-contact-email">Contact Email</Label>
              <Input
                id="ob-contact-email"
                type="email"
                value={data.contactEmail}
                onChange={(e) => update("contactEmail", e.target.value)}
                placeholder="contact@example.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ob-website">Website</Label>
              <Input
                id="ob-website"
                value={data.website}
                onChange={(e) => update("website", e.target.value)}
                placeholder="https://example.com"
              />
            </div>
          </div>
        );

      case 5:
        return (
          <div className="grid gap-4 sm:grid-cols-2">
            {AR_MODELS.map((model) => (
              <button
                key={model.id}
                type="button"
                onClick={() => update("arModel", model.id)}
                className={`glass rounded-xl p-4 text-left transition-all hover:glow-sm ${
                  data.arModel === model.id ? "ring-2 ring-primary" : ""
                }`}
              >
                <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <Box className="h-5 w-5 text-primary" />
                </div>
                <p className="text-sm font-medium">{model.name}</p>
                <p className="text-xs text-muted-foreground">{model.desc}</p>
                {data.arModel === model.id && (
                  <div className="mt-2 flex items-center gap-1 text-xs text-primary">
                    <Check className="h-3 w-3" />
                    Selected
                  </div>
                )}
              </button>
            ))}
          </div>
        );

      case 6:
        return (
          <div className="flex flex-col items-center space-y-6">
            <div className="glass rounded-xl p-6">
              <QRGenerator slug={data.name.toLowerCase().replace(/\s+/g, "-") || "preview"} size={200} />
            </div>
            <p className="text-sm text-muted-foreground text-center">
              This QR code will link to your digital card. You can customize it after setup.
            </p>
          </div>
        );

      case 7:
        return (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Review your card details before publishing.
            </p>
            <div className="glass rounded-xl p-6 space-y-4">
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <p className="text-xs text-muted-foreground">Name</p>
                  <p className="text-sm font-medium">{data.name || "Not set"}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Email</p>
                  <p className="text-sm font-medium">{data.email || "Not set"}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Company</p>
                  <p className="text-sm font-medium">{data.company || "Not set"}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Designation</p>
                  <p className="text-sm font-medium">{data.designation || "Not set"}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Template</p>
                  <p className="text-sm font-medium">{data.template || "Not selected"}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">AR Model</p>
                  <p className="text-sm font-medium">
                    {AR_MODELS.find((m) => m.id === data.arModel)?.name || "Default Card"}
                  </p>
                </div>
              </div>
              <div className="border-t border-border pt-3">
                <p className="text-xs text-muted-foreground mb-1">Social Links</p>
                <div className="flex flex-wrap gap-2">
                  {data.linkedin && <span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs text-primary">LinkedIn</span>}
                  {data.github && <span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs text-primary">GitHub</span>}
                  {data.twitter && <span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs text-primary">Twitter</span>}
                  {!data.linkedin && !data.github && !data.twitter && (
                    <span className="text-xs text-muted-foreground">No social links added</span>
                  )}
                </div>
              </div>
            </div>
            <Button onClick={handlePublish} className="w-full" disabled={publishing}>
              {publishing ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Rocket className="h-4 w-4" />
              )}
              {publishing ? "Publishing..." : "Publish Card"}
            </Button>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-grid bg-radial">
      <div className="mx-auto max-w-2xl px-4 py-12">
        <div className="mb-8">
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
                {(() => {
                  const Icon = STEP_CONFIG[step - 1].icon;
                  return <Icon className="h-4 w-4 text-primary" />;
                })()}
              </div>
              <div>
                <p className="text-xs text-muted-foreground">
                  Step {step} of {TOTAL_STEPS}
                </p>
                <h1 className="text-sm font-semibold">
                  {STEP_CONFIG[step - 1].title}
                </h1>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={skipOnboarding}>
              Skip
            </Button>
          </div>

          <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-primary transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div className="glass rounded-xl p-6 mb-6">
          {renderStep()}
        </div>

        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            onClick={prev}
            disabled={step === 1}
          >
            <ChevronLeft className="h-4 w-4" />
            Previous
          </Button>

          <div className="flex gap-1.5">
            {Array.from({ length: TOTAL_STEPS }, (_, i) => (
              <div
                key={i}
                className={`h-1.5 rounded-full transition-all ${
                  i + 1 === step
                    ? "w-6 bg-primary"
                    : i + 1 < step
                    ? "w-1.5 bg-primary/50"
                    : "w-1.5 bg-muted"
                }`}
              />
            ))}
          </div>

          {step < TOTAL_STEPS ? (
            <Button onClick={next}>
              Next
              <ChevronRight className="h-4 w-4" />
            </Button>
          ) : (
            <Button onClick={handlePublish} disabled={publishing}>
              {publishing ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Check className="h-4 w-4" />
              )}
              {publishing ? "Publishing..." : "Finish"}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
