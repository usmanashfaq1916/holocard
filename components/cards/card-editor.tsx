"use client";

import { useEffect, useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  User,
  Palette,
  Link2,
  Image,
  MousePointerClick,
  Search,
  Plus,
  Trash2,
  Pencil,
  ExternalLink,
  Phone,
  Mail,
  Globe,
  MapPin,
  Loader2,
  Save,
  ChevronLeft,
  Box,
  Camera,
  Shield,
  MessageSquare,
} from "lucide-react";
import { toast } from "sonner";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

const cardEditorSchema = z.object({
  name: z.string().min(1, "Name is required").max(100, "Name must be 100 characters or less"),
  slug: z
    .string()
    .min(3, "Slug must be at least 3 characters")
    .regex(
      /^[a-z0-9-]+$/,
      "Slug can only contain lowercase letters, numbers, and hyphens"
    ),
  designation: z.string().optional(),
  company: z.string().optional(),
  bio: z.string().max(500, "Bio must be 500 characters or less").optional(),
  phone: z.string().optional(),
  email: z.string().email().optional().or(z.literal("")),
  website: z.string().url().optional().or(z.literal("")),
  whatsapp: z.string().optional(),
  location: z.string().optional(),
  linkedin: z.string().optional(),
  twitter: z.string().optional(),
  facebook: z.string().optional(),
  instagram: z.string().optional(),
  github: z.string().optional(),
  youtube: z.string().optional(),
  telegram: z.string().optional(),
  tiktok: z.string().optional(),
  profileImage: z.string().optional(),
  companyLogo: z.string().optional(),
  bgImage: z.string().optional(),
  templateId: z.string().optional(),
  accentColor: z.string().optional(),
  bgStyle: z.enum(["solid", "gradient", "glass"]).optional(),
  fontFamily: z.string().optional(),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  allowIndexing: z.boolean().optional(),
  visibility: z.enum(["PUBLIC", "UNLISTED", "PRIVATE"]).optional(),
  status: z.enum(["ACTIVE", "DRAFT", "ARCHIVED", "DISABLED"]).optional(),
  cardType: z.enum(["PERSONAL", "PROFESSIONAL", "BUSINESS", "PORTFOLIO", "EVENT"]).optional(),
  about: z.string().optional(),
  skills: z.string().optional(),
  enableContact: z.boolean().optional(),
  borderColor: z.string().optional(),
  shadowStyle: z.string().optional(),
  buttonStyle: z.string().optional(),
  layoutStyle: z.string().optional(),
  imageShape: z.string().optional(),
  socialIconStyle: z.string().optional(),
});

type CardEditorValues = z.infer<typeof cardEditorSchema>;

interface CardButton {
  id: string;
  cardId: string;
  label: string;
  icon: string | null;
  url: string;
  order: number;
  isActive: boolean;
}

interface CardEditorProps {
  cardId?: string;
  initialData?: Partial<CardEditorValues>;
}

function SocialIcon({ platform }: { platform: string }) {
  const p = platform.toLowerCase();
  if (p === "linkedin")
    return (
      <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    );
  if (p === "twitter" || p === "x")
    return (
      <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    );
  if (p === "github")
    return (
      <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
      </svg>
    );
  if (p === "facebook")
    return (
      <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
      </svg>
    );
  if (p === "instagram")
    return (
      <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
      </svg>
    );
  return <ExternalLink className="h-4 w-4" />;
}

const DEFAULT_VALUES: CardEditorValues = {
  name: "",
  slug: "",
  designation: "",
  company: "",
  bio: "",
  phone: "",
  email: "",
  website: "",
  whatsapp: "",
  location: "",
  linkedin: "",
  twitter: "",
  facebook: "",
  instagram: "",
  github: "",
  youtube: "",
  telegram: "",
  tiktok: "",
  profileImage: "",
  companyLogo: "",
  bgImage: "",
  templateId: "",
  accentColor: "#2563EB",
  bgStyle: "solid",
  fontFamily: "Inter",
  metaTitle: "",
  metaDescription: "",
  allowIndexing: true,
  visibility: "PUBLIC" as const,
};

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function CardEditor({ cardId, initialData }: CardEditorProps) {
  const [buttons, setButtons] = useState<CardButton[]>([]);
  const [buttonDialogOpen, setButtonDialogOpen] = useState(false);
  const [editingButton, setEditingButton] = useState<CardButton | null>(null);
  const [buttonLabel, setButtonLabel] = useState("");
  const [buttonUrl, setButtonUrl] = useState("");
  const [saving, setSaving] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<CardEditorValues>({
    resolver: zodResolver(cardEditorSchema),
    defaultValues: { ...DEFAULT_VALUES, ...initialData },
  });

  const formValues = watch();

  const loadCard = useCallback(async () => {
    if (!cardId) return;
    const res = await fetch(`/api/cards/${cardId}`);
    if (!res.ok) return;
    const card = await res.json();
    const fields = [
      "name", "slug", "designation", "company", "bio", "phone", "email",
      "website", "whatsapp", "location", "linkedin", "twitter", "facebook",
      "instagram", "profileImage", "companyLogo", "bgImage", "templateId", "accentColor", "bgStyle",
      "fontFamily", "metaTitle", "metaDescription", "allowIndexing", "visibility",
      "cardType",
    ] as const;
    const extraFields = [
      "borderColor", "shadowStyle", "buttonStyle", "layoutStyle", "imageShape", "socialIconStyle",
    ];
    fields.forEach((f) => {
      if (card[f] !== undefined && card[f] !== null) {
        setValue(f, card[f] as any);
      }
    });
    extraFields.forEach((f) => {
      if (card[f] !== undefined && card[f] !== null) {
        setValue(f as any, card[f] as any);
      }
    });
  }, [cardId, setValue]);

  const loadButtons = useCallback(async () => {
    if (!cardId) return;
    const res = await fetch(`/api/cards/${cardId}/buttons`);
    if (res.ok) {
      setButtons(await res.json());
    }
  }, [cardId]);

  useEffect(() => {
    loadCard();
    loadButtons();
  }, [loadCard, loadButtons]);

  const onSubmit = async (data: CardEditorValues) => {
    setSaving(true);
    try {
      const url = cardId ? `/api/cards/${cardId}` : "/api/cards";
      const method = cardId ? "PATCH" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const err = await res.json();
        toast.error(err.error || "Failed to save card");
        return;
      }
      if (!cardId) {
        const created = await res.json();
        toast.success("Card created");
        window.location.href = `/dashboard/cards/${created.id}/edit`;
      } else {
        toast.success("Card saved successfully");
      }
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const [bgImageUploading, setBgImageUploading] = useState(false);

  const handleUpload = async (file: File, purpose: "profile" | "company" | "background") => {
    if (!cardId) {
      toast.error("Save the card before uploading images");
      return;
    }
    const formData = new FormData();
    formData.append("file", file);
    formData.append("cardId", cardId);
    formData.append("purpose", purpose === "profile" ? "profile" : purpose === "company" ? "company-logo" : "background");
    const res = await fetch("/api/upload", { method: "POST", body: formData });
    if (res.ok) {
      const data = await res.json();
      if (purpose === "profile") setValue("profileImage", data.url);
      else if (purpose === "company") setValue("companyLogo", data.url);
      else setValue("bgImage", data.url);
      toast.success("Image uploaded");
    } else {
      toast.error("Failed to upload image");
    }
  };

  const saveButton = async () => {
    if (!cardId || !buttonLabel || !buttonUrl) return;
    if (editingButton) {
      const res = await fetch(`/api/cards/${cardId}/buttons`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          buttonId: editingButton.id,
          label: buttonLabel,
          url: buttonUrl,
        }),
      });
      if (res.ok) loadButtons();
    } else {
      const res = await fetch(`/api/cards/${cardId}/buttons`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          label: buttonLabel,
          url: buttonUrl,
          order: buttons.length,
        }),
      });
      if (res.ok) loadButtons();
    }
    setButtonDialogOpen(false);
    setEditingButton(null);
    setButtonLabel("");
    setButtonUrl("");
  };

  const deleteButton = async (id: string) => {
    if (!cardId) return;
    const res = await fetch(`/api/cards/${cardId}/buttons?buttonId=${id}`, {
      method: "DELETE",
    });
    if (res.ok) loadButtons();
  };

  const initials = formValues.name
    ? formValues.name.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2)
    : "?";

  return (
    <div className="flex h-full flex-col lg:flex-row">
      <div className="flex-1 overflow-y-auto p-4 lg:p-6">
        <div className="mb-6 flex items-center gap-3">
          <a href="/dashboard" className={buttonVariants({ variant: "ghost", size: "icon-sm" })}>
            <ChevronLeft className="h-4 w-4" />
          </a>
          <div>
            <h1 className="text-xl font-bold">{cardId ? "Edit Card" : "New Card"}</h1>
            <p className="text-sm text-muted-foreground">
              {cardId ? "Update your digital card" : "Create a new digital business card"}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <Tabs defaultValue="profile">
            <TabsList className="mb-4 flex flex-wrap">
              <TabsTrigger value="profile"><User className="h-4 w-4" />Profile</TabsTrigger>
              <TabsTrigger value="design"><Palette className="h-4 w-4" />Design</TabsTrigger>
              <TabsTrigger value="social"><Link2 className="h-4 w-4" />Social</TabsTrigger>
              <TabsTrigger value="media"><Image className="h-4 w-4" />Media</TabsTrigger>
              <TabsTrigger value="buttons"><MousePointerClick className="h-4 w-4" />Buttons</TabsTrigger>
              <TabsTrigger value="contact"><MessageSquare className="h-4 w-4" />Contact</TabsTrigger>
              <TabsTrigger value="3d"><Box className="h-4 w-4" />3D Card</TabsTrigger>
              <TabsTrigger value="ar"><Camera className="h-4 w-4" />AR</TabsTrigger>
              <TabsTrigger value="privacy"><Shield className="h-4 w-4" />Privacy</TabsTrigger>
              <TabsTrigger value="seo"><Search className="h-4 w-4" />SEO</TabsTrigger>
            </TabsList>

            <TabsContent value="profile" className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Name *</Label>
                  <Input id="name" {...register("name")} placeholder="John Doe" maxLength={100} />
                  {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="slug">Slug *</Label>
                  <Input id="slug" {...register("slug")} placeholder="john-doe" />
                  {errors.slug && <p className="text-xs text-destructive">{errors.slug.message}</p>}
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="designation">Designation</Label>
                  <Input id="designation" {...register("designation")} placeholder="Software Engineer" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="company">Company</Label>
                  <Input id="company" {...register("company")} placeholder="Acme Inc." />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="cardType">Card Type</Label>
                <select
                  id="cardType"
                  {...register("cardType")}
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="PROFESSIONAL">Professional</option>
                  <option value="PERSONAL">Personal</option>
                  <option value="BUSINESS">Business</option>
                  <option value="PORTFOLIO">Portfolio</option>
                  <option value="EVENT">Event</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea id="bio" {...register("bio")} placeholder="A short bio about yourself..." rows={3} maxLength={500} />
                <p className="text-xs text-muted-foreground text-right">
                  {(formValues.bio || "").length}/500
                </p>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" {...register("email")} placeholder="john@example.com" />
                  {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input id="phone" {...register("phone")} placeholder="+1 (555) 000-0000" />
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="website">Website</Label>
                  <Input id="website" {...register("website")} placeholder="https://example.com" />
                  {errors.website && <p className="text-xs text-destructive">{errors.website.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="whatsapp">WhatsApp</Label>
                  <Input id="whatsapp" {...register("whatsapp")} placeholder="+1 (555) 000-0000" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input id="location" {...register("location")} placeholder="San Francisco, CA" />
              </div>
            </TabsContent>

            <TabsContent value="design" className="space-y-4">
              {/* Template Selection */}
              <div className="space-y-2">
                <Label>Template</Label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: "", name: "Default" },
                    { id: "corporate", name: "Corporate" },
                    { id: "developer", name: "Developer" },
                    { id: "designer", name: "Designer" },
                    { id: "freelancer", name: "Freelancer" },
                    { id: "executive", name: "Executive" },
                    { id: "minimal", name: "Minimal" },
                    { id: "creative", name: "Creative" },
                    { id: "real-estate", name: "Real Estate" },
                    { id: "student", name: "Student" },
                  ].map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setValue("templateId", t.id)}
                      className={`rounded-lg border p-2 text-xs font-medium transition-colors ${
                        watch("templateId") === t.id
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-border text-muted-foreground hover:bg-accent"
                      }`}
                    >
                      {t.name}
                    </button>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <Label>Accent Color</Label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={formValues.accentColor || "#2563EB"}
                    onChange={(e) => setValue("accentColor", e.target.value)}
                    className="h-10 w-10 cursor-pointer rounded-lg border border-border"
                  />
                  <Input
                    value={formValues.accentColor || "#2563EB"}
                    onChange={(e) => {
                      if (/^#[0-9A-Fa-f]{6}$/.test(e.target.value)) {
                        setValue("accentColor", e.target.value);
                      }
                    }}
                    className="w-32"
                    placeholder="#2563EB"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Background Style</Label>
                <div className="flex gap-2">
                  {(["solid", "gradient", "glass"] as const).map((style) => (
                    <button
                      key={style}
                      type="button"
                      onClick={() => setValue("bgStyle", style)}
                      className={`rounded-lg border px-4 py-2 text-xs font-medium capitalize transition-colors ${
                        formValues.bgStyle === style
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-border text-muted-foreground hover:bg-accent"
                      }`}
                    >
                      {style}
                    </button>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <Label>Font Family</Label>
                <select
                  value={formValues.fontFamily || "Inter"}
                  onChange={(e) => setValue("fontFamily", e.target.value)}
                  className="h-8 w-full rounded-lg border border-input bg-transparent px-2.5 py-1 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                >
                  <option value="Inter">Inter</option>
                  <option value="Roboto">Roboto</option>
                  <option value="Open Sans">Open Sans</option>
                  <option value="Montserrat">Montserrat</option>
                  <option value="Poppins">Poppins</option>
                  <option value="Lato">Lato</option>
                  <option value="Raleway">Raleway</option>
                  <option value="Space Grotesk">Space Grotesk</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label>Border Style</Label>
                <div className="flex gap-2">
                  {[
                    { id: "none", label: "None" },
                    { id: "subtle", label: "Subtle" },
                    { id: "accent", label: "Accent" },
                  ].map((b) => (
                    <button
                      key={b.id}
                      type="button"
                      onClick={() => setValue("borderColor" as any, b.id)}
                      className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors ${
                        (formValues as any).borderColor === b.id
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-border text-muted-foreground hover:bg-accent"
                      }`}
                    >
                      {b.label}
                    </button>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <Label>Shadow Style</Label>
                <div className="flex gap-2">
                  {[
                    { id: "none", label: "None" },
                    { id: "soft", label: "Soft" },
                    { id: "medium", label: "Medium" },
                    { id: "strong", label: "Strong" },
                  ].map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => setValue("shadowStyle" as any, s.id)}
                      className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors ${
                        (formValues as any).shadowStyle === s.id
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-border text-muted-foreground hover:bg-accent"
                      }`}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <Label>Button Style</Label>
                <div className="flex gap-2">
                  {[
                    { id: "solid", label: "Solid" },
                    { id: "outline", label: "Outline" },
                    { id: "ghost", label: "Ghost" },
                  ].map((b) => (
                    <button
                      key={b.id}
                      type="button"
                      onClick={() => setValue("buttonStyle" as any, b.id)}
                      className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors ${
                        (formValues as any).buttonStyle === b.id
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-border text-muted-foreground hover:bg-accent"
                      }`}
                    >
                      {b.label}
                    </button>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <Label>Layout</Label>
                <div className="flex gap-2">
                  {[
                    { id: "centered", label: "Centered" },
                    { id: "left", label: "Left Aligned" },
                  ].map((l) => (
                    <button
                      key={l.id}
                      type="button"
                      onClick={() => setValue("layoutStyle" as any, l.id)}
                      className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors ${
                        (formValues as any).layoutStyle === l.id
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-border text-muted-foreground hover:bg-accent"
                      }`}
                    >
                      {l.label}
                    </button>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <Label>Profile Image Shape</Label>
                <div className="flex gap-2">
                  {[
                    { id: "circle", label: "Circle" },
                    { id: "rounded", label: "Rounded" },
                    { id: "square", label: "Square" },
                  ].map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => setValue("imageShape" as any, s.id)}
                      className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors ${
                        (formValues as any).imageShape === s.id
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-border text-muted-foreground hover:bg-accent"
                      }`}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <Label>Social Icon Style</Label>
                <div className="flex gap-2">
                  {[
                    { id: "rounded", label: "Rounded" },
                    { id: "square", label: "Square" },
                    { id: "filled", label: "Filled" },
                    { id: "outlined", label: "Outlined" },
                  ].map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => setValue("socialIconStyle" as any, s.id)}
                      className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors ${
                        (formValues as any).socialIconStyle === s.id
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-border text-muted-foreground hover:bg-accent"
                      }`}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="social" className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="linkedin">LinkedIn</Label>
                  <Input id="linkedin" {...register("linkedin")} placeholder="https://linkedin.com/in/..." />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="twitter">Twitter / X</Label>
                  <Input id="twitter" {...register("twitter")} placeholder="https://twitter.com/..." />
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="github">GitHub</Label>
                  <Input id="github" {...register("github")} placeholder="https://github.com/..." />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="instagram">Instagram</Label>
                  <Input id="instagram" {...register("instagram")} placeholder="https://instagram.com/..." />
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="facebook">Facebook</Label>
                  <Input id="facebook" {...register("facebook")} placeholder="https://facebook.com/..." />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="youtube">YouTube</Label>
                  <Input id="youtube" {...register("youtube")} placeholder="https://youtube.com/..." />
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="telegram">Telegram</Label>
                  <Input id="telegram" {...register("telegram")} placeholder="https://t.me/..." />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tiktok">TikTok</Label>
                  <Input id="tiktok" {...register("tiktok")} placeholder="https://tiktok.com/@..." />
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="whatsapp">WhatsApp</Label>
                  <Input id="whatsapp" {...register("whatsapp")} placeholder="+1 (555) 000-0000" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="website">Website</Label>
                  <Input id="website" {...register("website")} placeholder="https://yourdomain.com" />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="media" className="space-y-6">
              <div className="space-y-2">
                <Label>Profile Image</Label>
                <div className="flex items-center gap-4">
                  {formValues.profileImage ? (
                    <img
                      src={formValues.profileImage}
                      alt="Profile"
                      className="h-20 w-20 rounded-full object-cover border border-border"
                    />
                  ) : (
                    <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted text-2xl font-bold text-muted-foreground">
                      {initials}
                    </div>
                  )}
                  <label className="cursor-pointer">
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleUpload(file, "profile");
                      }}
                    />
                    <span className={buttonVariants({ variant: "outline", size: "sm" }) + " cursor-pointer"}><Image className="h-4 w-4" />{formValues.profileImage ? "Change" : "Upload"}</span>
                  </label>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Company Logo</Label>
                <div className="flex items-center gap-4">
                  {formValues.companyLogo ? (
                    <img
                      src={formValues.companyLogo}
                      alt="Logo"
                      className="h-16 w-16 rounded-lg object-contain border border-border"
                    />
                  ) : (
                    <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-muted text-xs font-medium text-muted-foreground">
                      Logo
                    </div>
                  )}
                  <label className="cursor-pointer">
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleUpload(file, "company");
                      }}
                    />
                    <span className={buttonVariants({ variant: "outline", size: "sm" }) + " cursor-pointer"}><Image className="h-4 w-4" />{formValues.companyLogo ? "Change" : "Upload"}</span>
                  </label>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Cover Image</Label>
                <div className="flex items-center gap-4">
                  {formValues.bgImage ? (
                    <img
                      src={formValues.bgImage}
                      alt="Cover"
                      className="h-20 w-32 rounded-lg object-cover border border-border"
                    />
                  ) : (
                    <div className="flex h-20 w-32 items-center justify-center rounded-lg bg-muted text-xs font-medium text-muted-foreground">
                      Cover
                    </div>
                  )}
                  {bgImageUploading ? (
                    <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                  ) : (
                    <label className="cursor-pointer">
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (!file || !cardId) return;
                          setBgImageUploading(true);
                          try {
                            await handleUpload(file, "background");
                          } finally {
                            setBgImageUploading(false);
                          }
                        }}
                      />
                      <span className={buttonVariants({ variant: "outline", size: "sm" }) + " cursor-pointer"}>
                        <Image className="h-4 w-4" />{formValues.bgImage ? "Change" : "Upload"}
                      </span>
                    </label>
                  )}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="buttons" className="space-y-4">
              {!cardId && (
                <p className="text-sm text-muted-foreground">
                  Save the card first to add custom buttons.
                </p>
              )}
              {cardId && (
                <>
                  <div className="space-y-2">
                    {buttons.map((btn) => (
                      <div
                        key={btn.id}
                        className="flex items-center justify-between rounded-lg border border-border p-3"
                      >
                        <div className="flex items-center gap-3">
                          <MousePointerClick className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <p className="text-sm font-medium">{btn.label}</p>
                            <p className="max-w-[200px] truncate text-xs text-muted-foreground">
                              {btn.url}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon-xs"
                            onClick={() => {
                              setEditingButton(btn);
                              setButtonLabel(btn.label);
                              setButtonUrl(btn.url);
                              setButtonDialogOpen(true);
                            }}
                          >
                            <Pencil className="h-3 w-3" />
                          </Button>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon-xs"
                            onClick={() => deleteButton(btn.id)}
                          >
                            <Trash2 className="h-3 w-3 text-destructive" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setEditingButton(null);
                      setButtonLabel("");
                      setButtonUrl("");
                      setButtonDialogOpen(true);
                    }}
                  >
                    <Plus className="h-4 w-4" />Add Button
                  </Button>
                </>
              )}
            </TabsContent>

            <TabsContent value="seo" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="metaTitle">Meta Title</Label>
                <Input id="metaTitle" {...register("metaTitle")} placeholder="Page title for search engines" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="metaDescription">Meta Description</Label>
                <Textarea
                  id="metaDescription"
                  {...register("metaDescription")}
                  placeholder="Brief description for search results..."
                  rows={3}
                />
              </div>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setValue("allowIndexing", !formValues.allowIndexing)}
                  className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors ${
                    formValues.allowIndexing ? "bg-primary" : "bg-input"
                  }`}
                >
                  <span
                    className={`pointer-events-none block h-4 w-4 rounded-full bg-background shadow-lg transition-transform ${
                      formValues.allowIndexing ? "translate-x-4" : "translate-x-0"
                    }`}
                  />
                </button>
                <Label
                  className="cursor-pointer"
                  onClick={() => setValue("allowIndexing", !formValues.allowIndexing)}
                >
                  Allow search engine indexing
                </Label>
              </div>
              <div className="space-y-2">
                <Label>Allow Search Engine Indexing</Label>
                <p className="text-xs text-muted-foreground">Control whether search engines can index your card page.</p>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 text-sm">
                    <input type="radio" name="allowIndexing" defaultChecked className="accent-primary" />
                    Allow indexing
                  </label>
                  <label className="flex items-center gap-2 text-sm">
                    <input type="radio" name="allowIndexing" className="accent-primary" />
                    Noindex
                  </label>
                </div>
              </div>
            </TabsContent>

            {/* Contact Tab */}
            <TabsContent value="contact" className="space-y-4">
              <div className="rounded-lg border border-border bg-muted/30 p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium">Contact Form</h3>
                    <p className="text-xs text-muted-foreground">Allow visitors to send you messages directly from your card.</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => toast.info("Contact form settings saved")}
                    className="rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-medium transition-colors hover:bg-accent"
                  >
                    Configure
                  </button>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="contactTitle">Contact Form Title</Label>
                <Input id="contactTitle" placeholder="Get in Touch" defaultValue="Get in Touch" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contactDesc">Welcome Message</Label>
                <Textarea id="contactDesc" placeholder="Send me a message..." rows={3} defaultValue="Send me a message and I will get back to you soon." />
              </div>
              <div className="rounded-lg border border-border p-4 space-y-3">
                <h4 className="text-sm font-medium">Form Fields</h4>
                <p className="text-xs text-muted-foreground">Select which fields to show on your contact form.</p>
                <div className="space-y-2">
                  {["Name", "Email", "Phone", "Message"].map((field) => (
                    <label key={field} className="flex items-center gap-2 text-sm">
                      <input type="checkbox" defaultChecked className="rounded border-border" />
                      {field}
                    </label>
                  ))}
                </div>
              </div>
            </TabsContent>

            {/* 3D Card Tab */}
            <TabsContent value="3d" className="space-y-4">
              <div className="space-y-2">
                <Label>Card Style</Label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: "business", label: "Business Card" },
                    { id: "badge", label: "Badge" },
                    { id: "floating", label: "Floating" },
                  ].map((style) => (
                    <button
                      key={style.id}
                      type="button"
                      onClick={() => toast.info(`3D style: ${style.label}`)}
                      className="rounded-lg border border-border bg-background p-3 text-xs font-medium transition-colors hover:bg-accent hover:border-primary"
                    >
                      {style.label}
                    </button>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <Label>Holographic Intensity</Label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  defaultValue="75"
                  className="w-full accent-primary"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Subtle</span>
                  <span>Vivid</span>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Animation Speed</Label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  defaultValue="50"
                  className="w-full accent-primary"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Slow</span>
                  <span>Fast</span>
                </div>
              </div>
              <div className="rounded-lg border border-border p-4 space-y-3">
                <h4 className="text-sm font-medium">Effects</h4>
                <div className="space-y-2">
                  {["Holographic Glass", "Light Sweep", "Tilt Tracking", "Click to Flip"].map((effect) => (
                    <label key={effect} className="flex items-center gap-2 text-sm">
                      <input type="checkbox" defaultChecked className="rounded border-border" />
                      {effect}
                    </label>
                  ))}
                </div>
              </div>
            </TabsContent>

            {/* AR Tab */}
            <TabsContent value="ar" className="space-y-4">
              <div className="rounded-lg border border-border bg-muted/30 p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium">AR Experience</h3>
                    <p className="text-xs text-muted-foreground">Enable augmented reality for your card visitors.</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => toast.info("AR settings saved")}
                    className="rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-medium transition-colors hover:bg-accent"
                  >
                    Enable AR
                  </button>
                </div>
              </div>
              <div className="space-y-2">
                <Label>AR Background</Label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: "transparent", label: "Transparent" },
                    { id: "gradient", label: "Gradient" },
                    { id: "blur", label: "Camera Blur" },
                    { id: "solid", label: "Solid Color" },
                  ].map((bg) => (
                    <button
                      key={bg.id}
                      type="button"
                      onClick={() => toast.info(`AR background: ${bg.label}`)}
                      className="rounded-lg border border-border bg-background p-2 text-xs font-medium transition-colors hover:bg-accent hover:border-primary"
                    >
                      {bg.label}
                    </button>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <Label>AR Placement Guide</Label>
                <p className="text-xs text-muted-foreground">Show a guide to help users place the 3D card in their environment.</p>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 text-sm">
                    <input type="radio" name="arGuide" defaultChecked className="accent-primary" />
                    Show guide
                  </label>
                  <label className="flex items-center gap-2 text-sm">
                    <input type="radio" name="arGuide" className="accent-primary" />
                    Hide guide
                  </label>
                </div>
              </div>
              <div className="space-y-2">
                <Label>AR Trigger</Label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: "qr", label: "QR Code" },
                    { id: "link", label: "Direct Link" },
                    { id: "nfc", label: "NFC Tag" },
                    { id: "button", label: "Button Click" },
                  ].map((trigger) => (
                    <button
                      key={trigger.id}
                      type="button"
                      onClick={() => toast.info(`AR trigger: ${trigger.label}`)}
                      className="rounded-lg border border-border bg-background p-2 text-xs font-medium transition-colors hover:bg-accent hover:border-primary"
                    >
                      {trigger.label}
                    </button>
                  ))}
                </div>
              </div>
            </TabsContent>

            {/* Privacy Tab */}
            <TabsContent value="privacy" className="space-y-4">
              <div className="rounded-lg border border-border p-4 space-y-3">
                <h4 className="text-sm font-medium">Profile Visibility</h4>
                <div className="space-y-2">
                  {[
                    { label: "Show in search engines", defaultChecked: true },
                    { label: "Show analytics to visitors", defaultChecked: false },
                    { label: "Allow contact form submissions", defaultChecked: true },
                    { label: "Show Powered by HoloCard badge", defaultChecked: true },
                  ].map((item) => (
                    <label key={item.label} className="flex items-center gap-2 text-sm">
                      <input type="checkbox" defaultChecked={item.defaultChecked} className="rounded border-border" />
                      {item.label}
                    </label>
                  ))}
                </div>
              </div>
              <div className="rounded-lg border border-border p-4 space-y-3">
                <h4 className="text-sm font-medium">Data &amp; Security</h4>
                <div className="space-y-2">
                  {[
                    { label: "Collect analytics data", defaultChecked: true },
                    { label: "Allow search engine indexing", defaultChecked: true },
                    { label: "Enable contact form spam protection", defaultChecked: true },
                  ].map((item) => (
                    <label key={item.label} className="flex items-center gap-2 text-sm">
                      <input type="checkbox" defaultChecked={item.defaultChecked} className="rounded border-border" />
                      {item.label}
                    </label>
                  ))}
                </div>
              </div>
            </TabsContent>

          </Tabs>

          <div className="mt-6 flex justify-end border-t border-border pt-4">
            <Button type="submit" disabled={saving}>
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              {cardId ? "Update Card" : "Create Card"}
            </Button>
          </div>
        </form>
      </div>

      <div className="border-t border-border bg-muted/30 p-4 lg:w-[380px] lg:border-l lg:border-t-0">
        <p className="mb-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
          Live Preview
        </p>
        <div
          className={`mx-auto max-w-sm overflow-hidden rounded-2xl border shadow-lg ${
            (formValues as any).borderColor === "accent"
              ? "border-2"
              : (formValues as any).borderColor === "subtle"
              ? "border border-border"
              : "border-transparent"
          } ${
            (formValues as any).shadowStyle === "strong"
              ? "shadow-xl"
              : (formValues as any).shadowStyle === "medium"
              ? "shadow-lg"
              : (formValues as any).shadowStyle === "soft"
              ? "shadow-md"
              : "shadow-none"
          } ${
            formValues.bgStyle === "glass"
              ? "glass"
              : formValues.bgStyle === "gradient"
              ? "bg-gradient-to-br from-background to-muted"
              : "bg-background"
          }`}
          style={{
            fontFamily: formValues.fontFamily || "Inter",
            borderColor: (formValues as any).borderColor === "accent" ? (formValues.accentColor || "#2563EB") : undefined,
          }}
        >
          <div
            className="h-20 w-full"
            style={{
              background:
                formValues.bgStyle === "gradient"
                  ? `linear-gradient(135deg, ${formValues.accentColor || "#2563EB"}40, ${formValues.accentColor || "#2563EB"}10)`
                  : formValues.accentColor || "#2563EB",
              opacity: formValues.bgStyle === "gradient" ? 1 : 0.15,
            }}
          />
          <div className="-mt-10 flex flex-col items-center px-6 pb-6">
            <div
              className={`flex h-20 w-20 items-center justify-center border-4 border-background text-2xl font-bold text-white ${
                (formValues as any).imageShape === "square"
                  ? "rounded-lg"
                  : (formValues as any).imageShape === "rounded"
                  ? "rounded-xl"
                  : "rounded-full"
              }`}
              style={{ background: `linear-gradient(135deg, ${formValues.accentColor || "#2563EB"}, ${formValues.accentColor || "#2563EB"}88)` }}
            >
              {initials}
            </div>
            <h2 className="mt-3 text-lg font-bold">{formValues.name || "Your Name"}</h2>
            <p className="text-sm text-muted-foreground">
              {formValues.designation || "Designation"}
              {formValues.company ? ` at ${formValues.company}` : ""}
            </p>
            {formValues.bio && (
              <p className="mt-2 text-center text-xs text-muted-foreground line-clamp-2">
                {formValues.bio}
              </p>
            )}

            {buttons.filter((b) => b.isActive).length > 0 && (
              <div className="mt-4 flex flex-wrap justify-center gap-2">
                {buttons
                  .filter((b) => b.isActive)
                  .map((btn) => (
                    <span
                      key={btn.id}
                      className={`inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium ${
                        (formValues as any).buttonStyle === "outline"
                          ? "border border-current"
                          : (formValues as any).buttonStyle === "ghost"
                          ? "bg-transparent"
                          : ""
                      }`}
                      style={{
                        backgroundColor: (formValues as any).buttonStyle === "ghost" ? "transparent" : (formValues as any).buttonStyle === "outline" ? "transparent" : (formValues.accentColor || "#2563EB"),
                        color: (formValues as any).buttonStyle === "outline" ? (formValues.accentColor || "#2563EB") : (formValues as any).buttonStyle === "ghost" ? (formValues.accentColor || "#2563EB") : "white",
                        borderColor: (formValues as any).buttonStyle === "outline" ? (formValues.accentColor || "#2563EB") : undefined,
                      }}
                    >
                      {btn.label}
                      <ExternalLink className="h-3 w-3" />
                    </span>
                  ))}
              </div>
            )}

            <div className="mt-4 flex flex-wrap justify-center gap-2">
              {[
                { platform: "linkedin", value: formValues.linkedin },
                { platform: "twitter", value: formValues.twitter },
                { platform: "github", value: formValues.github },
                { platform: "instagram", value: formValues.instagram },
                { platform: "facebook", value: formValues.facebook },
                { platform: "youtube", value: formValues.youtube },
                { platform: "telegram", value: formValues.telegram },
                { platform: "tiktok", value: formValues.tiktok },
              ]
                .filter((s) => s.value)
                .map((s) => (
                  <span
                    key={s.platform}
                    className="flex h-8 w-8 items-center justify-center rounded-lg text-foreground/60"
                    style={{ backgroundColor: `${formValues.accentColor || "#2563EB"}20` }}
                  >
                    <SocialIcon platform={s.platform} />
                  </span>
                ))}
            </div>

            <div className="mt-4 flex flex-wrap justify-center gap-2">
              {formValues.phone && (
                <span className="inline-flex items-center gap-1 rounded-full border border-border px-2.5 py-1 text-xs text-muted-foreground">
                  <Phone className="h-3 w-3" />{formValues.phone}
                </span>
              )}
              {formValues.email && (
                <span className="inline-flex items-center gap-1 rounded-full border border-border px-2.5 py-1 text-xs text-muted-foreground">
                  <Mail className="h-3 w-3" />{formValues.email}
                </span>
              )}
              {formValues.website && (
                <span className="inline-flex items-center gap-1 rounded-full border border-border px-2.5 py-1 text-xs text-muted-foreground">
                  <Globe className="h-3 w-3" />Website
                </span>
              )}
              {formValues.location && (
                <span className="inline-flex items-center gap-1 rounded-full border border-border px-2.5 py-1 text-xs text-muted-foreground">
                  <MapPin className="h-3 w-3" />{formValues.location}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      <Dialog open={buttonDialogOpen} onOpenChange={setButtonDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingButton ? "Edit Button" : "Add Button"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="btn-label">Label</Label>
              <Input
                id="btn-label"
                value={buttonLabel}
                onChange={(e) => setButtonLabel(e.target.value)}
                placeholder="Visit Website"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="btn-url">URL</Label>
              <Input
                id="btn-url"
                value={buttonUrl}
                onChange={(e) => setButtonUrl(e.target.value)}
                placeholder="https://example.com"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setButtonDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={saveButton}
              disabled={!buttonLabel || !buttonUrl}
            >
              {editingButton ? "Save" : "Add"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
