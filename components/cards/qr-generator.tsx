"use client";

import { useEffect, useState } from "react";
import QRCodeLib from "qrcode";

interface QRGeneratorProps {
  slug: string;
  size?: number;
}

export function QRGenerator({ slug, size = 200 }: QRGeneratorProps) {
  const [dataUrl, setDataUrl] = useState<string | null>(null);
  const url = `${typeof window !== "undefined" ? window.location.origin : ""}/card/${slug}`;

  useEffect(() => {
    QRCodeLib.toDataURL(url, {
      width: size,
      margin: 2,
      color: { dark: "#ffffff", light: "#050A14" },
    }).then(setDataUrl);
  }, [url, size]);

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
