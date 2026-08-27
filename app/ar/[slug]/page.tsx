"use client";

import { useState, useEffect, Suspense } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import dynamic from "next/dynamic";
import { Smartphone, Camera, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { trackAREvent } from "@/lib/ar/analytics";

const ARViewer = dynamic(() => import("@/components/ar/ar-viewer"), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
    </div>
  ),
});

type ARViewerProps = React.ComponentProps<typeof ARViewer>;

const Fallback3DViewer = dynamic(() => import("@/components/ar/fallback-viewer"), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
    </div>
  ),
});

interface CardData {
  id: string;
  slug: string;
  name: string;
  designation?: string;
  company?: string;
  bio?: string;
  phone?: string;
  email?: string;
  website?: string;
  whatsapp?: string;
  linkedin?: string;
  facebook?: string;
  instagram?: string;
  twitter?: string;
  profileImage?: string;
  socialLinks?: { platform: string; url: string }[];
  buttons?: { label: string; url: string }[];
  arExperience?: {
    id: string;
    status: string;
    templateType?: string;
    target?: {
      mindFileUrl?: string;
      status: string;
    };
    scenes?: { id: string; name: string; order: number; duration: number; transitionType: string; elements: unknown[] }[];
  };
}

export default function ARPage() {
  const params = useParams<{ slug: string }>();
  const slug = params.slug;
  const [card, setCard] = useState<CardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showFallback, setShowFallback] = useState(false);
  const [showIntro, setShowIntro] = useState(true);

  useEffect(() => {
    const fetchCard = async () => {
      try {
        const res = await fetch(`/api/cards/by-slug/${slug}`);
        if (!res.ok) throw new Error("Card not found");
        const data = await res.json();
        setCard(data);
        trackAREvent({ cardId: data.id, eventType: "AR_PAGE_OPENED" });
      } catch {
        setError("Card not found");
      } finally {
        setLoading(false);
      }
    };
    fetchCard();
  }, [slug]);

  useEffect(() => {
    const referrer = document.referrer;
    if (referrer.includes("/qr") || referrer.includes("qr")) {
      trackAREvent({ cardId: card?.id || "", eventType: "QR_AR_SCAN" });
    }
  }, [card]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-muted-foreground text-sm">Loading experience...</p>
        </div>
      </div>
    );
  }

  if (error || !card) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-2">Card Not Found</h1>
          <p className="text-muted-foreground mb-4">{error || "This card does not exist."}</p>
          <Link
            href="/"
            className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full px-6 py-2 text-sm font-medium transition-colors"
          >
            Go to HoloCard
          </Link>
        </div>
      </div>
    );
  }

  const hasAR = card.arExperience?.status === "PUBLISHED" && card.arExperience?.target?.mindFileUrl;

  if (showFallback || !hasAR) {
    return (
      <Fallback3DViewer
        name={card.name}
        cardSlug={card.slug}
        designation={card.designation}
        company={card.company}
        phone={card.phone}
        email={card.email}
        website={card.website}
        linkedin={card.linkedin}
        whatsapp={card.whatsapp}
      />
    );
  }

  if (showIntro) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-muted/30 flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center">
          <div className="mb-8">
            <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Smartphone className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-2xl font-bold text-foreground mb-2">
              Bring This Card to Life
            </h1>
            <p className="text-muted-foreground">
              Point your camera at {card.name}&apos;s business card to see the AR experience
            </p>
          </div>

          <div className="space-y-4 mb-8 text-left">
            {[
              { step: "1", text: "Tap Start AR and allow camera access" },
              { step: "2", text: "Point your camera at the physical business card" },
              { step: "3", text: "Keep the entire card visible in the frame" },
              { step: "4", text: "Watch the AR content appear on top of the card" },
            ].map(({ step, text }) => (
              <div key={step} className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-xs font-bold flex-shrink-0">
                  {step}
                </div>
                <p className="text-muted-foreground text-sm">{text}</p>
              </div>
            ))}
          </div>

          <div className="space-y-3">
            <Button
              onClick={() => setShowIntro(false)}
              className="w-full"
              size="lg"
            >
              <Camera className="w-5 h-5 mr-2" />
              Start AR
            </Button>
            <Button
              onClick={() => setShowFallback(true)}
              variant="outline"
              className="w-full"
            >
              <ArrowRight className="w-4 h-4 mr-2" />
              View Digital Card
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
        </div>
      }
    >
      <ARViewer
        cardSlug={card.slug}
        cardName={card.name}
        cardDesignation={card.designation}
        cardCompany={card.company}
        mindFileUrl={card.arExperience!.target!.mindFileUrl!}
        socialLinks={card.socialLinks}
        buttons={card.buttons}
        phone={card.phone}
        email={card.email}
        whatsapp={card.whatsapp}
        website={card.website}
        linkedin={card.linkedin}
        profileImage={card.profileImage}
        templateType={card.arExperience?.templateType}
        scenes={card.arExperience?.scenes as ARViewerProps["scenes"]}
      />
    </Suspense>
  );
}
