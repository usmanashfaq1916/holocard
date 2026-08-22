"use client";

import { Suspense, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  Loader2,
  Eye,
  ArrowLeft,
  Smartphone,
  RotateCw,
  ZoomIn,
  AlertTriangle,
  QrCode,
  UserPlus,
  ExternalLink,
} from "lucide-react";
import { ARModelViewer, ARModelViewerFallback } from "@/components/ar/model-viewer";

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
}

function detectARSupport() {
  if (typeof navigator === "undefined") return false;
  return "xr" in navigator;
}

function useDeviceInfo() {
  const [deviceInfo, setDeviceInfo] = useState({
    isMobile: false,
    arSupported: false,
    loading: true,
  });

  useEffect(() => {
    const isMobile =
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      );
    const arSupported = detectARSupport();
    setDeviceInfo({ isMobile, arSupported, loading: false });
  }, []);

  return deviceInfo;
}

export default function ARExperiencePage() {
  const params = useParams();
  const cardId = params.cardId as string;
  const [card, setCard] = useState<Card | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [arMode, setArMode] = useState<"3d" | "ar">("3d");
  const device = useDeviceInfo();

  useEffect(() => {
    fetch(`/api/cards/${cardId}`)
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
  }, [cardId]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !card) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4">
        <AlertTriangle className="mb-4 h-12 w-12 text-destructive" />
        <h1 className="text-xl font-bold">Card Not Found</h1>
        <p className="mt-2 text-muted-foreground">
          This card may have been removed or is not active.
        </p>
        <Link
          href="/"
          className="mt-6 flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Go Home
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="glass sticky top-0 z-50 border-b border-border">
        <div className="mx-auto flex h-14 max-w-4xl items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <Link
              href={`/card/${card.slug}`}
              className="flex h-8 items-center gap-1.5 rounded-lg text-sm text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Link>
            <span className="text-sm font-medium">{card.name}</span>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setArMode("3d")}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                arMode === "3d"
                  ? "bg-primary/20 text-primary"
                  : "text-muted-foreground hover:bg-accent"
              }`}
            >
              <RotateCw className="h-3 w-3" />
              3D View
            </button>
            {device.arSupported && (
              <button
                onClick={() => setArMode("ar")}
                className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                  arMode === "ar"
                    ? "bg-primary/20 text-primary"
                    : "text-muted-foreground hover:bg-accent"
                }`}
              >
                <Smartphone className="h-3 w-3" />
                AR Mode
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-6">
        {arMode === "3d" && (
          <div className="space-y-6">
            {/* 3D Viewer */}
            <div className="glass overflow-hidden rounded-2xl glow-md">
              <Suspense
                fallback={
                  <div className="flex h-96 items-center justify-center">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                }
              >
                <ARModelViewer
                  cardColor="oklch(0.58 0.2 260)"
                  autoRotate={true}
                  className="h-96 md:h-[500px]"
                />
              </Suspense>
            </div>

            {/* Controls hint */}
            <div className="flex items-center justify-center gap-6 text-xs text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <RotateCw className="h-3 w-3" />
                Drag to rotate
              </span>
              <span className="flex items-center gap-1.5">
                <ZoomIn className="h-3 w-3" />
                Scroll to zoom
              </span>
            </div>

            {/* Card info */}
            <div className="glass rounded-xl p-6">
              <div className="flex flex-col items-center text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-primary to-cyan text-lg font-bold text-white">
                  {card.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)}
                </div>
                <h2 className="mt-3 text-xl font-bold">{card.name}</h2>
                <p className="text-sm text-muted-foreground">
                  {card.designation}{card.company ? ` at ${card.company}` : ""}
                </p>
                {card.bio && (
                  <p className="mt-2 max-w-md text-sm text-muted-foreground">{card.bio}</p>
                )}
              </div>

              <div className="mt-6 flex justify-center gap-3">
                <a
                  href={`/api/contact/${card.slug}`}
                  download
                  className="flex h-10 items-center gap-2 rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground transition-all hover:glow-sm"
                >
                  <UserPlus className="h-4 w-4" />
                  Save Contact
                </a>
                <a
                  href={`/card/${card.slug}`}
                  className="flex h-10 items-center gap-2 rounded-lg border border-border px-4 text-sm font-medium transition-colors hover:bg-accent"
                >
                  <ExternalLink className="h-4 w-4" />
                  View Card
                </a>
              </div>
            </div>
          </div>
        )}

        {arMode === "ar" && (
          <div className="space-y-6">
            {!device.arSupported ? (
              <ARModelViewerFallback />
            ) : (
              <div className="glass rounded-2xl p-8 text-center glow-md">
                <Smartphone className="mx-auto mb-4 h-16 w-16 text-primary" />
                <h2 className="text-xl font-bold">Ready for AR</h2>
                <p className="mt-2 text-muted-foreground">
                  Point your camera at the physical business card to activate the AR experience.
                </p>
                <p className="mt-4 text-sm text-muted-foreground">
                  The image tracking feature requires a physical card with the target image.
                </p>
                <div className="mt-6 flex justify-center gap-3">
                  <button
                    onClick={() => setArMode("3d")}
                    className="flex h-10 items-center gap-2 rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground"
                  >
                    <Eye className="h-4 w-4" />
                    Switch to 3D View
                  </button>
                </div>
              </div>
            )}

            {/* AR Info */}
            <div className="grid gap-4 md:grid-cols-3">
              {[
                { icon: RotateCw, title: "Place Card", desc: "Position the 3D card in your space" },
                { icon: Eye, title: "Explore", desc: "Walk around and view from any angle" },
                { icon: UserPlus, title: "Connect", desc: "Save contact directly from AR" },
              ].map((item) => (
                <div key={item.title} className="glass rounded-xl p-4 text-center">
                  <item.icon className="mx-auto mb-2 h-6 w-6 text-primary" />
                  <h3 className="font-semibold">{item.title}</h3>
                  <p className="mt-1 text-xs text-muted-foreground">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
