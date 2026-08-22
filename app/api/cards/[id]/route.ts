import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth/config";
import { cardSchema } from "@/lib/validation";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(_req: Request, { params }: RouteParams) {
  const { id } = await params;
  const card = await prisma.card.findUnique({
    where: { id },
    include: { socialLinks: { orderBy: { order: "asc" } } },
  });

  if (!card) {
    return NextResponse.json({ error: "Card not found" }, { status: 404 });
  }

  return NextResponse.json(card);
}

export async function POST(req: Request, { params }: RouteParams) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const card = await prisma.card.findUnique({
    where: { id },
    include: { socialLinks: true, buttons: true },
  });

  if (!card || card.userId !== session.user.id) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const body = await req.json().catch(() => ({}));
  if (body.action !== "duplicate") {
    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  }

  let newSlug = `${card.slug}-copy`;
  const existing = await prisma.card.findUnique({ where: { slug: newSlug } });
  if (existing) {
    newSlug = `${card.slug}-copy-${Date.now()}`;
  }

  const duplicated = await prisma.card.create({
    data: {
      userId: session.user.id,
      slug: newSlug,
      name: `${card.name} (Copy)`,
      designation: card.designation,
      company: card.company,
      bio: card.bio,
      phone: card.phone,
      email: card.email,
      website: card.website,
      whatsapp: card.whatsapp,
      linkedin: card.linkedin,
      facebook: card.facebook,
      instagram: card.instagram,
      twitter: card.twitter,
      location: card.location,
      profileImage: card.profileImage,
      companyLogo: card.companyLogo,
      status: "DRAFT",
      isPublic: card.isPublic,
      visibility: card.visibility,
      accentColor: card.accentColor,
      bgStyle: card.bgStyle,
      bgImage: card.bgImage,
      fontFamily: card.fontFamily,
      cardStyle: card.cardStyle,
      metaTitle: card.metaTitle,
      metaDescription: card.metaDescription,
      ogImage: card.ogImage,
      allowIndexing: card.allowIndexing,
      templateId: card.templateId,
      themeConfig: card.themeConfig ?? undefined,
      socialLinks: {
        create: card.socialLinks.map((sl) => ({
          platform: sl.platform,
          url: sl.url,
          label: sl.label,
          icon: sl.icon,
          order: sl.order,
        })),
      },
      buttons: {
        create: card.buttons.map((btn) => ({
          label: btn.label,
          icon: btn.icon,
          url: btn.url,
          order: btn.order,
          isActive: btn.isActive,
        })),
      },
    },
    include: { socialLinks: true, buttons: true },
  });

  return NextResponse.json(duplicated);
}

export async function PATCH(req: Request, { params }: RouteParams) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const card = await prisma.card.findUnique({ where: { id } });

  if (!card || card.userId !== session.user.id) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const body = await req.json();
  const result = cardSchema.partial().safeParse(body);

  if (!result.success) {
    return NextResponse.json(
      { error: result.error.issues[0].message },
      { status: 400 }
    );
  }

  if (result.data.slug && result.data.slug !== card.slug) {
    const existing = await prisma.card.findUnique({
      where: { slug: result.data.slug },
    });
    if (existing) {
      return NextResponse.json(
        { error: "This slug is already taken" },
        { status: 409 }
      );
    }
  }

  const updated = await prisma.card.update({
    where: { id },
    data: result.data,
  });

  return NextResponse.json(updated);
}

export async function DELETE(_req: Request, { params }: RouteParams) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const card = await prisma.card.findUnique({ where: { id } });

  if (!card || card.userId !== session.user.id) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  await prisma.card.delete({ where: { id } });

  return NextResponse.json({ success: true });
}
