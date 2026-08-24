"use client";

import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";

const CardDesigner = dynamic(() => import("@/components/card-designer/CardDesigner"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[600px] bg-slate-100 rounded-lg animate-pulse flex items-center justify-center">
      <span className="text-slate-400">Loading designer...</span>
    </div>
  ),
});

interface CardDesignerWrapperProps {
  cardId: string;
  cardData: Record<string, string>;
}

export default function CardDesignerWrapper({ cardId, cardData }: CardDesignerWrapperProps) {
  const router = useRouter();

  const handleSave = async (frontJson: string, backJson: string) => {
    try {
      await fetch(`/api/cards/${cardId}/design`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ front: frontJson, back: backJson }),
      });
      router.push(`/dashboard/cards/${cardId}`);
    } catch (error) {
      console.error("Save failed:", error);
    }
  };

  return <CardDesigner cardId={cardId} cardData={cardData} onSave={handleSave} />;
}
