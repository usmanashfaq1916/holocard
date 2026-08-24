import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth/config";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const contacts = await prisma.contact.findMany({
    where: { card: { userId: session.user.id } },
    include: { card: { select: { name: true, slug: true } } },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(contacts);
}

export async function POST(req: Request) {
  const body = await req.json();
  const { cardId, name, email, phone, message, source } = body;

  if (!cardId) {
    return NextResponse.json({ error: "cardId is required" }, { status: 400 });
  }

  const card = await prisma.card.findUnique({ where: { id: cardId } });
  if (!card) {
    return NextResponse.json({ error: "Card not found" }, { status: 404 });
  }

  const contact = await prisma.contact.create({
    data: {
      cardId,
      name: name || null,
      email: email || null,
      phone: phone || null,
      message: message || null,
      source: source || null,
    },
  });

  return NextResponse.json(contact, { status: 201 });
}
