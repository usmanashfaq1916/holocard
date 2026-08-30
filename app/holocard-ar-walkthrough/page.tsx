import type { Metadata } from "next";
import { ARWalkthroughCard } from "@/components/home/ar-walkthrough-card";

export const metadata: Metadata = {
  title: "AR Walkthrough",
  description:
    "Scan it. Tilt it. Flip it. See how HoloCard brings business cards to life with augmented reality — no app needed.",
  openGraph: {
    title: "HoloCard — Your card, alive.",
    description:
      "Interactive AR business card demo. Scan, tilt, flip, and save contacts instantly.",
    url: "https://holocard-fawn.vercel.app/holocard-ar-walkthrough",
    siteName: "HoloCard",
    type: "website",
  },
};

export default function ARWalkthroughPage() {
  return <ARWalkthroughCard />;
}
