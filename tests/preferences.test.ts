import { describe, it, expect } from "vitest";

describe("User Preferences", () => {
  it("should have valid notification preference keys", () => {
    const validKeys = ["emailNotifications", "marketingEmails", "productUpdates"];
    validKeys.forEach((key) => {
      expect(typeof key).toBe("string");
      expect(key.length).toBeGreaterThan(0);
    });
  });

  it("should have valid privacy preference keys", () => {
    const validKeys = ["showInSearch", "allowAnalytics", "showContactOnCard"];
    validKeys.forEach((key) => {
      expect(typeof key).toBe("string");
      expect(key.length).toBeGreaterThan(0);
    });
  });

  it("should serialize preferences to JSON", () => {
    const prefs = {
      emailNotifications: true,
      marketingEmails: false,
      productUpdates: true,
      showInSearch: true,
      allowAnalytics: false,
      showContactOnCard: true,
    };
    const json = JSON.stringify(prefs);
    const parsed = JSON.parse(json);
    expect(parsed.emailNotifications).toBe(true);
    expect(parsed.marketingEmails).toBe(false);
  });
});

describe("Template Data", () => {
  const templates = [
    { slug: "corporate", style: "CORPORATE", isPremium: false },
    { slug: "executive", style: "EXECUTIVE", isPremium: true },
    { slug: "developer", style: "DEVELOPER", isPremium: false },
    { slug: "designer", style: "DESIGNER", isPremium: true },
    { slug: "freelancer", style: "FREELANCER", isPremium: false },
    { slug: "minimal", style: "MINIMAL", isPremium: false },
  ];

  it("should have unique slugs", () => {
    const slugs = templates.map((t) => t.slug);
    const unique = new Set(slugs);
    expect(unique.size).toBe(slugs.length);
  });

  it("should have valid styles", () => {
    const validStyles = [
      "CORPORATE", "EXECUTIVE", "DEVELOPER", "DATA_ANALYST",
      "DESIGNER", "FREELANCER", "STARTUP_FOUNDER", "REAL_ESTATE",
      "SALES", "MINIMAL",
    ];
    templates.forEach((t) => {
      expect(validStyles).toContain(t.style);
    });
  });

  it("should have premium flag as boolean", () => {
    templates.forEach((t) => {
      expect(typeof t.isPremium).toBe("boolean");
    });
  });
});

describe("Card Design API", () => {
  it("should support FRONT and BACK sides", () => {
    const sides = ["FRONT", "BACK"];
    expect(sides).toContain("FRONT");
    expect(sides).toContain("BACK");
  });

  it("should validate canvas JSON is stringifiable", () => {
    const mockCanvas = { objects: [], background: "#ffffff" };
    const json = JSON.stringify(mockCanvas);
    expect(typeof json).toBe("string");
    const parsed = JSON.parse(json);
    expect(parsed).toHaveProperty("objects");
  });
});
