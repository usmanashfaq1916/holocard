import { describe, it, expect } from "vitest";

describe("Notify Utility", () => {
  it("has createNotification function", async () => {
    const mod = await import("@/lib/notify");
    expect(typeof mod.createNotification).toBe("function");
  });
});

describe("Lazy Imports", () => {
  it("exports LazyARModelViewer", async () => {
    const mod = await import("@/lib/lazy-imports");
    expect(mod.LazyARModelViewer).toBeDefined();
  });

  it("exports LazyAnalyticsCharts", async () => {
    const mod = await import("@/lib/lazy-imports");
    expect(mod.LazyAnalyticsCharts).toBeDefined();
  });

  it("exports LazyCardEditor", async () => {
    const mod = await import("@/lib/lazy-imports");
    expect(mod.LazyCardEditor).toBeDefined();
  });
});

describe("Utils", () => {
  it("cn merges classes correctly", async () => {
    const { cn } = await import("@/lib/utils");
    expect(cn("text-red-500", "text-blue-500")).toBe("text-blue-500");
    expect(cn("foo", undefined, "bar")).toBe("foo bar");
  });
});
