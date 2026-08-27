"use client";

import { Check } from "lucide-react";

export interface WorkflowStep {
  num: number;
  title: string;
  description: string;
  status: "pending" | "current" | "completed";
}

interface WorkflowProgressProps {
  steps: WorkflowStep[];
  currentStep: number;
}

export function WorkflowProgress({ steps, currentStep }: WorkflowProgressProps) {
  return (
    <div className="w-full overflow-x-auto pb-4">
      <div className="flex items-center gap-1 min-w-max">
        {steps.map((step, i) => {
          const isCompleted = step.status === "completed";
          const isCurrent = i === currentStep;

          return (
            <div key={step.num} className="flex items-center">
              <div className="flex flex-col items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                    isCompleted
                      ? "bg-primary text-primary-foreground"
                      : isCurrent
                      ? "bg-primary/20 text-primary border-2 border-primary"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {isCompleted ? <Check className="w-4 h-4" /> : step.num}
                </div>
                <span
                  className={`mt-1 text-xs font-medium whitespace-nowrap ${
                    isCurrent ? "text-primary" : isCompleted ? "text-foreground" : "text-muted-foreground"
                  }`}
                >
                  {step.title}
                </span>
              </div>
              {i < steps.length - 1 && (
                <div
                  className={`w-8 h-0.5 mx-1 ${
                    isCompleted ? "bg-primary" : "bg-muted"
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
