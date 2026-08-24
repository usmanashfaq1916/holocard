import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth/config";
import { prisma } from "@/lib/db";

export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const experience = await prisma.aRExperience.findUnique({
      where: { id },
      include: {
        card: true,
        target: true,
        scenes: { include: { elements: true } },
      },
    });

    if (!experience) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    if (experience.card.userId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    if (!experience.target || experience.target.status !== "READY") {
      return NextResponse.json(
        { error: "Target image not ready. Upload and compile a target first." },
        { status: 400 }
      );
    }

    if (experience.scenes.length === 0) {
      return NextResponse.json(
        { error: "No scenes. Add at least one scene with elements." },
        { status: 400 }
      );
    }

    const hasElements = experience.scenes.some((s) => s.elements.length > 0);
    if (!hasElements) {
      return NextResponse.json(
        { error: "No elements. Add elements to your scenes." },
        { status: 400 }
      );
    }

    const updated = await prisma.aRExperience.update({
      where: { id },
      data: {
        status: "PUBLISHED",
        publishedAt: new Date(),
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Experience publish error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
