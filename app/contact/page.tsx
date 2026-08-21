import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with the HoloCard team.",
};

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-grid">
      <div className="absolute inset-0 bg-radial" />
      <div className="relative z-10 mx-auto max-w-2xl px-4 py-24">
        <h1 className="mb-8 text-4xl font-bold md:text-5xl">
          Get in <span className="text-gradient">Touch</span>
        </h1>
        <p className="mb-8 text-lg text-muted-foreground">
          Have a question or want to work together? We&apos;d love to hear from
          you.
        </p>
        <div className="glass rounded-xl p-8">
          <form className="space-y-6">
            <div>
              <label className="mb-2 block text-sm font-medium">Name</label>
              <input
                type="text"
                className="w-full rounded-lg border border-border bg-background px-4 py-3 text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
                placeholder="Your name"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium">Email</label>
              <input
                type="email"
                className="w-full rounded-lg border border-border bg-background px-4 py-3 text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium">Message</label>
              <textarea
                rows={5}
                className="w-full resize-none rounded-lg border border-border bg-background px-4 py-3 text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
                placeholder="How can we help?"
              />
            </div>
            <button
              type="submit"
              className="flex h-12 w-full items-center justify-center rounded-lg bg-primary font-medium text-primary-foreground transition-all hover:glow-sm"
            >
              Send Message
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
