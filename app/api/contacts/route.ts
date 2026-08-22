import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth/config";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const contacts = await prisma.contact.findMany({
    where: { card: { userId: session.user.id } },
    include: { card: { select: { name: true, slug: true } } },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(contacts);
}
