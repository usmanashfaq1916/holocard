import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth/config";

export async function GET(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const url = new URL(request.url);
  const page = parseInt(url.searchParams.get("page") || "1");
  const limit = parseInt(url.searchParams.get("limit") || "10");
  const skip = (page - 1) * limit;

  const [totalUsers, totalCards, totalTemplates, totalArAssets] = await Promise.all([
    prisma.user.count(),
    prisma.card.count(),
    prisma.template.count(),
    prisma.aRAsset.count(),
  ]);

  const recentUsers = await prisma.user.findMany({
    take: limit,
    skip,
    orderBy: { createdAt: "desc" },
    select: { id: true, name: true, email: true, plan: true, createdAt: true },
  });

  const recentCards = await prisma.card.findMany({
    take: limit,
    skip,
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      slug: true,
      status: true,
      createdAt: true,
      user: { select: { name: true, email: true } },
    },
  });

  return NextResponse.json({
    stats: { totalUsers, totalCards, totalTemplates, totalArAssets },
    totalUsers,
    totalCards,
    recentUsers,
    recentCards,
  });
}
