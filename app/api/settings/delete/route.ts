import { NextResponse } from "next/server";
import { auth } from "@/lib/auth/config";
import { prisma } from "@/lib/db";
import { getStorage } from "@/lib/storage";

const CONFIRMATION_TEXT = "DELETE";

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;

    const body = await request.json().catch(() => ({}));
    if (body.confirmation !== CONFIRMATION_TEXT) {
      return NextResponse.json(
        { error: "Please type DELETE to confirm" },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const storage = await getStorage();

    const mediaFiles = await prisma.media.findMany({
      where: { userId },
      select: { url: true },
    });

    const arAssets = await prisma.aRAsset.findMany({
      where: { userId },
      select: { fileUrl: true },
    });

    const cards = await prisma.card.findMany({
      where: { userId },
      select: { id: true },
    });

    const cardIds = cards.map((c) => c.id);

    const arTargets = await prisma.aRTarget.findMany({
      where: { experience: { cardId: { in: cardIds } } },
      select: { imageUrl: true, mindFileUrl: true },
    });

    const allFiles = [
      ...mediaFiles.map((f) => f.url),
      ...arAssets.map((f) => f.fileUrl),
      ...arTargets.map((f) => f.imageUrl),
      ...arTargets.filter((f) => f.mindFileUrl).map((f) => f.mindFileUrl!),
    ];

    for (const fileUrl of allFiles) {
      try {
        const bucketPrefix =
          process.env.STORAGE_DRIVER === "minio"
            ? `${process.env.MINIO_BUCKET || "holocard"}/`
            : "holocard-uploads/";
        const keyMatch = fileUrl.split(bucketPrefix);
        if (keyMatch.length > 1) {
          await storage.delete(keyMatch[1]);
        }
      } catch {
        // Continue even if storage delete fails
      }
    }

    await prisma.user.delete({ where: { id: userId } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Account deletion error:", error);
    return NextResponse.json(
      { error: "Failed to delete account. Please try again." },
      { status: 500 }
    );
  }
}
