import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { PublicCard } from "@/components/cards/public-card";

interface CardPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: CardPageProps): Promise<Metadata> {
  const { slug } = await params;
  const card = await prisma.card.findUnique({
    where: { slug },
    select: { name: true, designation: true, bio: true, slug: true },
  });

  if (!card) return { title: "Card Not Found" };

  const title = `${card.name} - ${card.designation || "Professional"} | HoloCard`;
  const description = card.bio || `${card.name}'s digital business card on HoloCard`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "profile",
      images: [`/api/og/${card.slug}`],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default async function PublicCardPage({ params }: CardPageProps) {
  const { slug } = await params;
  const card = await prisma.card.findUnique({
    where: { slug },
    include: {
      socialLinks: { orderBy: { order: "asc" } },
      buttons: { where: { isActive: true }, orderBy: { order: "asc" } },
    },
  });

  if (!card || card.status !== "ACTIVE") {
    notFound();
  }

  if (card.visibility === "PRIVATE") {
    notFound();
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return <PublicCard card={card as any} />;
}
