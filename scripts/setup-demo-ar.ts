import { prisma } from "@/lib/db";
import type { Prisma } from "@prisma/client";

const SLUG = "demo";

async function main() {
  console.log("Setting up demo1.jpg AR experience...");

  const owner = await prisma.user.findUnique({ where: { email: "usman@demo.com" } });
  if (!owner) {
    throw new Error("Demo user not found. Run `pnpm run db:seed` first.");
  }

  const card = await prisma.card.upsert({
    where: { slug: SLUG },
    update: {
      status: "ACTIVE",
      visibility: "PUBLIC",
      isPublic: true,
      name: "Demo Card",
      designation: "Augmented Reality",
      company: "HoloCard",
    },
    create: {
      userId: owner.id,
      slug: SLUG,
      name: "Demo Card",
      designation: "Augmented Reality",
      company: "HoloCard",
      bio: "Scan my card to see it come alive in augmented reality.",
      email: "hello@holocard.demo",
      phone: "+15550100",
      whatsapp: "+15550100",
      linkedin: "https://www.linkedin.com/company/holocard",
      website: "https://holocard-fawn.vercel.app",
      status: "ACTIVE",
      cardType: "PROFESSIONAL",
    },
  });
  console.log("Card ready:", card.slug);

  const experience = await prisma.aRExperience.upsert({
    where: { cardId: card.id },
    update: {},
    create: {
      cardId: card.id,
      name: "Demo1 AR Experience",
      templateType: "PERSONAL_BRAND",
      status: "DRAFT",
    },
  });

  await prisma.aRAction.deleteMany({
    where: { element: { scene: { experienceId: experience.id } } },
  });
  await prisma.aRElement.deleteMany({
    where: { scene: { experienceId: experience.id } },
  });
  await prisma.aRScene.deleteMany({ where: { experienceId: experience.id } });
  await prisma.aRTarget.deleteMany({ where: { experienceId: experience.id } });

  const target = await prisma.aRTarget.create({
    data: {
      experienceId: experience.id,
      imageUrl: "/demo1.jpg",
      mindFileUrl: "/targets/demo1.mind",
      status: "READY",
      quality: "PRECOMPILED",
      dimensions: { width: 4167, height: 4167 },
      metadata: {
        source: "public/demo1.jpg",
        compiledOffline: true,
        note: "Compiled via browser MindAR compiler (Node lacks Image API)",
      },
    },
  });
  console.log("Target ready:", target.mindFileUrl);

  const scene = await prisma.aRScene.create({
    data: {
      experienceId: experience.id,
      name: "Main Scene",
      order: 0,
      duration: 10,
      transitionType: "FADE",
    },
  });

  type ElementSeed = {
    type: "THREE_D" | "VIDEO" | "TEXT" | "BUTTON";
    assetUrl?: string;
    position: { x: number; y: number; z: number };
    rotation?: { x: number; y: number; z: number };
    scale?: { x: number; y: number; z: number };
    metadata?: Prisma.InputJsonValue;
    action?: {
      type:
        | "OPEN_PHONE"
        | "OPEN_EMAIL"
        | "OPEN_LINKEDIN"
        | "OPEN_WHATSAPP"
        | "OPEN_URL";
      payload: Prisma.InputJsonValue;
      label: string;
    };
  };

  const elementSeeds: ElementSeed[] = [
    {
      type: "THREE_D",
      position: { x: 0, y: 0.85, z: 0.05 },
      scale: { x: 1.2, y: 1.2, z: 1.2 },
      metadata: { shape: "icosahedron", color: "#059669", spinSpeed: 1.0 },
    },
    {
      type: "THREE_D",
      position: { x: 0, y: -0.18, z: 0.02 },
      scale: { x: 1, y: 1, z: 0.06 },
      metadata: { shape: "box", color: "#2D2520", spinSpeed: 0 },
    },
    {
      type: "TEXT",
      position: { x: 0, y: -0.12, z: 0.05 },
      metadata: { text: "Demo Card", fontSize: 0.12, color: "#FFFFFF" },
    },
    {
      type: "TEXT",
      position: { x: 0, y: -0.26, z: 0.05 },
      metadata: {
        text: "Augmented Reality Experience",
        fontSize: 0.07,
        color: "#6EE7B7",
      },
    },
    {
      type: "VIDEO",
      assetUrl: "/videos/holo-loop.mp4",
      position: { x: -0.55, y: 0.35, z: 0.04 },
      scale: { x: 0.6, y: 0.6, z: 1 },
    },
    {
      type: "BUTTON",
      position: { x: -0.74, y: -0.62, z: 0.05 },
      scale: { x: 0.6, y: 0.6, z: 1 },
      metadata: { label: "Call", bgColor: "#16A34A" },
      action: { type: "OPEN_PHONE", payload: { url: "tel:+15550100" }, label: "Call" },
    },
    {
      type: "BUTTON",
      position: { x: -0.37, y: -0.62, z: 0.05 },
      scale: { x: 0.6, y: 0.6, z: 1 },
      metadata: { label: "Email", bgColor: "#059669" },
      action: {
        type: "OPEN_EMAIL",
        payload: { url: "mailto:hello@holocard.demo" },
        label: "Email",
      },
    },
    {
      type: "BUTTON",
      position: { x: 0, y: -0.62, z: 0.05 },
      scale: { x: 0.6, y: 0.6, z: 1 },
      metadata: { label: "LinkedIn", bgColor: "#0A66C2" },
      action: {
        type: "OPEN_LINKEDIN",
        payload: { url: "https://www.linkedin.com/company/holocard" },
        label: "LinkedIn",
      },
    },
    {
      type: "BUTTON",
      position: { x: 0.37, y: -0.62, z: 0.05 },
      scale: { x: 0.6, y: 0.6, z: 1 },
      metadata: { label: "WhatsApp", bgColor: "#25D366" },
      action: {
        type: "OPEN_WHATSAPP",
        payload: { url: "https://wa.me/15550100" },
        label: "WhatsApp",
      },
    },
    {
      type: "BUTTON",
      position: { x: 0.74, y: -0.62, z: 0.05 },
      scale: { x: 0.6, y: 0.6, z: 1 },
      metadata: { label: "Website", bgColor: "#0D9488" },
      action: {
        type: "OPEN_URL",
        payload: { url: "https://holocard-fawn.vercel.app" },
        label: "Website",
      },
    },
  ];

  for (let i = 0; i < elementSeeds.length; i++) {
    const seed = elementSeeds[i];
    const element = await prisma.aRElement.create({
      data: {
        sceneId: scene.id,
        type: seed.type,
        assetUrl: seed.assetUrl,
        position: seed.position,
        rotation: seed.rotation || { x: 0, y: 0, z: 0 },
        scale: seed.scale || { x: 1, y: 1, z: 1 },
        visible: true,
        metadata: seed.metadata,
        order: i,
      },
    });

    if (seed.action) {
      await prisma.aRAction.create({
        data: {
          elementId: element.id,
          type: seed.action.type,
          payload: seed.action.payload,
          label: seed.action.label,
          order: 0,
        },
      });
    }
  }
  console.log(`Scene created with ${elementSeeds.length} elements`);

  await prisma.aRExperience.update({
    where: { id: experience.id },
    data: { status: "PUBLISHED", publishedAt: new Date() },
  });
  console.log("Experience PUBLISHED");

  console.log("\nDone! AR page: http://localhost:3000/ar/" + SLUG);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
