import { describe, it, expect } from "vitest";
import { canCreateCard, canUsePremiumTemplates, PLANS } from "@/lib/plans";

describe("Plans", () => {
  it("FREE allows 1 card", () => {
    expect(canCreateCard(0, "FREE")).toBe(true);
    expect(canCreateCard(1, "FREE")).toBe(false);
  });

  it("PRO allows 5 cards", () => {
    expect(canCreateCard(4, "PRO")).toBe(true);
    expect(canCreateCard(5, "PRO")).toBe(false);
  });

  it("BUSINESS allows unlimited cards", () => {
    expect(canCreateCard(100, "BUSINESS")).toBe(true);
  });

  it("FREE cannot use premium templates", () => {
    expect(canUsePremiumTemplates("FREE")).toBe(false);
  });

  it("PRO can use premium templates", () => {
    expect(canUsePremiumTemplates("PRO")).toBe(true);
  });

  it("BUSINESS can use premium templates", () => {
    expect(canUsePremiumTemplates("BUSINESS")).toBe(true);
  });

  it("has correct plan configs", () => {
    expect(PLANS.FREE.maxCards).toBe(1);
    expect(PLANS.PRO.maxCards).toBe(5);
    expect(PLANS.BUSINESS.maxCards).toBe(-1);
  });
});
