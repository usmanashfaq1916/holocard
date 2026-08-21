"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  QrCode,
  Smartphone,
  Eye,
  Share2,
  BarChart3,
  Sparkles,
  Globe,
  Palette,
  Zap,
  Shield,
  Users,
  Layers,
} from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

const features = [
  { icon: Eye, title: "Augmented Reality", desc: "Bring your card to life with immersive AR." },
  { icon: Layers, title: "3D Cards", desc: "Stunning 3D digital business cards." },
  { icon: QrCode, title: "QR Codes", desc: "Unique QR code for instant sharing." },
  { icon: Smartphone, title: "Save Contact", desc: "One-tap vCard download for any device." },
  { icon: Share2, title: "Social Links", desc: "All your profiles in one place." },
  { icon: BarChart3, title: "Analytics", desc: "Track views, scans, and engagement." },
  { icon: Palette, title: "Custom Themes", desc: "10+ templates to match your brand." },
  { icon: Sparkles, title: "AI Generator", desc: "AI-powered professional bios." },
  { icon: Globe, title: "Public URL", desc: "Your own /card/username link." },
  { icon: Shield, title: "Secure", desc: "Enterprise-grade security built in." },
  { icon: Zap, title: "Fast", desc: "Lightning-fast performance on all devices." },
  { icon: Users, title: "Multiple Cards", desc: "Separate cards for every context." },
];

const steps = [
  { num: "01", title: "Create", desc: "Build your professional digital card with our editor." },
  { num: "02", title: "Share", desc: "Share your card via URL, QR code, or social media." },
  { num: "03", title: "Experience", desc: "Visitors scan and experience your AR profile." },
];

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-grid opacity-50" />
        <div className="absolute inset-0 bg-radial" />
        <div className="relative mx-auto max-w-6xl px-4 py-24 md:py-32">
          <div className="grid items-center gap-12 md:grid-cols-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="mb-6 text-4xl font-bold leading-tight md:text-5xl lg:text-6xl">
                Your Business Card.{" "}
                <span className="text-gradient">Reimagined in AR.</span>
              </h1>
              <p className="mb-8 text-lg text-muted-foreground">
                Create an interactive digital business card that comes alive
                through Augmented Reality. Stand out. Make an impression.
              </p>
              <div className="flex flex-col gap-4 sm:flex-row">
                <Link href="/register" className={buttonVariants({ variant: "default", size: "lg" })}>
                  Create Your AR Card
                </Link>
                <Link href="/how-it-works" className={buttonVariants({ variant: "outline", size: "lg" })}>
                  See AR Demo
                </Link>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative"
            >
              <div className="glass animate-float rounded-2xl p-8 glow-md">
                <div className="flex items-center gap-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-primary to-cyan text-xl font-bold text-white">
                    UA
                  </div>
                  <div>
                    <h3 className="font-semibold">Usman Ashfaq</h3>
                    <p className="text-sm text-muted-foreground">
                      Data Analyst
                    </p>
                  </div>
                </div>
                <div className="mt-4 flex gap-2">
                  <span className="rounded-full bg-primary/20 px-3 py-1 text-xs text-primary">
                    Python
                  </span>
                  <span className="rounded-full bg-cyan/20 px-3 py-1 text-xs text-cyan">
                    SQL
                  </span>
                  <span className="rounded-full bg-primary/20 px-3 py-1 text-xs text-primary">
                    Power BI
                  </span>
                </div>
                <div className="mt-6 flex gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/20 text-primary">
                    <QrCode className="h-5 w-5" />
                  </div>
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-cyan/20 text-cyan">
                    <Eye className="h-5 w-5" />
                  </div>
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/20 text-primary">
                    <Share2 className="h-5 w-5" />
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="border-t border-border py-24">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="mb-12 text-center text-3xl font-bold md:text-4xl">
            How It <span className="text-gradient">Works</span>
          </h2>
          <div className="grid gap-8 md:grid-cols-3">
            {steps.map((step, i) => (
              <motion.div
                key={step.num}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.15 }}
                className="glass rounded-xl p-8 text-center"
              >
                <div className="mb-4 text-4xl font-bold text-gradient">
                  {step.num}
                </div>
                <h3 className="mb-2 text-xl font-semibold">{step.title}</h3>
                <p className="text-muted-foreground">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="border-t border-border py-24">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="mb-4 text-center text-3xl font-bold md:text-4xl">
            <span className="text-gradient">Everything</span> You Need
          </h2>
          <p className="mx-auto mb-12 max-w-2xl text-center text-muted-foreground">
            A complete toolkit for your professional digital identity.
          </p>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                className="glass group rounded-xl p-5 transition-all hover:glow-sm"
              >
                <f.icon className="mb-3 h-5 w-5 text-primary" />
                <h3 className="mb-1 font-semibold">{f.title}</h3>
                <p className="text-sm text-muted-foreground">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-border py-24">
        <div className="mx-auto max-w-3xl px-4 text-center">
          <h2 className="mb-4 text-3xl font-bold md:text-4xl">
            Ready to <span className="text-gradient">Stand Out</span>?
          </h2>
          <p className="mb-8 text-lg text-muted-foreground">
            Join thousands of professionals who have transformed their networking
            with HoloCard.
          </p>
          <Link href="/register" className={buttonVariants({ variant: "default", size: "lg" })}>
            Get Started Free
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
