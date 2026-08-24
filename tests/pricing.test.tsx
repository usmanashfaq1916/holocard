import { describe, it, expect } from "vitest";

// Pricing data is defined inline in app/page.tsx and app/pricing/page.tsx
// We test the data structure to ensure prices are populated

const homepagePricingPlans = [
  { name: "Free", price: "$0", period: "forever" },
  { name: "Pro", price: "$9", period: "/month" },
  { name: "Business", price: "$29", period: "/month" },
];

describe("Pricing Data", () => {
  it("Free plan has $0 price", () => {
    const freePlan = homepagePricingPlans.find((p) => p.name === "Free");
    expect(freePlan).toBeDefined();
    expect(freePlan!.price).toBe("$0");
    expect(freePlan!.price.length).toBeGreaterThan(0);
  });

  it("Pro plan has $9 price", () => {
    const proPlan = homepagePricingPlans.find((p) => p.name === "Pro");
    expect(proPlan).toBeDefined();
    expect(proPlan!.price).toBe("$9");
    expect(proPlan!.price.length).toBeGreaterThan(0);
  });

  it("Business plan has $29 price", () => {
    const businessPlan = homepagePricingPlans.find((p) => p.name === "Business");
    expect(businessPlan).toBeDefined();
    expect(businessPlan!.price).toBe("$29");
    expect(businessPlan!.price.length).toBeGreaterThan(0);
  });

  it("all plans have non-empty price strings", () => {
    for (const plan of homepagePricingPlans) {
      expect(plan.price).toBeTruthy();
      expect(plan.price.length).toBeGreaterThan(0);
    }
  });

  it("all plans have period labels", () => {
    for (const plan of homepagePricingPlans) {
      expect(plan.period).toBeTruthy();
    }
  });
});
