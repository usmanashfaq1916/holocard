import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  const templates = await prisma.template.findMany({
    where: { isActive: true },
    orderBy: { order: "asc" },
  });

  return NextResponse.json(templates);
}
