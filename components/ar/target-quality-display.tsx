"use client";

import { Check, AlertTriangle, Info } from "lucide-react";
import type { TargetQualityResult } from "@/lib/ar/target-quality";

interface TargetQualityDisplayProps {
  result: TargetQualityResult;
}

export function TargetQualityDisplay({ result }: TargetQualityDisplayProps) {
  const ratingColors = {
    excellent: "text-emerald-500",
    good: "text-primary",
    fair: "text-yellow-500",
    poor: "text-destructive",
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold">AR Target Quality</h3>
        <div className="flex items-center gap-2">
          <span className={`text-2xl font-bold ${ratingColors[result.rating]}`}>
            {result.score}
          </span>
          <span className="text-sm text-muted-foreground">/ 100</span>
          <span className={`text-xs font-medium uppercase ${ratingColors[result.rating]}`}>
            — {result.rating}
          </span>
        </div>
      </div>

      <div className="w-full bg-muted rounded-full h-2">
        <div
          className={`h-2 rounded-full transition-all ${
            result.rating === "excellent"
              ? "bg-emerald-500"
              : result.rating === "good"
              ? "bg-primary"
              : result.rating === "fair"
              ? "bg-yellow-500"
              : "bg-destructive"
          }`}
          style={{ width: `${result.score}%` }}
        />
      </div>

      <div className="space-y-2">
        {result.checks.map((check) => (
          <div key={check.name} className="flex items-center gap-2 text-sm">
            {check.passed ? (
              <Check className="w-4 h-4 text-emerald-500 shrink-0" />
            ) : (
              <AlertTriangle className="w-4 h-4 text-yellow-500 shrink-0" />
            )}
            <span className="font-medium">{check.name}</span>
            <span className="text-muted-foreground">— {check.message}</span>
          </div>
        ))}
      </div>

      {result.warnings.length > 0 && (
        <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-3">
          <div className="flex items-center gap-2 text-sm font-medium text-yellow-600 mb-1">
            <AlertTriangle className="w-4 h-4" />
            Warnings
          </div>
          <ul className="text-xs text-muted-foreground space-y-1">
            {result.warnings.map((w, i) => (
              <li key={i}>- {w}</li>
            ))}
          </ul>
        </div>
      )}

      {result.recommendations.length > 0 && (
        <div className="bg-primary/5 border border-primary/10 rounded-lg p-3">
          <div className="flex items-center gap-2 text-sm font-medium text-primary mb-1">
            <Info className="w-4 h-4" />
            Recommendations
          </div>
          <ul className="text-xs text-muted-foreground space-y-1">
            {result.recommendations.map((r, i) => (
              <li key={i}>- {r}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
