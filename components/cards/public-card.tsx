"use client";

import { Suspense, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  QrCode,
  UserPlus,
  Eye,
  Mail,
  Phone,
  Globe,
  MapPin,
  Download,
  ExternalLink,
  Share2,
  Check,
  MessageCircle,
  Loader2,
} from "lucide-react";
import { QRGenerator } from "./qr-generator";
import { ShareButtons } from "./share-buttons";
import { shareCard, copyToClipboard, downloadVCard } from "@/lib/sharing";
import { LazyARModelViewer } from "@/lib/lazy-imports";

function SocialIcon({ platform }: { platform: string }) {
  const p = platform.toLowerCase();
  if (p === "linkedin")
    return (
      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    );
  if (p === "twitter" || p === "x")
    return (
      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    );
  if (p === "github")
    return (
      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
      </svg>
    );
  if (p === "facebook")
    return (
      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
      </svg>
    );
  if (p === "instagram")
    return (
      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
      </svg>
    );
  return <ExternalLink className="h-5 w-5" />;
}

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
  buttons?: CardButton[];
  about?: string | null;
  skills?: string | null;
  experience?: string | null;
  projects?: string | null;
  enableContact?: boolean | null;
}

function SkillsSection({ skills }: { skills: unknown }) {
  let skillsList: string[] = [];
  try {
    const parsed = typeof skills === "string" ? JSON.parse(skills) : skills;
    skillsList = Array.isArray(parsed) ? parsed : [];
  } catch { skillsList = []; }
  if (skillsList.length === 0) return null;
  return (
    <section className="mx-auto max-w-2xl px-4 pb-6">
      <div className="glass rounded-xl p-4">
        <h3 className="mb-3 text-sm font-medium text-muted-foreground">Skills</h3>
        <div className="flex flex-wrap gap-2">
          {skillsList.map((skill: string, i: number) => (
            <span key={i} className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
              {skill}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

function ExperienceSection({ experience }: { experience: unknown }) {
  let expList: { title: string; company: string; period: string; description: string }[] = [];
  try {
    const parsed = typeof experience === "string" ? JSON.parse(experience) : experience;
    expList = Array.isArray(parsed) ? parsed : [];
  } catch { expList = []; }
  if (expList.length === 0) return null;
  return (
    <section className="mx-auto max-w-2xl px-4 pb-6">
      <div className="glass rounded-xl p-4">
        <h3 className="mb-3 text-sm font-medium text-muted-foreground">Experience</h3>
        <div className="space-y-4">
          {expList.map((exp, i: number) => (
            <div key={i} className="border-l-2 border-primary/30 pl-4">
              <h4 className="text-sm font-semibold">{exp.title}</h4>
              <p className="text-xs text-muted-foreground">{exp.company}{exp.period ? ` · ${exp.period}` : ""}</p>
              {exp.description && <p className="mt-1 text-xs text-muted-foreground">{exp.description}</p>}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ProjectsSection({ projects }: { projects: unknown }) {
  let projList: { name: string; description: string; url?: string }[] = [];
  try {
    const parsed = typeof projects === "string" ? JSON.parse(projects) : projects;
    projList = Array.isArray(parsed) ? parsed : [];
  } catch { projList = []; }
  if (projList.length === 0) return null;
  return (
    <section className="mx-auto max-w-2xl px-4 pb-6">
      <div className="glass rounded-xl p-4">
        <h3 className="mb-3 text-sm font-medium text-muted-foreground">Projects</h3>
        <div className="space-y-3">
          {projList.map((proj, i: number) => (
            <div key={i} className="rounded-lg border border-border p-3">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-semibold">{proj.name}</h4>
                {proj.url && (
                  <a href={proj.url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                    <ExternalLink className="h-3 w-3" />
                  </a>
                )}
              </div>
              {proj.description && <p className="mt-1 text-xs text-muted-foreground">{proj.description}</p>}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ContactForm({ cardId, cardName }: { cardId: string; cardName: string }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    try {
      const res = await fetch("/api/contacts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cardId, name, email, phone, message, source: "form" }),
      });
      if (res.ok) {
        setSent(true);
        setName("");
        setEmail("");
        setPhone("");
        setMessage("");
      }
    } catch { /* silent */ }
    setSending(false);
  };

  if (sent) {
    return (
      <div className="glass rounded-xl p-6 text-center">
        <Check className="mx-auto h-8 w-8 text-green-500" />
        <p className="mt-2 text-sm font-medium">Message sent to {cardName}!</p>
        <button onClick={() => setSent(false)} className="mt-2 text-xs text-primary hover:underline">Send another</button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="glass rounded-xl p-4 space-y-3">
      <h3 className="text-sm font-medium text-muted-foreground">Send a Message</h3>
      <input type="hidden" value={cardId} />
      <input
        type="text"
        placeholder="Your name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
        className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
      />
      <input
        type="email"
        placeholder="Your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
      />
      <input
        type="tel"
        placeholder="Phone (optional)"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
      />
      <textarea
        placeholder="Your message"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        required
        rows={3}
        className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary resize-none"
      />
      <button
        type="submit"
        disabled={sending}
        className="w-full rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-50"
      >
        {sending ? "Sending..." : "Send Message"}
      </button>
    </form>
  );
}

export function PublicCard({ card }: { card: Card }) {
  const [showQR, setShowQR] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    const shared = await shareCard(card);
    if (!shared) {
      const url = `${window.location.origin}/card/${card.slug}`;
      const success = await copyToClipboard(url);
      if (success) {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    }
  };

  const handleSaveContact = () => {
    downloadVCard({
      name: card.name,
      designation: card.designation,
      company: card.company,
      phone: card.phone,
      email: card.email,
      website: card.website,
      location: card.location,
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-primary/5 to-background">
        <div className="absolute inset-0 bg-grid opacity-30" />
        <div className="relative mx-auto max-w-2xl px-4 py-16 text-center">
          {card.profileImage ? (
            <div className="relative mx-auto h-24 w-24 overflow-hidden rounded-full ring-4 ring-primary/20">
              <Image
                src={card.profileImage}
                alt={card.name}
                fill
                className="object-cover"
                unoptimized
              />
            </div>
          ) : (
            <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-primary to-cyan text-3xl font-bold text-white ring-4 ring-primary/20">
              {card.name
                .split(" ")
                .map((n) => n[0])
                .join("")
                .toUpperCase()
                .slice(0, 2)}
            </div>
          )}
          <h1 className="mt-6 text-3xl font-bold">{card.name}</h1>
          <p className="mt-1 text-lg text-muted-foreground">
            {card.designation}
            {card.company ? ` at ${card.company}` : ""}
          </p>
          {card.bio && (
            <p className="mx-auto mt-4 max-w-md text-sm text-muted-foreground">
              {card.bio}
            </p>
          )}

          {/* Action buttons */}
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <button
              onClick={handleSaveContact}
              className="flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-all hover:opacity-90"
            >
              <UserPlus className="h-4 w-4" />
              Save Contact
            </button>
            <button
              onClick={handleShare}
              className="flex items-center gap-2 rounded-xl border border-border bg-background px-5 py-2.5 text-sm font-medium transition-colors hover:bg-accent"
            >
              {copied ? (
                <Check className="h-4 w-4 text-green-500" />
              ) : (
                <Share2 className="h-4 w-4" />
              )}
              {copied ? "Copied!" : "Share"}
            </button>
            <Link
              href={`/ar/${card.slug}`}
              className="flex items-center gap-2 rounded-xl border border-border bg-background px-5 py-2.5 text-sm font-medium transition-colors hover:bg-accent"
            >
              <Eye className="h-4 w-4" />
              View in AR
            </Link>
          </div>
        </div>
      </section>

      {/* 3D HoloCard */}
      <section className="mx-auto max-w-2xl px-4 py-8">
        <div className="glass overflow-hidden rounded-2xl glow-md">
          <Suspense
            fallback={
              <div className="flex h-64 items-center justify-center">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
              </div>
            }
          >
            <LazyARModelViewer
              name={card.name}
              designation={card.designation || undefined}
              company={card.company || undefined}
              profileImage={card.profileImage || undefined}
              cardColor={card.accentColor || undefined}
              socialLinks={card.socialLinks}
              slug={card.slug}
              className="h-64 md:h-80"
            />
          </Suspense>
        </div>
      </section>

      {/* Contact Grid */}
      <section className="mx-auto max-w-2xl px-4 pb-6">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {card.phone && (
            <a
              href={`tel:${card.phone}`}
              className="glass flex items-center gap-3 rounded-xl p-4 transition-all hover:glow-sm"
            >
              <Phone className="h-4 w-4 text-primary" />
              <span className="truncate text-sm">{card.phone}</span>
            </a>
          )}
          {card.email && (
            <a
              href={`mailto:${card.email}`}
              className="glass flex items-center gap-3 rounded-xl p-4 transition-all hover:glow-sm"
            >
              <Mail className="h-4 w-4 text-primary" />
              <span className="truncate text-sm">{card.email}</span>
            </a>
          )}
          {card.whatsapp && (
            <a
              href={`https://wa.me/${(card.whatsapp as string).replace(/[^0-9]/g, "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="glass flex items-center gap-3 rounded-xl p-4 transition-all hover:glow-sm"
            >
              <MessageCircle className="h-4 w-4 text-green-600" />
              <span className="truncate text-sm">WhatsApp</span>
            </a>
          )}
          {card.website && (
            <a
              href={card.website}
              target="_blank"
              rel="noopener noreferrer"
              className="glass flex items-center gap-3 rounded-xl p-4 transition-all hover:glow-sm"
            >
              <Globe className="h-4 w-4 text-cyan" />
              <span className="truncate text-sm">
                {(card.website as string).replace(/^https?:\/\//, "")}
              </span>
            </a>
          )}
          {card.location && (
            <div className="glass flex items-center gap-3 rounded-xl p-4">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span className="truncate text-sm">{card.location}</span>
            </div>
          )}
        </div>
      </section>

      {/* Social Links */}
      {(card.linkedin || card.twitter || card.facebook || card.instagram || card.socialLinks.length > 0) && (
        <section className="mx-auto max-w-2xl px-4 pb-6">
          <div className="glass rounded-xl p-4">
            <h3 className="mb-3 text-center text-sm font-medium text-muted-foreground">
              Connect
            </h3>
            <div className="flex flex-wrap justify-center gap-3">
              {card.linkedin && (
                <a
                  href={card.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary transition-all hover:bg-primary/20 hover:scale-105"
                >
                  <SocialIcon platform="linkedin" />
                </a>
              )}
              {card.twitter && (
                <a
                  href={card.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary transition-all hover:bg-primary/20 hover:scale-105"
                >
                  <SocialIcon platform="twitter" />
                </a>
              )}
              {card.facebook && (
                <a
                  href={card.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary transition-all hover:bg-primary/20 hover:scale-105"
                >
                  <SocialIcon platform="facebook" />
                </a>
              )}
              {card.instagram && (
                <a
                  href={card.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary transition-all hover:bg-primary/20 hover:scale-105"
                >
                  <SocialIcon platform="instagram" />
                </a>
              )}
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
        </section>
      )}

      {/* About Section */}
      {card.about && (
        <section className="mx-auto max-w-2xl px-4 pb-6">
          <div className="glass rounded-xl p-4">
            <h3 className="mb-3 text-sm font-medium text-muted-foreground">About</h3>
            <p className="text-sm leading-relaxed text-foreground whitespace-pre-line">{card.about}</p>
          </div>
        </section>
      )}

      {/* Skills Section */}
      {card.skills && <SkillsSection skills={card.skills} />}

      {/* Experience Section */}
      {card.experience && <ExperienceSection experience={card.experience} />}

      {/* Projects Section */}
      {card.projects && <ProjectsSection projects={card.projects} />}

      {/* Custom Buttons */}
      {card.buttons && card.buttons.filter((b) => b.isActive).length > 0 && (
        <section className="mx-auto max-w-2xl px-4 pb-6">
          <div className="space-y-2">
            {card.buttons
              .filter((b) => b.isActive)
              .sort((a, b) => a.order - b.order)
              .map((button) => (
                <a
                  key={button.id}
                  href={button.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="glass flex items-center justify-center gap-2 rounded-xl p-3 text-sm font-medium transition-all hover:glow-sm"
                >
                  {button.label}
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              ))}
          </div>
        </section>
      )}

      {/* QR Code */}
      <section className="mx-auto max-w-2xl px-4 pb-6">
        <button
          onClick={() => setShowQR(!showQR)}
          className="glass flex w-full items-center justify-center gap-2 rounded-xl p-3 text-sm font-medium transition-all hover:glow-sm"
        >
          <QrCode className="h-4 w-4" />
          {showQR ? "Hide QR Code" : "Show QR Code"}
        </button>
        {showQR && (
          <div className="mt-4 flex flex-col items-center gap-3 glass rounded-xl p-6">
            <QRGenerator slug={card.slug} size={180} />
            <div className="flex gap-2">
              <a
                href={`/api/qr/${card.slug}?format=png`}
                download
                className="flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs font-medium transition-colors hover:bg-accent"
              >
                <Download className="h-3 w-3" /> PNG
              </a>
              <a
                href={`/api/qr/${card.slug}?format=svg`}
                download
                className="flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs font-medium transition-colors hover:bg-accent"
              >
                <Download className="h-3 w-3" /> SVG
              </a>
            </div>
          </div>
        )}
      </section>

      {/* Share */}
      <section className="mx-auto max-w-2xl px-4 pb-6">
        <div className="glass rounded-xl p-4">
          <p className="mb-3 text-center text-xs text-muted-foreground">
            Share this card
          </p>
          <ShareButtons slug={card.slug} name={card.name} designation={card.designation || undefined} company={card.company || undefined} phone={card.phone || undefined} email={card.email || undefined} website={card.website || undefined} />
        </div>
      </section>

      {/* Contact Form */}
      {card.enableContact && (
        <section className="mx-auto max-w-2xl px-4 pb-6">
          <ContactForm cardId={card.id} cardName={card.name} />
        </section>
      )}

      {/* Footer */}
      <footer className="py-8 text-center">
        <Link
          href="/"
          className="text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          Powered by <span className="font-semibold">HoloCard</span>
        </Link>
      </footer>
    </div>
  );
}

function parseJsonArray(value: unknown): string[] {
  try {
    const parsed = typeof value === "string" ? JSON.parse(value) : value;
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function parseJsonObjectArray(value: unknown): Record<string, string>[] {
  try {
    const parsed = typeof value === "string" ? JSON.parse(value) : value;
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}
