"use client";

import { Copy, Check, MessageCircle, Mail, Share2 } from "lucide-react";
import { useState } from "react";

interface ShareButtonsProps {
  slug: string;
  name: string;
}

export function ShareButtons({ slug, name }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);
  const baseUrl = typeof window !== "undefined" ? window.location.origin : "";
  const cardUrl = `${baseUrl}/card/${slug}`;

  const copyLink = async () => {
    await navigator.clipboard.writeText(cardUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${name} - HoloCard`,
          text: `Check out ${name}'s digital business card`,
          url: cardUrl,
        });
      } catch {
        // User cancelled or error
      }
    }
  };

  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(`Check out ${name}'s card: ${cardUrl}`)}`;
  const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(cardUrl)}`;
  const emailUrl = `mailto:?subject=${encodeURIComponent(`${name}'s Business Card`)}&body=${encodeURIComponent(`Check out my digital business card: ${cardUrl}`)}`;

  return (
    <div className="flex flex-wrap justify-center gap-2">
      {"share" in navigator && typeof navigator.share === "function" && (
        <button
          onClick={handleNativeShare}
          className="flex items-center gap-1.5 rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-medium transition-colors hover:bg-accent"
        >
          <Share2 className="h-3 w-3" />
          Share
        </button>
      )}
      <button
        onClick={copyLink}
        className="flex items-center gap-1.5 rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-medium transition-colors hover:bg-accent"
      >
        {copied ? <Check className="h-3 w-3 text-success" /> : <Copy className="h-3 w-3" />}
        {copied ? "Copied!" : "Copy Link"}
      </button>
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-1.5 rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-medium transition-colors hover:bg-accent"
      >
        <MessageCircle className="h-3 w-3" />
        WhatsApp
      </a>
      <a
        href={linkedinUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-1.5 rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-medium transition-colors hover:bg-accent"
      >
        <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 24 24">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
        </svg>
        LinkedIn
      </a>
      <a
        href={emailUrl}
        className="flex items-center gap-1.5 rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-medium transition-colors hover:bg-accent"
      >
        <Mail className="h-3 w-3" />
        Email
      </a>
    </div>
  );
}
