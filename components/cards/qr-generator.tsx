"use client";

import { useEffect, useState } from "react";
import QRCodeLib from "qrcode";

interface QRGeneratorProps {
  slug: string;
  type?: "ar" | "card";
  size?: number;
  darkColor?: string;
  lightColor?: string;
}

export function QRGenerator({ slug, type = "ar", size = 200, darkColor, lightColor }: QRGeneratorProps) {
  const [dataUrl, setDataUrl] = useState<string | null>(null);
  const [isDark, setIsDark] = useState(false);
  const path = type === "card" ? "card" : "ar";
  const url = `${typeof window !== "undefined" ? window.location.origin : ""}/${path}/${slug}`;

  useEffect(() => {
    const dark = document.documentElement.classList.contains("dark");
    setIsDark(dark);
  }, []);

  useEffect(() => {
    const dark = darkColor || (isDark ? "#ffffff" : "#0F172A");
    const light = lightColor || (isDark ? "#050A14" : "#ffffff");
    QRCodeLib.toDataURL(url, {
      width: size,
      margin: 2,
      color: { dark, light },
    }).then(setDataUrl).catch(() => {});
  }, [url, size, isDark, darkColor, lightColor]);

  if (!dataUrl) {
    return (
      <div
        className="flex items-center justify-center rounded-lg bg-muted"
        style={{ width: size, height: size }}
      >
        <span className="text-xs text-muted-foreground">Loading...</span>
      </div>
    );
  }

  return <img src={dataUrl} alt={`QR code for ${slug}`} width={size} height={size} className="rounded-lg" />;
}
