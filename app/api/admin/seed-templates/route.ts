import { NextResponse } from "next/server";
import { auth } from "@/lib/auth/config";
import { seedTemplates } from "@/lib/db/seed-templates";

export async function POST() {
  const session = await auth();
  if (!session?.user?.id || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  try {
    const result = await seedTemplates();
    return NextResponse.json({ message: "Templates seeded", ...result });
  } catch (error) {
    console.error("Seed error:", error);
    return NextResponse.json({ error: "Failed to seed templates" }, { status: 500 });
  }
}
