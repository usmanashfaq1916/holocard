import { NextResponse } from "next/server";
import { auth } from "@/lib/auth/config";
import { getStorage } from "@/lib/storage";
import { prisma } from "@/lib/db";

const ALLOWED_MIME_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
  "model/gltf-binary",
  "model/gltf+json",
  "video/mp4",
]);

const MAX_FILE_SIZE = 50 * 1024 * 1024;

const MAGIC_BYTES: Record<string, number[][]> = {
  "image/jpeg": [[0xff, 0xd8, 0xff]],
  "image/png": [[0x89, 0x50, 0x4e, 0x47]],
  "image/gif": [[0x47, 0x49, 0x46, 0x38]],
  "image/webp": [[0x52, 0x49, 0x46, 0x46]],
  "model/gltf-binary": [[0x67, 0x6c, 0x54, 0x46]],
  "video/mp4": [[0x00, 0x00, 0x00]],
};

function verifyFileType(buffer: Buffer, claimedType: string): boolean {
  const signatures = MAGIC_BYTES[claimedType];
  if (!signatures) return true;
  return signatures.some((sig) =>
    sig.every((byte, i) => buffer[i] === byte)
  );
}

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

  if (!ALLOWED_MIME_TYPES.has(file.type)) {
    return NextResponse.json(
      { error: `File type ${file.type} is not allowed. Allowed: JPEG, PNG, GIF, WebP, GLB, GLTF, MP4.` },
      { status: 400 }
    );
  }

  if (file.size > MAX_FILE_SIZE) {
    return NextResponse.json(
      { error: `File size ${(file.size / 1024 / 1024).toFixed(1)}MB exceeds 50MB limit.` },
      { status: 400 }
    );
  }

  const ext = file.name.split(".").pop() || "bin";
  const timestamp = Date.now();
  const key = `${session.user.id}/${purpose}/${timestamp}.${ext}`;

  const buffer = Buffer.from(await file.arrayBuffer());

  if (!verifyFileType(buffer, file.type)) {
    return NextResponse.json(
      { error: "File content does not match declared type. Upload the actual file." },
      { status: 400 }
    );
  }

  const storage = await getStorage();

  try {
    const result = await storage.upload(key, buffer, file.type);

    const mediaType = purpose === "model" ? "MODEL_3D" : purpose === "ar-target" ? "AR_TARGET" : "IMAGE";

    const media = await prisma.media.create({
      data: {
        userId: session.user.id,
        cardId: cardId || null,
        type: mediaType,
        filename: file.name,
        url: result.url,
        size: file.size,
        mimeType: file.type,
      },
    });

    return NextResponse.json(
      {
        id: media.id,
        url: result.url,
        key: result.key,
        filename: file.name,
        mimeType: file.type,
        size: file.size,
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: `Upload failed: ${error instanceof Error ? error.message : "Unknown error"}` },
      { status: 500 }
    );
  }
}
