"use client";

import { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import {
  Sparkles,
  Copy,
  Check,
  RefreshCw,
  ArrowRight,
  Loader2,
  Briefcase,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface GeneratedContent {
  headline: string;
  bio: string;
  about: string;
  tagline: string;
}

const TONES = ["Professional", "Creative", "Executive", "Friendly", "Minimal"] as const;
type Tone = (typeof TONES)[number];

export default function AIGeneratorPage() {
  const [name, setName] = useState("");
  const [profession, setProfession] = useState("");
  const [skills, setSkills] = useState("");
  const [experience, setExperience] = useState("");
  const [industry, setIndustry] = useState("");
  const [tone, setTone] = useState<Tone>("Professional");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<GeneratedContent | null>(null);
  const [copied, setCopied] = useState<string | null>(null);

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/ai/generate-bio", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          profession,
          skills: skills.split(",").map((s) => s.trim()).filter(Boolean),
          experience,
          industry,
          tone,
        }),
      });
      const data = await res.json();
      setResult(data);
    } catch {
      setResult({
        headline: `${profession || "Professional"} | ${industry || "Industry"}`,
        bio: `Experienced ${profession || "professional"} with a passion for innovation and excellence in the ${industry || "industry"} sector.`,
        about: `${name || "A dedicated professional"} with ${experience || "extensive"} experience in ${profession || "the field"}. Skilled in ${skills || "relevant areas"} and committed to delivering high-quality results.`,
        tagline: "Driving results through innovation and expertise.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopied(field);
    setTimeout(() => setCopied(null), 2000);
  };

  const handleTransform = async (action: "improve" | "shorten" | "professional") => {
    if (!result) return;
    setLoading(true);
    try {
      const res = await fetch("/api/ai/generate-bio", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          profession,
          skills: skills.split(",").map((s) => s.trim()).filter(Boolean),
          experience,
          industry,
          tone,
          action,
          existing: result,
        }),
      });
      const data = await res.json();
      setResult(data);
    } catch {
      toast.error("Transform failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const outputSections = result
    ? [
        { label: "Professional Headline", value: result.headline, key: "headline" },
        { label: "Bio", value: result.bio, key: "bio" },
        { label: "About Section", value: result.about, key: "about" },
        { label: "Tagline", value: result.tagline, key: "tagline" },
      ]
    : [];

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold">AI Profile Generator</h1>
        <p className="text-sm text-muted-foreground">
          Generate professional content for your digital card using AI.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="glass rounded-xl p-6 space-y-5">
          <div className="flex items-center gap-2 text-sm font-medium">
            <Sparkles className="h-4 w-4 text-primary" />
            Your Information
          </div>

          <div className="space-y-2">
            <Label htmlFor="ai-name">Name</Label>
            <Input
              id="ai-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="John Doe"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="ai-profession">Profession</Label>
            <Input
              id="ai-profession"
              value={profession}
              onChange={(e) => setProfession(e.target.value)}
              placeholder="Software Engineer"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="ai-skills">Skills (comma separated)</Label>
            <Input
              id="ai-skills"
              value={skills}
              onChange={(e) => setSkills(e.target.value)}
              placeholder="React, Node.js, TypeScript"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="ai-experience">Experience</Label>
              <Input
                id="ai-experience"
                value={experience}
                onChange={(e) => setExperience(e.target.value)}
                placeholder="5+ years"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ai-industry">Industry</Label>
              <Input
                id="ai-industry"
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
                placeholder="Technology"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Tone</Label>
            <div className="flex flex-wrap gap-2">
              {TONES.map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTone(t)}
                  className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors ${
                    tone === t
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border text-muted-foreground hover:bg-accent"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <Button onClick={handleGenerate} disabled={loading} className="w-full">
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Sparkles className="h-4 w-4" />
            )}
            {loading ? "Generating..." : "Generate Content"}
          </Button>
        </div>

        <div className="space-y-4">
          {loading && (
            <div className="glass rounded-xl p-6">
              <div className="space-y-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="space-y-2">
                    <div className="h-3 w-24 rounded bg-muted animate-pulse" />
                    <div className="h-10 w-full rounded-lg bg-muted animate-pulse" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {!loading && result && (
            <>
              <div className="glass rounded-xl p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-sm font-medium">Generated Content</h2>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm" onClick={() => handleTransform("improve")} disabled={loading}>
                      <Sparkles className="h-3.5 w-3.5" />
                      Improve
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleTransform("shorten")} disabled={loading}>
                      <RefreshCw className="h-3.5 w-3.5" />
                      Shorten
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleTransform("professional")} disabled={loading}>
                      <Briefcase className="h-3.5 w-3.5" />
                      Professional
                    </Button>
                    <Button variant="ghost" size="sm" onClick={handleGenerate} disabled={loading}>
                      <RefreshCw className="h-3.5 w-3.5" />
                      Regenerate
                    </Button>
                  </div>
                </div>

                {outputSections.map((section) => (
                  <div key={section.key} className="space-y-1.5">
                    <Label className="text-xs text-muted-foreground">
                      {section.label}
                    </Label>
                    <div className="relative rounded-lg border border-border bg-background/50 p-3">
                      <p className="text-sm pr-8">{section.value}</p>
                      <button
                        type="button"
                        onClick={() => handleCopy(section.value, section.key)}
                        className="absolute right-2 top-2 rounded-md p-1 text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
                      >
                        {copied === section.key ? (
                          <Check className="h-3.5 w-3.5 text-green-400" />
                        ) : (
                          <Copy className="h-3.5 w-3.5" />
                        )}
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="glass rounded-xl p-4">
                <Link href="/dashboard/cards/new">
                  <Button className="w-full" variant="outline">
                    <Briefcase className="h-4 w-4" />
                    Apply to Card
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </>
          )}

          {!loading && !result && (
            <div className="glass rounded-xl p-12 text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
                <Sparkles className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mb-1 font-semibold">Ready to generate</h3>
              <p className="text-sm text-muted-foreground">
                Fill in your details and click Generate to create AI-powered content.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
