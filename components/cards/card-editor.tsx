/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  User,
  Palette,
  Link2,
  Image as ImageIcon,
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

interface SocialLink {
  id: string;
  cardId: string;
  platform: string;
  url: string;
  label: string | null;
  icon: string | null;
  order: number;
}

const SOCIAL_PLATFORMS = [
  { value: "linkedin", label: "LinkedIn" },
  { value: "twitter", label: "Twitter / X" },
  { value: "github", label: "GitHub" },
  { value: "instagram", label: "Instagram" },
  { value: "facebook", label: "Facebook" },
  { value: "youtube", label: "YouTube" },
  { value: "telegram", label: "Telegram" },
  { value: "tiktok", label: "TikTok" },
  { value: "whatsapp", label: "WhatsApp" },
  { value: "pinterest", label: "Pinterest" },
  { value: "reddit", label: "Reddit" },
  { value: "discord", label: "Discord" },
  { value: "medium", label: "Medium" },
  { value: "twitch", label: "Twitch" },
  { value: "spotify", label: "Spotify" },
  { value: "snapchat", label: "Snapchat" },
  { value: "custom", label: "Custom" },
];

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
  if (p === "youtube")
    return (
      <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
      </svg>
    );
  if (p === "telegram")
    return (
      <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.479.33-.913.492-1.302.48-.428-.013-1.252-.242-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
      </svg>
    );
  if (p === "tiktok")
    return (
      <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
      </svg>
    );
  if (p === "whatsapp")
    return (
      <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
      </svg>
    );
  if (p === "pinterest")
    return (
      <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 01.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.631-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12.017 24c6.624 0 11.99-5.367 11.99-11.988C24.007 5.367 18.641 0 12.017 0z" />
      </svg>
    );
  if (p === "reddit")
    return (
      <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 0 0-.232-.095z" />
      </svg>
    );
  if (p === "discord")
    return (
      <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189z" />
      </svg>
    );
  if (p === "medium")
    return (
      <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M13.54 12a6.8 6.8 0 01-6.77 6.82A6.8 6.8 0 010 12a6.8 6.8 0 016.77-6.82A6.8 6.8 0 0113.54 12zM20.96 12c0 3.54-1.51 6.42-3.38 6.42-1.87 0-3.39-2.88-3.39-6.42s1.52-6.42 3.39-6.42 3.38 2.88 3.38 6.42M24 12c0 3.17-.53 5.75-1.19 5.75-.66 0-1.19-2.58-1.19-5.75s.53-5.75 1.19-5.75C23.47 6.25 24 8.83 24 12z" />
      </svg>
    );
  if (p === "twitch")
    return (
      <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M11.571 4.714h1.715v5.143H11.57zm4.715 0H18v5.143h-1.714zM6 0L1.714 4.286v15.428h5.143V24l4.286-4.286h3.428L22.286 12V0zm14.571 11.143l-3.428 3.428h-3.429l-3 3v-3H6.857V1.714h13.714z" />
      </svg>
    );
  if (p === "spotify")
    return (
      <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
      </svg>
    );
  if (p === "snapchat")
    return (
      <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12.206.793c.99 0 4.347.276 5.93 3.821.529 1.193.403 3.219.299 4.847l-.003.06c-.012.18-.022.345-.03.51.075.045.203.09.401.09.3-.016.659-.12.922-.214.094-.04.19-.06.29-.06.326 0 .596.18.768.36.156.18.276.42.378.72.166.48.29.92.378 1.14.045.12.091.24.135.36.09.24.135.48.09.78-.075.48-.36.72-.66.9-.165.09-.345.165-.51.21-.18.045-.36.075-.48.105-.09.03-.165.06-.21.12-.075.09-.12.24-.12.36 0 .09.03.18.06.27.09.24.27.48.66.6.555.18 1.2.24 1.86.27.09.015.18.045.24.09.105.06.18.18.18.36 0 .075-.015.15-.045.24-.105.24-.36.42-.66.54-.345.12-.72.18-1.08.21-.39.045-.75.075-1.05.12-.15.03-.285.075-.375.18-.045.06-.09.12-.09.24v.12c.015.3.165.54.39.72.39.27.96.39 1.41.42.135.015.27.03.39.06.24.06.42.24.42.48v.03c-.015.18-.09.33-.21.45-.36.36-1.05.54-1.65.63-.36.06-.72.09-1.05.12-.3.03-.57.06-.78.12-.09.03-.18.09-.24.18-.075.12-.09.27-.06.42.06.36.36.6.72.72.45.12.96.15 1.41.18.15.015.3.03.42.06.3.06.54.24.6.54v.03c-.015.12-.06.24-.12.33-.24.36-.72.6-1.2.72-.36.09-.72.12-1.05.15-.36.03-.66.06-.9.12-.15.045-.27.12-.33.27-.045.09-.06.18-.06.3 0 .06.015.12.03.18.105.36.36.6.72.72.45.12.96.15 1.41.18.15.015.3.03.42.06.3.06.54.24.6.54v.12c0 .36-.15.63-.42.81-.45.27-1.05.36-1.56.42-.36.045-.72.06-1.05.09-.15.015-.3.03-.39.06-.15.06-.24.18-.24.36v.03c.015.18.09.33.21.45.36.36 1.05.54 1.65.63.36.06.72.09 1.05.12.3.03.57.06.78.12.15.045.27.15.3.3.015.09.015.18 0 .27-.06.36-.36.6-.72.72-.45.12-.96.15-1.41.18-.15.015-.3.03-.42.06-.3.06-.54.24-.6.54v.12c0 .36.15.63.42.81.45.27 1.05.36 1.56.42.36.045.72.06 1.05.09.54.045 1.02.12 1.38.36.15.09.27.21.36.39.06.15.09.3.09.48 0 .15-.03.3-.06.42-.12.42-.42.72-.81.93-.54.27-1.17.36-1.74.42-.45.045-.87.06-1.23.09-.24.015-.45.03-.6.06-.24.06-.42.24-.42.48v.03c.015.18.09.33.21.45.36.36 1.05.54 1.65.63.36.06.72.09 1.05.12.54.045 1.02.12 1.38.36.15.09.27.21.36.39.06.15.09.3.09.48 0 .15-.03.3-.06.42-.12.42-.42.72-.81.93-.54.27-1.17.36-1.74.42-.45.045-.87.06-1.23.09-.24.015-.45.03-.6.06-.24.06-.42.24-.42.48v.24c0 .36.15.63.42.81.45.27 1.05.36 1.56.42.36.045.72.06 1.05.09.3.03.57.06.78.12.15.045.27.15.3.3.015.09.015.18 0 .27-.06.36-.36.6-.72.72-.45.12-.96.15-1.41.18-.15.015-.3.03-.42.06-.3.06-.54.24-.6.54v.12c0 .36.15.63.42.81.45.27 1.05.36 1.56.42.54.06 1.05.12 1.38.36.15.09.27.21.36.39.06.15.09.3.09.48 0 .15-.03.3-.06.42-.12.42-.42.72-.81.93-.54.27-1.17.36-1.74.42-.45.045-.87.06-1.23.09h-.12c-.06.18-.18.33-.33.42-.36.18-.78.21-1.2.21-.3 0-.6-.06-.84-.15-.36-.12-.63-.36-.75-.66-.06-.18-.09-.36-.09-.54 0-.24.06-.48.18-.66.18-.24.42-.39.66-.51.3-.12.63-.18.96-.24.39-.06.75-.12 1.05-.21.24-.075.42-.21.51-.42.03-.09.06-.18.06-.3 0-.15-.03-.3-.09-.42-.18-.3-.48-.48-.84-.57-.45-.09-.93-.12-1.41-.15-.3-.03-.6-.06-.84-.12-.15-.045-.27-.15-.3-.3-.015-.09-.015-.18 0-.27.06-.36.36-.6.72-.72.45-.12.96-.15 1.41-.18.15-.015.3-.03.42-.06.3-.06.54-.24.6-.54v-.12c0-.36-.15-.63-.42-.81-.45-.27-1.05-.36-1.56-.42-.36-.045-.72-.06-1.05-.09-.3-.03-.57-.06-.78-.12-.15-.045-.27-.15-.3-.3-.015-.09-.015-.18 0-.27.06-.36.36-.6.72-.72.45-.12.96-.15 1.41-.18.15-.015.3-.03.42-.06.3-.06.54-.24.6-.54v-.12c0-.36-.15-.63-.42-.81-.45-.27-1.05-.36-1.56-.42-.36-.045-.72-.06-1.05-.09-.3-.03-.57-.06-.78-.12-.15-.045-.27-.15-.3-.3-.015-.09-.015-.18 0-.27.06-.36.36-.6.72-.72.45-.12.96-.15 1.41-.18.15-.015.3-.03.42-.06.3-.06.54-.24.6-.54v-.12c0-.36-.15-.63-.42-.81-.45-.27-1.05-.36-1.56-.42-.36-.045-.72-.06-1.05-.09-.3-.03-.57-.06-.78-.12-.15-.045-.27-.15-.3-.3-.015-.09-.015-.18 0-.27.06-.36.36-.6.72-.72.45-.12.96-.15 1.41-.18.15-.015.3-.03.42-.06.3-.06.54-.24.6-.54v-.12c0-.36-.15-.63-.42-.81-.45-.27-1.05-.36-1.56-.42-.36-.045-.72-.06-1.05-.09-.3-.03-.57-.06-.78-.12-.15-.045-.27-.15-.3-.3-.015-.09-.015-.18 0-.27.06-.36.36-.6.72-.72.45-.12.96-.15 1.41-.18.15-.015.3-.03.42-.06.3-.06.54-.24.6-.54v-.12c0-.36-.15-.63-.42-.81-.45-.27-1.05-.36-1.56-.42-.54-.06-1.05-.12-1.38-.36-.15-.09-.27-.21-.36-.39-.06-.15-.09-.3-.09-.48 0-.15.03-.3.06-.42.12-.42.42-.72.81-.93.54-.27 1.17-.36 1.74-.42.45-.045.87-.06 1.23-.09.24-.015.45-.03.6-.06.24-.06.42-.24.42-.48v-.03c-.015-.18-.09-.33-.21-.45-.36-.36-1.05-.54-1.65-.63-.36-.06-.72-.09-1.05-.12-.54-.045-1.02-.12-1.38-.36-.15-.09-.27-.21-.36-.39-.06-.15-.09-.3-.09-.48 0-.15.03-.3.06-.42.12-.42.42-.72.81-.93.54-.27 1.17-.36 1.74-.42.45-.045.87-.06 1.23-.09h.12c.06-.18.18-.33.33-.42.36-.18.78-.21 1.2-.21.3 0 .6.06.84.15.36.12.63.36.75.66.06.18.09.36.09.54 0 .24-.06.48-.18.66-.18.24-.42.39-.66.51-.3.12-.63.18-.96.24-.39.06-.75.12-1.05.21-.24.075-.42.21-.51.42-.03.09-.06.18-.06.3 0 .15.03.3.09.42.18.3.48.48.84.57.45.09.93.12 1.41.15.3.03.6.06.84.12.15.045.27.15.3.3.015.09.015.18 0 .27-.06.36-.36.6-.72.72-.45.12-.96.15-1.41.18-.15.015-.3.03-.42.06-.3.06-.54.24-.6.54v.12c0 .36.15.63.42.81.45.27 1.05.36 1.56.42.36.045.72.06 1.05.09.3.03.57.06.78.12.15.045.27.15.3.3.015.09.015.18 0 .27-.06.36-.36.6-.72.72-.45.12-.96.15-1.41.18-.15.015-.3.03-.42.06-.3.06-.54.24-.6.54v.12c0 .36.15.63.42.81.45.27 1.05.36 1.56.42.36.045.72.06 1.05.09.3.03.57.06.78.12.15.045.27.15.3.3.015.09.015.18 0 .27-.06.36-.36.6-.72.72-.45.12-.96.15-1.41.18-.15.015-.3.03-.42.06-.3.06-.54.24-.6.54v.12c0 .36.15.63.42.81.45.27 1.05.36 1.56.42.36.045.72.06 1.05.09.3.03.57.06.78.12.15.045.27.15.3.3.015.09.015.18 0 .27-.06.36-.36.6-.72.72-.45.12-.96.15-1.41.18-.15.015-.3.03-.42.06-.3.06-.54.24-.6.54v.12c0 .36.15.63.42.81.45.27 1.05.36 1.56.42.36.045.72.06 1.05.09.3.03.57.06.78.12.15.045.27.15.3.3.015.09.015.18 0 .27-.06.36-.36.6-.72.72-.45.12-.96.15-1.41.18-.15.015-.3.03-.42.06-.3.06-.54.24-.6.54v.12c0 .36.15.63.42.81.45.27 1.05.36 1.56.42.36.045.72.06 1.05.09.3.03.57.06.78.12.15.045.27.15.3.3.015.09.015.18 0 .27-.06.36-.36.6-.72.72-.45.12-.96.15-1.41.18-.15.015-.3.03-.42.06-.3.06-.54.24-.6.54v.12c0 .36.15.63.42.81.45.27 1.05.36 1.56.42.54.06 1.05.12 1.38.36.15.09.27.21.36.39.06.15.09.3.09.48 0 .15-.03.3-.06.42-.12.42-.42.72-.81.93-.54.27-1.17.36-1.74.42-.45.045-.87.06-1.23.09-.24.015-.45.03-.6.06-.24.06-.42.24-.42.48v.12c0 .36.15.63.42.81.45.27 1.05.36 1.56.42.36.045.72.06 1.05.09.3.03.57.06.78.12.15.045.27.15.3.3.015.09.015.18 0 .27-.06.36-.36.6-.72.72-.45.12-.96.15-1.41.18-.15.015-.3.03-.42.06-.3.06-.54.24-.6.54v.12c0 .36.15.63.42.81.45.27 1.05.36 1.56.42.36.045.72.06 1.05.09.3.03.57.06.78.12.15.045.27.15.3.3.015.09.015.18 0 .27-.06.36-.36.6-.72.72-.45.12-.96.15-1.41.18-.15.015-.3.03-.42.06-.3.06-.54.24-.6.54v.12c0 .36.15.63.42.81.45.27 1.05.36 1.56.42.36.045.72.06 1.05.09.3.03.57.06.78.12.15.045.27.15.3.3.015.09.015.18 0 .27-.06.36-.36.6-.72.72-.45.12-.96.15-1.41.18-.15.015-.3.03-.42.06-.3.06-.54.24-.6.54v.12c0 .36.15.63.42.81.45.27 1.05.36 1.56.42.54.06 1.05.12 1.38.36.15.09.27.21.36.39.06.15.09.3.09.48 0 .15-.03.3-.06.42-.12.42-.42.72-.81.93-.54.27-1.17.36-1.74.42-.45.045-.87.06-1.23.09-.24.015-.45.03-.6.06-.24.06-.42.24-.42.48v.12c0 .36.15.63.42.81.45.27 1.05.36 1.56.42.36.045.72.06 1.05.09.3.03.57.06.78.12.15.045.27.15.3.3.015.09.015.18 0 .27-.06.36-.36.6-.72.72-.45.12-.96.15-1.41.18-.15.015-.3.03-.42.06-.3.06-.54.24-.6.54v.12c0 .36.15.63.42.81.45.27 1.05.36 1.56.42.36.045.72.06 1.05.09.3.03.57.06.78.12.15.045.27.15.3.3.015.09.015.18 0 .27-.06.36-.36.6-.72.72-.45.12-.96.15-1.41.18-.15.015-.3.03-.42.06-.3.06-.54.24-.6.54v.12c0 .36.15.63.42.81.45.27 1.05.36 1.56.42.54.06 1.05.12 1.38.36.15.09.27.21.36.39.06.15.09.3.09.48 0 .15-.03.3-.06.42-.12.42-.42.72-.81.93-.54.27-1.17.36-1.74.42-.45.045-.87.06-1.23.09-.24.015-.45.03-.6.06-.24.06-.42.24-.42.48v.12c0 .36.15.63.42.81.45.27 1.05.36 1.56.42.36.045.72.06 1.05.09.3.03.57.06.78.12.15.045.27.15.3.3.015.09.015.18 0 .27-.06.36-.36.6-.72.72-.45.12-.96.15-1.41.18-.15.015-.3.03-.42.06-.3.06-.54.24-.6.54v.12c0 .36.15.63.42.81.45.27 1.05.36 1.56.42.54.06 1.05.12 1.38.36.15.09.27.21.36.39.06.15.09.3.09.48 0 .15-.03.3-.06.42-.12.42-.42.72-.81.93-.54.27-1.17.36-1.74.42-.45.045-.87.06-1.23.09h-.01z" />
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

export function CardEditor({ cardId, initialData }: CardEditorProps) {
  const [buttons, setButtons] = useState<CardButton[]>([]);
  const [buttonDialogOpen, setButtonDialogOpen] = useState(false);
  const [editingButton, setEditingButton] = useState<CardButton | null>(null);
  const [buttonLabel, setButtonLabel] = useState("");
  const [buttonUrl, setButtonUrl] = useState("");
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);
  const [socialLinkDialogOpen, setSocialLinkDialogOpen] = useState(false);
  const [editingSocialLink, setEditingSocialLink] = useState<SocialLink | null>(null);
  const [socialPlatform, setSocialPlatform] = useState("linkedin");
  const [socialCustomPlatform, setSocialCustomPlatform] = useState("");
  const [socialUrl, setSocialUrl] = useState("");
  const [socialLabel, setSocialLabel] = useState("");
  const [saving, setSaving] = useState(false);
  const [templates, setTemplates] = useState<{ id: string; name: string }[]>([]);

  useEffect(() => {
    fetch("/api/templates")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setTemplates(data.map((t: { slug: string; name: string }) => ({ id: t.slug, name: t.name })));
        } else {
          setTemplates([
            { id: "", name: "Default" },
            { id: "corporate", name: "Corporate" },
            { id: "developer", name: "Developer" },
            { id: "designer", name: "Designer" },
            { id: "freelancer", name: "Freelancer" },
            { id: "executive", name: "Executive" },
            { id: "minimal", name: "Minimal" },
            { id: "real-estate", name: "Real Estate" },
            { id: "sales", name: "Sales" },
            { id: "data-analyst", name: "Data Analyst" },
          ]);
        }
      })
      .catch(() => {
        setTemplates([
          { id: "", name: "Default" },
          { id: "corporate", name: "Corporate" },
          { id: "developer", name: "Developer" },
          { id: "designer", name: "Designer" },
          { id: "freelancer", name: "Freelancer" },
          { id: "executive", name: "Executive" },
          { id: "minimal", name: "Minimal" },
          { id: "real-estate", name: "Real Estate" },
          { id: "sales", name: "Sales" },
          { id: "data-analyst", name: "Data Analyst" },
        ]);
      });
  }, []);

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
    if (card.status) setCardStatus(card.status);
  }, [cardId, setValue]);

  const loadButtons = useCallback(async () => {
    if (!cardId) return;
    const res = await fetch(`/api/cards/${cardId}/buttons`);
    if (res.ok) {
      setButtons(await res.json());
    }
  }, [cardId]);

  const loadSocialLinks = useCallback(async () => {
    if (!cardId) return;
    const res = await fetch(`/api/cards/${cardId}/social-links`);
    if (res.ok) {
      setSocialLinks(await res.json());
    }
  }, [cardId]);

  useEffect(() => {
    loadCard();
    loadButtons();
    loadSocialLinks();
  }, [loadCard, loadButtons, loadSocialLinks]);

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
        window.location.href = `/dashboard/cards/${created.id}/edit`; // eslint-disable-line @next/next/no-location-assign-relative-destination
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
  const [profileImageUploading, setProfileImageUploading] = useState(false);
  const [companyLogoUploading, setCompanyLogoUploading] = useState(false);
  const [cardStatus, setCardStatus] = useState<"ACTIVE" | "DRAFT" | "ARCHIVED" | "DISABLED">("DRAFT");

  const handleStatusChange = async (newStatus: string) => {
    if (!cardId) return;
    const res = await fetch(`/api/cards/${cardId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });
    if (res.ok) {
      setCardStatus(newStatus as typeof cardStatus);
      toast.success(`Card status: ${newStatus.toLowerCase()}`);
    } else {
      toast.error("Failed to update status");
    }
  };

  const handleUpload = async (file: File, purpose: "profile" | "company" | "background") => {
    if (!cardId) {
      toast.error("Save the card before uploading images");
      return;
    }
    const setUploading = purpose === "profile" ? setProfileImageUploading
      : purpose === "company" ? setCompanyLogoUploading
      : setBgImageUploading;
    setUploading(true);
    try {
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
        const body = await res.json().catch(() => null);
        toast.error(body?.error || "Failed to upload image");
      }
    } catch {
      toast.error("Upload failed. Check your connection and try again.");
    } finally {
      setUploading(false);
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

  const saveSocialLink = async () => {
    if (!cardId || !socialUrl) return;
    const platformValue = socialPlatform === "custom" ? socialCustomPlatform : socialPlatform;
    if (!platformValue) return;

    const payload = {
      platform: platformValue,
      url: socialUrl,
      label: socialLabel || undefined,
    };

    if (editingSocialLink) {
      const res = await fetch(`/api/social-links/${editingSocialLink.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.ok) loadSocialLinks();
    } else {
      const res = await fetch(`/api/cards/${cardId}/social-links`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.ok) loadSocialLinks();
    }
    setSocialLinkDialogOpen(false);
    setEditingSocialLink(null);
    setSocialPlatform("linkedin");
    setSocialCustomPlatform("");
    setSocialUrl("");
    setSocialLabel("");
  };

  const deleteSocialLink = async (id: string) => {
    if (!cardId) return;
    const res = await fetch(`/api/social-links/${id}`, {
      method: "DELETE",
    });
    if (res.ok) loadSocialLinks();
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
          {cardId && (
            <div className="ml-auto flex items-center gap-2">
              <Label className="text-xs text-muted-foreground whitespace-nowrap">Status</Label>
              <select
                value={cardStatus}
                onChange={(e) => handleStatusChange(e.target.value)}
                className="h-8 rounded-md border border-input bg-background px-2 text-sm"
              >
                <option value="DRAFT">Draft</option>
                <option value="ACTIVE">Active</option>
                <option value="ARCHIVED">Archived</option>
                <option value="DISABLED">Disabled</option>
              </select>
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <Tabs defaultValue="profile">
            <TabsList className="mb-4 flex flex-wrap">
              <TabsTrigger value="profile"><User className="h-4 w-4" />Profile</TabsTrigger>
              <TabsTrigger value="design"><Palette className="h-4 w-4" />Design</TabsTrigger>
              <TabsTrigger value="social"><Link2 className="h-4 w-4" />Social</TabsTrigger>
              <TabsTrigger value="media"><ImageIcon className="h-4 w-4" aria-hidden="true" />Media</TabsTrigger>
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
                  {templates.map((t) => (
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
              {!cardId && (
                <div className="rounded-lg border border-border bg-muted/30 p-4">
                  <p className="text-sm text-muted-foreground">
                    Save the card first to add social media links.
                  </p>
                </div>
              )}
              {cardId && (
                <>
                  <div className="space-y-2">
                    {socialLinks.map((link) => (
                      <div
                        key={link.id}
                        className="flex items-center justify-between rounded-lg border border-border p-3"
                      >
                        <div className="flex items-center gap-3">
                          <SocialIcon platform={link.platform} />
                          <div>
                            <p className="text-sm font-medium">{link.label || link.platform}</p>
                            <p className="max-w-[200px] truncate text-xs text-muted-foreground">
                              {link.url}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon-xs"
                            onClick={() => {
                              setEditingSocialLink(link);
                              const isCustom = !SOCIAL_PLATFORMS.some((p) => p.value === link.platform && p.value !== "custom");
                              if (isCustom) {
                                setSocialPlatform("custom");
                                setSocialCustomPlatform(link.platform);
                              } else {
                                setSocialPlatform(link.platform);
                                setSocialCustomPlatform("");
                              }
                              setSocialUrl(link.url);
                              setSocialLabel(link.label || "");
                              setSocialLinkDialogOpen(true);
                            }}
                          >
                            <Pencil className="h-3 w-3" />
                          </Button>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon-xs"
                            onClick={() => deleteSocialLink(link.id)}
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
                      setEditingSocialLink(null);
                      setSocialPlatform("linkedin");
                      setSocialCustomPlatform("");
                      setSocialUrl("");
                      setSocialLabel("");
                      setSocialLinkDialogOpen(true);
                    }}
                  >
                    <Plus className="h-4 w-4" />Add Social Link
                  </Button>
                </>
              )}
            </TabsContent>

            <TabsContent value="media" className="space-y-6">
              <div className="space-y-2">
                <Label>Profile Image</Label>
                <div className="flex items-center gap-4">
                  {formValues.profileImage ? (
                    // eslint-disable-next-line @next/next/no-img-element
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
                  {profileImageUploading ? (
                    <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                  ) : (
                    <label className="cursor-pointer">
                      <input
                        key={`profile-${formValues.profileImage}`}
                        type="file"
                        accept="image/jpeg,image/png,image/gif,image/webp"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleUpload(file, "profile");
                        }}
                      />
                      <span className={buttonVariants({ variant: "outline", size: "sm" }) + " cursor-pointer"}><ImageIcon className="h-4 w-4" aria-hidden="true" />{formValues.profileImage ? "Change" : "Upload"}</span>
                    </label>
                  )}
                </div>
              </div>
              <div className="space-y-2">
                <Label>Company Logo</Label>
                <div className="flex items-center gap-4">
                  {formValues.companyLogo ? (
                    // eslint-disable-next-line @next/next/no-img-element
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
                  {companyLogoUploading ? (
                    <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                  ) : (
                    <label className="cursor-pointer">
                      <input
                        key={`logo-${formValues.companyLogo}`}
                        type="file"
                        accept="image/jpeg,image/png,image/gif,image/webp"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleUpload(file, "company");
                        }}
                      />
                      <span className={buttonVariants({ variant: "outline", size: "sm" }) + " cursor-pointer"}><ImageIcon className="h-4 w-4" aria-hidden="true" />{formValues.companyLogo ? "Change" : "Upload"}</span>
                    </label>
                  )}
                </div>
              </div>
              <div className="space-y-2">
                <Label>Cover Image</Label>
                <div className="flex items-center gap-4">
                  {formValues.bgImage ? (
                    // eslint-disable-next-line @next/next/no-img-element
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
                        key={`bg-${formValues.bgImage}`}
                        type="file"
                        accept="image/jpeg,image/png,image/gif,image/webp"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleUpload(file, "background");
                        }}
                      />
                      <span className={buttonVariants({ variant: "outline", size: "sm" }) + " cursor-pointer"}>
                        <ImageIcon className="h-4 w-4" aria-hidden="true" />{formValues.bgImage ? "Change" : "Upload"}
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
              {socialLinks.map((link) => (
                <span
                  key={link.id}
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-foreground/60"
                  style={{ backgroundColor: `${formValues.accentColor || "#2563EB"}20` }}
                  title={link.label || link.platform}
                >
                  <SocialIcon platform={link.platform} />
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

      <Dialog open={socialLinkDialogOpen} onOpenChange={setSocialLinkDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingSocialLink ? "Edit Social Link" : "Add Social Link"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="social-platform">Platform</Label>
              <select
                id="social-platform"
                value={socialPlatform}
                onChange={(e) => setSocialPlatform(e.target.value)}
                className="flex h-10 w-full rounded-md border border-border bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                {SOCIAL_PLATFORMS.map((p) => (
                  <option key={p.value} value={p.value}>
                    {p.label}
                  </option>
                ))}
              </select>
            </div>
            {socialPlatform === "custom" && (
              <div className="space-y-2">
                <Label htmlFor="social-custom-platform">Platform Name</Label>
                <Input
                  id="social-custom-platform"
                  value={socialCustomPlatform}
                  onChange={(e) => setSocialCustomPlatform(e.target.value)}
                  placeholder="e.g. MySpace"
                />
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="social-url">URL</Label>
              <Input
                id="social-url"
                value={socialUrl}
                onChange={(e) => setSocialUrl(e.target.value)}
                placeholder="https://..."
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="social-label">Label (optional)</Label>
              <Input
                id="social-label"
                value={socialLabel}
                onChange={(e) => setSocialLabel(e.target.value)}
                placeholder="e.g. My Profile"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setSocialLinkDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={saveSocialLink}
              disabled={!socialUrl || (socialPlatform === "custom" && !socialCustomPlatform)}
            >
              {editingSocialLink ? "Save" : "Add"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
