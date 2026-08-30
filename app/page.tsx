"use client";

import Link from "next/link";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useMemo, useState, useEffect } from "react";
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
  Video,
  MessageCircle,
  Mail,
  Phone,
  ExternalLink,
  GitFork,
  User,
  Building,
  Scan,
  LinkIcon,
  Briefcase,
  Download,
} from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { HeroHoloCard } from "@/components/home/hero-holo-card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { DEMO_CARD_URL, DEMO_AR_URL } from "@/lib/config";

const steps = [
  { num: "01", title: "Upload", desc: "Upload your existing printed business card.", icon: Smartphone },
  { num: "02", title: "Build", desc: "Add videos, images, 3D models and interactive buttons.", icon: Sparkles },
  { num: "03", title: "Publish", desc: "Generate your unique AR experience and QR code.", icon: QrCode },
  { num: "04", title: "Scan", desc: "Someone scans the QR code on your card.", icon: Scan },
  { num: "05", title: "Point", desc: "They point their phone camera at the physical card.", icon: Eye },
  { num: "06", title: "Experience", desc: "Watch the business card come alive with interactive AR content.", icon: Share2 },
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

const features = [
  { icon: Eye, title: "Digital Profile", desc: "Create a professional online identity." },
  { icon: Layers, title: "WebAR", desc: "Turn your physical card into an AR experience." },
  { icon: QrCode, title: "QR Sharing", desc: "Share your profile instantly." },
  { icon: Smartphone, title: "Save Contact", desc: "Let people save your details with one tap." },
  { icon: Share2, title: "Social Links", desc: "Connect LinkedIn, WhatsApp, Instagram, X and more." },
  { icon: Video, title: "Video", desc: "Introduce yourself or your business with video." },
  { icon: Sparkles, title: "3D Experiences", desc: "Display interactive 3D content." },
  { icon: BarChart3, title: "Analytics", desc: "Track visits, scans and engagement." },
  { icon: Palette, title: "Custom Branding", desc: "Use your own colors, logo and visual identity." },
  { icon: Globe, title: "Custom URL", desc: "Give every profile a memorable HoloCard URL." },
  { icon: Shield, title: "Secure", desc: "Your data is stored securely. You control visibility." },
  { icon: Zap, title: "Fast", desc: "Lightning-fast performance on all devices." },
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
  { q: "What is HoloCard?", a: "HoloCard transforms your physical business card into an interactive AR experience. Upload your card, build your AR content, publish, and print the QR code on your card. When someone scans it, your card comes alive with video, 3D, contact buttons and more." },
  { q: "Do I need a mobile app?", a: "No. HoloCard works directly in mobile browsers using WebAR technology. No app download is required — just scan the QR code and point your camera at the card." },
  { q: "How does AR recognize my card?", a: "HoloCard uses image-target technology. When you upload your physical card, it is analyzed for unique visual features. The AR system recognizes these features when someone points their camera at the card." },
  { q: "Do I need a special printed card?", a: "No. Your existing business card works. HoloCard analyzes the visual features of your printed card and uses it as the AR trigger. Cards with high contrast and distinctive designs work best." },
  { q: "Does my existing business card work?", a: "Most business cards work well. Cards with clear text, logos, and good contrast produce the best AR targets. Very plain or low-contrast cards may have reduced tracking quality." },
  { q: "What happens if AR isn't supported?", a: "If AR isn't available on the user's device, HoloCard shows a premium digital fallback — a full-featured online business card with your profile, contact buttons, social links and more." },
  { q: "Can I use videos?", a: "Yes. You can embed intro videos, product demos, or portfolio reels that appear in the AR experience when your card is detected." },
  { q: "Can I add 3D models?", a: "Yes. HoloCard supports GLB and GLTF 3D models. Display floating logos, product models, or any 3D content that appears when your card is scanned." },
  { q: "Can I update my AR experience after printing?", a: "Yes — this is a major advantage. Your physical card never changes, but you can update videos, links, 3D models, social links, and promotions anytime. The AR experience updates instantly." },
  { q: "Can I track scans?", a: "Yes. The analytics dashboard tracks AR launches, target detections, button clicks, video plays, contact saves, and more. You can see what's engaging your audience." },
];

function ParticlesBackground() {
  const particles = useMemo(
    () =>
      Array.from({ length: 30 }, (_, i) => ({
        id: i,
        x: ((i * 37) % 100),
        y: ((i * 53) % 100),
        scale: 0.5 + ((i * 13) % 50) / 100,
        animY1: ((i * 71) % 100),
        animY2: ((i * 43) % 100),
        duration: 10 + ((i * 17) % 10),
      })),
    []
  );

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute h-1 w-1 rounded-full bg-primary/20"
          initial={{
            x: `${p.x}%`,
            y: `${p.y}%`,
            scale: p.scale,
          }}
          animate={{
            y: [`${p.animY1}%`, `${p.animY2}%`],
            opacity: [0.2, 0.6, 0.2],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      ))}
    </div>
  );
}

function ScanEffect() {
  return (
    <motion.div
      className="absolute left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent"
      initial={{ top: "20%", opacity: 0 }}
      animate={{ top: ["20%", "80%", "20%"], opacity: [0, 1, 0] }}
      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
    />
  );
}

const demoCaptions = [
  "Your card, but different.",
  "Scan. Tap. That's it.",
  "No app to download.",
  "Tilt to explore.",
  "Tap for details.",
  "Save instantly.",
  "Works on any device.",
];

function VideoDemoSection() {
  const [captionIndex, setCaptionIndex] = useState(0);
  const [videoLoaded, setVideoLoaded] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setCaptionIndex((prev) => (prev + 1) % demoCaptions.length);
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative overflow-hidden rounded-2xl border border-border bg-black">
      {/* Video or fallback */}
      <div className="relative aspect-video w-full">
        {!videoLoaded && (
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[#171826] to-[#0d0e15]">
            <div className="text-center">
              <HeroHoloCard />
            </div>
          </div>
        )}
        <video
          className={`h-full w-full object-cover ${videoLoaded ? "opacity-100" : "opacity-0"}`}
          poster="/videos/holo-loop.mp4"
          autoPlay
          muted
          loop
          playsInline
          onLoadedData={() => setVideoLoaded(true)}
          onError={() => setVideoLoaded(false)}
        >
          <source src="/videos/holo-loop.mp4" type="video/mp4" />
        </video>

        {/* Animated caption overlay */}
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-6 pt-16">
          <motion.p
            key={captionIndex}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4 }}
            className="text-center text-xl font-semibold text-white md:text-2xl"
          >
            {demoCaptions[captionIndex]}
          </motion.p>
        </div>
      </div>

      {/* CTA row */}
      <div className="flex flex-col items-center gap-3 border-t border-border bg-card px-6 py-4 sm:flex-row sm:justify-center">
        <Link
          href="/holocard-ar-walkthrough"
          className={buttonVariants({ variant: "default", size: "sm" }) + " bg-primary text-primary-foreground hover:bg-primary/90"}
        >
          Try it live
          <ArrowRight className="ml-2 h-3 w-3" />
        </Link>
        <Link
          href="/register"
          className={buttonVariants({ variant: "outline", size: "sm" }) + " border-border text-foreground hover:bg-muted/80"}
        >
          Create yours
          <ArrowRight className="ml-2 h-3 w-3" />
        </Link>
      </div>
    </div>
  );
}

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
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);

  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Hero — Full-screen cinematic with particles and scan effect */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        <motion.div style={{ y: bgY }} className="absolute inset-0 bg-grid opacity-30" />
        <div className="absolute inset-0 bg-radial" />
        <ParticlesBackground />
        <div className="relative mx-auto max-w-6xl px-4 py-24 md:py-32 w-full">
          <div className="grid items-center gap-12 md:grid-cols-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="mb-6 text-4xl font-bold leading-tight md:text-5xl lg:text-6xl">
                Turn Your Business Card{" "}
                <span className="text-gradient">Into an AR Experience</span>
              </h1>
              <p className="mb-6 text-lg text-muted-foreground">
                Scan a physical business card and watch it come alive with video, 3D, contact buttons, social links and interactive content.
              </p>
              <div className="flex flex-col gap-4 sm:flex-row">
                <Link href="/register" className={buttonVariants({ variant: "default", size: "lg" }) + " bg-primary text-primary-foreground hover:bg-primary/90"}>
                  Create Your AR Card
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
                <Link href={DEMO_AR_URL} className={buttonVariants({ variant: "outline", size: "lg" }) + " border-border text-foreground hover:bg-muted/80"}>
                  <Eye className="mr-2 h-4 w-4" />
                  Try Live AR Demo
                </Link>
                <Link href="/holocard-ar-walkthrough" className={buttonVariants({ variant: "ghost", size: "lg" }) + " text-muted-foreground hover:text-foreground hover:bg-muted/50"}>
                  Watch Walkthrough →
                </Link>
              </div>
              <p className="mt-4 text-xs text-muted-foreground/70">No app required. Works directly in your mobile browser.</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative"
            >
              <ScanEffect />
              <HeroHoloCard />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Phase 4: Video Demo — Hero video with animated captions */}
      <section className="border-t border-border py-24">
        <div className="mx-auto max-w-6xl px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
            <h2 className="mb-4 text-center text-3xl font-bold md:text-4xl">
              See Your Card <span className="text-gradient">Come Alive</span>
            </h2>
            <p className="mx-auto mb-12 max-w-2xl text-center text-muted-foreground">
              Scan. Tilt. Flip. Save. A business card that does everything paper can&apos;t.
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mx-auto max-w-3xl"
          >
            <VideoDemoSection />
          </motion.div>
        </div>
      </section>

      {/* Phase 5: Explain the Concept */}
      <section className="border-t border-border py-24">
        <div className="mx-auto max-w-6xl px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
            <h2 className="mb-4 text-center text-3xl font-bold md:text-4xl">
              A Business Card That <span className="text-gradient">Does More</span>
            </h2>
            <p className="mx-auto mb-12 max-w-2xl text-center text-muted-foreground">
              Traditional cards are limited. HoloCard turns yours into an interactive digital identity.
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
              <motion.div key={item.title} initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: i * 0.08 }} className="glass rounded-xl p-6 hover:scale-[1.02] transition-transform">
                <item.icon className="mb-3 h-6 w-6 text-primary" />
                <h3 className="mb-2 font-semibold text-lg">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works — 6 steps with connecting lines */}
      <section id="how-it-works" className="border-t border-border py-24">
        <div className="mx-auto max-w-6xl px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
            <h2 className="mb-12 text-center text-3xl font-bold md:text-4xl">
              How It <span className="text-gradient">Works</span>
            </h2>
          </motion.div>
          <div className="relative grid gap-6 md:grid-cols-6">
            {steps.map((step, i) => (
              <motion.div key={step.num} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.1 }} className="relative text-center">
                {i < steps.length - 1 && (
                  <div className="absolute left-1/2 top-10 hidden h-0.5 w-full bg-gradient-to-r from-primary/50 to-primary/20 md:block" />
                )}
                <div className="relative z-10 mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 border border-primary/20">
                  <step.icon className="h-6 w-6 text-primary" />
                </div>
                <div className="mb-1 text-xs font-bold uppercase tracking-wider text-primary">Step {step.num}</div>
                <h3 className="mb-1 text-lg font-semibold">{step.title}</h3>
                <p className="text-xs text-muted-foreground">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Phase 7: Digital Business Card */}
      <section className="border-t border-border py-24">
        <div className="mx-auto max-w-6xl px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
            <h2 className="mb-4 text-center text-3xl font-bold md:text-4xl">
              Everything You Need. <span className="text-gradient">One Smart Card.</span>
            </h2>
            <p className="mx-auto mb-12 max-w-2xl text-center text-muted-foreground">
              A digital business card that holds your complete professional identity.
            </p>
          </motion.div>
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="glass rounded-2xl p-6 md:p-8">
              <div className="mb-6 flex items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-emerald-600 to-teal-500 text-xl font-bold text-white">JD</div>
                <div>
                  <h3 className="text-lg font-semibold">John Doe</h3>
                  <p className="text-sm text-muted-foreground">Senior Engineer @ TechCorp</p>
                </div>
              </div>
              <p className="mb-4 text-sm text-muted-foreground">Passionate about building innovative AR experiences. 10+ years in software engineering.</p>
              <div className="mb-6 grid grid-cols-2 gap-2">
                {cardFields.map((field) => (
                  <div key={field.label} className="flex items-center gap-2 rounded-lg border border-border bg-muted/50 px-3 py-2">
                    <field.icon className="h-3.5 w-3.5 text-primary" />
                    <span className="text-xs">{field.label}</span>
                  </div>
                ))}
              </div>
              <div className="flex gap-3">
                <button className="flex-1 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground">Save Contact</button>
                <button className="flex-1 rounded-lg border border-border bg-muted/50 px-4 py-2.5 text-sm font-medium">Share Profile</button>
              </div>
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.2 }} className="space-y-4">
              <h3 className="text-2xl font-bold">More Than a Business Card</h3>
              <p className="text-muted-foreground">Your HoloCard is a living digital profile. Update it anytime — changes go live instantly.</p>
              <ul className="space-y-3">
                {["One-tap vCard download to any phone", "QR code for instant sharing at events", "Public URL you can put anywhere", "Analytics on every view and scan", "AR experience that makes you unforgettable"].map((item) => (
                  <li key={item} className="flex items-center gap-2 text-sm"><Check className="h-4 w-4 shrink-0 text-primary" />{item}</li>
                ))}
              </ul>
              <Link href="/register" className={buttonVariants({ variant: "default" }) + " bg-primary text-primary-foreground hover:bg-primary/90 mt-4"}>
                Create Your Digital Card <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Phase 8: AR Business Card */}
      <section className="border-t border-border py-24">
        <div className="mx-auto max-w-6xl px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
            <h2 className="mb-4 text-center text-3xl font-bold md:text-4xl">
              Turn Your Card Into an <span className="text-gradient">AR Experience</span>
            </h2>
            <p className="mx-auto mb-12 max-w-2xl text-center text-muted-foreground">
              Make your physical business card interactive. No app download required.
            </p>
          </motion.div>
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="space-y-4">
              <h3 className="text-2xl font-bold">What Happens When They Scan</h3>
              <p className="text-muted-foreground">Point your phone at a HoloCard and the physical card transforms into an interactive digital experience.</p>
              <div className="grid grid-cols-2 gap-4 pt-4">
                {arElements.map((el, i) => (
                  <motion.div key={el.label} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: i * 0.1 }} className="glass rounded-xl p-4 hover:scale-[1.02] transition-transform">
                    <el.icon className="mb-2 h-5 w-5 text-primary" />
                    <h4 className="text-sm font-semibold">{el.label}</h4>
                    <p className="text-xs text-muted-foreground">{el.desc}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.2 }} className="glass rounded-3xl p-2 glow-md">
              <HeroHoloCard />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Phase 9: Paper to Digital Animation */}
      <section ref={scrollRef} className="relative border-t border-border py-32 overflow-hidden">
        <div className="mx-auto max-w-4xl px-4">
          <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }} className="mb-20 text-center text-3xl font-bold md:text-4xl">
            From Paper to <span className="text-gradient">Digital Identity</span>
          </motion.h2>
          <div className="relative flex flex-col items-center gap-12">
            <motion.div style={{ rotate: cardRotate, scale: cardScale }} className="glass rounded-xl p-8 shadow-lg border border-border w-full max-w-xs text-center">
              <div className="mb-3 text-xs font-bold uppercase tracking-wider text-muted-foreground/70">Traditional Card</div>
              <div className="mb-2 text-lg font-semibold">John Doe</div>
              <div className="text-sm text-muted-foreground">Senior Engineer @ TechCorp</div>
              <div className="mt-3 text-xs text-muted-foreground/70">john@techcorp.com | +1 555 0123</div>
            </motion.div>
            <div className="text-2xl text-primary">&#8595;</div>
            <motion.div style={{ opacity: qrOpacity }} className="flex flex-col items-center gap-3">
              <div className="glass rounded-2xl p-6 border border-primary/30"><QrCode className="h-24 w-24 text-primary" /></div>
              <span className="text-sm font-medium text-primary">Scan the QR Code</span>
            </motion.div>
            <div className="text-2xl text-primary">&#8595;</div>
            <motion.div style={{ y: profileY, opacity: profileOpacity }} className="glass rounded-2xl p-6 w-full max-w-sm border border-border">
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-emerald-600 to-teal-500 text-sm font-bold text-white">JD</div>
                <div><div className="font-semibold">John Doe</div><div className="text-xs text-muted-foreground">Senior Engineer @ TechCorp</div></div>
              </div>
              <div className="flex gap-2">
                <span className="rounded-md bg-primary/10 px-2 py-1 text-xs text-primary"><Mail className="mr-1 inline h-3 w-3" />Email</span>
                <span className="rounded-md bg-primary/10 px-2 py-1 text-xs text-primary"><Phone className="mr-1 inline h-3 w-3" />Call</span>
                <span className="rounded-md bg-primary/10 px-2 py-1 text-xs text-primary"><ExternalLink className="mr-1 inline h-3 w-3" />LinkedIn</span>
              </div>
            </motion.div>
            <div className="text-2xl text-primary">&#8595;</div>
            <motion.div style={{ scale: arScale, opacity: arOpacity }} className="w-full max-w-md">
              <div className="glass rounded-3xl p-2 glow-md"><HeroHoloCard /></div>
              <div className="mt-4 text-center"><span className="text-sm font-medium text-primary">AR Experience Activated</span><p className="text-xs text-muted-foreground/70">3D content, videos, and interactive buttons</p></div>
            </motion.div>
            <motion.div style={{ opacity: arOpacity }} className="mt-8 text-center">
              <p className="text-2xl font-bold md:text-3xl">One Card. <span className="text-gradient">Infinite Possibilities.</span></p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Phase 10: Features Grid */}
      <section id="features" className="border-t border-border py-24">
        <div className="mx-auto max-w-6xl px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
            <h2 className="mb-4 text-center text-3xl font-bold md:text-4xl">
              <span className="text-gradient">Everything</span> Your Network Needs
            </h2>
            <p className="mx-auto mb-12 max-w-2xl text-center text-muted-foreground">A complete toolkit for your professional digital identity.</p>
          </motion.div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f, i) => (
              <motion.div key={f.title} initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: i * 0.05 }} className="glass group rounded-xl p-5 transition-all hover:scale-[1.02] hover:glow-sm">
                <f.icon className="mb-3 h-5 w-5 text-primary" />
                <h3 className="mb-1 font-semibold">{f.title}</h3>
                <p className="text-sm text-muted-foreground">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Analytics Section — Real metrics you'll see after publishing */}
      <section className="border-t border-border py-24">
        <div className="mx-auto max-w-6xl px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
            <h2 className="mb-4 text-center text-3xl font-bold md:text-4xl">
              Know How Your Network <span className="text-gradient">Is Engaging</span>
            </h2>
            <p className="mx-auto mb-12 max-w-2xl text-center text-muted-foreground">Your business card becomes a measurable networking tool.</p>
          </motion.div>
          <div className="glass rounded-2xl p-6 mb-8 border border-border">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[
                { label: "AR Launches", icon: Eye, desc: "Camera opened" },
                { label: "Target Detections", icon: QrCode, desc: "Card recognized" },
                { label: "AR Experiences", icon: Sparkles, desc: "Interactions" },
                { label: "Contact Saves", icon: Users, desc: "vCards downloaded" },
              ].map((m, i) => (
                <motion.div key={m.label} initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: i * 0.1 }} className="rounded-xl bg-muted/50 border border-border p-6 text-center">
                  <m.icon className="mx-auto mb-3 h-6 w-6 text-primary" />
                  <div className="text-lg font-semibold">{m.desc}</div>
                  <div className="text-sm text-muted-foreground">{m.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
          <div className="flex justify-center">
            <Link href="/register" className={buttonVariants({ variant: "outline" }) + " border-border text-foreground hover:bg-muted/80"}>
              See Full Analytics Dashboard <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section id="use-cases" className="border-t border-border py-24">
        <div className="mx-auto max-w-6xl px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
            <h2 className="mb-4 text-center text-3xl font-bold md:text-4xl">
              <span className="text-gradient">Built for People Who Want to Be Remembered</span>
            </h2>
            <p className="mx-auto mb-12 max-w-2xl text-center text-muted-foreground">HoloCard transforms how you connect in every professional context.</p>
          </motion.div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {[
              { icon: Zap, title: "Sales", desc: "Show products and services directly from the card." },
              { icon: Globe, title: "Real Estate", desc: "Show properties in 3D with gallery and contact." },
              { icon: Palette, title: "Creators", desc: "Show portfolios with video and social links." },
              { icon: Users, title: "Consultants", desc: "Show presentations and case studies in AR." },
              { icon: Building, title: "Restaurants", desc: "Show menu, food gallery and location." },
              { icon: Sparkles, title: "Events", desc: "Create memorable networking experiences." },
              { icon: Shield, title: "Companies", desc: "Deploy consistent AR cards across teams." },
            ].map((useCase, i) => (
              <motion.div key={useCase.title} initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: i * 0.08 }} className="glass rounded-xl p-6 transition-all hover:scale-[1.02] hover:glow-sm">
                <useCase.icon className="mb-3 h-6 w-6 text-primary" />
                <h3 className="mb-2 font-semibold text-lg">{useCase.title}</h3>
                <p className="text-sm text-muted-foreground">{useCase.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Phase 13: Live Demo */}
      <section className="border-t border-border py-24">
        <div className="mx-auto max-w-6xl px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
            <h2 className="mb-4 text-center text-3xl font-bold md:text-4xl">
              Experience HoloCard <span className="text-gradient">Yourself</span>
            </h2>
            <p className="mx-auto mb-12 max-w-2xl text-center text-muted-foreground">Open the AR page on your phone, then point the camera at the target image to see the card come alive.</p>
          </motion.div>
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="flex flex-col items-center gap-6">
              <div className="glass rounded-xl p-6 shadow-lg border border-border text-center">
                <div className="mb-3 text-xs font-bold uppercase tracking-wider text-muted-foreground/70">AR Target Image</div>
                <Image
                  src="/demo1.jpg"
                  alt="HoloCard AR target — display this image on a screen or print it"
                  width={224}
                  height={224}
                  className="mx-auto rounded-lg border border-border"
                />
                <p className="mt-3 max-w-[17rem] text-xs text-muted-foreground">Print this image or show it on another screen, then point your phone camera at it.</p>
                <a href="/demo1.jpg" download className="mt-3 inline-flex items-center gap-1.5 text-xs font-medium text-primary hover:text-primary/70 transition-colors">
                  <Download className="h-3 w-3" />
                  Download image
                </a>
              </div>
              <div className="text-2xl text-primary">&#8595;</div>
              <Link href={DEMO_AR_URL} aria-label="Open AR demo page" className="glass rounded-2xl p-4 border border-primary/30 hover:border-primary/60 transition-colors"><QrCode className="h-32 w-32 text-primary" /></Link>
              <span className="text-sm font-medium text-primary">Scan QR to open the AR page on your phone</span>
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.2 }} className="flex flex-col items-center">
              <div className="relative w-64 rounded-[2.5rem] border-4 border-stone-300 bg-stone-200 p-2 shadow-2xl">
                <div className="absolute left-1/2 top-0 h-5 w-24 -translate-x-1/2 rounded-b-xl bg-stone-300" />
                <div className="overflow-hidden rounded-[2rem] bg-stone-100"><div className="p-4"><HeroHoloCard /></div></div>
              </div>
              <div className="mt-6 flex gap-3">
                <Link href={DEMO_AR_URL} className={buttonVariants({ variant: "default", size: "sm" }) + " bg-primary text-primary-foreground hover:bg-primary/90"}>
                  <Eye className="mr-2 h-3 w-3" />
                  Try AR Demo
                </Link>
                <Link href={DEMO_CARD_URL} className={buttonVariants({ variant: "outline", size: "sm" }) + " border-border text-foreground hover:bg-muted/80"}>
                  Open Digital Card
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Phase 14: Trust / Social Proof */}
      <section className="border-t border-border py-24">
        <div className="mx-auto max-w-6xl px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
            <h2 className="mb-4 text-center text-3xl font-bold md:text-4xl">
              Made for <span className="text-gradient">Modern Networking</span>
            </h2>
            <p className="mx-auto mb-12 max-w-2xl text-center text-muted-foreground">Trusted by professionals who want to stand out.</p>
          </motion.div>
          <div className="mb-12 grid grid-cols-2 gap-4 md:grid-cols-4">
            {[{ label: "Professionals", icon: Briefcase }, { label: "Entrepreneurs", icon: Zap }, { label: "Creators", icon: Sparkles }, { label: "Sales Teams", icon: Users }].map((p, i) => (
              <motion.div key={p.label} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: i * 0.1 }} className="glass rounded-xl p-4 text-center">
                <p.icon className="mx-auto mb-2 h-6 w-6 text-primary" />
                <div className="text-sm font-medium">{p.label}</div>
              </motion.div>
            ))}
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            <motion.div initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4 }} className="glass rounded-xl p-6">
              <Lock className="mb-3 h-6 w-6 text-primary" /><h3 className="mb-2 font-semibold">Secure Storage</h3>
              <p className="text-sm text-muted-foreground">Your data is encrypted in transit and stored securely. You control what is public or private.</p>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: 0.1 }} className="glass rounded-xl p-6">
              <EyeOff className="mb-3 h-6 w-6 text-primary" /><h3 className="mb-2 font-semibold">You Control Your Data</h3>
              <p className="text-sm text-muted-foreground">Set your card to public, unlisted, or private. Update content anytime without reprinting.</p>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: 0.2 }} className="glass rounded-xl p-6">
              <Server className="mb-3 h-6 w-6 text-primary" /><h3 className="mb-2 font-semibold">Reliable Hosting</h3>
              <p className="text-sm text-muted-foreground">Hosted on modern infrastructure with automatic scaling. No app install required.</p>
            </motion.div>
          </div>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
            {["WebAR", "Digital Profile", "QR Sharing", "Analytics"].map((tag) => (
              <span key={tag} className="flex items-center gap-1.5"><Check className="h-4 w-4 text-primary" />{tag}</span>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="border-t border-border py-24">
        <div className="mx-auto max-w-6xl px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
            <h2 className="mb-4 text-center text-3xl font-bold md:text-4xl">Simple <span className="text-gradient">Pricing</span></h2>
            <p className="mx-auto mb-4 max-w-2xl text-center text-muted-foreground">Choose the plan that fits your needs. Upgrade anytime.</p>
            <p className="mx-auto mb-12 max-w-xl text-center text-sm text-primary font-medium">Early Access — Create your first AR business card free.</p>
          </motion.div>
          <div className="grid gap-6 md:grid-cols-3">
            {pricingPlans.map((plan, i) => (
              <motion.div key={plan.name} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.15 }} className="glass relative rounded-2xl p-6 border border-border">
                {plan.popular && <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-4 py-1 text-xs font-medium text-primary-foreground">Most Popular</div>}
                <div className="mb-6"><h3 className="text-lg font-semibold">{plan.name}</h3><p className="text-sm text-muted-foreground">{plan.desc}</p></div>
                <div className="mb-6"><span className="text-4xl font-bold">{plan.price}</span><span className="text-muted-foreground">{plan.period}</span></div>
                <ul className="mb-6 space-y-3">
                  {plan.features.map((f) => <li key={f} className="flex items-center gap-2 text-sm"><Check className="h-4 w-4 text-primary" />{f}</li>)}
                  {plan.excluded.map((f) => <li key={f} className="flex items-center gap-2 text-sm text-muted-foreground/70"><X className="h-4 w-4" />{f}</li>)}
                </ul>
                <Link href="/register" className={buttonVariants({ variant: plan.variant, size: "lg" }) + (plan.popular ? " bg-primary text-primary-foreground hover:bg-primary/90 border-primary" : " border-border text-foreground hover:bg-muted/80")}>{plan.cta}</Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="border-t border-border py-24">
        <div className="mx-auto max-w-3xl px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
            <h2 className="mb-4 text-center text-3xl font-bold md:text-4xl">Frequently Asked <span className="text-gradient">Questions</span></h2>
          </motion.div>
          <Accordion type="single" collapsible className="space-y-3 mt-12">
            {faqs.map((faq, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.3, delay: i * 0.05 }}>
                <AccordionItem value={`faq-${i}`} className="glass overflow-hidden rounded-xl border-0 border border-border">
                  <AccordionTrigger className="px-5 py-5 text-left hover:no-underline [&>svg]:h-5 [&>svg]:w-5"><span className="font-medium">{faq.q}</span></AccordionTrigger>
                  <AccordionContent className="px-5 pb-5 text-sm text-muted-foreground">{faq.a}</AccordionContent>
                </AccordionItem>
              </motion.div>
            ))}
          </Accordion>
        </div>
      </section>

      {/* Phase 15: Final CTA */}
      <section className="border-t border-border py-24">
        <div className="mx-auto max-w-3xl px-4 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
            <h2 className="mb-4 text-3xl font-bold md:text-4xl">
              Don&apos;t Hand Out an <span className="text-gradient">Ordinary Business Card.</span>
            </h2>
            <p className="mb-8 text-lg text-muted-foreground">Create a business identity people can see, interact with and remember.</p>
            <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <Link href="/register" className={buttonVariants({ variant: "default", size: "lg" }) + " bg-primary text-primary-foreground hover:bg-primary/90"}>
                Create Your HoloCard <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
              <Link href={DEMO_AR_URL} className={buttonVariants({ variant: "outline", size: "lg" }) + " border-border text-foreground hover:bg-muted/80"}>
                <Eye className="mr-2 h-4 w-4" />Try Demo
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
