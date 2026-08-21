import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "How It Works",
  description:
    "Create your AR business card in 3 simple steps. Share via URL or QR code.",
};

export default function HowItWorksPage() {
  const steps = [
    {
      number: "01",
      title: "Create",
      description:
        "Build your professional digital business card with our intuitive editor. Add your photo, details, social links, and customize the design.",
    },
    {
      number: "02",
      title: "Share",
      description:
        "Get a unique URL and QR code for your card. Share it on social media, in emails, or on your physical business card.",
    },
    {
      number: "03",
      title: "Experience",
      description:
        "Visitors scan your card and experience your interactive AR profile — complete with 3D elements, animations, and instant contact saving.",
    },
  ];

  return (
    <div className="min-h-screen bg-grid">
      <div className="absolute inset-0 bg-radial" />
      <div className="relative z-10 mx-auto max-w-6xl px-4 py-24">
        <div className="mb-16 text-center">
          <h1 className="mb-4 text-4xl font-bold md:text-5xl">
            How It <span className="text-gradient">Works</span>
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            From traditional business card to immersive AR experience in three
            simple steps.
          </p>
        </div>
        <div className="grid gap-8 md:grid-cols-3">
          {steps.map((step) => (
            <div key={step.number} className="glass group rounded-xl p-8 text-center">
              <div className="mb-6 text-5xl font-bold text-gradient">
                {step.number}
              </div>
              <h3 className="mb-3 text-xl font-semibold">{step.title}</h3>
              <p className="text-muted-foreground">{step.description}</p>
            </div>
          ))}
        </div>
        <div className="mt-16 text-center">
          <a
            href="/register"
            className="inline-flex h-12 items-center rounded-lg bg-primary px-8 font-medium text-primary-foreground transition-all hover:glow-sm"
          >
            Get Started Free
          </a>
        </div>
      </div>
    </div>
  );
}
