import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth/config";

export async function PATCH(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { cardIds } = body;

  if (!Array.isArray(cardIds)) {
    return NextResponse.json(
      { error: "cardIds must be an array" },
      { status: 400 }
    );
  }

  // Verify all cards belong to the user
  const cards = await prisma.card.findMany({
    where: { id: { in: cardIds }, userId: session.user.id },
    select: { id: true },
  });

  if (cards.length !== cardIds.length) {
    return NextResponse.json(
      { error: "Some cards not found or unauthorized" },
      { status: 403 }
    );
  }

  // Update order for each card
  await Promise.all(
    cardIds.map((id: string, index: number) =>
      prisma.card.update({
        where: { id },
        data: { order: index },
      })
    )
  );

  return NextResponse.json({ success: true });
}
