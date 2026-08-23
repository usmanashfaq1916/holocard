import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || "https://holocard.app"),
  title: {
    default: "HoloCard - AR Business Cards Reimagined",
    template: "%s | HoloCard",
  },
  description:
    "Create interactive digital business cards that come alive through Augmented Reality. The future of professional networking.",
  keywords: [
    "AR business card",
    "augmented reality",
    "digital business card",
    "QR code",
    "professional networking",
    "3D card",
  ],
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "HoloCard",
    title: "HoloCard - Your Business Card, Reimagined in AR",
    description:
      "Create an interactive digital business card that comes alive through Augmented Reality.",
    images: ["/og-image.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "HoloCard - Your Business Card, Reimagined in AR",
    description:
      "Create an interactive digital business card that comes alive through Augmented Reality.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

import { Toaster } from "sonner";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body className="min-h-screen bg-background text-foreground antialiased">
        {children}
        <Toaster richColors position="bottom-right" />
      </body>
    </html>
  );
}
