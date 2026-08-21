import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth/config";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user.id;

  const totalCards = await prisma.card.count({ where: { userId } });

  const cardIds = (
    await prisma.card.findMany({ where: { userId }, select: { id: true } })
  ).map((c) => c.id);

  if (cardIds.length === 0) {
    return NextResponse.json({
      totalCards: 0,
      totalViews: 0,
      totalQrScans: 0,
      totalArSessions: 0,
      totalContactSaves: 0,
      totalLinkClicks: 0,
    });
  }

  const [views, qrScans, arSessions, contactSaves, linkClicks] =
    await Promise.all([
      prisma.analyticsEvent.count({
        where: { cardId: { in: cardIds }, eventType: "PROFILE_VIEW" },
      }),
      prisma.analyticsEvent.count({
        where: { cardId: { in: cardIds }, eventType: "QR_SCAN" },
      }),
      prisma.analyticsEvent.count({
        where: {
          cardId: { in: cardIds },
          eventType: { in: ["AR_LAUNCH", "AR_SESSION"] },
        },
      }),
      prisma.analyticsEvent.count({
        where: { cardId: { in: cardIds }, eventType: "CONTACT_SAVE" },
      }),
      prisma.analyticsEvent.count({
        where: {
          cardId: { in: cardIds },
          eventType: {
            in: [
              "PHONE_CLICK",
              "EMAIL_CLICK",
              "WHATSAPP_CLICK",
              "LINKEDIN_CLICK",
              "WEBSITE_CLICK",
              "SOCIAL_CLICK",
            ],
          },
        },
      }),
    ]);

  return NextResponse.json({
    totalCards,
    totalViews: views,
    totalQrScans: qrScans,
    totalArSessions: arSessions,
    totalContactSaves: contactSaves,
    totalLinkClicks: linkClicks,
  });
}
