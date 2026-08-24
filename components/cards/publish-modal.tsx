"use client";

import { useState } from "react";
import Link from "next/link";
import { Check, ExternalLink, Copy, QrCode, Share2, X, Loader2 } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { toast } from "sonner";
import { QRGenerator } from "@/components/cards/qr-generator";

interface PublishModalProps {
  cardId: string;
  cardName: string;
  cardSlug: string;
  open: boolean;
  onClose: () => void;
  onPublished: () => void;
}

type Step = "validate" | "confirm" | "success";

export function PublishModal({ cardId, cardName, cardSlug, open, onClose, onPublished }: PublishModalProps) {
  const [step, setStep] = useState<Step>("validate");
  const [publishing, setPublishing] = useState(false);
  const [copied, setCopied] = useState(false);

  const handlePublish = async () => {
    setPublishing(true);
    try {
      const res = await fetch(`/api/cards/${cardId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "ACTIVE" }),
      });
      if (res.ok) {
        setStep("success");
        onPublished();
      } else {
        toast.error("Failed to publish");
        setStep("confirm");
      }
    } catch {
      toast.error("Failed to publish");
      setStep("confirm");
    }
    setPublishing(false);
  };

  const startPublish = () => {
    setStep("validate");
    // Simulate validation
    setTimeout(() => setStep("confirm"), 800);
  };

  const copyUrl = () => {
    navigator.clipboard.writeText(`${window.location.origin}/card/${cardSlug}`);
    setCopied(true);
    toast.success("URL copied!");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClose = () => {
    setStep("validate");
    onClose();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div
        className="relative w-full max-w-lg overflow-hidden rounded-2xl bg-background shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={handleClose}
          className="absolute right-3 top-3 z-10 rounded-full bg-muted p-1.5 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Step: Validating */}
        {step === "validate" && (
          <div className="flex flex-col items-center p-8 text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <Loader2 className="h-8 w-8 text-primary animate-spin" />
            </div>
            <h2 className="text-xl font-bold">Validating Card</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Checking your card is ready to publish...
            </p>
          </div>
        )}

        {/* Step: Confirm */}
        {step === "confirm" && (
          <div className="p-6">
            <h2 className="text-xl font-bold">Publish Your HoloCard</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Review and publish <strong>{cardName}</strong>
            </p>

            <div className="mt-4 space-y-3">
              <div className="flex items-center gap-3 rounded-lg border border-border p-3">
                <Check className="h-4 w-4 text-success" />
                <span className="text-sm">Profile information complete</span>
              </div>
              <div className="flex items-center gap-3 rounded-lg border border-border p-3">
                <Check className="h-4 w-4 text-success" />
                <span className="text-sm">Card URL: /card/{cardSlug}</span>
              </div>
              <div className="flex items-center gap-3 rounded-lg border border-border p-3">
                <Check className="h-4 w-4 text-success" />
                <span className="text-sm">QR code will be generated automatically</span>
              </div>
            </div>

            <div className="mt-6 flex gap-3">
              <button
                onClick={handlePublish}
                disabled={publishing}
                className={buttonVariants({ variant: "default" })}
              >
                {publishing ? (
                  <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Publishing...</>
                ) : (
                  <>Publish Now</>
                )}
              </button>
              <button
                onClick={handleClose}
                className={buttonVariants({ variant: "outline" })}
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Step: Success */}
        {step === "success" && (
          <div className="p-6">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-success/10">
              <Check className="h-7 w-7 text-success" />
            </div>
            <h2 className="text-xl font-bold">Your HoloCard is now live!</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {cardName} is published and ready to share.
            </p>

            <div className="mt-4 rounded-xl border border-border p-4">
              <div className="flex items-center justify-center">
                <QRGenerator slug={cardSlug} size={140} />
              </div>
              <p className="mt-2 text-center text-xs text-muted-foreground">
                /card/{cardSlug}
              </p>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              <Link
                href={`/card/${cardSlug}`}
                target="_blank"
                className={buttonVariants({ variant: "default", size: "sm" })}
              >
                <ExternalLink className="mr-1 h-3 w-3" /> Open Card
              </Link>
              <button onClick={copyUrl} className={buttonVariants({ variant: "outline", size: "sm" })}>
                {copied ? <Check className="mr-1 h-3 w-3" /> : <Copy className="mr-1 h-3 w-3" />}
                {copied ? "Copied!" : "Copy URL"}
              </button>
              <a
                href={`/api/qr/${cardSlug}?format=png`}
                download
                className={buttonVariants({ variant: "outline", size: "sm" })}
              >
                <QrCode className="mr-1 h-3 w-3" /> Download QR
              </a>
            </div>

            <button
              onClick={handleClose}
              className={buttonVariants({ variant: "outline", className: "mt-4 w-full" })}
            >
              Done
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
