import { prisma } from "@/lib/db";
import bcrypt from "bcryptjs";

async function main() {
  console.log("Seeding database...");

  const hashedPassword = await bcrypt.hash("demo1234", 12);

  const user = await prisma.user.upsert({
    where: { email: "usman@demo.com" },
    update: {},
    create: {
      name: "Usman Ashfaq",
      email: "usman@demo.com",
      password: hashedPassword,
      company: "HoloCard",
      designation: "Data Analyst",
    },
  });

  console.log("Created demo user:", user.email);

  const card = await prisma.card.upsert({
    where: { slug: "usman-ashfaq" },
    update: {},
    create: {
      userId: user.id,
      slug: "usman-ashfaq",
      name: "Usman Ashfaq",
      designation: "Data Analyst",
      company: "HoloCard",
      bio: "Passionate data analyst with expertise in Python, SQL, Power BI, and Data Visualization. Turning raw data into actionable insights.",
      email: "usman@holocard.com",
      phone: "+1 234 567 890",
      website: "https://holocard.com",
      linkedin: "https://linkedin.com/in/usman-ashfaq",
      twitter: "https://x.com/usman-ashfaq",
      location: "New York, NY",
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
