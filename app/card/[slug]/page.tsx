import type { Metadata } from "next";
import { QrCode, UserPlus, Eye, ExternalLink, MapPin } from "lucide-react";

interface CardPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: CardPageProps): Promise<Metadata> {
  const { slug } = await params;
  const name = slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
  return {
    title: `${name} | HoloCard`,
    description: `Interactive digital business card for ${name}.`,
    openGraph: {
      title: `${name} | HoloCard`,
      description: `Interactive digital business card for ${name}.`,
      type: "profile",
    },
  };
}

export default async function PublicCardPage({ params }: CardPageProps) {
  const { slug } = await params;
  const name = slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

  return (
    <div className="min-h-screen bg-grid">
      <div className="absolute inset-0 bg-radial" />
      <div className="relative z-10 mx-auto flex min-h-screen max-w-lg flex-col items-center justify-center px-4 py-12">
        <div className="glass w-full rounded-2xl p-8 glow-md">
          <div className="flex flex-col items-center text-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-primary to-cyan text-2xl font-bold text-white">
              {name
                .split(" ")
                .map((n) => n[0])
                .join("")
                .toUpperCase()
                .slice(0, 2)}
            </div>
            <h1 className="mt-4 text-2xl font-bold">{name}</h1>
            <p className="text-muted-foreground">Data Analyst</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Turning data into actionable insights
            </p>
          </div>

          <div className="mt-6 flex justify-center gap-3">
            <a
              href="#"
              className="flex h-11 items-center gap-2 rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground transition-all hover:glow-sm"
            >
              <UserPlus className="h-4 w-4" />
              Save Contact
            </a>
            <a
              href="#"
              className="flex h-11 items-center gap-2 rounded-lg border border-border bg-background px-4 text-sm font-medium transition-colors hover:bg-accent"
            >
              <Eye className="h-4 w-4" />
              View in AR
            </a>
          </div>

          <div className="mt-6 space-y-2">
            <a
              href="mailto:test@example.com"
              className="flex items-center gap-3 rounded-lg border border-border p-3 text-sm transition-colors hover:bg-accent"
            >
              <ExternalLink className="h-4 w-4 text-muted-foreground" />
              test@example.com
            </a>
            <a
              href="#"
              className="flex items-center gap-3 rounded-lg border border-border p-3 text-sm transition-colors hover:bg-accent"
            >
              <MapPin className="h-4 w-4 text-muted-foreground" />
              New York, NY
            </a>
          </div>

          <div className="mt-6">
            <div className="flex items-center justify-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/20 text-primary">
                <QrCode className="h-5 w-5" />
              </div>
            </div>
            <p className="mt-2 text-center text-xs text-muted-foreground">
              Scan QR to view this card
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
