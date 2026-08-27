"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { AlertTriangle } from "lucide-react";

export default function ARError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const router = useRouter();

  useEffect(() => {
    console.error("[AR Page Error]", error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-6 text-center">
      <AlertTriangle className="mb-4 h-10 w-10 text-warning" />
      <h1 className="mb-2 text-lg font-semibold">AR Experience Unavailable</h1>
      <p className="mb-6 max-w-sm text-sm text-muted-foreground">
        Something went wrong while loading the AR experience. You can try again or view the digital card instead.
      </p>
      <div className="flex gap-3">
        <button
          onClick={reset}
          className="rounded-full border border-border bg-background px-4 py-2 text-xs font-medium transition-colors hover:bg-accent"
        >
          Try Again
        </button>
        <button
          onClick={() => router.push("/")}
          className="rounded-full bg-primary px-4 py-2 text-xs font-medium text-primary-foreground transition-colors hover:bg-primary/90"
        >
          Go Home
        </button>
      </div>
    </div>
  );
}
