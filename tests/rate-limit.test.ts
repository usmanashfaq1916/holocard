import { describe, it, expect, vi } from "vitest";

vi.mock("@/lib/db", () => ({
  prisma: {
    rateLimit: {
      findUnique: vi.fn(),
      upsert: vi.fn(),
      update: vi.fn(),
    },
  },
}));

import { checkRateLimit } from "@/lib/rate-limit";
import { prisma } from "@/lib/db";

describe("Rate Limiter", () => {
  it("allows requests within limit", async () => {
    vi.mocked(prisma.rateLimit.findUnique).mockResolvedValue(null);
    vi.mocked(prisma.rateLimit.upsert).mockResolvedValue({} as never);

    const result = await checkRateLimit("test-key-1", 5, 60000);
    expect(result.allowed).toBe(true);
    expect(result.remaining).toBe(4);
  });

  it("blocks requests over limit", async () => {
    vi.mocked(prisma.rateLimit.findUnique).mockResolvedValue({
      id: "1",
      key: "test-key-block",
      count: 5,
      resetAt: new Date(Date.now() + 60000),
      createdAt: new Date(),
    });

    const result = await checkRateLimit("test-key-block", 5, 60000);
    expect(result.allowed).toBe(false);
    expect(result.remaining).toBe(0);
  });

  it("resets after window expires", async () => {
    vi.mocked(prisma.rateLimit.findUnique).mockResolvedValue({
      id: "2",
      key: "test-key-reset",
      count: 2,
      resetAt: new Date(Date.now() - 1000),
      createdAt: new Date(),
    });
    vi.mocked(prisma.rateLimit.upsert).mockResolvedValue({} as never);

    const result = await checkRateLimit("test-key-reset", 2, 60000);
    expect(result.allowed).toBe(true);
  });
});
