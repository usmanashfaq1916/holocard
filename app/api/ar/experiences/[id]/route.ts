import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth/config";
import { prisma } from "@/lib/db";

export async function GET(
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
        card: {
          select: {
            id: true,
            userId: true,
            slug: true,
            name: true,
            designation: true,
            company: true,
            bio: true,
            phone: true,
            email: true,
            website: true,
            whatsapp: true,
            linkedin: true,
            profileImage: true,
          },
        },
        target: true,
        scenes: {
          include: {
            elements: {
              include: { actions: true },
              orderBy: { order: "asc" },
            },
          },
          orderBy: { order: "asc" },
        },
      },
    });

    if (!experience || experience.card.userId !== session.user.id) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json(experience);
  } catch (error) {
    console.error("Experience get error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
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
      include: { card: true },
    });

    if (!experience) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    if (experience.card.userId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const data = await request.json();

    const updated = await prisma.aRExperience.update({
      where: { id },
      data: {
        name: data.name ?? undefined,
        templateType: data.templateType ?? undefined,
        sceneConfig: data.sceneConfig ?? undefined,
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Experience update error:", error);
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
    const experience = await prisma.aRExperience.findUnique({
      where: { id },
      include: { card: true },
    });

    if (!experience) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    if (experience.card.userId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await prisma.aRExperience.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Experience delete error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
