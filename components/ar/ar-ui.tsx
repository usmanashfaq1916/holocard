"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Camera,
  Eye,
  ArrowRight,
  Loader2,
  AlertTriangle,
  Smartphone,
  RotateCcw,
} from "lucide-react";
import { detectARSupport, AR_ERRORS, type ARError } from "@/lib/ar/ar-types";

interface ARInstructionsProps {
  onStart: () => void;
  onView3D: () => void;
  onViewDigital: () => void;
  cardName: string;
}

export function ARInstructions({
  onStart,
  onView3D,
  onViewDigital,
  cardName,
}: ARInstructionsProps) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30 flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Smartphone className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-2">
            Bring Your HoloCard to Life
          </h1>
          <p className="text-muted-foreground">
            Experience {cardName}&apos;s business card in augmented reality
          </p>
        </div>

        <div className="space-y-4 mb-8 text-left">
          {[
            { step: "1", text: "Allow camera access when prompted" },
            { step: "2", text: "Point your camera at the HoloCard" },
            { step: "3", text: "Keep the entire card visible in frame" },
            { step: "4", text: "Watch your AR experience appear!" },
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
          <Button onClick={onStart} className="w-full" size="lg">
            <Camera className="w-5 h-5 mr-2" />
            Start AR Experience
          </Button>
          <div className="flex gap-3">
            <Button
              onClick={onView3D}
              variant="outline"
              className="flex-1"
            >
              <Eye className="w-4 h-4 mr-1" />
              View in 3D
            </Button>
            <Button
              onClick={onViewDigital}
              variant="outline"
              className="flex-1"
            >
              <ArrowRight className="w-4 h-4 mr-1" />
              Digital Card
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

interface ARLoadingProps {
  progress?: string;
}

export function ARLoading({ progress }: ARLoadingProps) {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center">
        <Loader2 className="w-12 h-12 text-primary animate-spin mx-auto mb-4" />
        <h2 className="text-lg font-medium text-foreground mb-2">
          Preparing your AR experience...
        </h2>
        <p className="text-sm text-muted-foreground">{progress || "Loading assets..."}</p>
      </div>
    </div>
  );
}

interface ARErrorScreenProps {
  error: ARError;
  onRetry?: () => void;
  onView3D?: () => void;
}

export function ARErrorScreen({ error, onRetry, onView3D }: ARErrorScreenProps) {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        <div className="w-16 h-16 bg-destructive/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <AlertTriangle className="w-8 h-8 text-destructive" />
        </div>
        <h2 className="text-xl font-bold text-foreground mb-2">{error.message}</h2>
        <p className="text-muted-foreground mb-6">{error.suggestion}</p>
        <div className="flex gap-3 justify-center">
          {onRetry && (
            <Button onClick={onRetry} variant="outline">
              <RotateCcw className="w-4 h-4 mr-1" />
              Try Again
            </Button>
          )}
          {onView3D && (
            <Button onClick={onView3D}>
              <Eye className="w-4 h-4 mr-1" />
              View in 3D
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

interface ARStatusOverlayProps {
  isTracking: boolean;
  targetFound: boolean;
  animPhase?: number;
}

export function ARStatusOverlay({ isTracking, targetFound, animPhase = 0 }: ARStatusOverlayProps) {
  if (!isTracking) return null;

  let statusText = "Point camera at the HoloCard...";
  let statusColor = "bg-black/50 text-white";

  if (targetFound) {
    statusColor = "bg-green-500/90 text-white";
    if (animPhase < 1) {
      statusText = "Card detected!";
    } else if (animPhase < 2) {
      statusText = "Loading profile...";
    } else if (animPhase < 3) {
      statusText = "Loading 3D content...";
    } else {
      statusText = "Ready!";
    }
  }

  return (
    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-50">
      <div
        className={`px-4 py-2 rounded-full text-sm font-medium backdrop-blur-md transition-all ${statusColor}`}
      >
        {statusText}
      </div>
    </div>
  );
}
