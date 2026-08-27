import { prisma } from "@/lib/db";
import bcrypt from "bcryptjs";

// NOTE: The demo account is a standard USER role account.
// It cannot access admin routes (/api/admin/*) and can only modify its own data.
// Credentials are configurable via DEMO_EMAIL / DEMO_PASSWORD env vars.

const DEMO_EMAIL = process.env.DEMO_EMAIL || "demo@holocard.app";
const DEMO_PASSWORD = process.env.DEMO_PASSWORD || "changeme123";

async function main() {
  console.log("Seeding database...");

  const hashedPassword = await bcrypt.hash(DEMO_PASSWORD, 12);

  const user = await prisma.user.upsert({
    where: { email: DEMO_EMAIL },
    update: {},
    create: {
      name: "Demo User",
      email: DEMO_EMAIL,
      password: hashedPassword,
      company: "HoloCard",
      designation: "Product Designer",
    },
  });

  console.log("Created demo user:", user.email);

  const workspace = await prisma.workspace.upsert({
    where: { id: `ws-${user.id}` },
    update: {},
    create: {
      id: `ws-${user.id}`,
      userId: user.id,
      name: "My Workspace",
      isDefault: true,
    },
  });

  const project = await prisma.project.upsert({
    where: { id: `proj-${user.id}` },
    update: {},
    create: {
      id: `proj-${user.id}`,
      workspaceId: workspace.id,
      name: "Default Project",
      isDefault: true,
    },
  });

  console.log("Created workspace + project for demo user");

  const card = await prisma.card.upsert({
    where: { slug: "demo-sample" },
    update: {},
    create: {
      userId: user.id,
      workspaceId: workspace.id,
      projectId: project.id,
      slug: "demo-sample",
      name: "Alex Johnson",
      designation: "Product Designer",
      company: "HoloCard",
      bio: "Creative product designer with a passion for building beautiful, user-centered digital experiences. Specializing in AR and interactive design.",
      email: "alex@holocard.com",
      phone: "+1 555 0100",
      website: "https://holocard.com",
      linkedin: "https://linkedin.com/in/alexjohnson",
      twitter: "https://x.com/alexjohnson",
      location: "San Francisco, CA",
      status: "ACTIVE",
    },
  });

  console.log("Created demo card:", card.slug);

  const templates = [
    { name: "Corporate", slug: "corporate", style: "CORPORATE" as const, description: "Professional blue tones for corporate environments", config: { primaryColor: "#2563EB", bgStyle: "solid" } },
    { name: "Executive", slug: "executive", style: "EXECUTIVE" as const, description: "Elegant dark theme for executives", config: { primaryColor: "#1E293B", bgStyle: "gradient" }, isPremium: true },
    { name: "Developer", slug: "developer", style: "DEVELOPER" as const, description: "Monospace accents for developers", config: { primaryColor: "#22D3EE", bgStyle: "solid" } },
    { name: "Data Analyst", slug: "data-analyst", style: "DATA_ANALYST" as const, description: "Clean and modern for data professionals", config: { primaryColor: "#8B5CF6", bgStyle: "solid" } },
    { name: "Designer", slug: "designer", style: "DESIGNER" as const, description: "Creative and colorful for designers", config: { primaryColor: "#EC4899", bgStyle: "gradient" }, isPremium: true },
    { name: "Freelancer", slug: "freelancer", style: "FREELANCER" as const, description: "Bold and versatile for freelancers", config: { primaryColor: "#F59E0B", bgStyle: "solid" } },
    { name: "Startup Founder", slug: "startup-founder", style: "STARTUP_FOUNDER" as const, description: "Innovative and sleek for founders", config: { primaryColor: "#10B981", bgStyle: "gradient" }, isPremium: true },
    { name: "Real Estate", slug: "real-estate", style: "REAL_ESTATE" as const, description: "Trust and authority for real estate", config: { primaryColor: "#059669", bgStyle: "solid" } },
    { name: "Sales", slug: "sales", style: "SALES" as const, description: "Dynamic and engaging for salespeople", config: { primaryColor: "#EF4444", bgStyle: "solid" } },
    { name: "Minimal", slug: "minimal", style: "MINIMAL" as const, description: "Simple and refined", config: { primaryColor: "#6B7280", bgStyle: "solid" } },
  ];

  for (const template of templates) {
    await prisma.template.upsert({
      where: { slug: template.slug },
      update: {},
      create: template,
    });
  }

  console.log("Seeded", templates.length, "templates");
  console.log("Seeding complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
