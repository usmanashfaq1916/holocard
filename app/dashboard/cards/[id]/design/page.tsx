import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth/config";
import CardDesignerWrapper from "./CardDesignerWrapper";

interface CardDesignPageProps {
  params: Promise<{ id: string }>;
}

export default async function CardDesignPage({ params }: CardDesignPageProps) {
  const { id } = await params;

  const session = await auth();
  if (!session?.user?.id) {
    notFound();
  }

  const card = await prisma.card.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      designation: true,
      company: true,
      phone: true,
      email: true,
      website: true,
      userId: true,
    },
  });

  if (!card || card.userId !== session.user.id) {
    notFound();
  }

  const cardData = {
    name: card.name || "",
    designation: card.designation || "",
    company: card.company || "",
    phone: card.phone || "",
    email: card.email || "",
    website: card.website || "",
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-[1200px] mx-auto">
        <div className="mb-6 flex items-center gap-4">
          <Link
            href={`/dashboard/cards/${id}`}
            className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
          >
            ← Back to Card
          </Link>
          <div>
            <h1 className="text-2xl font-bold">Card Designer</h1>
            <p className="text-sm text-slate-500">
              Design your physical business card front and back
            </p>
          </div>
        </div>

        <CardDesignerWrapper cardId={id} cardData={cardData} />
      </div>
    </div>
  );
}
