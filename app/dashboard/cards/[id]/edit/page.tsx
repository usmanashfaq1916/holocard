"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Loader2 } from "lucide-react";
import { cardSchema, type CardInput } from "@/lib/validation";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function EditCardPage() {
  const router = useRouter();
  const params = useParams();
  const cardId = params.id as string;
  const [isLoading, setIsLoading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<CardInput>({
    resolver: zodResolver(cardSchema),
  });

  const watchedValues = watch();

  useEffect(() => {
    fetch(`/api/cards/${cardId}`)
      .then((r) => r.json())
      .then((data) => {
        reset({
          name: data.name || "",
          slug: data.slug || "",
          designation: data.designation || "",
          company: data.company || "",
          bio: data.bio || "",
          phone: data.phone || "",
          email: data.email || "",
          website: data.website || "",
          whatsapp: data.whatsapp || "",
          linkedin: data.linkedin || "",
          facebook: data.facebook || "",
          instagram: data.instagram || "",
          twitter: data.twitter || "",
          location: data.location || "",
        });
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load card");
        setLoading(false);
      });
  }, [cardId, reset]);

  const onSubmit = async (data: CardInput) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/cards/${cardId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const result = await res.json();
        setError(result.error || "Failed to update card");
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

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Edit Card</h1>
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
                <Input id="name" {...register("name")} />
                {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="slug">Card URL Slug *</Label>
                <div className="flex items-center">
                  <span className="rounded-l-lg border border-r-0 border-border bg-muted px-3 py-2 text-sm text-muted-foreground">/card/</span>
                  <Input id="slug" {...register("slug")} className="rounded-l-none" />
                </div>
                {errors.slug && <p className="text-xs text-destructive">{errors.slug.message}</p>}
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="designation">Designation</Label>
                <Input id="designation" {...register("designation")} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="company">Company</Label>
                <Input id="company" {...register("company")} />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea id="bio" {...register("bio")} rows={3} />
            </div>
          </div>

          <div className="glass rounded-xl p-6 space-y-4">
            <h2 className="font-semibold">Contact</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input id="phone" {...register("phone")} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" {...register("email")} />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="website">Website</Label>
              <Input id="website" {...register("website")} />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="whatsapp">WhatsApp</Label>
                <Input id="whatsapp" {...register("whatsapp")} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input id="location" {...register("location")} />
              </div>
            </div>
          </div>

          <div className="glass rounded-xl p-6 space-y-4">
            <h2 className="font-semibold">Social Links</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="linkedin">LinkedIn</Label>
                <Input id="linkedin" {...register("linkedin")} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="twitter">X / Twitter</Label>
                <Input id="twitter" {...register("twitter")} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="github">GitHub</Label>
                <Input id="github" {...register("instagram")} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="facebook">Facebook</Label>
                <Input id="facebook" {...register("facebook")} />
              </div>
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save Changes
          </Button>
        </form>

        <div className="lg:col-span-2">
          <div className="sticky top-24">
            <p className="mb-2 text-sm font-medium text-muted-foreground">Live Preview</p>
            <div className="glass rounded-xl p-6 glow-sm">
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-primary to-cyan text-lg font-bold text-white">
                  {watchedValues.name?.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2) || "??"}
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
                {watchedValues.phone && <span className="rounded-full bg-primary/20 px-3 py-1 text-xs text-primary">{watchedValues.phone}</span>}
                {watchedValues.email && <span className="rounded-full bg-cyan/20 px-3 py-1 text-xs text-cyan">{watchedValues.email}</span>}
                {watchedValues.location && <span className="rounded-full bg-muted px-3 py-1 text-xs text-muted-foreground">{watchedValues.location}</span>}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
