import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth/config";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const assets = await prisma.aRAsset.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(assets);
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { name, type, fileUrl, fileSize, mimeType, cardId, metadata } = body;

  if (!name || !type || !fileUrl) {
    return NextResponse.json(
      { error: "name, type, and fileUrl are required" },
      { status: 400 }
    );
  }

  const allowedTypes = ["glb", "gltf", "image-target", "png", "jpg", "jpeg", "mp4"];
  if (!allowedTypes.includes(type)) {
    return NextResponse.json(
      { error: `Invalid type. Allowed: ${allowedTypes.join(", ")}` },
      { status: 400 }
    );
  }

  const maxSize = 50 * 1024 * 1024; // 50MB
  if (fileSize && fileSize > maxSize) {
    return NextResponse.json(
      { error: "File size must be under 50MB" },
      { status: 400 }
    );
  }

  const asset = await prisma.aRAsset.create({
    data: {
      userId: session.user.id,
      cardId: cardId || null,
      name,
      type,
      fileUrl,
      fileSize: fileSize || null,
      mimeType: mimeType || null,
      metadata: metadata || null,
    },
  });

  return NextResponse.json(asset, { status: 201 });
}
