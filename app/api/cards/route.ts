import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth/config";
import { cardSchema } from "@/lib/validation";
import { canCreateCard, type PlanTier } from "@/lib/plans";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const cards = await prisma.card.findMany({
    where: { userId: session.user.id },
    orderBy: { updatedAt: "desc" },
    include: { _count: { select: { analyticsEvents: true, socialLinks: true } } },
  });

  return NextResponse.json(cards);
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const result = cardSchema.safeParse(body);

  if (!result.success) {
    return NextResponse.json(
      { error: result.error.issues[0].message },
      { status: 400 }
    );
  }

  const existing = await prisma.card.findUnique({
    where: { slug: result.data.slug },
  });
  if (existing) {
    return NextResponse.json(
      { error: "This slug is already taken" },
      { status: 409 }
    );
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { plan: true },
  });

  const cardCount = await prisma.card.count({
    where: { userId: session.user.id },
  });

  if (!canCreateCard(cardCount, (user?.plan || "FREE") as PlanTier)) {
    return NextResponse.json(
      { error: "You've reached the card limit for your plan. Upgrade to create more cards." },
      { status: 403 }
    );
  }

  const card = await prisma.card.create({
    data: {
      userId: session.user.id,
      ...result.data,
    },
  });

  return NextResponse.json(card, { status: 201 });
}
