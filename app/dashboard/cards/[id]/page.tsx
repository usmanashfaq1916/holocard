import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth/config";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  ArrowLeft,
  Pencil,
  Paintbrush,
  Sparkles,
  ExternalLink,
  QrCode,
  Globe,
  Lock,
  Eye,
  EyeOff,
  Mail,
  Phone,
} from "lucide-react";

interface CardDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function CardDetailPage({ params }: CardDetailPageProps) {
  const { id } = await params;

  const session = await auth();
  if (!session?.user?.id) {
    notFound();
  }

  const card = await prisma.card.findUnique({
    where: { id },
    include: {
      socialLinks: { orderBy: { order: "asc" } },
      arExperience: { select: { id: true, status: true } },
      _count: { select: { analyticsEvents: true, contacts: true } },
    },
  });

  if (!card || card.userId !== session.user.id) {
    notFound();
  }

  const statusColors: Record<string, string> = {
    ACTIVE: "bg-green-100 text-green-700",
    DRAFT: "bg-yellow-100 text-yellow-700",
    ARCHIVED: "bg-slate-100 text-slate-600",
    DISABLED: "bg-red-100 text-red-700",
  };

  const publicUrl = `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/card/${card.slug}`;
  const arUrl = `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/ar/${card.slug}`;

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/cards" className={buttonVariants({ variant: "ghost", size: "sm" })}>
          <ArrowLeft className="mr-1 h-4 w-4" />
          All Cards
        </Link>
      </div>

      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold">{card.name}</h1>
            <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[card.status] || ""}`}>
              {card.status}
            </span>
          </div>
          {card.designation && (
            <p className="text-muted-foreground mt-1">
              {card.designation}{card.company ? ` at ${card.company}` : ""}
            </p>
          )}
        </div>
        <div className="flex gap-2">
          <Link
            href={`/dashboard/cards/${id}/edit`}
            className={buttonVariants({ variant: "outline", size: "sm" })}
          >
            <Pencil className="mr-1 h-4 w-4" />
            Edit
          </Link>
          <Link
            href={`/dashboard/cards/${id}/design`}
            className={buttonVariants({ variant: "outline", size: "sm" })}
          >
            <Paintbrush className="mr-1 h-4 w-4" />
            Design
          </Link>
          <Link
            href={`/dashboard/cards/${id}/ar`}
            className={buttonVariants({ variant: "outline", size: "sm" })}
          >
            <Sparkles className="mr-1 h-4 w-4" />
            AR
          </Link>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Views</p>
            <p className="text-2xl font-bold">{card._count.analyticsEvents}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Contacts</p>
            <p className="text-2xl font-bold">{card._count.contacts}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">AR Status</p>
            <p className="text-2xl font-bold">
              {card.arExperience?.status || "None"}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardContent className="p-6 space-y-4">
            <h2 className="text-lg font-semibold">Card Details</h2>
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-2">
                <Globe className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Slug:</span>
                <code className="font-mono text-xs bg-muted px-1.5 py-0.5 rounded">{card.slug}</code>
              </div>
              <div className="flex items-center gap-2">
                {card.visibility === "PUBLIC" ? (
                  <Eye className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <EyeOff className="h-4 w-4 text-muted-foreground" />
                )}
                <span className="text-muted-foreground">Visibility:</span>
                <span>{card.visibility}</span>
              </div>
              {card.email && (
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Email:</span>
                  <span>{card.email}</span>
                </div>
              )}
              {card.phone && (
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Phone:</span>
                  <span>{card.phone}</span>
                </div>
              )}
              <div className="flex items-center gap-2">
                {card.isPublic ? (
                  <Globe className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <Lock className="h-4 w-4 text-muted-foreground" />
                )}
                <span className="text-muted-foreground">Public:</span>
                <span>{card.isPublic ? "Yes" : "No"}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 space-y-4">
            <h2 className="text-lg font-semibold">Links</h2>
            <div className="space-y-2">
              <a
                href={publicUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-blue-600 hover:underline"
              >
                <ExternalLink className="h-4 w-4" />
                View Public Card
              </a>
              <a
                href={arUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-blue-600 hover:underline"
              >
                <Sparkles className="h-4 w-4" />
                View AR Experience
              </a>
            </div>
            {card.socialLinks.length > 0 && (
              <div className="pt-2 border-t">
                <p className="text-xs text-muted-foreground mb-2">Social Links</p>
                <div className="flex flex-wrap gap-2">
                  {card.socialLinks.map((link) => (
                    <a
                      key={link.id}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-2 py-1 bg-muted rounded text-xs hover:bg-muted/80"
                    >
                      {link.platform}
                    </a>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
