"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Loader2 } from "lucide-react";
import { cardSchema, type CardInput } from "@/lib/validation";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function NewCardPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<CardInput>({
    resolver: zodResolver(cardSchema),
    defaultValues: {
      name: "",
      slug: "",
      designation: "",
      company: "",
      bio: "",
      phone: "",
      email: "",
      website: "",
    },
  });

  const watchedValues = watch();

  const onSubmit = async (data: CardInput) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/cards", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const result = await res.json();
        setError(result.error || "Failed to create card");
        return;
      }
      router.push("/dashboard/cards");
      router.refresh();
    } catch {
      setError("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Create New Card</h1>
        <Link href="/dashboard/cards" className={buttonVariants({ variant: "ghost" })}>
          Back to Cards
        </Link>
      </div>
      <div className="grid gap-8 lg:grid-cols-5">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 lg:col-span-3">
          {error && (
            <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-3 text-sm text-destructive">
              {error}
            </div>
          )}

          <div className="glass rounded-xl p-6 space-y-4">
            <h2 className="font-semibold">Basic Info</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name *</Label>
                <Input id="name" {...register("name")} placeholder="John Doe" />
                {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="slug">Card URL Slug *</Label>
                <div className="flex items-center">
                  <span className="rounded-l-lg border border-r-0 border-border bg-muted px-3 py-2 text-sm text-muted-foreground">
                    /card/
                  </span>
                  <Input id="slug" {...register("slug")} placeholder="john-doe" className="rounded-l-none" />
                </div>
                {errors.slug && <p className="text-xs text-destructive">{errors.slug.message}</p>}
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="designation">Designation</Label>
                <Input id="designation" {...register("designation")} placeholder="Software Engineer" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="company">Company</Label>
                <Input id="company" {...register("company")} placeholder="Acme Inc" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea id="bio" {...register("bio")} rows={3} placeholder="A short professional bio..." />
            </div>
          </div>

          <div className="glass rounded-xl p-6 space-y-4">
            <h2 className="font-semibold">Contact</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input id="phone" {...register("phone")} placeholder="+1 234 567 890" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" {...register("email")} placeholder="john@example.com" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="website">Website</Label>
              <Input id="website" {...register("website")} placeholder="https://example.com" />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="whatsapp">WhatsApp</Label>
                <Input id="whatsapp" {...register("whatsapp")} placeholder="+1 234 567 890" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input id="location" {...register("location")} placeholder="New York, NY" />
              </div>
            </div>
          </div>

          <div className="glass rounded-xl p-6 space-y-4">
            <h2 className="font-semibold">Social Links</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="linkedin">LinkedIn</Label>
                <Input id="linkedin" {...register("linkedin")} placeholder="https://linkedin.com/in/..." />
              </div>
              <div className="space-y-2">
                <Label htmlFor="twitter">X / Twitter</Label>
                <Input id="twitter" {...register("twitter")} placeholder="https://x.com/..." />
              </div>
              <div className="space-y-2">
                <Label htmlFor="github">GitHub</Label>
                <Input id="github" {...register("instagram")} placeholder="https://github.com/..." />
              </div>
              <div className="space-y-2">
                <Label htmlFor="facebook">Facebook</Label>
                <Input id="facebook" {...register("facebook")} placeholder="https://facebook.com/..." />
              </div>
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Create Card
          </Button>
        </form>

        <div className="lg:col-span-2">
          <div className="sticky top-24">
            <p className="mb-2 text-sm font-medium text-muted-foreground">Live Preview</p>
            <div className="glass rounded-xl p-6 glow-sm">
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-primary to-cyan text-lg font-bold text-white">
                  {watchedValues.name
                    ?.split(" ")
                    .map((n: string) => n[0])
                    .join("")
                    .toUpperCase()
                    .slice(0, 2) || "??"}
                </div>
                <div>
                  <h3 className="font-semibold">{watchedValues.name || "Your Name"}</h3>
                  <p className="text-sm text-muted-foreground">
                    {watchedValues.designation || "Designation"}
                    {watchedValues.company ? ` at ${watchedValues.company}` : ""}
                  </p>
                </div>
              </div>
              {watchedValues.bio && (
                <p className="mt-4 text-sm text-muted-foreground line-clamp-3">{watchedValues.bio}</p>
              )}
              <div className="mt-4 flex flex-wrap gap-2">
                {watchedValues.phone && (
                  <span className="rounded-full bg-primary/20 px-3 py-1 text-xs text-primary">{watchedValues.phone}</span>
                )}
                {watchedValues.email && (
                  <span className="rounded-full bg-cyan/20 px-3 py-1 text-xs text-cyan">{watchedValues.email}</span>
                )}
                {watchedValues.location && (
                  <span className="rounded-full bg-muted px-3 py-1 text-xs text-muted-foreground">{watchedValues.location}</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
