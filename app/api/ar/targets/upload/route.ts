import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth/config";
import { prisma } from "@/lib/db";
import { validateTargetFile, validateTargetImage } from "@/lib/ar/target-compiler";
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

    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const experienceId = formData.get("experienceId") as string | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const fileValidation = validateTargetFile(file);
    if (!fileValidation.valid) {
      return NextResponse.json({ error: fileValidation.error }, { status: 400 });
    }

    const imageValidation = await validateTargetImage(file);
    if (!imageValidation.valid) {
      return NextResponse.json({ error: imageValidation.error }, { status: 400 });
    }

    const fileName = `targets/${session.user.id}/${Date.now()}-${file.name}`;
    const buffer = Buffer.from(await file.arrayBuffer());

    const supabase = getSupabase();
    const { error: uploadError } = await supabase.storage
      .from("holocard")
      .upload(fileName, buffer, { contentType: file.type });

    if (uploadError) {
      return NextResponse.json({ error: "Upload failed" }, { status: 500 });
    }

    const { data: urlData } = supabase.storage
      .from("holocard")
      .getPublicUrl(fileName);

    const experience = experienceId
      ? await prisma.aRExperience.findFirst({
          where: { id: experienceId, card: { userId: session.user.id } },
        })
      : null;

    const target = await prisma.aRTarget.create({
      data: {
        experienceId: experience?.id || "",
        imageUrl: urlData.publicUrl,
        status: "PENDING",
        dimensions: {
          width: imageValidation.width,
          height: imageValidation.height,
        },
      },
    });

    if (experience) {
      await prisma.aRTarget.update({
        where: { id: target.id },
        data: { experienceId: experience.id },
      });
    }

    return NextResponse.json({
      id: target.id,
      imageUrl: urlData.publicUrl,
      dimensions: {
        width: imageValidation.width,
        height: imageValidation.height,
      },
    });
  } catch (error) {
    console.error("Target upload error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
