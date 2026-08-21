"use client";

import Link from "next/link";
import { Plus, Eye, QrCode, Copy } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";

const mockCards = [
  {
    id: "1",
    name: "Usman Ashfaq",
    slug: "usman-ashfaq",
    designation: "Data Analyst",
    status: "ACTIVE",
    views: 342,
  },
  {
    id: "2",
    name: "Professional Card",
    slug: "usman-pro",
    designation: "Professional",
    status: "DRAFT",
    views: 0,
  },
];

export default function CardsPage() {
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

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {mockCards.map((card) => (
          <div key={card.id} className="glass rounded-xl p-5">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-primary to-cyan text-sm font-bold text-white">
                  {card.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase()
                    .slice(0, 2)}
                </div>
                <div>
                  <h3 className="font-semibold">{card.name}</h3>
                  <p className="text-xs text-muted-foreground">{card.designation}</p>
                </div>
              </div>
              <span
                className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                  card.status === "ACTIVE"
                    ? "bg-green-500/20 text-green-400"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {card.status}
              </span>
            </div>

            <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
              <Eye className="h-3 w-3" /> {card.views} views
              <span className="mx-1">·</span>
              /card/{card.slug}
            </div>

            <div className="mt-4 flex gap-2">
              <Link
                href={`/card/${card.slug}`}
                className={buttonVariants({ variant: "outline", size: "sm" })}
              >
                <Eye className="mr-1 h-3 w-3" /> View
              </Link>
              <button className={buttonVariants({ variant: "outline", size: "sm" })}>
                <QrCode className="mr-1 h-3 w-3" /> QR
              </button>
              <button className={buttonVariants({ variant: "outline", size: "sm" })}>
                <Copy className="mr-1 h-3 w-3" /> Share
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
