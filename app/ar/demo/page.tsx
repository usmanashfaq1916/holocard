"use client";

import { useState, useCallback } from "react";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";
import { Camera, Smartphone } from "lucide-react";
import { compileTarget } from "@/lib/ar/target-compiler";
import { detectARSupport, AR_ERRORS } from "@/lib/ar/ar-types";
import {
  ARLoading,
  ARErrorScreen,
  ARStatusOverlay,
} from "@/components/ar/ar-ui";
import { DemoCardScene } from "@/components/ar/scenes/demo-card-scene";

const ARView = dynamic(
  () => import("r3f-mind-ar").then((mod) => mod.ARView),
  { ssr: false }
);

type ViewerState = "instructions" | "loading" | "ar" | "error";

const GOLD = "#D4AF37";

function DemoInstructions({ onStart }: { onStart: () => void }) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
            style={{ backgroundColor: `${GOLD}20` }}
          >
            <Smartphone className="w-8 h-8" style={{ color: GOLD }} />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">
            AR Business Card Demo
          </h1>
          <p className="text-slate-400">
            Point your camera at the card to see it come to life
          </p>
        </div>

        <div className="mb-6 rounded-lg overflow-hidden border border-slate-700">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/demo.png"
            alt="Demo card"
            className="w-full h-auto"
          />
        </div>

        <div className="space-y-4 mb-8 text-left">
          {[
            { step: "1", text: "Allow camera access when prompted" },
            { step: "2", text: "Point your camera at the business card" },
            { step: "3", text: "Keep the entire card visible in frame" },
            { step: "4", text: "Watch the AR experience appear!" },
          ].map(({ step, text }) => (
            <div key={step} className="flex items-start gap-3">
              <div
                className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                style={{ backgroundColor: GOLD }}
              >
                {step}
              </div>
              <p className="text-slate-300 text-sm">{text}</p>
            </div>
          ))}
        </div>

        <Button onClick={onStart} className="w-full" size="lg">
          <Camera className="w-5 h-5 mr-2" />
          Start AR Experience
        </Button>
      </div>
    </div>
  );
}

export default function DemoARPage() {
  const [state, setState] = useState<ViewerState>("instructions");
  const [arError, setArError] = useState<
    (typeof AR_ERRORS)[keyof typeof AR_ERRORS] | null
  >(null);
  const [mindUrl, setMindUrl] = useState<string | null>(null);
  const [loadingProgress, setLoadingProgress] = useState("Checking AR support...");
  const [targetFound, setTargetFound] = useState(false);

  const handleStartAR = useCallback(async () => {
    const support = detectARSupport();
    if (!support.supported) {
      setArError(support.error || AR_ERRORS.UNSUPPORTED_BROWSER);
      setState("error");
      return;
    }

    setState("loading");
    setLoadingProgress("Starting camera...");

    try {
      setLoadingProgress("Compiling target image...");
      const response = await fetch("/demo.png");
      const blob = await response.blob();
      const file = new File([blob], "demo.png", { type: "image/png" });

      setLoadingProgress("Analyzing image features...");
      const result = await compileTarget(file, (progress) => {
        if (progress.phase === "matching") {
          setLoadingProgress(`Matching features... ${Math.round(progress.progress)}%`);
        } else if (progress.phase === "tracking") {
          setLoadingProgress(`Building tracking data... ${Math.round(progress.progress)}%`);
        } else {
          setLoadingProgress("Finalizing...");
        }
      });

      const mindBlob = new Blob([new Uint8Array(result.buffer)], {
        type: "application/octet-stream",
      });
      const url = URL.createObjectURL(mindBlob);
      setMindUrl(url);

      setLoadingProgress("Ready!");
      setState("ar");
    } catch (err) {
      console.error("Compile error:", err);
      setArError({
        code: "ASSET_LOAD_FAILED",
        message: "Failed to compile target image.",
        suggestion: "Try refreshing the page.",
      });
      setState("error");
    }
  }, []);

  const handleInteraction = useCallback((type: string, url?: string) => {
    if (url) {
      window.open(url, "_blank", "noopener,noreferrer");
    }
  }, []);

  const handleAnchorFound = useCallback(() => {
    setTargetFound(true);
  }, []);

  const handleAnchorLost = useCallback(() => {
    setTargetFound(false);
  }, []);

  if (state === "instructions") {
    return <DemoInstructions onStart={handleStartAR} />;
  }

  if (state === "loading") {
    return <ARLoading progress={loadingProgress} />;
  }

  if (state === "error" && arError) {
    return (
      <ARErrorScreen
        error={arError}
        onRetry={handleStartAR}
      />
    );
  }

  if (state === "ar" && mindUrl) {
    return (
      <div className="relative w-full h-screen">
        <ARView
          imageTargets={mindUrl}
          maxTrack={1}
          autoplay={true}
          flipUserCamera={false}
          onReady={() => setLoadingProgress("Ready!")}
          onError={(err) => {
            setArError({
              code: "TRACKING_FAILED",
              message: "AR tracking failed",
              suggestion: err.message,
            });
            setState("error");
          }}
        >
          <ambientLight intensity={0.9} />
          <directionalLight position={[5, 5, 5]} intensity={1} />
          <pointLight position={[-3, 3, 2]} intensity={0.5} color="#60A5FA" />

          <DemoCardScene
            onInteraction={handleInteraction}
            onAnchorFound={handleAnchorFound}
            onAnchorLost={handleAnchorLost}
          />
        </ARView>

        <ARStatusOverlay
          isTracking={true}
          targetFound={targetFound}
          animPhase={targetFound ? 3 : 0}
        />

        <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-center z-50">
          <div className="bg-black/50 backdrop-blur-md rounded-full px-4 py-2 text-white text-sm font-medium">
            AR Demo
          </div>
          <button
            onClick={() => {
              if (mindUrl) URL.revokeObjectURL(mindUrl);
              setState("instructions");
              setMindUrl(null);
              setTargetFound(false);
            }}
            className="bg-black/50 backdrop-blur-md rounded-full px-4 py-2 text-white text-sm hover:bg-black/70 transition-colors"
          >
            Back
          </button>
        </div>
      </div>
    );
  }

  return null;
}
