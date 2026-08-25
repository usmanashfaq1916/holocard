import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth/config";
import { prisma } from "@/lib/db";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(_req: Request, { params }: RouteParams) {
  const { id } = await params;
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const card = await prisma.card.findFirst({
    where: { id, userId: session.user.id },
    include: { cardDesigns: true },
  });

  if (!card) {
    return NextResponse.json({ error: "Card not found" }, { status: 404 });
  }

  const front = card.cardDesigns.find((d) => d.side === "FRONT");
  return NextResponse.json(front || null);
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  const { id } = await params;
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const card = await prisma.card.findFirst({
    where: { id, userId: session.user.id },
  });

  if (!card) {
    return NextResponse.json({ error: "Card not found" }, { status: 404 });
  }

  const { side, canvasJson, exportedImageUrl } = await request.json();

  const existing = await prisma.cardDesign.findFirst({
    where: { cardId: id, side: side || "FRONT" },
  });

  let design;
  if (existing) {
    design = await prisma.cardDesign.update({
      where: { id: existing.id },
      data: {
        canvasJson: canvasJson || undefined,
        exportedImageUrl: exportedImageUrl || undefined,
      },
    });
  } else {
    design = await prisma.cardDesign.create({
      data: {
        cardId: id,
        side: side || "FRONT",
        canvasJson: canvasJson || {},
        exportedImageUrl: exportedImageUrl || undefined,
      },
    });
  }

  return NextResponse.json(design);
}
