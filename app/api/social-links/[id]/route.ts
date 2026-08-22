import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth/config";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function DELETE(_req: Request, { params }: RouteParams) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const link = await prisma.socialLink.findUnique({
    where: { id },
    include: { card: true },
  });

  if (!link || link.card.userId !== session.user.id) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  await prisma.socialLink.delete({ where: { id } });

  return NextResponse.json({ success: true });
}

export async function PATCH(req: Request, { params }: RouteParams) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const link = await prisma.socialLink.findUnique({
    where: { id },
    include: { card: true },
  });

  if (!link || link.card.userId !== session.user.id) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const body = await req.json();
  const updated = await prisma.socialLink.update({
    where: { id },
    data: {
      platform: body.platform ?? link.platform,
      url: body.url ?? link.url,
      label: body.label ?? link.label,
      order: body.order ?? link.order,
    },
  });

  return NextResponse.json(updated);
}
