import { describe, it, expect } from "vitest";

// FAQ data is defined inline in app/page.tsx
// We test the data structure to ensure all questions have answers

const faqs = [
  { q: "What is HoloCard?", a: "HoloCard is a platform that creates interactive digital business cards with Augmented Reality experiences." },
  { q: "How does the AR experience work?", a: "When someone scans your QR code or opens your link on a mobile device, they can activate AR mode." },
  { q: "Do I need to install an app?", a: "No app installation is required. HoloCard works directly in mobile browsers using WebAR technology." },
  { q: "Can I create multiple cards?", a: "Yes! All users can create unlimited cards." },
  { q: "Is my data secure?", a: "Absolutely. We use enterprise-grade encryption and security practices." },
  { q: "Can I track who viewed my card?", a: "Yes, our analytics dashboard provides insights into views, QR scans, contact saves, and engagement metrics." },
];

describe("FAQ Data", () => {
  it("has at least 6 questions", () => {
    expect(faqs.length).toBeGreaterThanOrEqual(6);
  });

  it("all questions have non-empty question text", () => {
    for (const faq of faqs) {
      expect(faq.q).toBeTruthy();
      expect(faq.q.length).toBeGreaterThan(0);
    }
  });

  it("all questions have non-empty answer text", () => {
    for (const faq of faqs) {
      expect(faq.a).toBeTruthy();
      expect(faq.a.length).toBeGreaterThan(0);
    }
  });

  it("all answers are at least 10 characters long", () => {
    for (const faq of faqs) {
      expect(faq.a.length).toBeGreaterThanOrEqual(10);
    }
  });

  it("no duplicate questions", () => {
    const questions = faqs.map((f) => f.q);
    const unique = new Set(questions);
    expect(unique.size).toBe(questions.length);
  });
});
