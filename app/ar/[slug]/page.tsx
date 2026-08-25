"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import { useParams } from "next/navigation";
import dynamic from "next/dynamic";
import { trackAREvent } from "@/lib/ar/analytics";

const ARViewer = dynamic(() => import("@/components/ar/ar-viewer"), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center">
      <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full" />
    </div>
  ),
});

const Fallback3DViewer = dynamic(() => import("@/components/ar/fallback-viewer"), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center">
      <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full" />
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
    scenes?: unknown[];
  };
}

export default function ARPage() {
  const params = useParams<{ slug: string }>();
  const slug = params.slug;
  const [card, setCard] = useState<CardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showFallback, setShowFallback] = useState(false);

  useEffect(() => {
    fetchCard();
  }, [slug]);

  useEffect(() => {
    const referrer = document.referrer;
    if (referrer.includes("/qr") || referrer.includes("qr")) {
      trackAREvent({ cardId: card?.id || "", eventType: "QR_SCAN" });
    }
  }, [card]);

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

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-white/60 text-sm">Loading experience...</p>
        </div>
      </div>
    );
  }

  if (error || !card) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-2">Card Not Found</h1>
          <p className="text-white/60 mb-4">{error || "This card does not exist."}</p>
          <a
            href="/"
            className="bg-blue-500 hover:bg-blue-600 text-white rounded-full px-6 py-2 text-sm font-medium transition-colors"
          >
            Go to HoloCard
          </a>
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

  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-900 flex items-center justify-center">
          <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full" />
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
      />
    </Suspense>
  );
}
