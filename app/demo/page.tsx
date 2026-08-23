import type { Metadata } from "next";
import { DemoWrapper } from "@/components/demo/demo-wrapper";

export const metadata: Metadata = {
  title: "Live Demo - HoloCard",
  description:
    "Experience HoloCard's interactive 3D business cards, AR experience, QR generator, card builder, analytics dashboard, and professional templates.",
  openGraph: {
    title: "HoloCard Live Demo",
    description:
      "Try all HoloCard features: 3D cards, AR, QR codes, analytics, and templates.",
    type: "website",
  },
};

export default function DemoPage() {
  return <DemoWrapper />;
}
