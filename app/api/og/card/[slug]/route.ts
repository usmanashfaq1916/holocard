import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface OGRouteParams {
  params: Promise<{ slug: string }>;
}

export async function GET(_request: NextRequest, { params }: OGRouteParams) {
  try {
    const { slug } = await params;

    const card = await prisma.card.findUnique({
      where: { slug },
      select: {
        name: true,
        designation: true,
        company: true,
        profileImage: true,
        status: true,
        visibility: true,
      },
    });

    if (!card || card.status !== "ACTIVE" || card.visibility === "PRIVATE") {
      return new Response(buildFallbackSvg("Card Not Found"), {
        headers: { "Content-Type": "image/svg+xml" },
      });
    }

    const displayName = card.name || "HoloCard User";
    const subtitle = [card.designation, card.company].filter(Boolean).join(" at ") || "Professional";

    const initials = displayName
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);

    const profileImg = card.profileImage
      ? `<img src="${card.profileImage}" width="120" height="120" style="width:120px;height:120px;border-radius:50%;object-fit:cover;border:4px solid #6366f1" />`
      : `<div style="width:120px;height:120px;border-radius:50%;background:linear-gradient(135deg,#6366f1,#8b5cf6);display:flex;align-items:center;justify-content:center;border:4px solid #6366f1"><span style="font-size:42px;font-weight:bold;color:white;font-family:sans-serif">${initials}</span></div>`;

    const svg = `
      <svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" style="stop-color:#6366f1"/>
            <stop offset="50%" style="stop-color:#8b5cf6"/>
            <stop offset="100%" style="stop-color:#a78bfa"/>
          </linearGradient>
        </defs>
        <rect width="1200" height="630" fill="white"/>
        <rect x="0" y="626" width="1200" height="4" fill="url(#grad)"/>

        <rect x="40" y="32" width="32" height="32" rx="8" fill="url(#grad)"/>
        <text x="56" y="55" font-family="sans-serif" font-size="20" font-weight="bold" fill="#1e293b">HoloCard</text>

        <foreignObject x="540" y="170" width="120" height="120">
          ${profileImg}
        </foreignObject>

        <text x="600" y="340" text-anchor="middle" font-family="sans-serif" font-size="40" font-weight="bold" fill="#1e293b">${escapeXml(displayName)}</text>
        <text x="600" y="380" text-anchor="middle" font-family="sans-serif" font-size="22" fill="#64748b">${escapeXml(subtitle)}</text>

        <text x="600" y="460" text-anchor="middle" font-family="sans-serif" font-size="16" fill="#6366f1">holocard.app</text>
      </svg>
    `;

    return new Response(svg, {
      headers: {
        "Content-Type": "image/svg+xml",
        "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=604800",
      },
    });
  } catch (error) {
    console.error("OG image generation error:", error);
    return new Response(buildFallbackSvg("HoloCard"), {
      headers: { "Content-Type": "image/svg+xml" },
    });
  }
}

function buildFallbackSvg(text: string): string {
  return `
    <svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" style="stop-color:#6366f1"/>
          <stop offset="100%" style="stop-color:#8b5cf6"/>
        </linearGradient>
      </defs>
      <rect width="1200" height="630" fill="white"/>
      <rect x="0" y="626" width="1200" height="4" fill="url(#grad)"/>
      <rect x="576" y="200" width="48" height="48" rx="12" fill="url(#grad)"/>
      <text x="600" y="232" text-anchor="middle" font-family="sans-serif" font-size="24" font-weight="bold" fill="white">H</text>
      <text x="600" y="290" text-anchor="middle" font-family="sans-serif" font-size="24" font-weight="bold" fill="#1e293b">${escapeXml(text)}</text>
      <text x="600" y="320" text-anchor="middle" font-family="sans-serif" font-size="16" fill="#64748b">Digital Business Card &amp; AR Platform</text>
    </svg>
  `;
}

function escapeXml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}
