import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth/config";
import { prisma } from "@/lib/db";
import { compileTarget } from "@/lib/ar/target-compiler";
import { createClient } from "@supabase/supabase-js";

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

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

    const supabase = getSupabase();
    const mindFileName = `targets/${session.user.id}/${targetId}.mind`;
    const { error: uploadError } = await supabase.storage
      .from("holocard")
      .upload(mindFileName, result.buffer, {
        contentType: "application/octet-stream",
        upsert: true,
      });

    if (uploadError) {
      await prisma.aRTarget.update({
        where: { id: targetId },
        data: { status: "FAILED" },
      });
      return NextResponse.json({ error: "Failed to store compiled target" }, { status: 500 });
    }

    const { data: mindUrlData } = supabase.storage
      .from("holocard")
      .getPublicUrl(mindFileName);

    await prisma.aRTarget.update({
      where: { id: targetId },
      data: {
        mindFileUrl: mindUrlData.publicUrl,
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
      mindFileUrl: mindUrlData.publicUrl,
    });
  } catch (error) {
    console.error("Target compile error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
