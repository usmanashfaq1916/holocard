import { NextResponse } from "next/server";
import { auth } from "@/lib/auth/config";
import { getSupabase, BUCKET_NAME, validateUpload } from "@/lib/supabase";
import { prisma } from "@/lib/db";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let formData: FormData;
  try {
    formData = await req.formData();
  } catch {
    return NextResponse.json({ error: "Invalid form data" }, { status: 400 });
  }

  const file = formData.get("file") as File | null;
  const cardId = formData.get("cardId") as string | null;
  const purpose = (formData.get("purpose") as string) || "upload";

  if (!file) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  const validation = validateUpload(file);
  if (!validation.valid) {
    return NextResponse.json({ error: validation.error }, { status: 400 });
  }

  const ext = file.name.split(".").pop() || "bin";
  const timestamp = Date.now();
  const path = `${session.user.id}/${purpose}/${timestamp}.${ext}`;

  const buffer = Buffer.from(await file.arrayBuffer());

  const supabase = getSupabase();

  const { error: uploadError } = await supabase.storage
    .from(BUCKET_NAME)
    .upload(path, buffer, {
      contentType: file.type,
      upsert: false,
    });

  if (uploadError) {
    return NextResponse.json(
      { error: `Upload failed: ${uploadError.message}` },
      { status: 500 }
    );
  }

  const { data: urlData } = supabase.storage
    .from(BUCKET_NAME)
    .getPublicUrl(path);

  const media = await prisma.media.create({
    data: {
      userId: session.user.id,
      cardId: cardId || null,
      type: purpose === "model" ? "MODEL_3D" : purpose === "ar-target" ? "AR_TARGET" : "IMAGE",
      filename: file.name,
      url: urlData.publicUrl,
      size: file.size,
      mimeType: file.type,
    },
  });

  return NextResponse.json({
    id: media.id,
    url: urlData.publicUrl,
    filename: file.name,
    mimeType: file.type,
    size: file.size,
  }, { status: 201 });
}
