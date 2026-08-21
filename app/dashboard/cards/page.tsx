"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Eye, QrCode, Copy, Trash2, ExternalLink } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { QRGenerator } from "@/components/cards/qr-generator";
import { ShareButtons } from "@/components/cards/share-buttons";

interface Card {
  id: string;
  name: string;
  slug: string;
  designation: string | null;
  company: string | null;
  status: string;
  _count: { analyticsEvents: number };
}

export default function CardsPage() {
  const [cards, setCards] = useState<Card[]>([]);
  const [loading, setLoading] = useState(true);
  const [showQR, setShowQR] = useState<string | null>(null);
  const [showShare, setShowShare] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/cards")
      .then((r) => r.json())
      .then((data) => {
        setCards(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const deleteCard = async (id: string) => {
    if (!confirm("Delete this card? This cannot be undone.")) return;
    await fetch(`/api/cards/${id}`, { method: "DELETE" });
    setCards(cards.filter((c) => c.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">My Cards</h1>
          <p className="text-sm text-muted-foreground">
            Manage your digital business cards.
          </p>
        </div>
        <Link href="/dashboard/cards/new" className={buttonVariants({ variant: "default" })}>
          <Plus className="mr-2 h-4 w-4" />
          Create Card
        </Link>
      </div>

      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="glass animate-pulse rounded-xl p-5">
              <div className="h-10 w-10 rounded-full bg-muted" />
              <div className="mt-3 h-4 w-32 rounded bg-muted" />
              <div className="mt-2 h-3 w-24 rounded bg-muted" />
            </div>
          ))}
        </div>
      ) : cards.length === 0 ? (
        <div className="glass flex flex-col items-center justify-center rounded-xl p-12">
          <p className="text-muted-foreground">No cards yet</p>
          <Link href="/dashboard/cards/new" className={buttonVariants({ variant: "default", className: "mt-4" })}>
            Create Your First Card
          </Link>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {cards.map((card) => (
            <div key={card.id} className="glass rounded-xl p-5">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-primary to-cyan text-sm font-bold text-white">
                    {card.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)}
                  </div>
                  <div>
                    <h3 className="font-semibold">{card.name}</h3>
                    <p className="text-xs text-muted-foreground">
                      {card.designation}{card.company ? ` at ${card.company}` : ""}
                    </p>
                  </div>
                </div>
                <span
                  className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                    card.status === "ACTIVE"
                      ? "bg-green-500/20 text-green-400"
                      : card.status === "DRAFT"
                      ? "bg-yellow-500/20 text-yellow-400"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {card.status}
                </span>
              </div>

              <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
                <Eye className="h-3 w-3" /> {card._count.analyticsEvents} views
                <span className="mx-1">·</span>
                /card/{card.slug}
              </div>

              <div className="mt-4 flex gap-2">
                <Link
                  href={`/card/${card.slug}`}
                  target="_blank"
                  className={buttonVariants({ variant: "outline", size: "sm" })}
                >
                  <ExternalLink className="mr-1 h-3 w-3" /> View
                </Link>
                <button
                  onClick={() => setShowQR(showQR === card.id ? null : card.id)}
                  className={buttonVariants({ variant: "outline", size: "sm" })}
                >
                  <QrCode className="mr-1 h-3 w-3" /> QR
                </button>
                <button
                  onClick={() => setShowShare(showShare === card.id ? null : card.id)}
                  className={buttonVariants({ variant: "outline", size: "sm" })}
                >
                  <Copy className="mr-1 h-3 w-3" /> Share
                </button>
                <button
                  onClick={() => deleteCard(card.id)}
                  className={buttonVariants({ variant: "outline", size: "sm" })}
                >
                  <Trash2 className="h-3 w-3" />
                </button>
              </div>

              {showQR === card.id && (
                <div className="mt-4 flex flex-col items-center gap-3 rounded-lg border border-border p-4">
                  <QRGenerator slug={card.slug} size={160} />
                  <div className="flex gap-2">
                    <a
                      href={`/api/qr/${card.slug}?format=png`}
                      download
                      className={buttonVariants({ variant: "outline", size: "sm" })}
                    >
                      PNG
                    </a>
                    <a
                      href={`/api/qr/${card.slug}?format=svg`}
                      download
                      className={buttonVariants({ variant: "outline", size: "sm" })}
                    >
                      SVG
                    </a>
                  </div>
                </div>
              )}

              {showShare === card.id && (
                <div className="mt-4 rounded-lg border border-border p-4">
                  <ShareButtons slug={card.slug} name={card.name} />
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
