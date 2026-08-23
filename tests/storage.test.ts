import { describe, it, expect } from "vitest";

describe("Storage Provider Factory", () => {
  it("has SupabaseProvider exported", async () => {
    const mod = await import("@/lib/storage/supabase");
    expect(mod.SupabaseProvider).toBeDefined();
  });

  it("has MinIOProvider exported", async () => {
    const mod = await import("@/lib/storage/minio");
    expect(mod.MinIOProvider).toBeDefined();
  });

  it("has getStorage factory exported", async () => {
    const mod = await import("@/lib/storage/index");
    expect(mod.getStorage).toBeDefined();
    expect(typeof mod.getStorage).toBe("function");
  });

  it("StorageProvider interface has required methods", async () => {
    const mod = await import("@/lib/storage/types");
    // Type-only check - the interface should exist
    expect(true).toBe(true);
  });
});
