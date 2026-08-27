import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth/config";
import { getStorage } from "@/lib/storage";
import { extractStorageKey } from "@/lib/storage/key";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(_req: Request, { params }: RouteParams) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const media = await prisma.media.findUnique({ where: { id } });

  if (!media || media.userId !== session.user.id) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  try {
    const storage = await getStorage();
    const key = extractStorageKey(media.url);
    if (key) {
      const signedUrl = await storage.getSignedUrl(key, 3600);
      return NextResponse.json({ url: signedUrl, expiresIn: 3600 });
    }

    return NextResponse.json({ url: media.url, expiresIn: null });
  } catch {
    return NextResponse.json(
      { error: "Failed to generate signed URL" },
      { status: 500 }
    );
  }
}
