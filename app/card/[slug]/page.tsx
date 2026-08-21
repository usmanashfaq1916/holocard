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
    select: { name: true, designation: true, bio: true },
  });

  if (!card) return { title: "Card Not Found" };

  return {
    title: `${card.name}${card.designation ? ` - ${card.designation}` : ""}`,
    description: card.bio || `Interactive digital business card for ${card.name}.`,
    openGraph: {
      title: `${card.name} | HoloCard`,
      description: card.bio || `Interactive digital business card for ${card.name}.`,
      type: "profile",
    },
    twitter: {
      card: "summary_large_image",
      title: `${card.name} | HoloCard`,
      description: card.bio || `Interactive digital business card for ${card.name}.`,
    },
  };
}

export default async function PublicCardPage({ params }: CardPageProps) {
  const { slug } = await params;
  const card = await prisma.card.findUnique({
    where: { slug },
    include: { socialLinks: { orderBy: { order: "asc" } } },
  });

  if (!card || card.status !== "ACTIVE") {
    notFound();
  }

  return <PublicCard card={card} />;
}
