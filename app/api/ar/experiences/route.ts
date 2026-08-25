import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth/config";
import { prisma } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const url = new URL(request.url);
    const cardIdFilter = url.searchParams.get("cardId");

    if (cardIdFilter) {
      const card = await prisma.card.findFirst({
        where: { id: cardIdFilter, userId: session.user.id },
      });
      if (!card) {
        return NextResponse.json({ error: "Card not found" }, { status: 404 });
      }

      const experience = await prisma.aRExperience.findUnique({
        where: { cardId: cardIdFilter },
        include: {
          card: { select: { id: true, slug: true, name: true } },
          target: true,
          scenes: {
            include: {
              elements: { include: { actions: true }, orderBy: { order: "asc" } },
            },
            orderBy: { order: "asc" },
          },
        },
      });

      return NextResponse.json(experience ? [experience] : []);
    }

    const experiences = await prisma.aRExperience.findMany({
      where: { card: { userId: session.user.id } },
      include: {
        card: { select: { id: true, slug: true, name: true } },
        target: { select: { id: true, status: true, quality: true } },
        scenes: { select: { id: true } },
      },
      orderBy: { updatedAt: "desc" },
    });

    return NextResponse.json(experiences);
  } catch (error) {
    console.error("Experiences list error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { cardId, name, templateType } = await request.json();

    if (!cardId || !name) {
      return NextResponse.json({ error: "cardId and name required" }, { status: 400 });
    }

    const card = await prisma.card.findFirst({
      where: { id: cardId, userId: session.user.id },
    });

    if (!card) {
      return NextResponse.json({ error: "Card not found" }, { status: 404 });
    }

    const existing = await prisma.aRExperience.findUnique({
      where: { cardId },
    });

    if (existing) {
      return NextResponse.json({ experience: existing, created: false }, { status: 200 });
    }

    let experience;
    try {
      experience = await prisma.aRExperience.create({
        data: {
          cardId,
          name,
          templateType: templateType || null,
        },
      });
    } catch (err: unknown) {
      if (err && typeof err === "object" && "code" in err && err.code === "P2002") {
        const raceExisting = await prisma.aRExperience.findUnique({
          where: { cardId },
        });
        if (raceExisting) {
          return NextResponse.json({ experience: raceExisting, created: false }, { status: 200 });
        }
      }
      throw err;
    }

    await prisma.aRScene.create({
      data: {
        experienceId: experience.id,
        name: "Main Scene",
        order: 0,
        duration: 5,
      },
    });

    return NextResponse.json({ experience, created: true }, { status: 201 });
  } catch (error) {
    console.error("Experience create error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
