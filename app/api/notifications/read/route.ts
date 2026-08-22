import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth/config";

export async function PATCH(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { notificationIds, markAll } = body;

  if (markAll) {
    await prisma.notification.updateMany({
      where: { userId: session.user.id, read: false },
      data: { read: true },
    });
  } else if (Array.isArray(notificationIds)) {
    await prisma.notification.updateMany({
      where: { id: { in: notificationIds }, userId: session.user.id },
      data: { read: true },
    });
  }

  return NextResponse.json({ success: true });
}
