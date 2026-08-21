import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

interface RouteParams {
  params: Promise<{ slug: string }>;
}

export async function GET(_req: Request, { params }: RouteParams) {
  const { slug } = await params;

  const card = await prisma.card.findUnique({
    where: { slug },
    include: { socialLinks: true },
  });

  if (!card) {
    return NextResponse.json({ error: "Card not found" }, { status: 404 });
  }

  const lines: string[] = [
    "BEGIN:VCARD",
    "VERSION:3.0",
    `FN:${card.name}`,
    `N:${card.name.split(" ").pop() || ""};${card.name.split(" ").slice(0, -1).join(" ")};;;`,
  ];

  if (card.company) lines.push(`ORG:${card.company}`);
  if (card.designation) lines.push(`TITLE:${card.designation}`);
  if (card.phone) lines.push(`TEL;TYPE=CELL:${card.phone}`);
  if (card.email) lines.push(`EMAIL:${card.email}`);
  if (card.website) lines.push(`URL:${card.website}`);
  if (card.location) lines.push(`ADR;TYPE=WORK:;;${card.location};;;;`);

  for (const link of card.socialLinks) {
    const type = link.platform.toLowerCase();
    if (type === "linkedin") lines.push(`X-SOCIALPROFILE;TYPE=linkedin:${link.url}`);
    else if (type === "twitter" || type === "x") lines.push(`X-SOCIALPROFILE;TYPE=twitter:${link.url}`);
    else if (type === "github") lines.push(`X-SOCIALPROFILE;TYPE=github:${link.url}`);
    else if (type === "facebook") lines.push(`X-SOCIALPROFILE;TYPE=facebook:${link.url}`);
    else if (type === "instagram") lines.push(`X-SOCIALPROFILE;TYPE=instagram:${link.url}`);
    else lines.push(`URL;TYPE=${link.platform}:${link.url}`);
  }

  if (card.bio) {
    lines.push(`NOTE:${card.bio.replace(/\n/g, "\\n")}`);
  }

  lines.push("END:VCARD");

  return new NextResponse(lines.join("\r\n"), {
    headers: {
      "Content-Type": "text/vcard; charset=utf-8",
      "Content-Disposition": `attachment; filename="${card.slug}.vcf"`,
    },
  });
}
