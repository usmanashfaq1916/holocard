"use client";

import Link from "next/link";
import { ArrowRight, Check, Zap, Shield, Globe } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";

export function DemoCTA() {
  return (
    <section className="flex min-h-screen flex-col items-center justify-center px-4 pt-20 pb-24">
      <div className="mx-auto max-w-3xl text-center">
        <div className="mb-6">
          <span className="rounded-full bg-primary/10 px-4 py-1.5 text-xs font-semibold text-primary">
            07 / 07
          </span>
        </div>

        <h2 className="mb-6 text-4xl font-bold md:text-5xl">
          Ready to Create Your{" "}
          <span className="text-gradient">HoloCard</span>?
        </h2>
        <p className="mx-auto mb-10 max-w-xl text-lg text-muted-foreground">
          Join professionals who have transformed their networking with
          interactive 3D business cards.
        </p>

        {/* CTA buttons */}
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <Link
            href="/register"
            className={buttonVariants({ variant: "default", size: "lg" })}
          >
            Get Started Free
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
          <Link
            href="/ar/usman-ashfaq"
            className={buttonVariants({ variant: "outline", size: "lg" })}
          >
            View Live Demo
          </Link>
        </div>

        {/* Trust indicators */}
        <div className="mt-12 flex flex-wrap justify-center gap-6">
          {[
            { icon: Check, text: "No credit card required" },
            { icon: Zap, text: "Setup in 2 minutes" },
            { icon: Shield, text: "Enterprise-grade security" },
            { icon: Globe, text: "Public URL included" },
          ].map((item) => (
            <div
              key={item.text}
              className="flex items-center gap-2 text-sm text-muted-foreground"
            >
              <item.icon className="h-4 w-4 text-primary" />
              {item.text}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
