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
  const asset = await prisma.aRAsset.findUnique({ where: { id } });

  if (!asset || asset.userId !== session.user.id) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  await prisma.aRAsset.delete({ where: { id } });

  return NextResponse.json({ success: true });
}
