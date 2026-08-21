import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth/config";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const [totalUsers, totalCards, totalTemplates, totalArAssets] = await Promise.all([
    prisma.user.count(),
    prisma.card.count(),
    prisma.template.count(),
    prisma.aRAsset.count(),
  ]);

  const recentUsers = await prisma.user.findMany({
    take: 5,
    orderBy: { createdAt: "desc" },
    select: { id: true, name: true, email: true, createdAt: true },
  });

  const recentCards = await prisma.card.findMany({
    take: 5,
    orderBy: { createdAt: "desc" },
    include: { user: { select: { name: true, email: true } } },
  });

  return NextResponse.json({
    stats: { totalUsers, totalCards, totalTemplates, totalArAssets },
    recentUsers,
    recentCards,
  });
}
