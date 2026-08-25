import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth/config";

export async function GET(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const url = new URL(req.url);
  const range = url.searchParams.get("range") || "7d";
  const userId = session.user.id;

  const now = new Date();
  let startDate: Date;

  switch (range) {
    case "30d":
      startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      break;
    case "90d":
      startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
      break;
    case "1y":
      startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
      break;
    default:
      startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  }

  const cardIds = (
    await prisma.card.findMany({ where: { userId }, select: { id: true } })
  ).map((c) => c.id);

  if (cardIds.length === 0) {
    return NextResponse.json({
      totalViews: 0,
      totalQrScans: 0,
      totalArSessions: 0,
      totalContactSaves: 0,
      totalLinkClicks: 0,
      eventsByType: [],
      viewsOverTime: [],
      topLinks: [],
      deviceBreakdown: [],
    });
  }

  const events = await prisma.analyticsEvent.findMany({
    where: {
      cardId: { in: cardIds },
      createdAt: { gte: startDate },
    },
    orderBy: { createdAt: "asc" },
  });

  const totalViews = events.filter((e) => e.eventType === "PROFILE_VIEW").length;
  const qrArScans = events.filter((e) => e.eventType === "QR_AR_SCAN").length;
  const qrCardScans = events.filter((e) => e.eventType === "QR_CARD_SCAN").length;
  const qrLegacyScans = events.filter((e) => e.eventType === "QR_SCAN").length;
  const totalQrScans = qrArScans + qrCardScans + qrLegacyScans;
  const totalArSessions = events.filter((e) =>
    ["AR_LAUNCH", "AR_SESSION"].includes(e.eventType)
  ).length;
  const totalContactSaves = events.filter((e) => e.eventType === "CONTACT_SAVE").length;
  const totalLinkClicks = events.filter((e) =>
    [
      "PHONE_CLICK",
      "EMAIL_CLICK",
      "WHATSAPP_CLICK",
      "LINKEDIN_CLICK",
      "WEBSITE_CLICK",
      "SOCIAL_CLICK",
    ].includes(e.eventType)
  ).length;

  // Events by type
  const eventFriendlyNames: Record<string, string> = {
    PROFILE_VIEW: "Profile Views",
    QR_SCAN: "Legacy QR Scans",
    QR_AR_SCAN: "AR QR Scans",
    QR_CARD_SCAN: "Digital Card QR Scans",
    AR_LAUNCH: "AR Launches",
    AR_SESSION: "AR Sessions",
    CONTACT_SAVE: "Contacts Saved",
    PHONE_CLICK: "Phone Clicks",
    EMAIL_CLICK: "Email Clicks",
    WHATSAPP_CLICK: "WhatsApp Clicks",
    LINKEDIN_CLICK: "LinkedIn Clicks",
    WEBSITE_CLICK: "Website Clicks",
    SOCIAL_CLICK: "Social Clicks",
    CTA_CLICK: "CTA Clicks",
    SHARE: "Shares",
    VIDEO_PLAY: "Video Plays",
    CAMERA_STARTED: "Camera Starts",
    TARGET_DETECTED: "Target Detected",
    AR_EXPERIENCE_STARTED: "AR Experience Starts",
    AR_INTERACTION: "AR Interactions",
  };
  const eventCounts: Record<string, number> = {};
  events.forEach((e) => {
    eventCounts[e.eventType] = (eventCounts[e.eventType] || 0) + 1;
  });
  const eventsByType = Object.entries(eventCounts)
    .map(([name, value]) => ({ name: eventFriendlyNames[name] || name, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 8);

  // Views over time
  const viewsByDate: Record<string, { views: number; scans: number }> = {};
  const days = range === "90d" ? 90 : range === "30d" ? 30 : 7;
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
    const key = d.toISOString().split("T")[0];
    viewsByDate[key] = { views: 0, scans: 0 };
  }
  events.forEach((e) => {
    const key = e.createdAt.toISOString().split("T")[0];
    if (viewsByDate[key]) {
      if (e.eventType === "PROFILE_VIEW") viewsByDate[key].views++;
      if (["QR_SCAN", "QR_AR_SCAN", "QR_CARD_SCAN"].includes(e.eventType)) viewsByDate[key].scans++;
    }
  });
  const viewsOverTime = Object.entries(viewsByDate).map(([date, data]) => ({
    date: date.slice(5),
    ...data,
  }));

  // Top links
  const linkClicks: Record<string, number> = {};
  events.forEach((e) => {
    if (e.eventType.endsWith("_CLICK")) {
      const name = e.eventType.replace("_CLICK", "").toLowerCase();
      linkClicks[name] = (linkClicks[name] || 0) + 1;
    }
  });
  const topLinks = Object.entries(linkClicks)
    .map(([name, clicks]) => ({ name, clicks }))
    .sort((a, b) => b.clicks - a.clicks);

  // Device breakdown
  const devices: Record<string, number> = {};
  events.forEach((e) => {
    const device = e.deviceType || "Unknown";
    devices[device] = (devices[device] || 0) + 1;
  });
  const deviceBreakdown = Object.entries(devices).map(([name, value]) => ({
    name,
    value,
  }));

  return NextResponse.json({
    totalViews,
    totalQrScans,
    qrArScans,
    qrCardScans,
    qrLegacyScans,
    totalArSessions,
    totalContactSaves,
    totalLinkClicks,
    eventsByType,
    viewsOverTime,
    topLinks,
    deviceBreakdown,
  });
}
