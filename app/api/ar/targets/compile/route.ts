import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth/config";
import { prisma } from "@/lib/db";
import { compileTarget } from "@/lib/ar/target-compiler";
import { getStorage } from "@/lib/storage";

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { targetId } = await request.json();
    if (!targetId) {
      return NextResponse.json({ error: "targetId required" }, { status: 400 });
    }

    const target = await prisma.aRTarget.findUnique({
      where: { id: targetId },
      include: { experience: { include: { card: true } } },
    });

    if (!target) {
      return NextResponse.json({ error: "Target not found" }, { status: 404 });
    }

    if (target.experience.card.userId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await prisma.aRTarget.update({
      where: { id: targetId },
      data: { status: "COMPILING" },
    });

    const imageResponse = await fetch(target.imageUrl);
    const imageBlob = await imageResponse.blob();
    const file = new File([imageBlob], "target.png", { type: "image/png" });

    const result = await compileTarget(file);

    const storage = await getStorage();
    const mindFileName = `targets/${session.user.id}/${targetId}.mind`;
    const uploadResult = await storage.upload(mindFileName, Buffer.from(result.buffer), "application/octet-stream");

    await prisma.aRTarget.update({
      where: { id: targetId },
      data: {
        mindFileUrl: uploadResult.url,
        quality: result.quality.rating,
        featureCount: result.quality.featureCount,
        status: "READY",
        metadata: {
          score: result.quality.score,
          recommendations: result.quality.recommendations,
          trackingFeatures: result.quality.trackingFeatureCount,
        },
      },
    });

    return NextResponse.json({
      id: targetId,
      status: "READY",
      quality: result.quality,
      mindFileUrl: uploadResult.url,
    });
  } catch (error) {
    console.error("Target compile error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
