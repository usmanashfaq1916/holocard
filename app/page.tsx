"use client";

import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
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
  ArrowRight,
  Check,
  X,
  Lock,
  EyeOff,
  Server,
  Camera,
  Video,
  MessageCircle,
  Mail,
  Phone,
  ExternalLink,
  GitFork,
  User,
  Building,
  Briefcase,
  Scan,
  LinkIcon,
} from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { HeroHoloCard } from "@/components/home/hero-holo-card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const capabilities = [
  { icon: Sparkles, label: "Create" },
  { icon: QrCode, label: "Share via QR" },
  { icon: Scan, label: "Scan AR" },
  { icon: Video, label: "3D & Video" },
  { icon: Users, label: "Connect" },
  { icon: BarChart3, label: "Track" },
];

const steps = [
  { num: "01", title: "Create", desc: "Design your digital card with our intuitive editor. Add your photo, bio, links, and branding.", icon: Palette },
  { num: "02", title: "Share", desc: "Get a unique QR code and URL. Print it on physical cards or share digitally.", icon: QrCode },
  { num: "03", title: "Scan", desc: "Someone scans your QR code. Your profile loads instantly in their mobile browser.", icon: Smartphone },
  { num: "04", title: "Experience", desc: "Point the camera at your card and watch it come alive with 3D, video, and interactive buttons.", icon: Eye },
];

const cardFields = [
  { icon: User, label: "Full Name" },
  { icon: Briefcase, label: "Title & Company" },
  { icon: Mail, label: "Email Address" },
  { icon: Phone, label: "Phone Number" },
  { icon: Globe, label: "Website" },
  { icon: ExternalLink, label: "LinkedIn" },
  { icon: GitFork, label: "GitHub / Portfolio" },
  { icon: MessageCircle, label: "WhatsApp" },
  { icon: Share2, label: "Social Profiles" },
];

const arElements = [
  { icon: Video, label: "Video Overlay", desc: "Play intro videos on your card" },
  { icon: Layers, label: "3D Objects", desc: "Floating logos, products, avatars" },
  { icon: Sparkles, label: "Animations", desc: "Dynamic particle effects" },
  { icon: LinkIcon, label: "Interactive Buttons", desc: "Tap to open links, call, email" },
];

const analyticsMetrics = [
  { label: "Profile Views", value: "2,847", change: "+23%", icon: Eye },
  { label: "QR Scans", value: "1,203", change: "+18%", icon: QrCode },
  { label: "AR Experiences", value: "891", change: "+42%", icon: Sparkles },
  { label: "Contact Saves", value: "456", change: "+31%", icon: Users },
];

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
    price: "$0",
    period: "forever",
    desc: "Perfect for getting started",
    features: ["1 digital card", "Basic AR experience", "QR code generation", "Public URL", "Basic analytics"],
    excluded: ["Custom themes", "Priority support"],
    cta: "Get Started",
    variant: "outline" as const,
  },
  {
    name: "Pro",
    price: "$9",
    period: "/month",
    desc: "For professionals who stand out",
    features: ["Unlimited cards", "Advanced AR effects", "Custom themes", "Detailed analytics", "Priority support", "Remove branding"],
    excluded: ["Team features"],
    cta: "Go Pro",
    variant: "default" as const,
    popular: true,
  },
  {
    name: "Business",
    price: "$29",
    period: "/month",
    desc: "For teams and enterprises",
    features: ["Everything in Pro", "Team management", "White-label options", "Dedicated support", "Custom integrations"],
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
  { q: "How much does it cost?", a: "HoloCard offers a generous free tier with 1 card and core features. Pro plans start at $9/month with unlimited cards, premium templates, and advanced analytics. Business plans include team management and priority support." },
  { q: "What devices are supported?", a: "HoloCard works on all modern browsers across iOS, Android, Windows, macOS, and Linux. The AR experience is optimized for mobile devices with ARCore (Android) or ARKit (iOS) support." },
];

export default function HomePage() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: scrollRef, offset: ["start end", "end start"] });
  const cardRotate = useTransform(scrollYProgress, [0, 0.3, 0.6], [0, -15, 0]);
  const cardScale = useTransform(scrollYProgress, [0, 0.3, 0.6], [0.8, 1.1, 1]);
  const qrOpacity = useTransform(scrollYProgress, [0.25, 0.35], [0, 1]);
  const profileY = useTransform(scrollYProgress, [0.4, 0.7], [40, 0]);
  const profileOpacity = useTransform(scrollYProgress, [0.4, 0.6], [0, 1]);
  const arScale = useTransform(scrollYProgress, [0.65, 0.85], [0.5, 1]);
  const arOpacity = useTransform(scrollYProgress, [0.65, 0.8], [0, 1]);

  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Phase 1: Hero — 6-capability framing */}
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
              <p className="mb-6 text-lg text-muted-foreground">
                Create, share, scan, experience, connect, and track — all from one smart card. Point your phone at a HoloCard and watch your professional identity come alive.
              </p>
              <div className="mb-8 flex flex-wrap gap-3">
                {capabilities.map((cap) => (
                  <span key={cap.label} className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background/50 px-3 py-1 text-xs font-medium backdrop-blur-sm">
                    <cap.icon className="h-3 w-3 text-primary" />
                    {cap.label}
                  </span>
                ))}
              </div>
              <div className="flex flex-col gap-4 sm:flex-row">
                <Link href="/register" className={buttonVariants({ variant: "default", size: "lg" })}>
                  Create Your AR Card
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
                <Link href="/ar/usman-ashfaq" className={buttonVariants({ variant: "outline", size: "lg" })}>
                  <Eye className="mr-2 h-4 w-4" />
                  Try AR Demo
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
              <HeroHoloCard />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Phase 5: Explain the Concept — "A Business Card That Does More" */}
      <section className="border-t border-border py-24">
        <div className="mx-auto max-w-6xl px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="mb-4 text-center text-3xl font-bold md:text-4xl">
              A Business Card That <span className="text-gradient">Does More</span>
            </h2>
            <p className="mx-auto mb-12 max-w-2xl text-center text-muted-foreground">
              Not just a card — a complete digital identity. Your profile, portfolio, videos, 3D content, social links, and analytics, all in one place.
            </p>
          </motion.div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[
              { icon: User, title: "Professional Profile", desc: "Name, title, company, about, photo — everything at a glance." },
              { icon: Video, title: "Video & 3D Content", desc: "Embed intro videos, 3D models, and animated elements." },
              { icon: Share2, title: "Social & Contact", desc: "LinkedIn, GitHub, WhatsApp, email, phone — all connected." },
              { icon: QrCode, title: "QR Code Sharing", desc: "Print on physical cards or share digitally with one scan." },
              { icon: Eye, title: "WebAR Experience", desc: "No app needed — AR works directly in the mobile browser." },
              { icon: BarChart3, title: "Engagement Analytics", desc: "Track views, scans, saves, and link clicks in real time." },
            ].map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                className="glass rounded-xl p-6"
              >
                <item.icon className="mb-3 h-6 w-6 text-primary" />
                <h3 className="mb-2 font-semibold text-lg">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Phase 6: How It Works — 4 steps with connecting lines */}
      <section className="border-t border-border py-24">
        <div className="mx-auto max-w-5xl px-4">
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
          <div className="relative grid gap-8 md:grid-cols-4">
            {steps.map((step, i) => (
              <motion.div
                key={step.num}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.15 }}
                className="relative text-center"
              >
                {i < steps.length - 1 && (
                  <div className="absolute left-1/2 top-10 hidden h-0.5 w-full bg-gradient-to-r from-primary/50 to-primary/20 md:block" />
                )}
                <div className="relative z-10 mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-2xl bg-primary/10 border border-primary/20">
                  <step.icon className="h-8 w-8 text-primary" />
                </div>
                <div className="mb-2 text-xs font-bold uppercase tracking-wider text-primary">Step {step.num}</div>
                <h3 className="mb-2 text-xl font-semibold">{step.title}</h3>
                <p className="text-sm text-muted-foreground">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Phase 7: Digital Business Card — "Everything You Need. One Smart Card." */}
      <section className="border-t border-border py-24">
        <div className="mx-auto max-w-6xl px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="mb-4 text-center text-3xl font-bold md:text-4xl">
              Everything You Need. <span className="text-gradient">One Smart Card.</span>
            </h2>
            <p className="mx-auto mb-12 max-w-2xl text-center text-muted-foreground">
              A digital business card that holds your complete professional identity — and fits in your pocket.
            </p>
          </motion.div>
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="glass rounded-2xl p-6 md:p-8"
            >
              <div className="mb-6 flex items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-purple-600 text-xl font-bold text-white">
                  JD
                </div>
                <div>
                  <h3 className="text-lg font-semibold">John Doe</h3>
                  <p className="text-sm text-muted-foreground">Senior Engineer @ TechCorp</p>
                </div>
              </div>
              <p className="mb-4 text-sm text-muted-foreground">
                Passionate about building innovative AR experiences. 10+ years in software engineering with a focus on emerging technologies.
              </p>
              <div className="mb-6 grid grid-cols-2 gap-2">
                {cardFields.map((field) => (
                  <div key={field.label} className="flex items-center gap-2 rounded-lg border border-border bg-background/50 px-3 py-2">
                    <field.icon className="h-3.5 w-3.5 text-primary" />
                    <span className="text-xs">{field.label}</span>
                  </div>
                ))}
              </div>
              <div className="flex gap-3">
                <button className="flex-1 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground">
                  Save Contact
                </button>
                <button className="flex-1 rounded-lg border border-border px-4 py-2.5 text-sm font-medium">
                  Share Profile
                </button>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="space-y-4"
            >
              <h3 className="text-2xl font-bold">More Than a Business Card</h3>
              <p className="text-muted-foreground">
                Your HoloCard is a living digital profile. Update it anytime — changes go live instantly. No reprints needed.
              </p>
              <ul className="space-y-3">
                {[
                  "One-tap vCard download to any phone",
                  "QR code for instant sharing at events",
                  "Public URL you can put anywhere",
                  "Analytics on every view and scan",
                  "AR experience that makes you unforgettable",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-2 text-sm">
                    <Check className="h-4 w-4 shrink-0 text-primary" />
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Phase 8: AR Business Card — "Turn Your Card Into an AR Experience" */}
      <section className="border-t border-border py-24">
        <div className="mx-auto max-w-6xl px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="mb-4 text-center text-3xl font-bold md:text-4xl">
              Turn Your Card Into an <span className="text-gradient">AR Experience</span>
            </h2>
            <p className="mx-auto mb-12 max-w-2xl text-center text-muted-foreground">
              Your physical card becomes a portal to immersive digital content. Video, 3D, animations — all triggered by a single scan.
            </p>
          </motion.div>
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="space-y-4"
            >
              <h3 className="text-2xl font-bold">What Happens When They Scan</h3>
              <p className="text-muted-foreground">
                Point your phone at a HoloCard and the physical card transforms into an interactive digital experience — no app required.
              </p>
              <div className="grid grid-cols-2 gap-4 pt-4">
                {arElements.map((el, i) => (
                  <motion.div
                    key={el.label}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: i * 0.1 }}
                    className="glass rounded-xl p-4"
                  >
                    <el.icon className="mb-2 h-5 w-5 text-primary" />
                    <h4 className="text-sm font-semibold">{el.label}</h4>
                    <p className="text-xs text-muted-foreground">{el.desc}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="glass rounded-3xl p-2 glow-md"
            >
              <HeroHoloCard />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Phase 9: "From Paper to Digital Identity" Scroll Animation */}
      <section ref={scrollRef} className="relative border-t border-border py-32 overflow-hidden">
        <div className="mx-auto max-w-4xl px-4">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mb-20 text-center text-3xl font-bold md:text-4xl"
          >
            From Paper to <span className="text-gradient">Digital Identity</span>
          </motion.h2>
          <div className="relative flex flex-col items-center gap-12">
            {/* Traditional Card */}
            <motion.div style={{ rotate: cardRotate, scale: cardScale }} className="glass rounded-xl p-8 shadow-lg border border-border w-full max-w-xs text-center">
              <div className="mb-3 text-xs font-bold uppercase tracking-wider text-muted-foreground">Traditional Card</div>
              <div className="mb-2 text-lg font-semibold">John Doe</div>
              <div className="text-sm text-muted-foreground">Senior Engineer @ TechCorp</div>
              <div className="mt-3 text-xs text-muted-foreground">john@techcorp.com | +1 555 0123</div>
            </motion.div>

            {/* Arrow */}
            <div className="text-2xl text-primary">&#8595;</div>

            {/* QR Highlight */}
            <motion.div style={{ opacity: qrOpacity }} className="flex flex-col items-center gap-3">
              <div className="glass rounded-2xl p-6 border border-primary/30">
                <QrCode className="h-24 w-24 text-primary" />
              </div>
              <span className="text-sm font-medium text-primary">Scan the QR Code</span>
            </motion.div>

            {/* Arrow */}
            <div className="text-2xl text-primary">&#8595;</div>

            {/* Digital Profile */}
            <motion.div style={{ y: profileY, opacity: profileOpacity }} className="glass rounded-2xl p-6 w-full max-w-sm border border-border">
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-purple-600 text-sm font-bold text-white">JD</div>
                <div>
                  <div className="font-semibold">John Doe</div>
                  <div className="text-xs text-muted-foreground">Senior Engineer @ TechCorp</div>
                </div>
              </div>
              <div className="flex gap-2">
                <span className="rounded-md bg-primary/10 px-2 py-1 text-xs text-primary"><Mail className="mr-1 inline h-3 w-3" />Email</span>
                <span className="rounded-md bg-primary/10 px-2 py-1 text-xs text-primary"><Phone className="mr-1 inline h-3 w-3" />Call</span>
                <span className="rounded-md bg-primary/10 px-2 py-1 text-xs text-primary"><ExternalLink className="mr-1 inline h-3 w-3" />LinkedIn</span>
              </div>
            </motion.div>

            {/* Arrow */}
            <div className="text-2xl text-primary">&#8595;</div>

            {/* AR Experience */}
            <motion.div style={{ scale: arScale, opacity: arOpacity }} className="w-full max-w-md">
              <div className="glass rounded-3xl p-2 glow-md">
                <HeroHoloCard />
              </div>
              <div className="mt-4 text-center">
                <span className="text-sm font-medium text-primary">AR Experience Activated</span>
                <p className="text-xs text-muted-foreground">3D content, videos, and interactive buttons</p>
              </div>
            </motion.div>

            {/* Final Tagline */}
            <motion.div style={{ opacity: arOpacity }} className="mt-8 text-center">
              <p className="text-2xl font-bold md:text-3xl">One Card. <span className="text-gradient">Infinite Possibilities.</span></p>
            </motion.div>
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

      {/* Use Cases */}
      <section className="border-t border-border py-24">
        <div className="mx-auto max-w-6xl px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="mb-4 text-center text-3xl font-bold md:text-4xl">
              <span className="text-gradient">Perfect For</span> Every Professional
            </h2>
            <p className="mx-auto mb-12 max-w-2xl text-center text-muted-foreground">
              From solo entrepreneurs to enterprise teams, HoloCard transforms how you connect.
            </p>
          </motion.div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { icon: Users, title: "Business Professionals", desc: "Make networking memorable. Your card becomes an unforgettable interactive experience." },
              { icon: Globe, title: "Sales Teams", desc: "Turn every meeting into an interactive experience. Share products and services in AR." },
              { icon: Zap, title: "Real Estate", desc: "Show properties directly from your card. Let clients experience buildings in 3D." },
              { icon: Sparkles, title: "Creators", desc: "Turn your card into a portfolio. Showcase your work in augmented reality." },
              { icon: Layers, title: "Events", desc: "Give attendees an unforgettable introduction. Perfect for conferences and trade shows." },
              { icon: Shield, title: "Companies", desc: "Create branded AR experiences for your entire team. Consistent, professional, impressive." },
            ].map((useCase, i) => (
              <motion.div
                key={useCase.title}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                className="glass rounded-xl p-6 transition-all hover:glow-sm"
              >
                <useCase.icon className="mb-3 h-6 w-6 text-primary" />
                <h3 className="mb-2 font-semibold text-lg">{useCase.title}</h3>
                <p className="text-sm text-muted-foreground">{useCase.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Phase 11: Analytics — "Know How Your Network Is Engaging" */}
      <section className="border-t border-border py-24">
        <div className="mx-auto max-w-6xl px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="mb-4 text-center text-3xl font-bold md:text-4xl">
              Know How Your Network <span className="text-gradient">Is Engaging</span>
            </h2>
            <p className="mx-auto mb-12 max-w-2xl text-center text-muted-foreground">
              Real-time analytics show you who viewed your card, scanned your QR, saved your contact, and more.
            </p>
          </motion.div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {analyticsMetrics.map((m, i) => (
              <motion.div
                key={m.label}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="glass rounded-xl p-6 text-center"
              >
                <m.icon className="mx-auto mb-3 h-6 w-6 text-primary" />
                <div className="text-3xl font-bold">{m.value}</div>
                <div className="text-sm text-muted-foreground">{m.label}</div>
                <div className="mt-1 text-xs font-medium text-emerald-500">{m.change}</div>
              </motion.div>
            ))}
          </div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-8 text-center"
          >
            <Link href="/register" className={buttonVariants({ variant: "outline" })}>
              See Full Analytics Dashboard
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Phase 13: Live Demo — QR + Phone Mockup */}
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
              Scan the QR code or launch the AR experience on your phone.
            </p>
          </motion.div>
          <div className="grid items-center gap-12 lg:grid-cols-2">
            {/* Left: Physical card + QR */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="flex flex-col items-center gap-6"
            >
              <div className="glass rounded-xl p-6 shadow-lg border border-border text-center">
                <div className="mb-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">Sample HoloCard</div>
                <div className="mb-1 text-lg font-semibold">John Doe</div>
                <div className="text-sm text-muted-foreground">Senior Engineer @ TechCorp</div>
              </div>
              <div className="text-2xl text-primary">&#8595;</div>
              <div className="glass rounded-2xl p-4 border border-primary/30">
                <QrCode className="h-32 w-32 text-primary" />
              </div>
              <span className="text-sm font-medium text-primary">Scan to experience</span>
            </motion.div>

            {/* Right: Phone mockup with AR preview */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex flex-col items-center"
            >
              <div className="relative w-64 rounded-[2.5rem] border-4 border-gray-800 bg-gray-900 p-2 shadow-2xl">
                <div className="absolute left-1/2 top-0 h-5 w-24 -translate-x-1/2 rounded-b-xl bg-gray-800" />
                <div className="overflow-hidden rounded-[2rem] bg-background">
                  <div className="p-4">
                    <HeroHoloCard />
                  </div>
                </div>
              </div>
              <div className="mt-6 flex gap-3">
                <Link href="/register" className={buttonVariants({ variant: "default", size: "sm" })}>
                  Create Your HoloCard
                </Link>
                <Link href="/ar/usman-ashfaq" className={buttonVariants({ variant: "outline", size: "sm" })}>
                  <Eye className="mr-2 h-3 w-3" />
                  Launch AR Experience
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Phase 14: Trust & Social Proof — "Made for Modern Networking" */}
      <section className="border-t border-border py-24">
        <div className="mx-auto max-w-6xl px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="mb-4 text-center text-3xl font-bold md:text-4xl">
              Made for <span className="text-gradient">Modern Networking</span>
            </h2>
            <p className="mx-auto mb-12 max-w-2xl text-center text-muted-foreground">
              Trusted by professionals who want to stand out and make lasting impressions.
            </p>
          </motion.div>
          <div className="mb-12 grid grid-cols-2 gap-4 md:grid-cols-4">
            {[
              { label: "Professionals", icon: Briefcase },
              { label: "Entrepreneurs", icon: Zap },
              { label: "Creators", icon: Sparkles },
              { label: "Sales Teams", icon: Users },
            ].map((p, i) => (
              <motion.div
                key={p.label}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="glass rounded-xl p-4 text-center"
              >
                <p.icon className="mx-auto mb-2 h-6 w-6 text-primary" />
                <div className="text-sm font-medium">{p.label}</div>
              </motion.div>
            ))}
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0 }}
              className="glass rounded-xl p-6"
            >
              <Lock className="mb-3 h-6 w-6 text-primary" />
              <h3 className="mb-2 font-semibold">End-to-End Encryption</h3>
              <p className="text-sm text-muted-foreground">
                All data is encrypted in transit and at rest. Your personal information is never exposed to unauthorized parties.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="glass rounded-xl p-6"
            >
              <EyeOff className="mb-3 h-6 w-6 text-primary" />
              <h3 className="mb-2 font-semibold">Privacy First</h3>
              <p className="text-sm text-muted-foreground">
                You control exactly what information is public, unlisted, or private. We never sell your data to third parties.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="glass rounded-xl p-6"
            >
              <Server className="mb-3 h-6 w-6 text-primary" />
              <h3 className="mb-2 font-semibold">Secure Infrastructure</h3>
              <p className="text-sm text-muted-foreground">
                Hosted on enterprise-grade infrastructure with automatic backups, DDoS protection, and 99.9% uptime.
              </p>
            </motion.div>
          </div>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
            {["WebAR", "Digital Profile", "QR Sharing", "Analytics"].map((tag) => (
              <span key={tag} className="flex items-center gap-1.5">
                <Check className="h-4 w-4 text-primary" />
                {tag}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* AR Experience Templates */}
      <section className="border-t border-border py-24">
        <div className="mx-auto max-w-6xl px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="mb-4 text-center text-3xl font-bold md:text-4xl">
              AR Experience <span className="text-gradient">Templates</span>
            </h2>
            <p className="mx-auto mb-12 max-w-2xl text-center text-muted-foreground">
              Start with a pre-built AR template. Customize 3D objects, videos, and interactive buttons.
            </p>
          </motion.div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { name: "Corporate Intro", desc: "Logo animation + company video + website + LinkedIn", color: "from-blue-600 to-blue-800" },
              { name: "Creative Portfolio", desc: "3D artwork + portfolio gallery + Instagram", color: "from-pink-500 to-orange-400" },
              { name: "Developer", desc: "3D laptop + GitHub + portfolio + LinkedIn", color: "from-cyan-400 to-purple-500" },
              { name: "Real Estate", desc: "3D building + property gallery + Call + WhatsApp", color: "from-emerald-500 to-teal-600" },
              { name: "Product Showcase", desc: "3D product model + demo video + Buy Now", color: "from-orange-400 to-red-500" },
              { name: "Personal Brand", desc: "Animated portrait + social links + portfolio", color: "from-violet-500 to-purple-600" },
            ].map((t, i) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="glass group cursor-pointer overflow-hidden rounded-xl transition-all hover:glow-sm"
              >
                <div className={`h-32 bg-gradient-to-br ${t.color} p-6`}>
                  <div className="flex h-full items-center justify-center">
                    <div className="rounded-xl bg-white/10 px-6 py-4 backdrop-blur-sm">
                      <div className="text-sm font-bold text-white">{t.name}</div>
                    </div>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold">{t.name}</h3>
                  <p className="text-sm text-muted-foreground">{t.desc}</p>
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
          <Accordion type="single" collapsible className="space-y-3">
            {faqs.map((faq, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: i * 0.05 }}
              >
                <AccordionItem value={`faq-${i}`} className="glass overflow-hidden rounded-xl border-0">
                  <AccordionTrigger className="px-5 py-5 text-left hover:no-underline [&>svg]:h-5 [&>svg]:w-5">
                    <span className="font-medium">{faq.q}</span>
                  </AccordionTrigger>
                  <AccordionContent className="px-5 pb-5 text-sm text-muted-foreground">
                    {faq.a}
                  </AccordionContent>
                </AccordionItem>
              </motion.div>
            ))}
          </Accordion>
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
              Bring Your Business Card to <span className="text-gradient">Life</span>.
            </h2>
            <p className="mb-8 text-lg text-muted-foreground">
              Join professionals who have transformed their networking with AR-powered HoloCards.
            </p>
            <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <Link href="/register" className={buttonVariants({ variant: "default", size: "lg" })}>
                Create Your AR Card
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
              <Link href="/ar/usman-ashfaq" className={buttonVariants({ variant: "outline", size: "lg" })}>
                <Eye className="mr-2 h-4 w-4" />
                Try AR Demo
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
