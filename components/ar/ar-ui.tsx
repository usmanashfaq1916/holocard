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
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <div className="w-16 h-16 bg-blue-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Smartphone className="w-8 h-8 text-blue-400" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">
            Bring Your HoloCard to Life
          </h1>
          <p className="text-slate-400">
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
              <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                {step}
              </div>
              <p className="text-slate-300 text-sm">{text}</p>
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
              className="flex-1 border-slate-600 text-slate-300 hover:bg-slate-700"
            >
              <Eye className="w-4 h-4 mr-1" />
              View in 3D
            </Button>
            <Button
              onClick={onViewDigital}
              variant="outline"
              className="flex-1 border-slate-600 text-slate-300 hover:bg-slate-700"
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
    <div className="min-h-screen bg-slate-900 flex items-center justify-center">
      <div className="text-center">
        <Loader2 className="w-12 h-12 text-blue-500 animate-spin mx-auto mb-4" />
        <h2 className="text-lg font-medium text-white mb-2">
          Preparing your AR experience...
        </h2>
        <p className="text-sm text-slate-400">{progress || "Loading assets..."}</p>
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
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        <div className="w-16 h-16 bg-red-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <AlertTriangle className="w-8 h-8 text-red-400" />
        </div>
        <h2 className="text-xl font-bold text-white mb-2">{error.message}</h2>
        <p className="text-slate-400 mb-6">{error.suggestion}</p>
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
}

export function ARStatusOverlay({ isTracking, targetFound }: ARStatusOverlayProps) {
  if (!isTracking) return null;

  return (
    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-50">
      <div
        className={`px-4 py-2 rounded-full text-sm font-medium backdrop-blur-md transition-all ${
          targetFound
            ? "bg-green-500/90 text-white"
            : "bg-black/50 text-white"
        }`}
      >
        {targetFound
          ? "Card detected!"
          : "Point camera at the HoloCard..."}
      </div>
    </div>
  );
}
