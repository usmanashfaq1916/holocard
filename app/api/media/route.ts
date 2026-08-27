import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth/config";
import { getStorage } from "@/lib/storage";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const media = await prisma.media.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(media);
}

export async function DELETE(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const mediaId = searchParams.get("id");

  if (!mediaId) {
    return NextResponse.json({ error: "Media ID required" }, { status: 400 });
  }

  const media = await prisma.media.findUnique({ where: { id: mediaId } });
  if (!media || media.userId !== session.user.id) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  try {
    const storage = await getStorage();
    const url = media.url;
    const bucketPrefix = process.env.STORAGE_DRIVER === "minio"
      ? `${process.env.MINIO_BUCKET || "holocard"}/`
      : "holocard-uploads/";

    const keyMatch = url.split(bucketPrefix);
    if (keyMatch.length > 1) {
      await storage.delete(keyMatch[1]);
    }
  } catch {
    // Continue even if storage delete fails
  }

  await prisma.media.delete({ where: { id: mediaId } });

  return NextResponse.json({ success: true });
}

export async function PATCH(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const mediaId = searchParams.get("id");

  if (!mediaId) {
    return NextResponse.json({ error: "Media ID required" }, { status: 400 });
  }

  const media = await prisma.media.findUnique({ where: { id: mediaId } });
  if (!media || media.userId !== session.user.id) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const body = await req.json().catch(() => ({}));

  const data: { filename?: string; cardId?: string } = {};

  if (body.filename !== undefined) {
    if (typeof body.filename !== "string" || !body.filename.trim()) {
      return NextResponse.json({ error: "Filename must be a non-empty string" }, { status: 400 });
    }
    data.filename = body.filename.trim();
  }

  if (body.cardId !== undefined) {
    if (typeof body.cardId !== "string") {
      return NextResponse.json({ error: "cardId must be a string" }, { status: 400 });
    }
    data.cardId = body.cardId || null;
  }

  if (Object.keys(data).length === 0) {
    return NextResponse.json({ error: "No valid fields to update" }, { status: 400 });
  }

  const updated = await prisma.media.update({
    where: { id: mediaId },
    data,
  });

  return NextResponse.json(updated);
}
