import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth/config";
import { prisma } from "@/lib/db";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const card = await prisma.card.findFirst({
      where: { id, userId: session.user.id },
    });

    if (!card) {
      return NextResponse.json({ error: "Card not found" }, { status: 404 });
    }

    const { front, back } = await request.json();

    const existing = await prisma.cardDesign.findMany({
      where: { cardId: id },
    });

    if (existing.find((d) => d.side === "FRONT")) {
      await prisma.cardDesign.updateMany({
        where: { cardId: id, side: "FRONT" },
        data: { canvasJson: front },
      });
    } else {
      await prisma.cardDesign.create({
        data: { cardId: id, side: "FRONT", canvasJson: front },
      });
    }

    if (existing.find((d) => d.side === "BACK")) {
      await prisma.cardDesign.updateMany({
        where: { cardId: id, side: "BACK" },
        data: { canvasJson: back },
      });
    } else {
      await prisma.cardDesign.create({
        data: { cardId: id, side: "BACK", canvasJson: back },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Card design save error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
