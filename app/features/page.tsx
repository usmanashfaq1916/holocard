import type { Metadata } from "next";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

export const metadata: Metadata = {
  title: "Features",
  description:
    "Discover the powerful features of HoloCard - AR experiences, QR codes, analytics, and more.",
};

export default function FeaturesPage() {
  const features = [
    {
      title: "Augmented Reality",
      description:
        "Bring your business card to life with immersive AR experiences that leave a lasting impression.",
      icon: "✦",
    },
    {
      title: "3D Business Cards",
      description:
        "Create stunning 3D digital business cards that stand out from the crowd.",
      icon: "◈",
    },
    {
      title: "QR Codes",
      description:
        "Every card gets a unique QR code. Download as PNG, SVG, or share directly.",
      icon: "⊡",
    },
    {
      title: "Digital Contact",
      description:
        "Let visitors save your contact info instantly with one-tap vCard download.",
      icon: "◎",
    },
    {
      title: "Social Links",
      description:
        "All your social profiles in one beautiful, shareable card.",
      icon: "⬡",
    },
    {
      title: "Video Introduction",
      description:
        "Add a video intro to your card for a personal touch.",
      icon: "▶",
    },
    {
      title: "Portfolio",
      description:
        "Showcase your work directly on your digital business card.",
      icon: "▤",
    },
    {
      title: "Analytics",
      description:
        "Track views, QR scans, AR sessions, and contact saves with detailed analytics.",
      icon: "◇",
    },
    {
      title: "Custom Themes",
      description:
        "Choose from 10+ professional templates or create your own unique design.",
      icon: "◆",
    },
    {
      title: "AI Profile Generator",
      description:
        "Let AI help you craft the perfect professional bio and card content.",
      icon: "✦",
    },
    {
      title: "Contact Sharing",
      description:
        "Share your card via WhatsApp, LinkedIn, email, or any social platform.",
      icon: "↗",
    },
    {
      title: "Multiple Cards",
      description:
        "Create separate cards for personal, professional, and freelance use.",
      icon: "⊞",
    },
  ];

  return (
    <div className="min-h-screen bg-grid bg-radial">
      <Navbar />
      <div className="relative z-10 mx-auto max-w-6xl px-4 py-24">
        <div className="mb-16 text-center">
          <h1 className="mb-4 text-4xl font-bold md:text-5xl">
            <span className="text-gradient">Powerful</span> Features
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            Everything you need to create, share, and track your professional
            digital business card.
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="glass group rounded-xl p-6 transition-all hover:glow-sm"
            >
              <div className="mb-4 text-3xl text-primary">{feature.icon}</div>
              <h3 className="mb-2 text-lg font-semibold">{feature.title}</h3>
              <p className="text-sm text-muted-foreground">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
}
