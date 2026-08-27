import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth/config";

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

async function uniqueSlug(base: string): Promise<string> {
  let slug = base || "my-card";
  for (let i = 0; i < 10; i++) {
    const existing = await prisma.card.findUnique({ where: { slug } });
    if (!existing) return slug;
    slug = `${base}-${i + 2}`;
  }
  return `${base}-${Date.now()}`;
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();

  try {
    if (body.name || body.company || body.designation) {
      await prisma.user.update({
        where: { id: session.user.id },
        data: {
          name: body.name || undefined,
          company: body.company || undefined,
          designation: body.designation || undefined,
        },
      });
    }

    if (body.card) {
      const existingCards = await prisma.card.count({ where: { userId: session.user.id } });
      if (existingCards === 0) {
        const baseSlug = body.card.slug || generateSlug(body.card.name || session.user.name || "my-card");
        const slug = await uniqueSlug(baseSlug);
        await prisma.card.create({
          data: {
            userId: session.user.id,
            name: body.card.name || session.user.name || "My Card",
            slug,
            designation: body.card.designation || undefined,
            company: body.card.company || undefined,
            bio: body.card.bio || undefined,
            phone: body.card.phone || undefined,
            email: body.card.email || undefined,
            website: body.card.website || undefined,
            linkedin: body.card.linkedin || undefined,
            twitter: body.card.twitter || undefined,
            status: body.publish ? "ACTIVE" : "DRAFT",
          },
        });
      }
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to save onboarding data" }, { status: 500 });
  }
}
