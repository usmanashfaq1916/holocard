"use client";

import { useEffect, useRef, useCallback } from "react";

type EventName =
  | "QR_SCAN"
  | "AR_PAGE_OPENED"
  | "CAMERA_STARTED"
  | "TARGET_DETECTED"
  | "AR_EXPERIENCE_STARTED"
  | "AR_INTERACTION"
  | "CTA_CLICK"
  | "AR_SESSION";

interface TrackEventOptions {
  cardId: string;
  eventType: EventName;
  metadata?: Record<string, unknown>;
}

function getDeviceType(): string {
  if (typeof window === "undefined") return "unknown";
  const ua = navigator.userAgent;
  if (/android/i.test(ua)) return "android";
  if (/iPad|iPhone|iPod/.test(ua)) return "ios";
  return "desktop";
}

function getBrowser(): string {
  if (typeof window === "undefined") return "unknown";
  const ua = navigator.userAgent;
  if (ua.includes("Chrome") && !ua.includes("Edg")) return "chrome";
  if (ua.includes("Safari") && !ua.includes("Chrome")) return "safari";
  if (ua.includes("Firefox")) return "firefox";
  if (ua.includes("Edg")) return "edge";
  if (ua.includes("Samsung")) return "samsung";
  return "other";
}

export async function trackAREvent({
  cardId,
  eventType,
  metadata,
}: TrackEventOptions): Promise<void> {
  try {
    await fetch("/api/analytics/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        cardId,
        eventType,
        deviceType: getDeviceType(),
        browser: getBrowser(),
        referrer: document.referrer || undefined,
        metadata,
      }),
    });
  } catch {
    // Silently fail - analytics should not break AR
  }
}

export function useARSession(cardId: string) {
  const sessionStart = useRef<number>(Date.now());
  const hasTrackedSession = useRef(false);

  useEffect(() => {
    sessionStart.current = Date.now();
    trackAREvent({ cardId, eventType: "AR_SESSION", metadata: { action: "start" } });
    hasTrackedSession.current = true;

    return () => {
      if (hasTrackedSession.current) {
        const duration = Math.round((Date.now() - sessionStart.current) / 1000);
        trackAREvent({
          cardId,
          eventType: "AR_SESSION",
          metadata: { action: "end", duration },
        });
      }
    };
  }, [cardId]);

  const trackEvent = useCallback(
    (eventType: EventName, metadata?: Record<string, unknown>) => {
      trackAREvent({ cardId, eventType, metadata });
    },
    [cardId]
  );

  return { trackEvent };
}
