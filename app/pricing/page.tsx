import type { Metadata } from "next";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

export const metadata: Metadata = {
  title: "Pricing",
  description: "Simple, transparent pricing for every professional.",
};

export default function PricingPage() {
  const plans = [
    {
      name: "Free",
      price: "$0",
      period: "forever",
      description: "Perfect for getting started",
      features: [
        "1 AR business card",
        "Basic templates",
        "QR code generation",
        "Basic analytics",
        "Save contact (.vcf)",
        "Public URL",
      ],
      cta: "Get Started",
      highlighted: false,
    },
    {
      name: "Pro",
      price: "$9",
      period: "/month",
      description: "For professionals who want more",
      features: [
        "Unlimited cards",
        "Premium templates",
        "Advanced AR effects",
        "Custom branding",
        "Detailed analytics",
        "Priority support",
        "5GB storage",
      ],
      cta: "Start Pro Trial",
      highlighted: true,
    },
    {
      name: "Business",
      price: "$29",
      period: "/month",
      description: "For teams and companies",
      features: [
        "Everything in Pro",
        "Team management",
        "Company branding",
        "Dedicated support",
        "25GB storage",
      ],
      cta: "Contact Sales",
      highlighted: false,
    },
  ];

  return (
    <div className="min-h-screen bg-grid bg-radial">
      <Navbar />
      <div className="relative z-10 mx-auto max-w-6xl px-4 py-24">
        <div className="mb-16 text-center">
          <h1 className="mb-4 text-4xl font-bold md:text-5xl">
            Simple <span className="text-gradient">Pricing</span>
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            Choose the plan that fits your needs. Upgrade anytime.
          </p>
          <p className="mt-4 text-sm text-primary font-medium">
            Early Access — Create your first AR business card free.
          </p>
        </div>
        <div className="grid gap-8 md:grid-cols-3">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`glass relative rounded-xl p-8 ${
                plan.highlighted ? "glow-md border-primary/50" : ""
              }`}
            >
              {plan.highlighted && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-4 py-1 text-xs font-medium text-primary-foreground">
                  Most Popular
                </div>
              )}
              <h3 className="text-lg font-semibold">{plan.name}</h3>
              <div className="mt-4 flex items-baseline gap-1">
                <span className="text-4xl font-bold">{plan.price}</span>
                <span className="text-muted-foreground">{plan.period}</span>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">
                {plan.description}
              </p>
              <ul className="mt-6 space-y-3">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2 text-sm">
                    <span className="text-primary">✓</span>
                    {feature}
                  </li>
                ))}
              </ul>
              <a
                href="/register"
                className={`mt-8 flex h-10 items-center justify-center rounded-lg font-medium transition-all ${
                  plan.highlighted
                    ? "bg-primary text-primary-foreground hover:glow-sm"
                    : "border border-border bg-transparent hover:bg-accent"
                }`}
              >
                {plan.cta}
              </a>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
}
