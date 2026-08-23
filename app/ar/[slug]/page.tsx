"use client";

import { Suspense, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  Loader2,
  ArrowLeft,
  Smartphone,
  RotateCw,
  ZoomIn,
  AlertTriangle,
  UserPlus,
  ExternalLink,
  Share2,
  Mail,
  Phone,
  Globe,
  MapPin,
  MessageCircle,
} from "lucide-react";
import { ARModelViewer, ARModelViewerFallback } from "@/components/ar/model-viewer";
import { QRGenerator } from "@/components/cards/qr-generator";
import { shareCard, copyToClipboard, downloadVCard } from "@/lib/sharing";

interface SocialLink {
  id: string;
  platform: string;
  url: string;
  label: string | null;
}

interface CardButton {
  id: string;
  label: string;
  icon: string | null;
  url: string;
  order: number;
  isActive: boolean;
}

interface Card {
  id: string;
  name: string;
  slug: string;
  designation: string | null;
  company: string | null;
  bio: string | null;
  phone: string | null;
  email: string | null;
  website: string | null;
  whatsapp: string | null;
  linkedin: string | null;
  facebook: string | null;
  instagram: string | null;
  twitter: string | null;
  location: string | null;
  profileImage: string | null;
  accentColor: string | null;
  socialLinks: SocialLink[];
  buttons: CardButton[];
}

function SocialIcon({ platform }: { platform: string }) {
  const icons: Record<string, React.ReactNode> = {
    linkedin: (
      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
    twitter: (
      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
    github: (
      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
      </svg>
    ),
    facebook: (
      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
      </svg>
    ),
    instagram: (
      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
      </svg>
    ),
  };
  return icons[platform] || <ExternalLink className="h-5 w-5" />;
}

function LoadingScreen() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-4">
        <div className="relative">
          <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-primary to-cyan flex items-center justify-center">
            <span className="text-xl font-bold text-white">H</span>
          </div>
          <div className="absolute inset-0 animate-ping rounded-2xl bg-primary/20" />
        </div>
        <div className="flex items-center gap-2">
          <Loader2 className="h-4 w-4 animate-spin text-primary" />
          <span className="text-sm text-muted-foreground">Loading experience...</span>
        </div>
      </div>
    </div>
  );
}

export default function ARExperiencePage() {
  const params = useParams();
  const slug = params.slug as string;
  const [card, setCard] = useState<Card | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showQR, setShowQR] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetch(`/api/cards/by-slug/${slug}`)
      .then((r) => {
        if (!r.ok) throw new Error("Card not found");
        return r.json();
      })
      .then((data) => {
        setCard(data);
        setLoading(false);
      })
      .catch(() => {
        setError("Card not found");
        setLoading(false);
      });
  }, [slug]);

  if (loading) return <LoadingScreen />;

  if (error || !card) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4">
        <AlertTriangle className="mb-4 h-12 w-12 text-destructive" />
        <h1 className="text-xl font-bold">Card Not Found</h1>
        <p className="mt-2 text-center text-muted-foreground">
          This card may have been removed or is not active.
        </p>
        <Link
          href="/"
          className="mt-6 flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"
        >
          <ArrowLeft className="h-4 w-4" />
          Go Home
        </Link>
      </div>
    );
  }

  const handleShare = async () => {
    await shareCard({
      name: card.name,
      slug: card.slug,
    });
  };

  const handleCopyLink = async () => {
    const url = `${window.location.origin}/card/${card.slug}`;
    await copyToClipboard(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSaveContact = () => {
    downloadVCard({
      name: card.name,
      phone: card.phone || undefined,
      email: card.email || undefined,
      website: card.website || undefined,
      company: card.company || undefined,
      designation: card.designation || undefined,
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="glass sticky top-0 z-50 border-b border-border">
        <div className="mx-auto flex h-14 max-w-4xl items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <Link
              href={`/card/${card.slug}`}
              className="flex h-8 items-center gap-1.5 rounded-lg text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Link>
            <div className="h-4 w-px bg-border" />
            <span className="text-sm font-medium">{card.name}</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowQR(!showQR)}
              className="flex h-8 items-center gap-1.5 rounded-lg px-3 text-xs font-medium text-muted-foreground hover:bg-accent transition-colors"
            >
              QR
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-6">
        <div className="space-y-6">
          {/* Profile header */}
          <div className="glass rounded-2xl p-6 text-center">
            {card.profileImage ? (
              <div className="relative mx-auto h-20 w-20 overflow-hidden rounded-full ring-4 ring-primary/20">
                <Image
                  src={card.profileImage}
                  alt={card.name}
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>
            ) : (
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-primary to-cyan text-2xl font-bold text-white ring-4 ring-primary/20">
                {card.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .toUpperCase()
                  .slice(0, 2)}
              </div>
            )}
            <h1 className="mt-4 text-2xl font-bold">{card.name}</h1>
            <p className="text-muted-foreground">
              {card.designation}
              {card.company ? ` at ${card.company}` : ""}
            </p>
            {card.bio && (
              <p className="mx-auto mt-3 max-w-md text-sm text-muted-foreground">
                {card.bio}
              </p>
            )}
          </div>

          {/* 3D HoloCard */}
          <div className="glass overflow-hidden rounded-2xl glow-md">
            <Suspense
              fallback={
                <div className="flex h-80 items-center justify-center">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              }
            >
              <ARModelViewer
                name={card.name}
                designation={card.designation || undefined}
                company={card.company || undefined}
                profileImage={card.profileImage || undefined}
                cardColor={card.accentColor || undefined}
                socialLinks={card.socialLinks}
                slug={card.slug}
                className="h-80 md:h-[420px]"
              />
            </Suspense>
          </div>

          {/* Interaction hint */}
          <div className="flex items-center justify-center gap-6 text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <RotateCw className="h-3 w-3" />
              Drag to rotate
            </span>
            <span className="flex items-center gap-1.5">
              <ZoomIn className="h-3 w-3" />
              Click to flip
            </span>
          </div>

          {/* Contact actions */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {card.phone && (
              <a
                href={`tel:${card.phone}`}
                className="glass flex flex-col items-center gap-2 rounded-xl p-4 text-center transition-all hover:glow-sm"
              >
                <Phone className="h-5 w-5 text-primary" />
                <span className="text-xs font-medium">Call</span>
              </a>
            )}
            {card.email && (
              <a
                href={`mailto:${card.email}`}
                className="glass flex flex-col items-center gap-2 rounded-xl p-4 text-center transition-all hover:glow-sm"
              >
                <Mail className="h-5 w-5 text-primary" />
                <span className="text-xs font-medium">Email</span>
              </a>
            )}
            {card.whatsapp && (
              <a
                href={`https://wa.me/${card.whatsapp.replace(/[^0-9]/g, "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="glass flex flex-col items-center gap-2 rounded-xl p-4 text-center transition-all hover:glow-sm"
              >
                <MessageCircle className="h-5 w-5 text-green-600" />
                <span className="text-xs font-medium">WhatsApp</span>
              </a>
            )}
            {card.website && (
              <a
                href={card.website}
                target="_blank"
                rel="noopener noreferrer"
                className="glass flex flex-col items-center gap-2 rounded-xl p-4 text-center transition-all hover:glow-sm"
              >
                <Globe className="h-5 w-5 text-cyan" />
                <span className="text-xs font-medium">Website</span>
              </a>
            )}
            {card.location && (
              <div className="glass flex flex-col items-center gap-2 rounded-xl p-4 text-center">
                <MapPin className="h-5 w-5 text-muted-foreground" />
                <span className="text-xs font-medium">{card.location}</span>
              </div>
            )}
          </div>

          {/* Social links */}
          {card.socialLinks.length > 0 && (
            <div className="glass rounded-xl p-4">
              <h3 className="mb-3 text-center text-sm font-medium text-muted-foreground">
                Connect
              </h3>
              <div className="flex justify-center gap-3">
                {card.socialLinks.map((link) => (
                  <a
                    key={link.id}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary transition-all hover:bg-primary/20 hover:scale-105"
                    title={link.label || link.platform}
                  >
                    <SocialIcon platform={link.platform} />
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Custom buttons */}
          {card.buttons.length > 0 && (
            <div className="space-y-2">
              {card.buttons.map((btn) => (
                <a
                  key={btn.id}
                  href={btn.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="glass flex items-center justify-center gap-2 rounded-xl p-3 text-sm font-medium transition-all hover:glow-sm"
                >
                  {btn.label}
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              ))}
            </div>
          )}

          {/* QR Code */}
          {showQR && (
            <div className="glass rounded-2xl p-6 text-center">
              <h3 className="mb-4 text-sm font-medium">Scan to view profile</h3>
              <QRGenerator
                slug={card.slug}
                size={180}
              />
            </div>
          )}

          {/* Action buttons */}
          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              onClick={handleSaveContact}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-medium text-primary-foreground transition-all hover:opacity-90"
            >
              <UserPlus className="h-4 w-4" />
              Save Contact
            </button>
            <button
              onClick={handleShare}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-border px-4 py-3 text-sm font-medium transition-colors hover:bg-accent"
            >
              <Share2 className="h-4 w-4" />
              Share
            </button>
            <button
              onClick={handleCopyLink}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-border px-4 py-3 text-sm font-medium transition-colors hover:bg-accent"
            >
              {copied ? "Copied!" : "Copy Link"}
            </button>
          </div>

          {/* Footer */}
          <div className="py-8 text-center">
            <Link
              href="/"
              className="text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              Powered by <span className="font-semibold">HoloCard</span>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
