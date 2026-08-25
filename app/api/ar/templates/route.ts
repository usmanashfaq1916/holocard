import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth/config";
import { prisma } from "@/lib/db";
import { AR_TEMPLATES } from "@/lib/ar/experience-templates";

export async function GET(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const url = new URL(request.url);
  const templateId = url.searchParams.get("id");

  if (templateId) {
    const template = AR_TEMPLATES.find((t) => t.id === templateId);
    if (!template) {
      return NextResponse.json({ error: "Template not found" }, { status: 404 });
    }
    return NextResponse.json(template);
  }

  return NextResponse.json(AR_TEMPLATES);
}

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { cardId, templateId } = await request.json();

  if (!cardId || !templateId) {
    return NextResponse.json({ error: "cardId and templateId required" }, { status: 400 });
  }

  const card = await prisma.card.findFirst({
    where: { id: cardId, userId: session.user.id },
  });
  if (!card) {
    return NextResponse.json({ error: "Card not found" }, { status: 404 });
  }

  const template = AR_TEMPLATES.find((t) => t.id === templateId);
  if (!template) {
    return NextResponse.json({ error: "Template not found" }, { status: 404 });
  }

  // Create or get experience
  let experience = await prisma.aRExperience.findFirst({ where: { cardId } });
  if (!experience) {
    experience = await prisma.aRExperience.create({
      data: {
        cardId,
        name: `${card.name} - ${template.name}`,
        templateType: "CORPORATE_INTRO",
      },
    });
  }

  // Replace scenes with template scenes
  await prisma.aRScene.deleteMany({ where: { experienceId: experience.id } });

  for (let i = 0; i < template.scenes.length; i++) {
    const sceneTemplate = template.scenes[i];
    const scene = await prisma.aRScene.create({
      data: {
        experienceId: experience.id,
        name: sceneTemplate.name,
        order: i,
        duration: sceneTemplate.duration,
        transitionType: sceneTemplate.transitionType as "NONE" | "FADE" | "SLIDE" | "SCALE",
      },
    });

    for (const elTemplate of sceneTemplate.elements) {
      const createData: Record<string, unknown> = {
        sceneId: scene.id,
        type: elTemplate.type,
        position: elTemplate.position,
        rotation: elTemplate.rotation,
        scale: elTemplate.scale,
        visible: elTemplate.visible,
        metadata: elTemplate.metadata || {},
        order: elTemplate.order,
      };

      if (elTemplate.actions?.length) {
        createData.actions = {
          create: elTemplate.actions.map((a) => ({
            type: a.type,
            payload: a.payload || {},
            label: a.label,
            order: a.order,
          })),
        };
      }

      await prisma.aRElement.create({ data: createData as never });
    }
  }

  return NextResponse.json({ experience, template: template.name });
}
