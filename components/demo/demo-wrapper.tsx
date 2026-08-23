"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Demo3DCard } from "./demo-3d-card";
import { DemoAR } from "./demo-ar";
import { DemoQR } from "./demo-qr";
import { DemoBuilder } from "./demo-builder";
import { DemoAnalytics } from "./demo-analytics";
import { DemoTemplates } from "./demo-templates";
import { DemoCTA } from "./demo-cta";

const steps = [
  { num: "01", title: "3D HoloCard", component: Demo3DCard },
  { num: "02", title: "AR Experience", component: DemoAR },
  { num: "03", title: "QR Generator", component: DemoQR },
  { num: "04", title: "Card Builder", component: DemoBuilder },
  { num: "05", title: "Analytics", component: DemoAnalytics },
  { num: "06", title: "Templates", component: DemoTemplates },
  { num: "07", title: "Get Started", component: DemoCTA },
];

export function DemoWrapper() {
  const [currentStep, setCurrentStep] = useState(0);

  const goTo = useCallback((index: number) => {
    if (index >= 0 && index < steps.length) {
      setCurrentStep(index);
    }
  }, []);

  const next = useCallback(() => goTo(currentStep + 1), [currentStep, goTo]);
  const prev = useCallback(() => goTo(currentStep - 1), [currentStep, goTo]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === "ArrowDown") {
        e.preventDefault();
        next();
      }
      if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
        e.preventDefault();
        prev();
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [next, prev]);

  const StepComponent = steps[currentStep].component;

  return (
    <div className="relative min-h-screen">
      {/* Progress bar */}
      <div className="fixed top-0 left-0 right-0 z-50 h-1 bg-border">
        <motion.div
          className="h-full bg-gradient-to-r from-primary to-cyan"
          animate={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        />
      </div>

      {/* Side navigation dots */}
      <div className="fixed right-6 top-1/2 z-50 -translate-y-1/2 hidden md:flex flex-col gap-3">
        {steps.map((step, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            className="group relative flex items-center justify-end"
            aria-label={`Go to step ${i + 1}: ${step.title}`}
          >
            <span className="mr-3 rounded-md bg-background/80 px-2 py-0.5 text-xs font-medium opacity-0 shadow-sm backdrop-blur-sm transition-opacity group-hover:opacity-100">
              {step.title}
            </span>
            <span
              className={`h-3 w-3 rounded-full border-2 transition-all ${
                i === currentStep
                  ? "border-primary bg-primary scale-125"
                  : "border-border bg-background hover:border-primary/50"
              }`}
            />
          </button>
        ))}
      </div>

      {/* Step content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -30 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="min-h-screen"
        >
          <StepComponent />
        </motion.div>
      </AnimatePresence>

      {/* Bottom navigation */}
      <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
          <button
            onClick={prev}
            disabled={currentStep === 0}
            className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="h-4 w-4" />
            Previous
          </button>

          {/* Mobile step indicators */}
          <div className="flex gap-2 md:hidden">
            {steps.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                className={`h-2 w-2 rounded-full transition-all ${
                  i === currentStep ? "bg-primary w-6" : "bg-border"
                }`}
              />
            ))}
          </div>

          <div className="hidden md:flex items-center gap-2 text-sm text-muted-foreground">
            <span className="font-semibold text-foreground">{steps[currentStep].num}</span>
            <span>/</span>
            <span>{steps.length.toString().padStart(2, "0")}</span>
            <span className="ml-2">{steps[currentStep].title}</span>
          </div>

          <button
            onClick={next}
            disabled={currentStep === steps.length - 1}
            className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-30 disabled:cursor-not-allowed"
          >
            Next
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
