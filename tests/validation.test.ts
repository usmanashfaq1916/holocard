import { describe, it, expect } from "vitest";

describe("Validation Schemas", () => {
  it("loginSchema validates correct input", async () => {
    const { loginSchema } = await import("@/lib/validation");
    const result = loginSchema.safeParse({
      email: "test@example.com",
      password: "password123",
    });
    expect(result.success).toBe(true);
  });

  it("loginSchema rejects invalid email", async () => {
    const { loginSchema } = await import("@/lib/validation");
    const result = loginSchema.safeParse({
      email: "not-an-email",
      password: "password123",
    });
    expect(result.success).toBe(false);
  });

  it("registerSchema requires password confirmation", async () => {
    const { registerSchema } = await import("@/lib/validation");
    const result = registerSchema.safeParse({
      name: "John",
      email: "test@example.com",
      password: "password123",
      confirmPassword: "different",
    });
    expect(result.success).toBe(false);
  });

  it("registerSchema accepts matching passwords", async () => {
    const { registerSchema } = await import("@/lib/validation");
    const result = registerSchema.safeParse({
      name: "John",
      email: "test@example.com",
      password: "password123",
      confirmPassword: "password123",
    });
    expect(result.success).toBe(true);
  });

  it("cardSchema requires name and slug", async () => {
    const { cardSchema } = await import("@/lib/validation");
    const result = cardSchema.safeParse({});
    expect(result.success).toBe(false);
  });

  it("cardSchema validates correct card data", async () => {
    const { cardSchema } = await import("@/lib/validation");
    const result = cardSchema.safeParse({
      name: "My Card",
      slug: "my-card",
    });
    expect(result.success).toBe(true);
  });

  it("cardSchema rejects invalid slug format", async () => {
    const { cardSchema } = await import("@/lib/validation");
    const result = cardSchema.safeParse({
      name: "My Card",
      slug: "My Card With Spaces!",
    });
    expect(result.success).toBe(false);
  });
});
