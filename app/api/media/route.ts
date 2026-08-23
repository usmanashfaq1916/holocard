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
    const storage = getStorage();
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
