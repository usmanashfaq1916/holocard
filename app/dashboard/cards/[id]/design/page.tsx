"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import CardDesigner from "@/components/card-designer/CardDesigner";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function CardDesignPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();

  const cardData = {
    name: "Usman Ashfaq",
    designation: "Data Analyst",
    company: "HoloCard",
    phone: "+1 234 567 890",
    email: "usman@holocard.com",
    website: "https://holocard.com",
  };

  const handleSave = async (frontJson: string, backJson: string) => {
    try {
      await fetch(`/api/cards/${id}/design`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ front: frontJson, back: backJson }),
      });
      router.push(`/dashboard/cards/${id}`);
    } catch (error) {
      console.error("Save failed:", error);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-[1200px] mx-auto">
        <div className="mb-6 flex items-center gap-4">
          <Link href={`/dashboard/cards/${id}`}>
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-1" />
              Back to Card
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold">Card Designer</h1>
            <p className="text-sm text-slate-500">
              Design your physical business card front and back
            </p>
          </div>
        </div>

        <CardDesigner cardId={id} cardData={cardData} onSave={handleSave} />
      </div>
    </div>
  );
}
