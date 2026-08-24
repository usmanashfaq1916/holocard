import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth/config";
import { prisma } from "@/lib/db";
import { validateTargetFile, validateTargetImage } from "@/lib/ar/target-compiler";
import { getStorage } from "@/lib/storage";

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

    const storage = await getStorage();
    const result = await storage.upload(fileName, buffer, file.type);

    const experience = experienceId
      ? await prisma.aRExperience.findFirst({
          where: { id: experienceId, card: { userId: session.user.id } },
        })
      : null;

    if (!experience) {
      return NextResponse.json(
        { error: "Missing or invalid experienceId" },
        { status: 400 }
      );
    }

    const target = await prisma.aRTarget.create({
      data: {
        experienceId: experience.id,
        imageUrl: result.url,
        status: "PENDING",
        dimensions: {
          width: imageValidation.width,
          height: imageValidation.height,
        },
      },
    });

    return NextResponse.json({
      id: target.id,
      imageUrl: result.url,
      dimensions: {
        width: imageValidation.width,
        height: imageValidation.height,
      },
    });
  } catch (error) {
    console.error("Target upload error:", error);
    return NextResponse.json(
      { error: `Upload failed: ${error instanceof Error ? error.message : "Internal server error"}` },
      { status: 500 }
    );
  }
}
