"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import {
  Phone,
  Mail,
  Globe,
  MessageCircle,
  ExternalLink,
  Download,
  Share2,
  MapPin,
  User,
  Building,
  Video,
  Image,
} from "lucide-react";

interface FallbackViewerProps {
  name: string;
  cardSlug?: string;
  designation?: string;
  company?: string;
  phone?: string;
  email?: string;
  website?: string;
  linkedin?: string;
  whatsapp?: string;
  bio?: string;
  profileImage?: string;
  socialLinks?: { platform: string; url: string }[];
  buttons?: { label: string; url: string }[];
}

function generateVCard(data: {
  name: string;
  designation?: string;
  company?: string;
  phone?: string;
  email?: string;
  website?: string;
}): string {
  const parts = data.name.split(" ");
  const firstName = parts[0] || "";
  const lastName = parts.slice(1).join(" ");

  return [
    "BEGIN:VCARD",
    "VERSION:3.0",
    `N:${lastName};${firstName};;;`,
    `FN:${data.name}`,
    data.designation ? `TITLE:${data.designation}` : "",
    data.company ? `ORG:${data.company}` : "",
    data.phone ? `TEL:${data.phone}` : "",
    data.email ? `EMAIL:${data.email}` : "",
    data.website ? `URL:${data.website}` : "",
    "END:VCARD",
  ]
    .filter(Boolean)
    .join("\r\n");
}

export default function Fallback3DViewer(props: FallbackViewerProps) {
  const [saved, setSaved] = useState(false);

  const handleSaveContact = useCallback(() => {
    const vcard = generateVCard({
      name: props.name,
      designation: props.designation,
      company: props.company,
      phone: props.phone,
      email: props.email,
      website: props.website,
    });

    const blob = new Blob([vcard], { type: "text/vcard;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${props.name.replace(/\s+/g, "-")}.vcf`;
    link.click();
    URL.revokeObjectURL(url);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }, [props]);

  const handleShare = useCallback(async () => {
    const url = `${window.location.origin}/card/${props.cardSlug || props.name.toLowerCase().replace(/\s+/g, "-")}`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${props.name} — Digital Business Card`,
          text: `Connect with ${props.name}`,
          url,
        });
      } catch {}
    } else {
      await navigator.clipboard.writeText(url);
    }
  }, [props]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
      {/* Header */}
      <div className="bg-primary/5 border-b border-border">
        <div className="max-w-lg mx-auto px-4 py-3 flex items-center justify-between">
          <span className="text-sm font-medium text-primary">Digital HoloCard</span>
          <div className="flex gap-2">
            <button
              onClick={handleShare}
              className="p-2 rounded-lg hover:bg-muted transition-colors"
            >
              <Share2 className="h-4 w-4 text-muted-foreground" />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 py-8">
        {/* Profile */}
        <div className="text-center mb-8">
          {props.profileImage ? (
            <img
              src={props.profileImage}
              alt={props.name}
              className="w-24 h-24 rounded-full mx-auto mb-4 object-cover border-2 border-border"
            />
          ) : (
            <div className="w-24 h-24 rounded-full mx-auto mb-4 bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center border-2 border-border">
              <User className="h-10 w-10 text-primary" />
            </div>
          )}
          <h1 className="text-2xl font-bold text-foreground mb-1">{props.name}</h1>
          {(props.designation || props.company) && (
            <p className="text-muted-foreground">
              {props.designation}
              {props.company && (
                <>
                  {" at "}
                  <span className="font-medium text-foreground">{props.company}</span>
                </>
              )}
            </p>
          )}
          {props.bio && (
            <p className="mt-3 text-sm text-muted-foreground max-w-sm mx-auto">{props.bio}</p>
          )}
        </div>

        {/* Contact Actions */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          {props.phone && (
            <a
              href={`tel:${props.phone}`}
              className="flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white rounded-xl py-3 text-sm font-medium transition-colors"
            >
              <Phone className="h-4 w-4" />
              Call
            </a>
          )}
          {props.email && (
            <a
              href={`mailto:${props.email}`}
              className="flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 text-white rounded-xl py-3 text-sm font-medium transition-colors"
            >
              <Mail className="h-4 w-4" />
              Email
            </a>
          )}
          {props.whatsapp && (
            <a
              href={`https://wa.me/${props.whatsapp.replace(/\D/g, "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white rounded-xl py-3 text-sm font-medium transition-colors"
            >
              <MessageCircle className="h-4 w-4" />
              WhatsApp
            </a>
          )}
          <button
            onClick={handleSaveContact}
            className="flex items-center justify-center gap-2 bg-purple-500 hover:bg-purple-600 text-white rounded-xl py-3 text-sm font-medium transition-colors"
          >
            <Download className="h-4 w-4" />
            {saved ? "Saved!" : "Save Contact"}
          </button>
        </div>

        {/* Website */}
        {props.website && (
          <a
            href={props.website}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full glass rounded-xl py-3 text-sm font-medium text-foreground hover:bg-muted/80 transition-colors mb-6"
          >
            <Globe className="h-4 w-4" />
            Visit Website
            <ExternalLink className="h-3 w-3 text-muted-foreground" />
          </a>
        )}

        {/* Social Links */}
        {props.socialLinks && props.socialLinks.length > 0 && (
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-foreground mb-3">Connect</h3>
            <div className="space-y-2">
              {props.socialLinks.map((link) => (
                <a
                  key={link.platform}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 glass rounded-xl px-4 py-3 text-sm text-foreground hover:bg-muted/80 transition-colors"
                >
                  <span className="font-medium capitalize">{link.platform}</span>
                  <ExternalLink className="h-3 w-3 text-muted-foreground ml-auto" />
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Custom Buttons */}
        {props.buttons && props.buttons.length > 0 && (
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-foreground mb-3">Quick Links</h3>
            <div className="space-y-2">
              {props.buttons.map((btn) => (
                <a
                  key={btn.label}
                  href={btn.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 glass rounded-xl py-3 text-sm font-medium text-foreground hover:bg-muted/80 transition-colors"
                >
                  {btn.label}
                  <ExternalLink className="h-3 w-3 text-muted-foreground" />
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="text-center pt-6 border-t border-border">
          <p className="text-xs text-muted-foreground">
            Powered by <span className="font-medium text-primary">HoloCard</span>
          </p>
        </div>
      </div>
    </div>
  );
}
