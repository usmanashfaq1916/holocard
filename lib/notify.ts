import { prisma } from "@/lib/db";

export async function createNotification(
  userId: string,
  title: string,
  body?: string,
  type?: string,
  link?: string
) {
  return prisma.notification.create({
    data: { userId, title, body: body || null, type: type || "info", link: link || null },
  });
}
