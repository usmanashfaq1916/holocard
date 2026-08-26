"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Plus,
  Eye,
  Pencil,
  Trash2,
  Globe,
  QrCode,
  BarChart3,
  Copy,
  ExternalLink,
} from "lucide-react";
import { toast } from "sonner";

interface ARExperience {
  id: string;
  name: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  card: { id: string; slug: string; name: string };
  target?: { id: string; status: string; quality?: string };
  scenes: { id: string }[];
}

export default function ExperiencesPage() {
  const [experiences, setExperiences] = useState<ARExperience[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchExperiences();
  }, []);

  const fetchExperiences = async () => {
    try {
      const res = await fetch("/api/ar/experiences");
      if (res.ok) {
        setExperiences(await res.json());
      }
    } catch {
      toast.error("Failed to load experiences");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this experience?")) return;
    try {
      const res = await fetch(`/api/ar/experiences/${id}`, { method: "DELETE" });
      if (res.ok) {
        setExperiences(experiences.filter((e) => e.id !== id));
        toast.success("Experience deleted");
      }
    } catch {
      toast.error("Failed to delete");
    }
  };

  const handleCopyUrl = (slug: string) => {
    navigator.clipboard.writeText(`${window.location.origin}/ar/${slug}`);
    toast.success("AR URL copied!");
  };

  const handleCopyQR = async (slug: string) => {
    try {
      const res = await fetch(`/api/qr/${slug}?format=png`);
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `holocard-ar-${slug}.png`;
      link.click();
      URL.revokeObjectURL(url);
      toast.success("QR code downloaded");
    } catch {
      toast.error("Failed to generate QR");
    }
  };

  if (loading) {
    return (
      <div className="p-8">
        <div className="animate-pulse space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-32 bg-slate-100 rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">AR Experiences</h1>
          <p className="text-slate-500 mt-1">
            Manage your augmented reality business card experiences
          </p>
        </div>
      </div>

      {experiences.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
              <div className="w-16 h-16 bg-primary/5 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Plus className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-lg font-semibold mb-2">No AR Experiences Yet</h3>
            <p className="text-slate-500 mb-4">
              Create an AR experience to turn your business card into an interactive AR experience.
            </p>
            <Link href="/dashboard/cards">
              <Button>Create AR Experience</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {experiences.map((exp) => (
            <Card key={exp.id}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-emerald-600 to-teal-500 rounded-xl flex items-center justify-center text-white font-bold text-lg">
                      {exp.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">{exp.name}</h3>
                      <div className="flex items-center gap-3 text-sm text-slate-500">
                        <span>Card: {exp.card.name}</span>
                        <span
                          className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                            exp.status === "PUBLISHED"
                              ? "bg-green-100 text-green-700"
                              : exp.status === "DRAFT"
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-slate-100 text-slate-600"
                          }`}
                        >
                          {exp.status}
                        </span>
                        {exp.target && (
                          <span
                            className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                              exp.target.status === "READY"
                                ? "bg-green-100 text-green-700"
                                : "bg-yellow-100 text-yellow-700"
                            }`}
                          >
                            Target: {exp.target.quality || exp.target.status}
                          </span>
                        )}
                        <span>{exp.scenes.length} scenes</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Link href={`/ar/${exp.card.slug}`}>
                      <Button variant="ghost" size="sm">
                        <ExternalLink className="w-4 h-4" />
                      </Button>
                    </Link>
                    <Link href={`/dashboard/cards/${exp.card.id}/ar`}>
                      <Button variant="outline" size="sm">
                        <Pencil className="w-4 h-4 mr-1" />
                        Edit
                      </Button>
                    </Link>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleCopyUrl(exp.card.slug)}
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleCopyQR(exp.card.slug)}
                    >
                      <QrCode className="w-4 h-4" />
                    </Button>
                    <Link href={`/dashboard/analytics?cardId=${exp.card.id}`}>
                      <Button variant="ghost" size="sm">
                        <BarChart3 className="w-4 h-4" />
                      </Button>
                    </Link>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(exp.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
