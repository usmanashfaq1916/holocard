import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth/config";
import { prisma } from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    const { cardId, eventType, deviceType, browser, referrer, metadata } =
      await request.json();

    if (!cardId || !eventType) {
      return NextResponse.json({ error: "cardId and eventType required" }, { status: 400 });
    }

    const validEvents = [
      "PROFILE_VIEW",
      "QR_SCAN",
      "AR_LAUNCH",
      "AR_SESSION",
      "CONTACT_SAVE",
      "PHONE_CLICK",
      "EMAIL_CLICK",
      "WHATSAPP_CLICK",
      "LINKEDIN_CLICK",
      "WEBSITE_CLICK",
      "SOCIAL_CLICK",
      "CTA_CLICK",
      "SHARE",
      "VIDEO_PLAY",
      "CAMERA_STARTED",
      "TARGET_DETECTED",
      "AR_EXPERIENCE_STARTED",
      "AR_INTERACTION",
    ];

    if (!validEvents.includes(eventType)) {
      return NextResponse.json({ error: "Invalid eventType" }, { status: 400 });
    }

    await prisma.analyticsEvent.create({
      data: {
        cardId,
        userId: session?.user?.id || null,
        eventType,
        deviceType: deviceType || null,
        browser: browser || null,
        referrer: referrer || null,
        metadata: metadata || undefined,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Analytics track error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
