import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

interface RouteParams {
  params: Promise<{ slug: string }>;
}

export async function GET(_req: Request, { params }: RouteParams) {
  const { slug } = await params;

  const card = await prisma.card.findUnique({
    where: { slug },
    include: {
      socialLinks: { orderBy: { order: "asc" } },
      buttons: { where: { isActive: true }, orderBy: { order: "asc" } },
    },
  });

  if (!card || card.status !== "ACTIVE") {
    return NextResponse.json({ error: "Card not found" }, { status: 404 });
  }

  if (card.visibility === "PRIVATE") {
    return NextResponse.json({ error: "Card not found" }, { status: 404 });
  }

  return NextResponse.json(card);
}
