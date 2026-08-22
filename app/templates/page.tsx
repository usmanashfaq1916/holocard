import type { Metadata } from "next";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

export const metadata: Metadata = {
  title: "Templates",
  description:
    "Choose from professionally designed templates for your AR business card.",
};

export default function TemplatesPage() {
  const templates = [
    { name: "Corporate", style: "Professional blue tones", premium: false },
    { name: "Executive", style: "Elegant dark theme", premium: true },
    { name: "Developer", style: "Monospace accents", premium: false },
    { name: "Data Analyst", style: "Clean & modern", premium: false },
    { name: "Designer", style: "Creative & colorful", premium: true },
    { name: "Freelancer", style: "Bold & versatile", premium: false },
    { name: "Startup Founder", style: "Innovative & sleek", premium: true },
    { name: "Real Estate", style: "Trust & authority", premium: false },
    { name: "Sales", style: "Dynamic & engaging", premium: false },
    { name: "Minimal", style: "Simple & refined", premium: false },
  ];

  return (
    <div className="min-h-screen bg-grid bg-radial">
      <Navbar />
      <div className="relative z-10 mx-auto max-w-6xl px-4 py-24">
        <div className="mb-16 text-center">
          <h1 className="mb-4 text-4xl font-bold md:text-5xl">
            <span className="text-gradient">Templates</span>
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            Choose a professionally designed template and customize it to match
            your brand.
          </p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {templates.map((template) => (
            <div
              key={template.name}
              className="glass group cursor-pointer overflow-hidden rounded-xl transition-all hover:glow-sm"
            >
              <div className="flex h-48 items-center justify-center bg-gradient-to-br from-primary/20 to-cyan/10">
                <span className="text-4xl font-bold text-gradient">
                  {template.name.slice(0, 2)}
                </span>
              </div>
              <div className="p-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">{template.name}</h3>
                  {template.premium && (
                    <span className="rounded-full bg-primary/20 px-2 py-0.5 text-xs text-primary">
                      Pro
                    </span>
                  )}
                </div>
                <p className="mt-1 text-sm text-muted-foreground">
                  {template.style}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
}
