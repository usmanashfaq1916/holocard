import type { Metadata } from "next";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { TemplateGrid } from "@/components/templates/template-grid";
import { prisma } from "@/lib/db";

export const metadata: Metadata = {
  title: "Templates",
  description:
    "Choose from professionally designed templates for your AR business card.",
};

const FALLBACK_TEMPLATES = [
  {
    id: "corporate",
    name: "Corporate",
    style: "Professional blue tones",
    premium: false,
    gradient: "from-emerald-600 to-teal-700",
    accent: "#059669",
    layout: "centered" as const,
    description: "Clean, trustworthy design ideal for consultants and executives.",
  },
  {
    id: "executive",
    name: "Executive",
    style: "Elegant dark theme",
    premium: true,
    gradient: "from-gray-800 to-gray-950",
    accent: "#D4AF37",
    layout: "centered" as const,
    description: "Sophisticated dark theme for C-suite professionals.",
  },
  {
    id: "developer",
    name: "Developer",
    style: "Monospace accents",
    premium: false,
    gradient: "from-green-600 to-emerald-700",
    accent: "#10B981",
    layout: "left" as const,
    description: "Code-inspired layout with monospace typography.",
  },
  {
    id: "data-analyst",
    name: "Data Analyst",
    style: "Clean & modern",
    premium: false,
    gradient: "from-indigo-500 to-purple-600",
    accent: "#6366F1",
    layout: "centered" as const,
    description: "Data-driven aesthetic with structured information layout.",
  },
  {
    id: "designer",
    name: "Designer",
    style: "Creative & colorful",
    premium: true,
    gradient: "from-pink-500 to-orange-400",
    accent: "#EC4899",
    layout: "left" as const,
    description: "Bold, artistic design showcasing creative flair.",
  },
  {
    id: "freelancer",
    name: "Freelancer",
    style: "Bold & versatile",
    premium: false,
    gradient: "from-amber-500 to-orange-600",
    accent: "#F59E0B",
    layout: "centered" as const,
    description: "Versatile template for independent professionals.",
  },
  {
    id: "startup-founder",
    name: "Startup Founder",
    style: "Innovative & sleek",
    premium: true,
    gradient: "from-cyan-500 to-blue-600",
    accent: "#06B6D4",
    layout: "centered" as const,
    description: "Modern, forward-thinking design for entrepreneurs.",
  },
  {
    id: "real-estate",
    name: "Real Estate",
    style: "Trust & authority",
    premium: false,
    gradient: "from-emerald-600 to-teal-700",
    accent: "#059669",
    layout: "left" as const,
    description: "Professional template built for property professionals.",
  },
  {
    id: "sales",
    name: "Sales",
    style: "Dynamic & engaging",
    premium: false,
    gradient: "from-red-500 to-rose-600",
    accent: "#EF4444",
    layout: "centered" as const,
    description: "High-energy design for sales and business development.",
  },
  {
    id: "minimal",
    name: "Minimal",
    style: "Simple & refined",
    premium: false,
    gradient: "from-gray-400 to-gray-600",
    accent: "#6B7280",
    layout: "centered" as const,
    description: "Less is more. Clean, distraction-free professional card.",
  },
];

export default async function TemplatesPage() {
  let templates = FALLBACK_TEMPLATES;

  try {
    const dbTemplates = await prisma.template.findMany({
      where: { isActive: true },
      orderBy: { order: "asc" },
    });

    if (dbTemplates.length > 0) {
      templates = dbTemplates.map((t) => {
        const config = (t.config as Record<string, string>) || {};
        return {
          id: t.slug,
          name: t.name,
          style: t.style.replace(/_/g, " ").toLowerCase(),
          premium: t.isPremium,
          gradient: config.gradient || "from-emerald-600 to-teal-700",
          accent: config.accent || "#059669",
          layout: (config.layout || "centered") as "centered" | "left",
          description: t.description || "",
        };
      });
    }
  } catch {
    // Use fallback templates
  }

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
            your brand. Each template features a unique layout and style.
          </p>
        </div>
        <TemplateGrid templates={templates} />
      </div>
      <Footer />
    </div>
  );
}
