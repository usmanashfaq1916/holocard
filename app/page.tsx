"use client";

import Link from "next/link";
import Image from "next/image";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import { useRef, useEffect, useState, useCallback } from "react";
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

function AnimatedCounter({ target, duration = 2 }: { target: number; duration?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    let start = 0;
    const end = target;
    const stepTime = (duration * 1000) / end;
    const timer = setInterval(() => {
      start += Math.ceil(end / (duration * 60));
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(start);
      }
    }, 1000 / 60);
    return () => clearInterval(timer);
  }, [isInView, target, duration]);

  return <span ref={ref}>{count.toLocaleString()}</span>;
}

const capabilities = [
  { icon: Sparkles, label: "Create" },
  { icon: QrCode, label: "Share" },
  { icon: Scan, label: "Scan" },
  { icon: Eye, label: "Experience" },
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
  { icon: Shield, title: "Secure", desc: "Enterprise-grade security protecting your data." },
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
  { q: "What is HoloCard?", a: "HoloCard is a platform that creates interactive digital business cards with Augmented Reality experiences. Your contacts can scan your QR code and see your professional profile come alive in 3D." },
  { q: "How does the AR experience work?", a: "When someone scans your QR code or opens your link on a mobile device, they can activate AR mode to see your 3D profile card floating in front of them. They can rotate it, interact with it, and save your contact details directly." },
  { q: "Do I need to install an app?", a: "No app installation is required. HoloCard works directly in mobile browsers using WebAR technology. Simply share your link or QR code and your contacts can experience AR instantly." },
  { q: "Can I create multiple cards?", a: "Yes! Free users get 1 card, while Pro and Business users can create unlimited cards. This is perfect for having separate cards for different professional contexts like networking, sales, or personal branding." },
  { q: "Is my data secure?", a: "Absolutely. We use enterprise-grade encryption and security practices. Your data is stored securely, and you have full control over what information is displayed publicly. We never sell your data to third parties." },
  { q: "Can I track who viewed my card?", a: "Yes, our analytics dashboard provides insights into views, QR scans, contact saves, and engagement metrics. Pro and Business users get detailed analytics including geographic data and referral sources." },
  { q: "How much does it cost?", a: "HoloCard offers a generous free tier with 1 card and core features. Pro plans start at $9/month with unlimited cards, premium templates, and advanced analytics. Business plans include team management and priority support." },
  { q: "What devices are supported?", a: "HoloCard works on all modern browsers across iOS, Android, Windows, macOS, and Linux. The AR experience is optimized for mobile devices with ARCore (Android) or ARKit (iOS) support." },
];

function ParticlesBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {Array.from({ length: 30 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute h-1 w-1 rounded-full bg-blue-400/20"
          initial={{
            x: `${Math.random() * 100}%`,
            y: `${Math.random() * 100}%`,
            scale: Math.random() * 0.5 + 0.5,
          }}
          animate={{
            y: [`${Math.random() * 100}%`, `${Math.random() * 100}%`],
            opacity: [0.2, 0.6, 0.2],
          }}
          transition={{
            duration: Math.random() * 10 + 10,
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
    <div className="min-h-screen bg-gray-950 text-white">
      <Navbar />

      {/* Phase 2+3: Hero — Full-screen cinematic with particles and scan effect */}
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
                Your Business Card.{" "}
                <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">Brought to Life.</span>
              </h1>
              <p className="mb-6 text-lg text-gray-400">
                Create, share, scan, experience, connect, and track — all from one smart card.
              </p>
              <div className="mb-8 flex flex-wrap gap-3">
                {capabilities.map((cap) => (
                  <span key={cap.label} className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium backdrop-blur-sm">
                    <cap.icon className="h-3 w-3 text-blue-400" />
                    {cap.label}
                  </span>
                ))}
              </div>
              <div className="flex flex-col gap-4 sm:flex-row">
                <Link href="/register" className={buttonVariants({ variant: "default", size: "lg" }) + " bg-blue-600 text-white hover:bg-blue-500"}>
                  Create Your HoloCard
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
                <Link href={DEMO_AR_URL} className={buttonVariants({ variant: "outline", size: "lg" }) + " border-white/20 text-white hover:bg-white/5"}>
                  <Eye className="mr-2 h-4 w-4" />
                  Try Demo
                </Link>
              </div>
              <p className="mt-4 text-xs text-gray-500">No app required. Works directly in your mobile browser.</p>
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

      {/* Phase 4: Interactive AR Demo — Split layout below hero */}
      <section className="border-t border-white/10 py-24">
        <div className="mx-auto max-w-6xl px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
            <h2 className="mb-4 text-center text-3xl font-bold md:text-4xl">
              See Your Card <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">Come Alive</span>
            </h2>
            <p className="mx-auto mb-12 max-w-2xl text-center text-gray-400">
              Scan the QR code or try the 3D preview. The future of business networking.
            </p>
          </motion.div>
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="flex flex-col items-center gap-6">
              <div className="glass rounded-xl p-6 shadow-lg border border-white/10 text-center">
                <div className="mb-2 text-xs font-bold uppercase tracking-wider text-gray-500">Sample HoloCard</div>
                <div className="mb-1 text-lg font-semibold">John Doe</div>
                <div className="text-sm text-gray-400">Software Engineer @ TechCorp</div>
              </div>
              <div className="text-2xl text-blue-400">&#8595;</div>
              <div className="glass rounded-2xl p-4 border border-blue-400/30">
                <QrCode className="h-32 w-32 text-blue-400" />
              </div>
              <span className="text-sm font-medium text-blue-400">Scan to Experience HoloCard</span>
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.2 }} className="flex flex-col items-center">
              <div className="relative w-64 rounded-[2.5rem] border-4 border-gray-700 bg-gray-900 p-2 shadow-2xl">
                <div className="absolute left-1/2 top-0 h-5 w-24 -translate-x-1/2 rounded-b-xl bg-gray-700" />
                <div className="overflow-hidden rounded-[2rem] bg-gray-900">
                  <div className="p-4">
                    <HeroHoloCard />
                  </div>
                </div>
              </div>
              <div className="mt-6 flex gap-3">
                <Link href={DEMO_AR_URL} className={buttonVariants({ variant: "default", size: "sm" }) + " bg-blue-600 text-white hover:bg-blue-500"}>
                  <Eye className="mr-2 h-3 w-3" />
                  Try AR Demo
                </Link>
                <Link href={DEMO_CARD_URL} className={buttonVariants({ variant: "outline", size: "sm" }) + " border-white/20 text-white hover:bg-white/5"}>
                  Open Digital Card
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Phase 5: Explain the Concept */}
      <section className="border-t border-white/10 py-24">
        <div className="mx-auto max-w-6xl px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
            <h2 className="mb-4 text-center text-3xl font-bold md:text-4xl">
              A Business Card That <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">Does More</span>
            </h2>
            <p className="mx-auto mb-12 max-w-2xl text-center text-gray-400">
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
                <item.icon className="mb-3 h-6 w-6 text-blue-400" />
                <h3 className="mb-2 font-semibold text-lg">{item.title}</h3>
                <p className="text-sm text-gray-400">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Phase 6: How It Works — 4 steps with connecting lines */}
      <section id="how-it-works" className="border-t border-white/10 py-24">
        <div className="mx-auto max-w-5xl px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
            <h2 className="mb-12 text-center text-3xl font-bold md:text-4xl">
              How It <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">Works</span>
            </h2>
          </motion.div>
          <div className="relative grid gap-8 md:grid-cols-4">
            {steps.map((step, i) => (
              <motion.div key={step.num} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.15 }} className="relative text-center">
                {i < steps.length - 1 && (
                  <div className="absolute left-1/2 top-10 hidden h-0.5 w-full bg-gradient-to-r from-blue-500/50 to-blue-500/20 md:block" />
                )}
                <div className="relative z-10 mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-2xl bg-blue-500/10 border border-blue-500/20">
                  <step.icon className="h-8 w-8 text-blue-400" />
                </div>
                <div className="mb-2 text-xs font-bold uppercase tracking-wider text-blue-400">Step {step.num}</div>
                <h3 className="mb-2 text-xl font-semibold">{step.title}</h3>
                <p className="text-sm text-gray-400">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Phase 7: Digital Business Card */}
      <section className="border-t border-white/10 py-24">
        <div className="mx-auto max-w-6xl px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
            <h2 className="mb-4 text-center text-3xl font-bold md:text-4xl">
              Everything You Need. <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">One Smart Card.</span>
            </h2>
            <p className="mx-auto mb-12 max-w-2xl text-center text-gray-400">
              A digital business card that holds your complete professional identity.
            </p>
          </motion.div>
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="glass rounded-2xl p-6 md:p-8">
              <div className="mb-6 flex items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 text-xl font-bold text-white">JD</div>
                <div>
                  <h3 className="text-lg font-semibold">John Doe</h3>
                  <p className="text-sm text-gray-400">Senior Engineer @ TechCorp</p>
                </div>
              </div>
              <p className="mb-4 text-sm text-gray-400">Passionate about building innovative AR experiences. 10+ years in software engineering.</p>
              <div className="mb-6 grid grid-cols-2 gap-2">
                {cardFields.map((field) => (
                  <div key={field.label} className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2">
                    <field.icon className="h-3.5 w-3.5 text-blue-400" />
                    <span className="text-xs">{field.label}</span>
                  </div>
                ))}
              </div>
              <div className="flex gap-3">
                <button className="flex-1 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white">Save Contact</button>
                <button className="flex-1 rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-medium">Share Profile</button>
              </div>
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.2 }} className="space-y-4">
              <h3 className="text-2xl font-bold">More Than a Business Card</h3>
              <p className="text-gray-400">Your HoloCard is a living digital profile. Update it anytime — changes go live instantly.</p>
              <ul className="space-y-3">
                {["One-tap vCard download to any phone", "QR code for instant sharing at events", "Public URL you can put anywhere", "Analytics on every view and scan", "AR experience that makes you unforgettable"].map((item) => (
                  <li key={item} className="flex items-center gap-2 text-sm"><Check className="h-4 w-4 shrink-0 text-blue-400" />{item}</li>
                ))}
              </ul>
              <Link href="/register" className={buttonVariants({ variant: "default" }) + " bg-blue-600 text-white hover:bg-blue-500 mt-4"}>
                Create Your Digital Card <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Phase 8: AR Business Card */}
      <section className="border-t border-white/10 py-24">
        <div className="mx-auto max-w-6xl px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
            <h2 className="mb-4 text-center text-3xl font-bold md:text-4xl">
              Turn Your Card Into an <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">AR Experience</span>
            </h2>
            <p className="mx-auto mb-12 max-w-2xl text-center text-gray-400">
              Make your physical business card interactive. No app download required.
            </p>
          </motion.div>
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="space-y-4">
              <h3 className="text-2xl font-bold">What Happens When They Scan</h3>
              <p className="text-gray-400">Point your phone at a HoloCard and the physical card transforms into an interactive digital experience.</p>
              <div className="grid grid-cols-2 gap-4 pt-4">
                {arElements.map((el, i) => (
                  <motion.div key={el.label} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: i * 0.1 }} className="glass rounded-xl p-4 hover:scale-[1.02] transition-transform">
                    <el.icon className="mb-2 h-5 w-5 text-blue-400" />
                    <h4 className="text-sm font-semibold">{el.label}</h4>
                    <p className="text-xs text-gray-400">{el.desc}</p>
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
      <section ref={scrollRef} className="relative border-t border-white/10 py-32 overflow-hidden">
        <div className="mx-auto max-w-4xl px-4">
          <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }} className="mb-20 text-center text-3xl font-bold md:text-4xl">
            From Paper to <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">Digital Identity</span>
          </motion.h2>
          <div className="relative flex flex-col items-center gap-12">
            <motion.div style={{ rotate: cardRotate, scale: cardScale }} className="glass rounded-xl p-8 shadow-lg border border-white/10 w-full max-w-xs text-center">
              <div className="mb-3 text-xs font-bold uppercase tracking-wider text-gray-500">Traditional Card</div>
              <div className="mb-2 text-lg font-semibold">John Doe</div>
              <div className="text-sm text-gray-400">Senior Engineer @ TechCorp</div>
              <div className="mt-3 text-xs text-gray-500">john@techcorp.com | +1 555 0123</div>
            </motion.div>
            <div className="text-2xl text-blue-400">&#8595;</div>
            <motion.div style={{ opacity: qrOpacity }} className="flex flex-col items-center gap-3">
              <div className="glass rounded-2xl p-6 border border-blue-400/30"><QrCode className="h-24 w-24 text-blue-400" /></div>
              <span className="text-sm font-medium text-blue-400">Scan the QR Code</span>
            </motion.div>
            <div className="text-2xl text-blue-400">&#8595;</div>
            <motion.div style={{ y: profileY, opacity: profileOpacity }} className="glass rounded-2xl p-6 w-full max-w-sm border border-white/10">
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 text-sm font-bold text-white">JD</div>
                <div><div className="font-semibold">John Doe</div><div className="text-xs text-gray-400">Senior Engineer @ TechCorp</div></div>
              </div>
              <div className="flex gap-2">
                <span className="rounded-md bg-blue-500/10 px-2 py-1 text-xs text-blue-400"><Mail className="mr-1 inline h-3 w-3" />Email</span>
                <span className="rounded-md bg-blue-500/10 px-2 py-1 text-xs text-blue-400"><Phone className="mr-1 inline h-3 w-3" />Call</span>
                <span className="rounded-md bg-blue-500/10 px-2 py-1 text-xs text-blue-400"><ExternalLink className="mr-1 inline h-3 w-3" />LinkedIn</span>
              </div>
            </motion.div>
            <div className="text-2xl text-blue-400">&#8595;</div>
            <motion.div style={{ scale: arScale, opacity: arOpacity }} className="w-full max-w-md">
              <div className="glass rounded-3xl p-2 glow-md"><HeroHoloCard /></div>
              <div className="mt-4 text-center"><span className="text-sm font-medium text-blue-400">AR Experience Activated</span><p className="text-xs text-gray-500">3D content, videos, and interactive buttons</p></div>
            </motion.div>
            <motion.div style={{ opacity: arOpacity }} className="mt-8 text-center">
              <p className="text-2xl font-bold md:text-3xl">One Card. <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">Infinite Possibilities.</span></p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Phase 10: Features Grid */}
      <section id="features" className="border-t border-white/10 py-24">
        <div className="mx-auto max-w-6xl px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
            <h2 className="mb-4 text-center text-3xl font-bold md:text-4xl">
              <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">Everything</span> Your Network Needs
            </h2>
            <p className="mx-auto mb-12 max-w-2xl text-center text-gray-400">A complete toolkit for your professional digital identity.</p>
          </motion.div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f, i) => (
              <motion.div key={f.title} initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: i * 0.05 }} className="glass group rounded-xl p-5 transition-all hover:scale-[1.02] hover:glow-sm">
                <f.icon className="mb-3 h-5 w-5 text-blue-400" />
                <h3 className="mb-1 font-semibold">{f.title}</h3>
                <p className="text-sm text-gray-400">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Phase 11: Analytics Section */}
      <section className="border-t border-white/10 py-24">
        <div className="mx-auto max-w-6xl px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
            <h2 className="mb-4 text-center text-3xl font-bold md:text-4xl">
              Know How Your Network <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">Is Engaging</span>
            </h2>
            <p className="mx-auto mb-12 max-w-2xl text-center text-gray-400">Your business card becomes a measurable networking tool.</p>
          </motion.div>
          <div className="glass rounded-2xl p-6 mb-8 border border-white/10">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[
                { label: "Profile Views", value: 2847, change: "+23%", icon: Eye },
                { label: "QR Scans", value: 1203, change: "+18%", icon: QrCode },
                { label: "AR Experiences", value: 891, change: "+42%", icon: Sparkles },
                { label: "Contact Saves", value: 456, change: "+31%", icon: Users },
              ].map((m, i) => (
                <motion.div key={m.label} initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: i * 0.1 }} className="rounded-xl bg-white/5 border border-white/10 p-6 text-center">
                  <m.icon className="mx-auto mb-3 h-6 w-6 text-blue-400" />
                  <div className="text-3xl font-bold"><AnimatedCounter target={m.value} /></div>
                  <div className="text-sm text-gray-400">{m.label}</div>
                  <div className="mt-1 text-xs font-medium text-emerald-400">{m.change}</div>
                </motion.div>
              ))}
            </div>
          </div>
          <div className="flex justify-center">
            <Link href="/register" className={buttonVariants({ variant: "outline" }) + " border-white/20 text-white hover:bg-white/5"}>
              See Full Analytics Dashboard <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Phase 12: Use Cases */}
      <section id="use-cases" className="border-t border-white/10 py-24">
        <div className="mx-auto max-w-6xl px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
            <h2 className="mb-4 text-center text-3xl font-bold md:text-4xl">
              <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">Built for People Who Want to Be Remembered</span>
            </h2>
            <p className="mx-auto mb-12 max-w-2xl text-center text-gray-400">HoloCard transforms how you connect in every professional context.</p>
          </motion.div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {[
              { icon: Zap, title: "Entrepreneurs", desc: "Show your company and vision with an interactive experience." },
              { icon: Users, title: "Sales Professionals", desc: "Share products and contact information instantly." },
              { icon: Globe, title: "Real Estate", desc: "Show properties, videos and contact details in AR." },
              { icon: Palette, title: "Freelancers", desc: "Present your portfolio and services memorably." },
              { icon: Building, title: "Agencies", desc: "Create memorable client introductions at scale." },
              { icon: Sparkles, title: "Events & Networking", desc: "Make every introduction interactive and unforgettable." },
              { icon: Shield, title: "Companies", desc: "Deploy branded HoloCards across your entire team." },
            ].map((useCase, i) => (
              <motion.div key={useCase.title} initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: i * 0.08 }} className="glass rounded-xl p-6 transition-all hover:scale-[1.02] hover:glow-sm">
                <useCase.icon className="mb-3 h-6 w-6 text-blue-400" />
                <h3 className="mb-2 font-semibold text-lg">{useCase.title}</h3>
                <p className="text-sm text-gray-400">{useCase.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Phase 13: Live Demo */}
      <section className="border-t border-white/10 py-24">
        <div className="mx-auto max-w-6xl px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
            <h2 className="mb-4 text-center text-3xl font-bold md:text-4xl">
              Experience HoloCard <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">Yourself</span>
            </h2>
            <p className="mx-auto mb-12 max-w-2xl text-center text-gray-400">Open the AR page on your phone, then point the camera at the target image to see the card come alive.</p>
          </motion.div>
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="flex flex-col items-center gap-6">
              <div className="glass rounded-xl p-6 shadow-lg border border-white/10 text-center">
                <div className="mb-3 text-xs font-bold uppercase tracking-wider text-gray-500">AR Target Image</div>
                <Image
                  src="/demo1.jpg"
                  alt="HoloCard AR target — display this image on a screen or print it"
                  width={224}
                  height={224}
                  className="mx-auto rounded-lg border border-white/10"
                />
                <p className="mt-3 max-w-[17rem] text-xs text-gray-400">Print this image or show it on another screen, then point your phone camera at it.</p>
                <a href="/demo1.jpg" download className="mt-3 inline-flex items-center gap-1.5 text-xs font-medium text-blue-400 hover:text-blue-300 transition-colors">
                  <Download className="h-3 w-3" />
                  Download image
                </a>
              </div>
              <div className="text-2xl text-blue-400">&#8595;</div>
              <Link href={DEMO_AR_URL} aria-label="Open AR demo page" className="glass rounded-2xl p-4 border border-blue-400/30 hover:border-blue-400/60 transition-colors"><QrCode className="h-32 w-32 text-blue-400" /></Link>
              <span className="text-sm font-medium text-blue-400">Scan QR to open the AR page on your phone</span>
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.2 }} className="flex flex-col items-center">
              <div className="relative w-64 rounded-[2.5rem] border-4 border-gray-700 bg-gray-900 p-2 shadow-2xl">
                <div className="absolute left-1/2 top-0 h-5 w-24 -translate-x-1/2 rounded-b-xl bg-gray-700" />
                <div className="overflow-hidden rounded-[2rem] bg-gray-900"><div className="p-4"><HeroHoloCard /></div></div>
              </div>
              <div className="mt-6 flex gap-3">
                <Link href={DEMO_AR_URL} className={buttonVariants({ variant: "default", size: "sm" }) + " bg-blue-600 text-white hover:bg-blue-500"}>
                  <Eye className="mr-2 h-3 w-3" />
                  Try AR Demo
                </Link>
                <Link href={DEMO_CARD_URL} className={buttonVariants({ variant: "outline", size: "sm" }) + " border-white/20 text-white hover:bg-white/5"}>
                  Open Digital Card
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Phase 14: Trust / Social Proof */}
      <section className="border-t border-white/10 py-24">
        <div className="mx-auto max-w-6xl px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
            <h2 className="mb-4 text-center text-3xl font-bold md:text-4xl">
              Made for <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">Modern Networking</span>
            </h2>
            <p className="mx-auto mb-12 max-w-2xl text-center text-gray-400">Trusted by professionals who want to stand out.</p>
          </motion.div>
          <div className="mb-12 grid grid-cols-2 gap-4 md:grid-cols-4">
            {[{ label: "Professionals", icon: Briefcase }, { label: "Entrepreneurs", icon: Zap }, { label: "Creators", icon: Sparkles }, { label: "Sales Teams", icon: Users }].map((p, i) => (
              <motion.div key={p.label} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: i * 0.1 }} className="glass rounded-xl p-4 text-center">
                <p.icon className="mx-auto mb-2 h-6 w-6 text-blue-400" />
                <div className="text-sm font-medium">{p.label}</div>
              </motion.div>
            ))}
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            <motion.div initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4 }} className="glass rounded-xl p-6">
              <Lock className="mb-3 h-6 w-6 text-blue-400" /><h3 className="mb-2 font-semibold">End-to-End Encryption</h3>
              <p className="text-sm text-gray-400">All data encrypted in transit and at rest. Never exposed to unauthorized parties.</p>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: 0.1 }} className="glass rounded-xl p-6">
              <EyeOff className="mb-3 h-6 w-6 text-blue-400" /><h3 className="mb-2 font-semibold">Privacy First</h3>
              <p className="text-sm text-gray-400">You control what is public, unlisted, or private. We never sell your data.</p>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: 0.2 }} className="glass rounded-xl p-6">
              <Server className="mb-3 h-6 w-6 text-blue-400" /><h3 className="mb-2 font-semibold">Secure Infrastructure</h3>
              <p className="text-sm text-gray-400">Enterprise-grade hosting with automatic backups and 99.9% uptime.</p>
            </motion.div>
          </div>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-sm text-gray-400">
            {["WebAR", "Digital Profile", "QR Sharing", "Analytics"].map((tag) => (
              <span key={tag} className="flex items-center gap-1.5"><Check className="h-4 w-4 text-blue-400" />{tag}</span>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="border-t border-white/10 py-24">
        <div className="mx-auto max-w-6xl px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
            <h2 className="mb-4 text-center text-3xl font-bold md:text-4xl">Simple <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">Pricing</span></h2>
            <p className="mx-auto mb-12 max-w-2xl text-center text-gray-400">Choose the plan that fits your needs. Upgrade anytime.</p>
          </motion.div>
          <div className="grid gap-6 md:grid-cols-3">
            {pricingPlans.map((plan, i) => (
              <motion.div key={plan.name} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.15 }} className="glass relative rounded-2xl p-6 border border-white/10">
                {plan.popular && <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-blue-600 px-4 py-1 text-xs font-medium text-white">Most Popular</div>}
                <div className="mb-6"><h3 className="text-lg font-semibold">{plan.name}</h3><p className="text-sm text-gray-400">{plan.desc}</p></div>
                <div className="mb-6"><span className="text-4xl font-bold">{plan.price}</span><span className="text-gray-400">{plan.period}</span></div>
                <ul className="mb-6 space-y-3">
                  {plan.features.map((f) => <li key={f} className="flex items-center gap-2 text-sm"><Check className="h-4 w-4 text-blue-400" />{f}</li>)}
                  {plan.excluded.map((f) => <li key={f} className="flex items-center gap-2 text-sm text-gray-500"><X className="h-4 w-4" />{f}</li>)}
                </ul>
                <Link href="/register" className={buttonVariants({ variant: plan.variant, size: "lg" }) + (plan.popular ? " bg-blue-600 text-white hover:bg-blue-500 border-blue-600" : " border-white/20 text-white hover:bg-white/5")}>{plan.cta}</Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="border-t border-white/10 py-24">
        <div className="mx-auto max-w-3xl px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
            <h2 className="mb-4 text-center text-3xl font-bold md:text-4xl">Frequently Asked <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">Questions</span></h2>
          </motion.div>
          <Accordion type="single" collapsible className="space-y-3 mt-12">
            {faqs.map((faq, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.3, delay: i * 0.05 }}>
                <AccordionItem value={`faq-${i}`} className="glass overflow-hidden rounded-xl border-0 border border-white/10">
                  <AccordionTrigger className="px-5 py-5 text-left hover:no-underline [&>svg]:h-5 [&>svg]:w-5"><span className="font-medium">{faq.q}</span></AccordionTrigger>
                  <AccordionContent className="px-5 pb-5 text-sm text-gray-400">{faq.a}</AccordionContent>
                </AccordionItem>
              </motion.div>
            ))}
          </Accordion>
        </div>
      </section>

      {/* Phase 15: Final CTA */}
      <section className="border-t border-white/10 py-24">
        <div className="mx-auto max-w-3xl px-4 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
            <h2 className="mb-4 text-3xl font-bold md:text-4xl">
              Don&apos;t Hand Out an <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">Ordinary Business Card.</span>
            </h2>
            <p className="mb-8 text-lg text-gray-400">Create a business identity people can see, interact with and remember.</p>
            <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <Link href="/register" className={buttonVariants({ variant: "default", size: "lg" }) + " bg-blue-600 text-white hover:bg-blue-500"}>
                Create Your HoloCard <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
              <Link href={DEMO_AR_URL} className={buttonVariants({ variant: "outline", size: "lg" }) + " border-white/20 text-white hover:bg-white/5"}>
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
