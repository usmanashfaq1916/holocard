import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth/config";
import { prisma } from "@/lib/db";
import { createClient } from "@supabase/supabase-js";

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const target = await prisma.aRTarget.findUnique({
      where: { id },
      include: { experience: { include: { card: { select: { slug: true, name: true } } } } },
    });

    if (!target) {
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

    const supabase = getSupabase();
    if (target.mindFileUrl) {
      const mindPath = target.mindFileUrl.split("/holocard/")[1];
      if (mindPath) {
        await supabase.storage.from("holocard").remove([mindPath]);
      }
    }

    if (target.imageUrl) {
      const imgPath = target.imageUrl.split("/holocard/")[1];
      if (imgPath) {
        await supabase.storage.from("holocard").remove([imgPath]);
      }
    }

    await prisma.aRTarget.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Target delete error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
