import { prisma } from "./db";

export async function checkRateLimit(
  key: string,
  maxRequests: number = 10,
  windowMs: number = 60000
): Promise<{ allowed: boolean; remaining: number }> {
  const now = new Date();
  const resetAt = new Date(now.getTime() + windowMs);

  try {
    const existing = await prisma.rateLimit.findUnique({ where: { key } });

    if (!existing || now > existing.resetAt) {
      await prisma.rateLimit.upsert({
        where: { key },
        update: { count: 1, resetAt },
        create: { key, count: 1, resetAt },
      });
      return { allowed: true, remaining: maxRequests - 1 };
    }

    if (existing.count >= maxRequests) {
      return { allowed: false, remaining: 0 };
    }

    await prisma.rateLimit.update({
      where: { key },
      data: { count: existing.count + 1 },
    });

    return { allowed: true, remaining: maxRequests - existing.count - 1 };
  } catch {
    return { allowed: true, remaining: maxRequests - 1 };
  }
}
