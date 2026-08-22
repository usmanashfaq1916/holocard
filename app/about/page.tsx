import type { Metadata } from "next";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

export const metadata: Metadata = {
  title: "About",
  description: "Learn about HoloCard - the future of professional networking.",
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-grid bg-radial">
      <Navbar />
      <div className="relative z-10 mx-auto max-w-4xl px-4 py-24">
        <h1 className="mb-8 text-4xl font-bold md:text-5xl">
          About <span className="text-gradient">HoloCard</span>
        </h1>
        <div className="space-y-6 text-muted-foreground">
          <p className="text-lg">
            HoloCard is reimagining how professionals connect. We believe a
            business card should be more than paper — it should be an
            experience.
          </p>
          <p>
            Our platform transforms traditional business cards into interactive
            digital profiles powered by Augmented Reality. Create your card,
            share it via a QR code, and watch as your contacts experience your
            professional identity in an entirely new dimension.
          </p>
          <p>
            Whether you&apos;re a developer, designer, executive, or freelancer,
            HoloCard gives you the tools to stand out and make a memorable
            impression.
          </p>
          <h2 className="pt-8 text-2xl font-semibold text-foreground">
            Our Mission
          </h2>
          <p>
            To make professional networking immersive, digital, and
            unforgettable. We&apos;re building the future of how people share
            who they are and what they do.
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
}
