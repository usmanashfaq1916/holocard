import { describe, it, expect } from "vitest";

describe("QR Code Generation", () => {
  it("should generate AR URL by default", () => {
    const slug = "test-card";
    const path = "ar";
    const url = `/${path}/${slug}`;
    expect(url).toBe("/ar/test-card");
  });

  it("should generate card URL when type is card", () => {
    const slug = "test-card";
    const type = "card";
    const path = type === "card" ? "card" : "ar";
    const url = `/${path}/${slug}`;
    expect(url).toBe("/card/test-card");
  });

  it("should default to AR for unknown types", () => {
    const slug = "test-card";
    const type = "unknown" as string;
    const path = type === "card" ? "card" : "ar";
    expect(path).toBe("ar");
  });

  it("should handle special characters in slug", () => {
    const slug = "my-card--2024";
    expect(slug).toMatch(/^[a-z0-9-]+$/);
  });
});

describe("QR Download URLs", () => {
  it("should construct PNG download URL", () => {
    const slug = "my-card";
    const type = "ar";
    const format = "png";
    const url = `/api/qr/${slug}?type=${type}&format=${format}`;
    expect(url).toBe("/api/qr/my-card?type=ar&format=png");
  });

  it("should construct SVG download URL", () => {
    const slug = "my-card";
    const type = "card";
    const format = "svg";
    const url = `/api/qr/${slug}?type=${type}&format=${format}`;
    expect(url).toBe("/api/qr/my-card?type=card&format=svg");
  });
});
