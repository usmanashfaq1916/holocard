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
  if (p === "youtube")
    return (
      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
      </svg>
    );
  if (p === "telegram")
    return (
      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.479.33-.913.492-1.302.48-.428-.013-1.252-.242-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
      </svg>
    );
  if (p === "tiktok")
    return (
      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
      </svg>
    );
  if (p === "whatsapp")
    return (
      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
      </svg>
    );
  if (p === "pinterest")
    return (
      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 01.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.631-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12.017 24c6.624 0 11.99-5.367 11.99-11.988C24.007 5.367 18.641 0 12.017 0z" />
      </svg>
    );
  if (p === "reddit")
    return (
      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 0 0-.232-.095z" />
      </svg>
    );
  if (p === "discord")
    return (
      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189z" />
      </svg>
    );
  if (p === "medium")
    return (
      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M13.54 12a6.8 6.8 0 01-6.77 6.82A6.8 6.8 0 010 12a6.8 6.8 0 016.77-6.82A6.8 6.8 0 0113.54 12zM20.96 12c0 3.54-1.51 6.42-3.38 6.42-1.87 0-3.39-2.88-3.39-6.42s1.52-6.42 3.39-6.42 3.38 2.88 3.38 6.42M24 12c0 3.17-.53 5.75-1.19 5.75-.66 0-1.19-2.58-1.19-5.75s.53-5.75 1.19-5.75C23.47 6.25 24 8.83 24 12z" />
      </svg>
    );
  if (p === "twitch")
    return (
      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M11.571 4.714h1.715v5.143H11.57zm4.715 0H18v5.143h-1.714zM6 0L1.714 4.286v15.428h5.143V24l4.286-4.286h3.428L22.286 12V0zm14.571 11.143l-3.428 3.428h-3.429l-3 3v-3H6.857V1.714h13.714z" />
      </svg>
    );
  if (p === "spotify")
    return (
      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
      </svg>
    );
  if (p === "snapchat")
    return (
      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12.206.793c.99 0 4.347.276 5.93 3.821.529 1.193.403 3.219.299 4.847l-.003.06c-.012.18-.022.345-.03.51.075.045.203.09.401.09.3-.016.659-.12.922-.214.094-.04.19-.06.29-.06.326 0 .596.18.768.36.156.18.276.42.378.72.166.48.29.92.378 1.14.045.12.091.24.135.36.09.24.135.48.09.78-.075.48-.36.72-.66.9-.165.09-.345.165-.51.21-.18.045-.36.075-.48.105-.09.03-.165.06-.21.12-.075.09-.12.24-.12.36 0 .09.03.18.06.27.09.24.27.48.66.6.555.18 1.2.24 1.86.27.09.015.18.045.24.09.105.06.18.18.18.36 0 .075-.015.15-.045.24-.105.24-.36.42-.66.54-.345.12-.72.18-1.08.21-.39.045-.75.075-1.05.12-.15.03-.285.075-.375.18-.045.06-.09.12-.09.24v.12c.015.3.165.54.39.72.39.27.96.39 1.41.42.135.015.27.03.39.06.24.06.42.24.42.48v.03c-.015.18-.09.33-.21.45-.36.36-1.05.54-1.65.63-.36.06-.72.09-1.05.12-.3.03-.57.06-.78.12-.09.03-.18.09-.24.18-.075.12-.09.27-.06.42.06.36.36.6.72.72.45.12.96.15 1.41.18.15.015.3.03.42.06.3.06.54.24.6.54v.03c-.015.12-.06.24-.12.33-.24.36-.72.6-1.2.72-.36.09-.72.12-1.05.15-.36.03-.66.06-.9.12-.15.045-.27.12-.33.27-.045.09-.06.18-.06.3 0 .06.015.12.03.18.105.36.36.6.72.72.45.12.96.15 1.41.18.15.015.3.03.42.06.3.06.54.24.6.54v.12c0 .36-.15.63-.42.81-.45.27-1.05.36-1.56.42-.36.045-.72.06-1.05.09-.15.015-.3.03-.39.06-.15.06-.24.18-.24.36v.03c.015.18.09.33.21.45.36.36 1.05.54 1.65.63.36.06.72.09 1.05.12.3.03.57.06.78.12.15.045.27.15.3.3.015.09.015.18 0 .27-.06.36-.36.6-.72.72-.45.12-.96.15-1.41.18-.15.015-.3.03-.42.06-.3.06-.54.24-.6.54v.12c0 .36.15.63.42.81.45.27 1.05.36 1.56.42.36.045.72.06 1.05.09.54.045 1.02.12 1.38.36.15.09.27.21.36.39.06.15.09.3.09.48 0 .15-.03.3-.06.42-.12.42-.42.72-.81.93-.54.27-1.17.36-1.74.42-.45.045-.87.06-1.23.09-.24.015-.45.03-.6.06-.24.06-.42.24-.42.48v.03c.015.18.09.33.21.45.36.36 1.05.54 1.65.63.36.06.72.09 1.05.12.54.045 1.02.12 1.38.36.15.09.27.21.36.39.06.15.09.3.09.48 0 .15-.03.3-.06.42-.12.42-.42.72-.81.93-.54.27-1.17.36-1.74.42-.45.045-.87.06-1.23.09-.24.015-.45.03-.6.06-.24.06-.42.24-.42.48v.24c0 .36.15.63.42.81.45.27 1.05.36 1.56.42.36.045.72.06 1.05.09.3.03.57.06.78.12.15.045.27.15.3.3.015.09.015.18 0 .27-.06.36-.36.6-.72.72-.45.12-.96.15-1.41.18-.15.015-.3.03-.42.06-.3.06-.54.24-.6.54v.12c0 .36.15.63.42.81.45.27 1.05.36 1.56.42.54.06 1.05.12 1.38.36.15.09.27.21.36.39.06.15.09.3.09.48 0 .15-.03.3-.06.42-.12.42-.42.72-.81.93-.54.27-1.17.36-1.74.42-.45.045-.87.06-1.23.09h-.12c-.06.18-.18.33-.33.42-.36.18-.78.21-1.2.21-.3 0-.6-.06-.84-.15-.36-.12-.63-.36-.75-.66-.06-.18-.09-.36-.09-.54 0-.24.06-.48.18-.66.18-.24.42-.39.66-.51.3-.12.63-.18.96-.24.39-.06.75-.12 1.05-.21.24-.075.42-.21.51-.42.03-.09.06-.18.06-.3 0-.15-.03-.3-.09-.42-.18-.3-.48-.48-.84-.57-.45-.09-.93-.12-1.41-.15-.3-.03-.6-.06-.84-.12-.15-.045-.27-.15-.3-.3-.015-.09-.015-.18 0-.27.06-.36.36-.6.72-.72.45-.12.96-.15 1.41-.18.15-.015.3-.03.42-.06.3-.06.54-.24.6-.54v-.12c0-.36-.15-.63-.42-.81-.45-.27-1.05-.36-1.56-.42-.36-.045-.72-.06-1.05-.09-.3-.03-.57-.06-.78-.12-.15-.045-.27-.15-.3-.3-.015-.09-.015-.18 0-.27.06-.36.36-.6.72-.72.45-.12.96-.15 1.41-.18.15-.015.3-.03.42-.06.3-.06.54-.24.6-.54v-.12c0-.36-.15-.63-.42-.81-.45-.27-1.05-.36-1.56-.42-.36-.045-.72-.06-1.05-.09-.3-.03-.57-.06-.78-.12-.15-.045-.27-.15-.3-.3-.015-.09-.015-.18 0-.27.06-.36.36-.6.72-.72.45-.12.96-.15 1.41-.18.15-.015.3-.03.42-.06.3-.06.54-.24.6-.54v-.12c0-.36-.15-.63-.42-.81-.45-.27-1.05-.36-1.56-.42-.36-.045-.72-.06-1.05-.09-.3-.03-.57-.06-.78-.12-.15-.045-.27-.15-.3-.3-.015-.09-.015-.18 0-.27.06-.36.36-.6.72-.72.45-.12.96-.15 1.41-.18.15-.015.3-.03.42-.06.3-.06.54-.24.6-.54v-.12c0-.36-.15-.63-.42-.81-.45-.27-1.05-.36-1.56-.42-.36-.045-.72-.06-1.05-.09-.3-.03-.57-.06-.78-.12-.15-.045-.27-.15-.3-.3-.015-.09-.015-.18 0-.27.06-.36.36-.6.72-.72.45-.12.96-.15 1.41-.18.15-.015.3-.03.42-.06.3-.06.54-.24.6-.54v-.12c0-.36-.15-.63-.42-.81-.45-.27-1.05-.36-1.56-.42-.54-.06-1.05-.12-1.38-.36-.15-.09-.27-.21-.36-.39-.06-.15-.09-.3-.09-.48 0-.15.03-.3.06-.42.12-.42.42-.72.81-.93.54-.27 1.17-.36 1.74-.42.45-.045.87-.06 1.23-.09.24-.015.45-.03.6-.06.24-.06.42-.24.42-.48v-.03c-.015-.18-.09-.33-.21-.45-.36-.36-1.05-.54-1.65-.63-.36-.06-.72-.09-1.05-.12-.54-.045-1.02-.12-1.38-.36-.15-.09-.27-.21-.36-.39-.06-.15-.09-.3-.09-.48 0-.15.03-.3.06-.42.12-.42.42-.72.81-.93.54-.27 1.17-.36 1.74-.42.45-.045.87-.06 1.23-.09.24-.015.45-.03.6-.06.24-.06.42-.24.42-.48v-.12c0-.36-.15-.63-.42-.81-.45-.27-1.05-.36-1.56-.42-.36-.045-.72-.06-1.05-.09-.3-.03-.57-.06-.78-.12-.15-.045-.27-.15-.3-.3-.015-.09-.015-.18 0-.27.06-.36.36-.6.72-.72.45-.12.96-.15 1.41-.18.15-.015.3-.03.42-.06.3-.06.54-.24.6-.54v-.12c0-.36-.15-.63-.42-.81-.45-.27-1.05-.36-1.56-.42-.54-.06-1.05-.12-1.38-.36-.15-.09-.27-.21-.36-.39-.06-.15-.09-.3-.09-.48 0-.15.03-.3.06-.42.12-.42.42-.72.81-.93.54-.27 1.17-.36 1.74-.42.45-.045.87-.06 1.23-.09h.12c.06-.18.18-.33.33-.42.36-.18.78-.21 1.2-.21.3 0 .6.06.84.15.36.12.63.36.75.66.06.18.09.36.09.54 0 .24-.06.48-.18.66-.18.24-.42.39-.66.51-.3.12-.63.18-.96.24-.39.06-.75.12-1.05.21-.24.075-.42.21-.51.42-.03.09-.06.18-.06.3 0 .15.03.3.09.42.18.3.48.48.84.57.45.09.93.12 1.41.15.3.03.6.06.84.12.15.045.27.15.3.3.015.09.015.18 0 .27-.06.36-.36.6-.72.72-.45.12-.96.15-1.41.18-.15.015-.3.03-.42.06-.3.06-.54.24-.6.54v.12c0 .36.15.63.42.81.45.27 1.05.36 1.56.42.36.045.72.06 1.05.09.3.03.57.06.78.12.15.045.27.15.3.3.015.09.015.18 0 .27-.06.36-.36.6-.72.72-.45.12-.96.15-1.41.18-.15.015-.3.03-.42.06-.3.06-.54.24-.6.54v.12c0 .36.15.63.42.81.45.27 1.05.36 1.56.42.36.045.72.06 1.05.09.3.03.57.06.78.12.15.045.27.15.3.3.015.09.015.18 0 .27-.06.36-.36.6-.72.72-.45.12-.96.15-1.41.18-.15.015-.3.03-.42.06-.3.06-.54.24-.6.54v.12c0 .36.15.63.42.81.45.27 1.05.36 1.56.42.36.045.72.06 1.05.09.3.03.57.06.78.12.15.045.27.15.3.3.015.09.015.18 0 .27-.06.36-.36.6-.72.72-.45.12-.96.15-1.41.18-.15.015-.3.03-.42.06-.3.06-.54.24-.6.54v.12c0 .36.15.63.42.81.45.27 1.05.36 1.56.42.36.045.72.06 1.05.09.3.03.57.06.78.12.15.045.27.15.3.3.015.09.015.18 0 .27-.06.36-.36.6-.72.72-.45.12-.96.15-1.41.18-.15.015-.3.03-.42.06-.3.06-.54.24-.6.54v.12c0 .36.15.63.42.81.45.27 1.05.36 1.56.42.54.06 1.05.12 1.38.36.15.09.27.21.36.39.06.15.09.3.09.48 0 .15-.03.3-.06.42-.12.42-.42.72-.81.93-.54.27-1.17.36-1.74.42-.45.045-.87.06-1.23.09-.24.015-.45.03-.6.06-.24.06-.42.24-.42.48v.12c0 .36.15.63.42.81.45.27 1.05.36 1.56.42.36.045.72.06 1.05.09.3.03.57.06.78.12.15.045.27.15.3.3.015.09.015.18 0 .27-.06.36-.36.6-.72.72-.45.12-.96.15-1.41.18-.15.015-.3.03-.42.06-.3.06-.54.24-.6.54v.12c0 .36.15.63.42.81.45.27 1.05.36 1.56.42.36.045.72.06 1.05.09.3.03.57.06.78.12.15.045.27.15.3.3.015.09.015.18 0 .27-.06.36-.36.6-.72.72-.45.12-.96.15-1.41.18-.15.015-.3.03-.42.06-.3.06-.54.24-.6.54v.12c0 .36.15.63.42.81.45.27 1.05.36 1.56.42.36.045.72.06 1.05.09.3.03.57.06.78.12.15.045.27.15.3.3.015.09.015.18 0 .27-.06.36-.36.6-.72.72-.45.12-.96.15-1.41.18-.15.015-.3.03-.42.06-.3.06-.54.24-.6.54v.12c0 .36.15.63.42.81.45.27 1.05.36 1.56.42.54.06 1.05.12 1.38.36.15.09.27.21.36.39.06.15.09.3.09.48 0 .15-.03.3-.06.42-.12.42-.42.72-.81.93-.54.27-1.17.36-1.74.42-.45.045-.87.06-1.23.09-.24.015-.45.03-.6.06-.24.06-.42.24-.42.48v.12c0 .36.15.63.42.81.45.27 1.05.36 1.56.42.36.045.72.06 1.05.09.3.03.57.06.78.12.15.045.27.15.3.3.015.09.015.18 0 .27-.06.36-.36.6-.72.72-.45.12-.96.15-1.41.18-.15.015-.3.03-.42.06-.3.06-.54.24-.6.54v.12c0 .36.15.63.42.81.45.27 1.05.36 1.56.42.36.045.72.06 1.05.09.3.03.57.06.78.12.15.045.27.15.3.3.015.09.015.18 0 .27-.06.36-.36.6-.72.72-.45.12-.96.15-1.41.18-.15.015-.3.03-.42.06-.3.06-.54.24-.6.54v.12c0 .36.15.63.42.81.45.27 1.05.36 1.56.42.36.045.72.06 1.05.09.3.03.57.06.78.12.15.045.27.15.3.3.015.09.015.18 0 .27-.06.36-.36.6-.72.72-.45.12-.96.15-1.41.18-.15.015-.3.03-.42.06-.3.06-.54.24-.6.54v.12c0 .36.15.63.42.81.45.27 1.05.36 1.56.42.54.06 1.05.12 1.38.36.15.09.27.21.36.39.06.15.09.3.09.48 0 .15-.03.3-.06.42-.12.42-.42.72-.81.93-.54.27-1.17.36-1.74.42-.45.045-.87.06-1.23.09-.24.015-.45.03-.6.06-.24.06-.42.24-.42.48v.12c0 .36.15.63.42.81.45.27 1.05.36 1.56.42.36.045.72.06 1.05.09.3.03.57.06.78.12.15.045.27.15.3.3.015.09.015.18 0 .27-.06.36-.36.6-.72.72-.45.12-.96.15-1.41.18-.15.015-.3.03-.42.06-.3.06-.54.24-.6.54v.12c0 .36.15.63.42.81.45.27 1.05.36 1.56.42.36.045.72.06 1.05.09.3.03.57.06.78.12.15.045.27.15.3.3.015.09.015.18 0 .27-.06.36-.36.6-.72.72-.45.12-.96.15-1.41.18-.15.015-.3.03-.42.06-.3.06-.54.24-.6.54v.12c0 .36.15.63.42.81.45.27 1.05.36 1.56.42.54.06 1.05.12 1.38.36.15.09.27.21.36.39.06.15.09.3.09.48 0 .15-.03.3-.06.42-.12.42-.42.72-.81.93-.54.27-1.17.36-1.74.42-.45.045-.87.06-1.23.09h-.01z" />
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
    const base = process.env.NEXT_PUBLIC_BASE_URL || window.location.origin;
    const cardUrl = `${base}/card/${card.slug}`;
    const shared = await shareCard(card, cardUrl);
    if (!shared) {
      const success = await copyToClipboard(cardUrl);
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
