import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth/config";

interface RouteParams {
  params: Promise<{ cardId: string }>;
}

export async function GET(_req: Request, { params }: RouteParams) {
  const { cardId } = await params;
  const buttons = await prisma.cardButton.findMany({
    where: { cardId },
    orderBy: { order: "asc" },
  });
  return NextResponse.json(buttons);
}

export async function POST(req: Request, { params }: RouteParams) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { cardId } = await params;
  const card = await prisma.card.findUnique({ where: { id: cardId } });
  if (!card || card.userId !== session.user.id) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const body = await req.json();
  if (!body.label || !body.url) {
    return NextResponse.json(
      { error: "Label and URL are required" },
      { status: 400 }
    );
  }

  const count = await prisma.cardButton.count({ where: { cardId } });
  const button = await prisma.cardButton.create({
    data: {
      cardId,
      label: body.label,
      icon: body.icon || null,
      url: body.url,
      order: body.order ?? count,
      isActive: body.isActive ?? true,
    },
  });

  return NextResponse.json(button, { status: 201 });
}

export async function PATCH(req: Request, { params }: RouteParams) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { cardId } = await params;
  const card = await prisma.card.findUnique({ where: { id: cardId } });
  if (!card || card.userId !== session.user.id) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const body = await req.json();
  if (!body.buttonId) {
    return NextResponse.json(
      { error: "buttonId is required" },
      { status: 400 }
    );
  }

  const button = await prisma.cardButton.findUnique({
    where: { id: body.buttonId },
  });
  if (!button || button.cardId !== cardId) {
    return NextResponse.json({ error: "Button not found" }, { status: 404 });
  }

  const updated = await prisma.cardButton.update({
    where: { id: body.buttonId },
    data: {
      label: body.label ?? button.label,
      icon: body.icon ?? button.icon,
      url: body.url ?? button.url,
      order: body.order ?? button.order,
      isActive: body.isActive ?? button.isActive,
    },
  });

  return NextResponse.json(updated);
}

export async function DELETE(req: Request, { params }: RouteParams) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { cardId } = await params;
  const url = new URL(req.url);
  const buttonId = url.searchParams.get("buttonId");

  if (!buttonId) {
    return NextResponse.json({ error: "buttonId required" }, { status: 400 });
  }

  const button = await prisma.cardButton.findUnique({ where: { id: buttonId } });
  if (!button || button.cardId !== cardId) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const card = await prisma.card.findUnique({ where: { id: cardId } });
  if (!card || card.userId !== session.user.id) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  await prisma.cardButton.delete({ where: { id: buttonId } });
  return NextResponse.json({ success: true });
}
