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

  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(`Check out ${name}'s card: ${cardUrl}`)}`;
  const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(cardUrl)}`;
  const emailUrl = `mailto:?subject=${encodeURIComponent(`${name}'s Business Card`)}&body=${encodeURIComponent(`Check out my digital business card: ${cardUrl}`)}`;

  return (
    <div className="flex flex-wrap gap-2">
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
        <Share2 className="h-3 w-3" />
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
