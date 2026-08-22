"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { Plus, Eye, QrCode, Copy, Trash2, ExternalLink, GripVertical, CopyPlus } from "lucide-react";
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
  order: number;
  _count: { analyticsEvents: number };
}

export default function CardsPage() {
  const [cards, setCards] = useState<Card[]>([]);
  const [loading, setLoading] = useState(true);
  const [showQR, setShowQR] = useState<string | null>(null);
  const [showShare, setShowShare] = useState<string | null>(null);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [dragOverId, setDragOverId] = useState<string | null>(null);
  const dragCounter = useRef(0);

  useEffect(() => {
    fetch("/api/cards")
      .then((r) => r.json())
      .then((data) => {
        setCards(data.sort((a: Card, b: Card) => a.order - b.order));
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const deleteCard = async (id: string) => {
    if (!confirm("Delete this card? This cannot be undone.")) return;
    await fetch(`/api/cards/${id}`, { method: "DELETE" });
    setCards(cards.filter((c) => c.id !== id));
  };

  const duplicateCard = async (id: string) => {
    const res = await fetch(`/api/cards/${id}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "duplicate" }),
    });
    if (res.ok) {
      const duplicated = await res.json();
      setCards([...cards, duplicated].sort((a, b) => a.order - b.order));
    }
  };

  const handleDragStart = (e: React.DragEvent, id: string) => {
    setDraggingId(id);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", id);
  };

  const handleDragEnter = (e: React.DragEvent, id: string) => {
    e.preventDefault();
    dragCounter.current++;
    setDragOverId(id);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    dragCounter.current--;
    if (dragCounter.current === 0) {
      setDragOverId(null);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = async (e: React.DragEvent, targetId: string) => {
    e.preventDefault();
    dragCounter.current = 0;
    setDragOverId(null);

    const sourceId = e.dataTransfer.getData("text/plain");
    if (sourceId === targetId) return;

    const sourceIndex = cards.findIndex((c) => c.id === sourceId);
    const targetIndex = cards.findIndex((c) => c.id === targetId);
    if (sourceIndex === -1 || targetIndex === -1) return;

    const newCards = [...cards];
    const [moved] = newCards.splice(sourceIndex, 1);
    newCards.splice(targetIndex, 0, moved);

    setCards(newCards);
    setDraggingId(null);

    // Persist order to server
    try {
      await fetch("/api/cards/reorder", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cardIds: newCards.map((c) => c.id) }),
      });
    } catch {
      // Revert on error
      setCards(cards);
    }
  };

  const handleDragEnd = () => {
    setDraggingId(null);
    setDragOverId(null);
    dragCounter.current = 0;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">My Cards</h1>
          <p className="text-sm text-muted-foreground">
            Manage your digital business cards. Drag to reorder.
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
            <div
              key={card.id}
              draggable
              onDragStart={(e) => handleDragStart(e, card.id)}
              onDragEnter={(e) => handleDragEnter(e, card.id)}
              onDragLeave={handleDragLeave}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, card.id)}
              onDragEnd={handleDragEnd}
              className={`glass rounded-xl p-5 transition-all ${
                draggingId === card.id
                  ? "opacity-50 scale-95"
                  : dragOverId === card.id
                  ? "ring-2 ring-primary ring-offset-2 ring-offset-background"
                  : ""
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground">
                    <GripVertical className="h-5 w-5" />
                  </div>
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
                      ? "bg-success/10 text-success"
                      : card.status === "DRAFT"
                      ? "bg-warning/10 text-warning"
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
                  onClick={() => duplicateCard(card.id)}
                  className={buttonVariants({ variant: "outline", size: "sm" })}
                >
                  <CopyPlus className="mr-1 h-3 w-3" /> Duplicate
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
