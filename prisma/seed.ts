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
