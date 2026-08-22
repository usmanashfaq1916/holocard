"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
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
  ChevronDown,
  ArrowRight,
  CreditCard,
  Rotate3d,
  Download,
  LinkIcon,
  Mail,
  Phone,
  MessageSquare,
  Star,
  Check,
  X,
} from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

const features = [
  { icon: Eye, title: "Augmented Reality", desc: "Bring your card to life with immersive AR experiences." },
  { icon: Layers, title: "3D Cards", desc: "Stunning 3D digital business cards that captivate." },
  { icon: QrCode, title: "QR Codes", desc: "Unique QR codes for instant one-tap sharing." },
  { icon: Smartphone, title: "Save Contact", desc: "One-tap vCard download compatible with any device." },
  { icon: Share2, title: "Social Links", desc: "All your profiles connected in one place." },
  { icon: BarChart3, title: "Analytics", desc: "Track views, scans, and engagement metrics." },
  { icon: Palette, title: "Custom Themes", desc: "10+ templates to perfectly match your brand." },
  { icon: Sparkles, title: "AI Generator", desc: "AI-powered professional bios and content." },
  { icon: Globe, title: "Public URL", desc: "Your own /card/username link for easy sharing." },
  { icon: Shield, title: "Secure", desc: "Enterprise-grade security protecting your data." },
  { icon: Zap, title: "Fast", desc: "Lightning-fast performance on all devices." },
  { icon: Users, title: "Multiple Cards", desc: "Separate cards for every professional context." },
];

const steps = [
  { num: "01", title: "Create", desc: "Build your professional digital card with our intuitive editor." },
  { num: "02", title: "Share", desc: "Share your card via URL, QR code, or social media." },
  { num: "03", title: "Experience", desc: "Visitors scan and experience your immersive AR profile." },
];

const templates = [
  { name: "Minimal", color: "from-gray-500 to-gray-700", style: "Clean & Professional" },
  { name: "Neon", color: "from-cyan-400 to-purple-500", style: "Bold & Vibrant" },
  { name: "Corporate", color: "from-blue-600 to-blue-800", style: "Business & Trust" },
  { name: "Creative", color: "from-pink-500 to-orange-400", style: "Artistic & Unique" },
  { name: "Dark", color: "from-gray-800 to-black", style: "Sleek & Modern" },
  { name: "Gradient", color: "from-emerald-400 to-cyan-500", style: "Fresh & Dynamic" },
];

const pricingPlans = [
  {
    name: "Free",
    price: "",
    period: "forever",
    desc: "Perfect for getting started",
    features: ["1 digital card", "Basic AR experience", "QR code generation", "Public URL", "Basic analytics"],
    excluded: ["Custom themes", "Priority support", "API access"],
    cta: "Get Started",
    variant: "outline" as const,
  },
  {
    name: "Pro",
    price: "",
    period: "/month",
    desc: "For professionals who stand out",
    features: ["Unlimited cards", "Advanced AR effects", "Custom themes", "Detailed analytics", "Priority support", "Remove branding"],
    excluded: ["API access", "Team features"],
    cta: "Go Pro",
    variant: "default" as const,
    popular: true,
  },
  {
    name: "Business",
    price: "",
    period: "/month",
    desc: "For teams and enterprises",
    features: ["Everything in Pro", "Team management", "API access", "White-label options", "Dedicated support", "Custom integrations"],
    excluded: [],
    cta: "Contact Sales",
    variant: "outline" as const,
  },
];

const faqs = [
  { q: "What is HoloCard?", a: "HoloCard is a platform that creates interactive digital business cards with Augmented Reality experiences. Your contacts can scan your QR code and see your professional profile come alive in 3D." },
  { q: "How does the AR experience work?", a: "When someone scans your QR code or opens your link on a mobile device, they can activate AR mode to see your 3D profile card floating in front of them. They can rotate it, interact with it, and save your contact details directly." },
  { q: "Do I need to install an app?", a: "No app installation is required. HoloCard works directly in mobile browsers using WebAR technology. Simply share your link or QR code and your contacts can experience AR instantly." },
  { q: "Can I create multiple cards?", a: "Yes! Free users get 1 card, while Pro and Business users can create unlimited cards. This is perfect for having separate cards for different professional contexts like networking, sales, or personal branding." },
  { q: "Is my data secure?", a: "Absolutely. We use enterprise-grade encryption and security practices. Your data is stored securely, and you have full control over what information is displayed publicly. We never sell your data to third parties." },
  { q: "Can I track who viewed my card?", a: "Yes, our analytics dashboard provides insights into views, QR scans, contact saves, and engagement metrics. Pro and Business users get detailed analytics including geographic data and referral sources." },
];

export default function HomePage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-grid opacity-50" />
        <div className="absolute inset-0 bg-radial" />
        <div className="relative mx-auto max-w-6xl px-4 py-24 md:py-32">
          <div className="grid items-center gap-12 md:grid-cols-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="mb-6 text-4xl font-bold leading-tight md:text-5xl lg:text-6xl">
                Your Business Card.{" "}
                <span className="text-gradient">Reimagined in AR.</span>
              </h1>
              <p className="mb-8 text-lg text-muted-foreground">
                Create an interactive digital business card that comes alive through Augmented Reality. Stand out. Make an impression.
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
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
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
                    <p className="text-sm text-muted-foreground">Data Analyst</p>
                  </div>
                </div>
                <div className="mt-4 flex gap-2">
                  <span className="rounded-full bg-primary/20 px-3 py-1 text-xs text-primary">Python</span>
                  <span className="rounded-full bg-cyan/20 px-3 py-1 text-xs text-cyan">SQL</span>
                  <span className="rounded-full bg-primary/20 px-3 py-1 text-xs text-primary">Power BI</span>
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
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="mb-12 text-center text-3xl font-bold md:text-4xl">
              How It <span className="text-gradient">Works</span>
            </h2>
          </motion.div>
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
                <div className="mb-4 text-4xl font-bold text-gradient">{step.num}</div>
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
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="mb-4 text-center text-3xl font-bold md:text-4xl">
              <span className="text-gradient">Everything</span> You Need
            </h2>
            <p className="mx-auto mb-12 max-w-2xl text-center text-muted-foreground">
              A complete toolkit for your professional digital identity.
            </p>
          </motion.div>
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

      {/* Live Demo */}
      <section className="border-t border-border py-24">
        <div className="mx-auto max-w-6xl px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="mb-4 text-center text-3xl font-bold md:text-4xl">
              See It In <span className="text-gradient">Action</span>
            </h2>
            <p className="mx-auto mb-12 max-w-2xl text-center text-muted-foreground">
              Experience a live preview of what your HoloCard looks like.
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mx-auto max-w-lg"
          >
            <div className="glass rounded-3xl p-6 glow-md">
              <div className="rounded-2xl bg-gradient-to-br from-primary/10 to-cyan/10 p-8">
                <div className="flex flex-col items-center text-center">
                  <div className="mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-primary to-cyan text-3xl font-bold text-white glow-sm">
                    JD
                  </div>
                  <h3 className="mb-1 text-xl font-bold">Jane Doe</h3>
                  <p className="mb-4 text-sm text-muted-foreground">Product Designer at Acme Inc</p>
                  <p className="mb-6 text-sm text-muted-foreground">
                    Passionate about creating beautiful user experiences and building products that make a difference.
                  </p>
                  <div className="mb-6 flex flex-wrap justify-center gap-2">
                    <span className="rounded-full bg-primary/20 px-3 py-1 text-xs text-primary">UI/UX</span>
                    <span className="rounded-full bg-cyan/20 px-3 py-1 text-xs text-cyan">Figma</span>
                    <span className="rounded-full bg-primary/20 px-3 py-1 text-xs text-primary">React</span>
                    <span className="rounded-full bg-cyan/20 px-3 py-1 text-xs text-cyan">Design Systems</span>
                  </div>
                  <div className="flex gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/20 text-primary transition-colors hover:bg-primary hover:text-primary-foreground">
                      <Mail className="h-5 w-5" />
                    </div>
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-cyan/20 text-cyan transition-colors hover:bg-cyan hover:text-white">
                      <Globe className="h-5 w-5" />
                    </div>
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/20 text-primary transition-colors hover:bg-primary hover:text-primary-foreground">
                      <LinkIcon className="h-5 w-5" />
                    </div>
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-cyan/20 text-cyan transition-colors hover:bg-cyan hover:text-white">
                      <Phone className="h-5 w-5" />
                    </div>
                  </div>
                  <div className="mt-6 flex w-full gap-3">
                    <button className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90">
                      <Download className="h-4 w-4" />
                      Save Contact
                    </button>
                    <button className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-border bg-background px-4 py-3 text-sm font-medium transition-colors hover:bg-accent">
                      <Rotate3d className="h-4 w-4" />
                      View in AR
                    </button>
                  </div>
                </div>
              </div>
              <div className="mt-4 flex items-center justify-center gap-2 text-xs text-muted-foreground">
                <Eye className="h-3 w-3" />
                <span>Interactive preview &mdash; hover and click to explore</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Templates Preview */}
      <section className="border-t border-border py-24">
        <div className="mx-auto max-w-6xl px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="mb-4 text-center text-3xl font-bold md:text-4xl">
              Choose Your <span className="text-gradient">Style</span>
            </h2>
            <p className="mx-auto mb-12 max-w-2xl text-center text-muted-foreground">
              Pick from professionally designed templates to match your brand.
            </p>
          </motion.div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {templates.map((t, i) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="glass group cursor-pointer overflow-hidden rounded-xl transition-all hover:glow-sm"
              >
                <div className="h-40 bg-gradient-to-br p-6">
                  <div className="flex h-full items-center justify-center">
                    <div className="rounded-xl bg-white/10 px-6 py-4 backdrop-blur-sm">
                      <div className="text-sm font-bold text-white">{t.name}</div>
                      <div className="text-xs text-white/70">{t.style}</div>
                    </div>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold">{t.name}</h3>
                  <p className="text-sm text-muted-foreground">{t.style}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="border-t border-border py-24">
        <div className="mx-auto max-w-6xl px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="mb-4 text-center text-3xl font-bold md:text-4xl">
              Simple <span className="text-gradient">Pricing</span>
            </h2>
            <p className="mx-auto mb-12 max-w-2xl text-center text-muted-foreground">
              Choose the plan that fits your needs. Upgrade anytime.
            </p>
          </motion.div>
          <div className="grid gap-6 md:grid-cols-3">
            {pricingPlans.map((plan, i) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.15 }}
                className="glass relative rounded-2xl p-6"
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-4 py-1 text-xs font-medium text-primary-foreground">
                    Most Popular
                  </div>
                )}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold">{plan.name}</h3>
                  <p className="text-sm text-muted-foreground">{plan.desc}</p>
                </div>
                <div className="mb-6">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  <span className="text-muted-foreground">{plan.period}</span>
                </div>
                <ul className="mb-6 space-y-3">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm">
                      <Check className="h-4 w-4 text-primary" />
                      {f}
                    </li>
                  ))}
                  {plan.excluded.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <X className="h-4 w-4" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/register"
                  className={buttonVariants({ variant: plan.variant, size: "lg" })}
                >
                  {plan.cta}
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="border-t border-border py-24">
        <div className="mx-auto max-w-3xl px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="mb-4 text-center text-3xl font-bold md:text-4xl">
              Frequently Asked <span className="text-gradient">Questions</span>
            </h2>
            <p className="mx-auto mb-12 max-w-2xl text-center text-muted-foreground">
              Everything you need to know about HoloCard.
            </p>
          </motion.div>
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: i * 0.05 }}
                className="glass overflow-hidden rounded-xl"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="flex w-full items-center justify-between p-5 text-left"
                >
                  <span className="font-medium">{faq.q}</span>
                  <ChevronDown
                    className="h-5 w-5 text-muted-foreground transition-transform"
                  />
                </button>
                {openFaq === i && (
                  <div className="px-5 pb-5 text-sm text-muted-foreground">
                    {faq.a}
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-border py-24">
        <div className="mx-auto max-w-3xl px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="mb-4 text-3xl font-bold md:text-4xl">
              Ready to <span className="text-gradient">Stand Out</span>?
            </h2>
            <p className="mb-8 text-lg text-muted-foreground">
              Join thousands of professionals who have transformed their networking with HoloCard.
            </p>
            <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <Link href="/register" className={buttonVariants({ variant: "default", size: "lg" })}>
                Get Started Free
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
              <Link href="/login" className={buttonVariants({ variant: "outline", size: "lg" })}>
                Sign In
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
