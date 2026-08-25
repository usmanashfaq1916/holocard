import { prisma } from "@/lib/db";

const TEMPLATES = [
  {
    name: "Corporate",
    slug: "corporate",
    style: "CORPORATE" as const,
    description: "Clean, trustworthy design ideal for consultants and executives.",
    gradient: "from-blue-600 to-blue-800",
    accent: "#2563EB",
    layout: "centered",
    isPremium: false,
    order: 0,
  },
  {
    name: "Executive",
    slug: "executive",
    style: "EXECUTIVE" as const,
    description: "Sophisticated dark theme for C-suite professionals.",
    gradient: "from-gray-800 to-gray-950",
    accent: "#D4AF37",
    layout: "centered",
    isPremium: true,
    order: 1,
  },
  {
    name: "Developer",
    slug: "developer",
    style: "DEVELOPER" as const,
    description: "Code-inspired layout with monospace typography.",
    gradient: "from-green-600 to-emerald-700",
    accent: "#10B981",
    layout: "left",
    isPremium: false,
    order: 2,
  },
  {
    name: "Data Analyst",
    slug: "data-analyst",
    style: "DATA_ANALYST" as const,
    description: "Data-driven aesthetic with structured information layout.",
    gradient: "from-indigo-500 to-purple-600",
    accent: "#6366F1",
    layout: "centered",
    isPremium: false,
    order: 3,
  },
  {
    name: "Designer",
    slug: "designer",
    style: "DESIGNER" as const,
    description: "Bold, artistic design showcasing creative flair.",
    gradient: "from-pink-500 to-orange-400",
    accent: "#EC4899",
    layout: "left",
    isPremium: true,
    order: 4,
  },
  {
    name: "Freelancer",
    slug: "freelancer",
    style: "FREELANCER" as const,
    description: "Versatile template for independent professionals.",
    gradient: "from-amber-500 to-orange-600",
    accent: "#F59E0B",
    layout: "centered",
    isPremium: false,
    order: 5,
  },
  {
    name: "Startup Founder",
    slug: "startup-founder",
    style: "STARTUP_FOUNDER" as const,
    description: "Modern, forward-thinking design for entrepreneurs.",
    gradient: "from-cyan-500 to-blue-600",
    accent: "#06B6D4",
    layout: "centered",
    isPremium: true,
    order: 6,
  },
  {
    name: "Real Estate",
    slug: "real-estate",
    style: "REAL_ESTATE" as const,
    description: "Professional template built for property professionals.",
    gradient: "from-emerald-600 to-teal-700",
    accent: "#059669",
    layout: "left",
    isPremium: false,
    order: 7,
  },
  {
    name: "Sales",
    slug: "sales",
    style: "SALES" as const,
    description: "High-energy design for sales and business development.",
    gradient: "from-red-500 to-rose-600",
    accent: "#EF4444",
    layout: "centered",
    isPremium: false,
    order: 8,
  },
  {
    name: "Minimal",
    slug: "minimal",
    style: "MINIMAL" as const,
    description: "Less is more. Clean, distraction-free professional card.",
    gradient: "from-gray-400 to-gray-600",
    accent: "#6B7280",
    layout: "centered",
    isPremium: false,
    order: 9,
  },
];

export async function seedTemplates() {
  let created = 0;
  let skipped = 0;

  for (const template of TEMPLATES) {
    try {
      await prisma.template.upsert({
        where: { slug: template.slug },
        update: {},
        create: {
          name: template.name,
          slug: template.slug,
          style: template.style,
          description: template.description,
          config: {
            gradient: template.gradient,
            accent: template.accent,
            layout: template.layout,
          },
          isPremium: template.isPremium,
          isActive: true,
          order: template.order,
        },
      });
      created++;
    } catch {
      skipped++;
    }
  }

  return { created, skipped };
}
