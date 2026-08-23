import { describe, it, expect, vi } from "vitest";

describe("Sharing Utilities", () => {
  it("has shareCard function", async () => {
    const mod = await import("@/lib/sharing");
    expect(typeof mod.shareCard).toBe("function");
  });

  it("has copyToClipboard function", async () => {
    const mod = await import("@/lib/sharing");
    expect(typeof mod.copyToClipboard).toBe("function");
  });

  it("has shareViaWhatsApp function", async () => {
    const mod = await import("@/lib/sharing");
    expect(typeof mod.shareViaWhatsApp).toBe("function");
  });

  it("has shareViaEmail function", async () => {
    const mod = await import("@/lib/sharing");
    expect(typeof mod.shareViaEmail).toBe("function");
  });

  it("has downloadVCard function", async () => {
    const mod = await import("@/lib/sharing");
    expect(typeof mod.downloadVCard).toBe("function");
  });

  it("downloadVCard generates valid vCard format", async () => {
    const { downloadVCard } = await import("@/lib/sharing");
    const mockClick = vi.fn();
    const mockRevokeObjectURL = vi.fn();
    const mockCreateObjectURL = vi.fn(() => "blob:mock");

    vi.stubGlobal("URL", {
      createObjectURL: mockCreateObjectURL,
      revokeObjectURL: mockRevokeObjectURL,
    });

    const originalCreateElement = document.createElement.bind(document);
    document.createElement = vi.fn((tag: string) => {
      if (tag === "a") {
        return { href: "", download: "", click: mockClick } as any;
      }
      return originalCreateElement(tag);
    });

    downloadVCard({
      name: "John Doe",
      designation: "Engineer",
      company: "Acme",
      phone: "+1234567890",
      email: "john@example.com",
      website: "https://example.com",
    });

    expect(mockCreateObjectURL).toHaveBeenCalled();
    expect(mockClick).toHaveBeenCalled();

    vi.restoreAllMocks();
  });
});
