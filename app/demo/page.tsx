import type { Metadata } from "next";
import { DemoWrapper } from "@/components/demo/demo-wrapper";

export const metadata: Metadata = {
  title: "Live Demo - HoloCard",
  description:
    "Experience HoloCard's interactive AR business cards, 3D holographic effects, QR generator, card builder, analytics dashboard, and professional templates.",
  openGraph: {
    title: "HoloCard Live Demo",
    description:
      "Try all HoloCard features: AR cards, holographic 3D, QR codes, analytics, and templates.",
    type: "website",
  },
};

export default function DemoPage() {
  return <DemoWrapper />;
}
