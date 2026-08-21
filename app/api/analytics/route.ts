import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { cardId, eventType, deviceType, browser, country, referrer } = body;

    if (!cardId || !eventType) {
      return NextResponse.json(
        { error: "cardId and eventType are required" },
        { status: 400 }
      );
    }

    await prisma.analyticsEvent.create({
      data: {
        cardId,
        eventType,
        deviceType: deviceType || null,
        browser: browser || null,
        country: country || null,
        referrer: referrer || null,
      },
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Failed to track event" },
      { status: 500 }
    );
  }
}
