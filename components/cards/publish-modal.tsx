"use client";

import { useState, useCallback } from "react";
import {
  Check,
  Rocket,
  QrCode,
  Eye,
  Copy,
  Download,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface PublishModalProps {
  open: boolean;
  onClose: () => void;
  cardId?: string;
  cardSlug: string;
  cardName: string;
  onPublished?: () => void;
}

export function PublishModal({
  open,
  onClose,
  cardSlug,
  cardName,
  onPublished,
}: PublishModalProps) {
  const [copied, setCopied] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [published, setPublished] = useState(false);

  const arUrl = `${typeof window !== "undefined" ? window.location.origin : ""}/ar/${cardSlug}`;

  const handleCopy = useCallback(async () => {
    await navigator.clipboard.writeText(arUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [arUrl]);

  const handlePublish = useCallback(async () => {
    setPublishing(true);
    try {
      if (onPublished) {
        onPublished();
      }
      setPublished(true);
    } finally {
      setPublishing(false);
    }
  }, [onPublished]);

  if (published) {
    return (
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center">Your HoloCard is Live!</DialogTitle>
          </DialogHeader>
          <div className="space-y-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check className="w-8 h-8 text-emerald-500" />
              </div>
              <p className="text-sm text-muted-foreground">
                {cardName}&apos;s AR business card is now live.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="glass rounded-xl p-4 text-center">
                <QrCode className="w-12 h-12 text-primary mx-auto mb-2" />
                <p className="text-xs font-medium mb-2">AR QR Code</p>
                <Button variant="outline" size="sm">
                  <Download className="w-3 h-3 mr-1" />
                  Download
                </Button>
              </div>
              <div className="glass rounded-xl p-4 text-center">
                <Eye className="w-12 h-12 text-primary mx-auto mb-2" />
                <p className="text-xs font-medium mb-2">AR Experience</p>
                <Button variant="outline" size="sm" onClick={handleCopy}>
                  <Copy className="w-3 h-3 mr-1" />
                  {copied ? "Copied!" : "Copy URL"}
                </Button>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <Button onClick={() => window.open(arUrl, "_blank")} className="w-full">
                <Eye className="w-4 h-4 mr-2" />
                Experience Your AR Card
              </Button>
              <Button
                variant="outline"
                onClick={onClose}
                className="w-full"
              >
                Edit Card
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center">Publish AR Card</DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <Check className="w-5 h-5 text-emerald-500 mt-0.5 shrink-0" />
              <div>
                <p className="text-sm font-medium">Profile Information</p>
                <p className="text-xs text-muted-foreground">Profile name is set</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Check className="w-5 h-5 text-emerald-500 mt-0.5 shrink-0" />
              <div>
                <p className="text-sm font-medium">Card Image</p>
                <p className="text-xs text-muted-foreground">Card image uploaded</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Check className="w-5 h-5 text-emerald-500 mt-0.5 shrink-0" />
              <div>
                <p className="text-sm font-medium">URL Slug</p>
                <p className="text-xs text-muted-foreground">URL: /card/{cardSlug}</p>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={handlePublish}
              disabled={publishing}
              className="flex-1"
            >
              {publishing ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Rocket className="w-4 h-4 mr-2" />
              )}
              Publish
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
