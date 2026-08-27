"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  Upload,
  Scan,
  User,
  Palette,
  Box,
  Eye,
  Rocket,
  QrCode,
  Smartphone,
  Check,
  Loader2,
  ArrowRight,
  ArrowLeft,
  Camera,
  FileImage,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { WorkflowProgress, type WorkflowStep } from "@/components/workflow/workflow-progress";
import { TargetQualityDisplay } from "@/components/ar/target-quality-display";
import { analyzeTargetQuality } from "@/lib/ar/target-quality";
import type { TargetQualityResult } from "@/lib/ar/target-quality";

const WORKFLOW_STEPS = [
  { num: 0, title: "Upload Card", description: "Upload your physical business card", icon: Upload },
  { num: 1, title: "Analyze Card", description: "Review extracted information", icon: Scan },
  { num: 2, title: "Edit Info", description: "Edit your profile information", icon: User },
  { num: 3, title: "Select Template", description: "Choose an AR template", icon: Palette },
  { num: 4, title: "Build AR", description: "Add AR content and elements", icon: Box },
  { num: 5, title: "Validate", description: "Check target quality", icon: Check },
  { num: 6, title: "Preview", description: "Preview your AR experience", icon: Eye },
  { num: 7, title: "Publish", description: "Make your AR card live", icon: Rocket },
  { num: 8, title: "QR Code", description: "Generate QR for your card", icon: QrCode },
  { num: 9, title: "Scan", description: "Test the AR experience", icon: Smartphone },
];

interface CardData {
  name: string;
  slug: string;
  designation: string;
  company: string;
  phone: string;
  email: string;
  website: string;
  bio: string;
  profileImage: string;
  templateId: string;
  cardImage: string;
  mediaId: string;
}

export default function NewCardPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [cardData, setCardData] = useState<CardData>({
    name: "",
    slug: "",
    designation: "",
    company: "",
    phone: "",
    email: "",
    website: "",
    bio: "",
    profileImage: "",
    templateId: "",
    cardImage: "",
    mediaId: "",
  });
  const [targetQuality, setTargetQuality] = useState<TargetQualityResult | null>(null);
  const [uploading, setUploading] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [publishErrors, setPublishErrors] = useState<string[]>([]);

  const steps: WorkflowStep[] = WORKFLOW_STEPS.map((s, i) => ({
    ...s,
    status: i < currentStep ? "completed" : i === currentStep ? "current" : "pending",
  }));

  const handleImageUpload = useCallback(async (file: File) => {
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      if (!res.ok) throw new Error("Upload failed");
      const data = await res.json();
      setCardData((prev) => ({ ...prev, cardImage: data.url, mediaId: data.id }));

      const quality = await analyzeTargetQuality(data.url);
      setTargetQuality(quality);

      const extractRes = await fetch("/api/ai/extract-card", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageUrl: data.url }),
      });
      if (extractRes.ok) {
        const { extracted } = await extractRes.json();
        if (extracted) {
          setCardData((prev) => ({
            ...prev,
            name: extracted.name || prev.name,
            slug: extracted.name
              ? (prev.slug || extracted.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""))
              : prev.slug,
            designation: extracted.designation || prev.designation,
            company: extracted.company || prev.company,
            phone: extracted.phone || prev.phone,
            email: extracted.email || prev.email,
            website: extracted.website || prev.website,
          }));
          toast.success("Card info extracted — review in the next step");
        }
      }

      toast.success("Card image uploaded");
      setCurrentStep(1);
    } catch {
      toast.error("Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  }, []);

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) handleImageUpload(file);
    },
    [handleImageUpload]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      const file = e.dataTransfer.files?.[0];
      if (file) handleImageUpload(file);
    },
    [handleImageUpload]
  );

  const handleSlugChange = useCallback((value: string) => {
    const slug = value
      .toLowerCase()
      .replace(/[^a-z0-9-]/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "");
    setCardData((prev) => ({ ...prev, slug }));
  }, []);

  const validateCardData = useCallback((): string[] => {
    const errors: string[] = [];
    if (!cardData.name.trim()) {
      errors.push("Name is required");
    }
    if (cardData.slug.length < 3) {
      errors.push("Slug must be at least 3 characters");
    }
    if (cardData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cardData.email)) {
      errors.push("Please enter a valid email address");
    }
    if (cardData.website && !/^https?:\/\/.+/.test(cardData.website)) {
      errors.push("Website must start with http:// or https://");
    }
    return errors;
  }, [cardData.name, cardData.slug, cardData.email, cardData.website]);

  const handlePublish = useCallback(async () => {
    const errors = validateCardData();
    if (errors.length > 0) {
      setPublishErrors(errors);
      return;
    }
    setPublishErrors([]);
    setPublishing(true);
    try {
      const res = await fetch("/api/cards", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: cardData.name,
          slug: cardData.slug,
          designation: cardData.designation,
          company: cardData.company,
          phone: cardData.phone,
          email: cardData.email,
          website: cardData.website,
          bio: cardData.bio,
          profileImage: cardData.profileImage,
          templateId: cardData.templateId,
          status: "ACTIVE",
          visibility: "PUBLIC",
        }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: "Publish failed" }));
        throw new Error(err.error || "Publish failed");
      }
      const data = await res.json();

      if (cardData.mediaId) {
        await fetch(`/api/media?id=${cardData.mediaId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ cardId: data.id }),
        }).catch(() => {});
      }

      toast.success("Card published!");
      router.push(`/dashboard/cards/${data.id}/ar`);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Publish failed. Please try again.";
      toast.error(message);
    } finally {
      setPublishing(false);
    }
  }, [cardData, router, validateCardData]);

  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2">Create Your AR Business Card</h1>
        <p className="text-muted-foreground text-sm">
          Upload your physical card, build your AR experience, and publish.
        </p>
      </div>

      <div className="mb-8">
        <WorkflowProgress steps={steps} currentStep={currentStep} />
      </div>

      <div className="glass rounded-2xl border border-border p-6 md:p-8">
        {currentStep === 0 && (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h2 className="text-xl font-bold mb-2">Upload Your Business Card</h2>
              <p className="text-sm text-muted-foreground">
                Upload a photo of your physical business card. This image will be used as the AR target.
              </p>
            </div>

            <div
              onDrop={handleDrop}
              onDragOver={(e) => e.preventDefault()}
              className="border-2 border-dashed border-border rounded-xl p-12 text-center hover:border-primary/50 transition-colors cursor-pointer"
            >
              <input
                type="file"
                accept="image/jpeg,image/png"
                onChange={handleFileSelect}
                className="hidden"
                id="card-upload"
              />
              <label htmlFor="card-upload" className="cursor-pointer">
                {uploading ? (
                  <Loader2 className="w-12 h-12 text-primary mx-auto mb-4 animate-spin" />
                ) : (
                  <FileImage className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                )}
                <p className="text-sm font-medium mb-1">
                  {uploading ? "Uploading..." : "Drop your card image here or click to browse"}
                </p>
                <p className="text-xs text-muted-foreground">
                  Supports JPG and PNG. For best results, use a clear, well-lit photo.
                </p>
              </label>
            </div>

            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Camera className="w-4 h-4" />
                <span>Or</span>
              </div>
              <label
                htmlFor="camera-upload"
                className="flex items-center gap-2 text-primary hover:text-primary/80 cursor-pointer"
              >
                <Camera className="w-4 h-4" />
                Take a photo
              </label>
              <input
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handleFileSelect}
                className="hidden"
                id="camera-upload"
              />
            </div>
          </div>
        )}

        {currentStep === 1 && (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h2 className="text-xl font-bold mb-2">Analyze Your Card</h2>
              <p className="text-sm text-muted-foreground">
                Review the uploaded card and extracted information.
              </p>
            </div>

            {cardData.cardImage && (
              <div className="flex justify-center mb-6">
                <Image
                  src={cardData.cardImage}
                  alt="Uploaded business card"
                  width={384}
                  height={256}
                  className="max-w-xs rounded-lg border border-border"
                />
              </div>
            )}

            {targetQuality && <TargetQualityDisplay result={targetQuality} />}

            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setCurrentStep(0)}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <Button onClick={() => setCurrentStep(2)}>
                Continue
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        )}

        {currentStep === 2 && (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h2 className="text-xl font-bold mb-2">Edit Your Information</h2>
              <p className="text-sm text-muted-foreground">
                Review and edit your profile details.
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  value={cardData.name}
                  onChange={(e) => setCardData((prev) => ({ ...prev, name: e.target.value }))}
                  placeholder="John Doe"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="slug">URL Slug *</Label>
                <Input
                  id="slug"
                  value={cardData.slug}
                  onChange={(e) => handleSlugChange(e.target.value)}
                  placeholder="john-doe"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="title">Job Title</Label>
                <Input
                  id="title"
                  value={cardData.designation}
                  onChange={(e) => setCardData((prev) => ({ ...prev, designation: e.target.value }))}
                  placeholder="Software Engineer"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="company">Company</Label>
                <Input
                  id="company"
                  value={cardData.company}
                  onChange={(e) => setCardData((prev) => ({ ...prev, company: e.target.value }))}
                  placeholder="TechCorp"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  value={cardData.phone}
                  onChange={(e) => setCardData((prev) => ({ ...prev, phone: e.target.value }))}
                  placeholder="+1 555 0123"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={cardData.email}
                  onChange={(e) => setCardData((prev) => ({ ...prev, email: e.target.value }))}
                  placeholder="john@example.com"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="website">Website</Label>
                <Input
                  id="website"
                  value={cardData.website}
                  onChange={(e) => setCardData((prev) => ({ ...prev, website: e.target.value }))}
                  placeholder="https://example.com"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <textarea
                id="bio"
                value={cardData.bio}
                onChange={(e) => setCardData((prev) => ({ ...prev, bio: e.target.value }))}
                placeholder="Brief description about yourself..."
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm min-h-[80px]"
              />
            </div>

            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setCurrentStep(1)}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <Button onClick={() => setCurrentStep(3)}>
                Continue
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        )}

        {currentStep === 3 && (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h2 className="text-xl font-bold mb-2">Select AR Template</h2>
              <p className="text-sm text-muted-foreground">
                Choose a starting template for your AR experience.
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {[
                { id: "corporate", name: "Corporate Intro", desc: "Logo + video + contact + website" },
                { id: "executive", name: "Executive", desc: "Profile + bio + LinkedIn + Save Contact" },
                { id: "creative", name: "Creator", desc: "Portfolio + social + video" },
                { id: "product", name: "Product", desc: "3D product + video + Buy Now" },
              ].map((template) => (
                <button
                  key={template.id}
                  onClick={() => setCardData((prev) => ({ ...prev, templateId: template.id }))}
                  className={`glass rounded-xl p-4 text-left transition-all ${
                    cardData.templateId === template.id
                      ? "border-primary ring-2 ring-primary/20"
                      : "border-border hover:border-primary/50"
                  }`}
                >
                  <h3 className="font-semibold">{template.name}</h3>
                  <p className="text-sm text-muted-foreground">{template.desc}</p>
                </button>
              ))}
            </div>

            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setCurrentStep(2)}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <Button onClick={() => setCurrentStep(4)}>
                Continue
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        )}

        {(currentStep === 4 || currentStep === 5 || currentStep === 6) && (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h2 className="text-xl font-bold mb-2">
                {currentStep === 4 && "Build Your AR Experience"}
                {currentStep === 5 && "Validate Your Target"}
                {currentStep === 6 && "Preview Your AR Card"}
              </h2>
              <p className="text-sm text-muted-foreground">
                {currentStep === 4 && "Add videos, 3D models, images and interactive buttons."}
                {currentStep === 5 && "Review target quality and AR validation."}
                {currentStep === 6 && "See how your AR card will look."}
              </p>
            </div>

            <div className="glass rounded-xl p-8 text-center">
              <Box className="w-12 h-12 text-primary mx-auto mb-4" />
              <p className="text-sm text-muted-foreground">
                {currentStep === 4 && "AR Builder will be available after publishing. You can add elements in the AR editor."}
                {currentStep === 5 && (targetQuality ? `Target quality: ${targetQuality.score}/100 — ${targetQuality.rating}` : "Upload a card image to analyze target quality.")}
                {currentStep === 6 && "Preview will be available after publishing your card."}
              </p>
            </div>

            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setCurrentStep(currentStep - 1)}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <Button onClick={() => setCurrentStep(currentStep + 1)}>
                Continue
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        )}

        {currentStep === 7 && (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h2 className="text-xl font-bold mb-2">Publish Your AR Card</h2>
              <p className="text-sm text-muted-foreground">
                Make your AR business card live.
              </p>
            </div>

            <div className="glass rounded-xl p-6">
              <h3 className="font-semibold mb-4">Publish Checklist</h3>
              <div className="space-y-3">
                {[
                  { label: "Profile information", passed: Boolean(cardData.name) },
                  { label: "Card image uploaded", passed: Boolean(cardData.cardImage) },
                  { label: "URL slug set", passed: Boolean(cardData.slug) },
                  { label: "Template selected", passed: Boolean(cardData.templateId) },
                ].map((item) => (
                  <div key={item.label} className="flex items-center gap-2">
                    {item.passed ? (
                      <Check className="w-4 h-4 text-emerald-500" />
                    ) : (
                      <div className="w-4 h-4 rounded-full border-2 border-muted" />
                    )}
                    <span className={`text-sm ${item.passed ? "text-foreground" : "text-muted-foreground"}`}>
                      {item.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setCurrentStep(6)}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <Button onClick={handlePublish} disabled={publishing || !cardData.name || !cardData.slug}>
                {publishing ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Rocket className="w-4 h-4 mr-2" />
                )}
                Publish Card
              </Button>
            </div>

            {publishErrors.length > 0 && (
              <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-3 text-sm text-destructive">
                <ul className="list-disc list-inside space-y-1">
                  {publishErrors.map((e) => (
                    <li key={e}>{e}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {currentStep >= 8 && (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h2 className="text-xl font-bold mb-2">Your AR Card is Live!</h2>
              <p className="text-sm text-muted-foreground">
                Share your AR business card with the world.
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="glass rounded-xl p-6 text-center">
                <QrCode className="w-16 h-16 text-primary mx-auto mb-4" />
                <h3 className="font-semibold mb-2">QR Code</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Scan to experience the AR card
                </p>
                <Button variant="outline" size="sm">
                  Download QR
                </Button>
              </div>
              <div className="glass rounded-xl p-6 text-center">
                <Smartphone className="w-16 h-16 text-primary mx-auto mb-4" />
                <h3 className="font-semibold mb-2">AR URL</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  /ar/{cardData.slug || "your-card"}
                </p>
                <Button variant="outline" size="sm">
                  Copy URL
                </Button>
              </div>
            </div>

            <div className="flex justify-center gap-4">
              <Button variant="outline" onClick={() => router.push("/dashboard")}>
                Go to Dashboard
              </Button>
              <Button onClick={() => router.push(`/ar/${cardData.slug}`)}>
                <Eye className="w-4 h-4 mr-2" />
                Experience AR Card
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
