import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth/config";
import { prisma } from "@/lib/db";
import { getStorage } from "@/lib/storage";
import { extractStorageKey } from "@/lib/storage/key";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const target = await prisma.aRTarget.findUnique({
      where: { id },
      include: { experience: { include: { card: { select: { slug: true, name: true, userId: true } } } } },
    });

    if (!target || target.experience.card.userId !== session.user.id) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json(target);
  } catch (error) {
    console.error("Target get error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const target = await prisma.aRTarget.findUnique({
      where: { id },
      include: { experience: { include: { card: true } } },
    });

    if (!target) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    if (target.experience.card.userId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const storage = await getStorage();

    if (target.mindFileUrl) {
      const mindKey = extractStorageKey(target.mindFileUrl);
      if (mindKey) {
        try { await storage.delete(mindKey); } catch { /* continue */ }
      }
    }

    if (target.imageUrl) {
      const imgKey = extractStorageKey(target.imageUrl);
      if (imgKey) {
        try { await storage.delete(imgKey); } catch { /* continue */ }
      }
    }

    await prisma.aRTarget.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Target delete error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
