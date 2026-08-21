import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth/config";
import { socialLinkSchema } from "@/lib/validation";

interface RouteParams {
  params: Promise<{ cardId: string }>;
}

export async function POST(req: Request, { params }: RouteParams) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { cardId } = await params;
  const card = await prisma.card.findUnique({ where: { id: cardId } });

  if (!card || card.userId !== session.user.id) {
    return NextResponse.json({ error: "Card not found" }, { status: 404 });
  }

  const body = await req.json();
  const result = socialLinkSchema.safeParse(body);

  if (!result.success) {
    return NextResponse.json(
      { error: result.error.issues[0].message },
      { status: 400 }
    );
  }

  const maxOrder = await prisma.socialLink.findFirst({
    where: { cardId },
    orderBy: { order: "desc" },
    select: { order: true },
  });

  const link = await prisma.socialLink.create({
    data: {
      cardId,
      ...result.data,
      order: (maxOrder?.order ?? -1) + 1,
    },
  });

  return NextResponse.json(link, { status: 201 });
}
