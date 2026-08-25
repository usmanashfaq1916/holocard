import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { CONTACT_EMAIL } from "@/lib/config";

export const metadata = {
  title: "Privacy Policy | HoloCard",
  description: "HoloCard privacy policy. Learn how we collect, use, and protect your personal information.",
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="mx-auto max-w-3xl px-4 py-24">
        <h1 className="mb-8 text-4xl font-bold">Privacy Policy</h1>
        <p className="mb-6 text-sm text-muted-foreground">Last updated: August 23, 2026</p>

        <div className="prose prose-neutral dark:prose-invert max-w-none space-y-8">
          <section>
            <h2 className="text-2xl font-semibold">1. Information We Collect</h2>
            <p className="text-muted-foreground">
              When you use HoloCard, we collect information you provide directly, such as your name, email address, company, designation, and other profile information. We also collect usage data including page views, QR scans, and interaction metrics to power your analytics dashboard.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold">2. How We Use Your Information</h2>
            <p className="text-muted-foreground">
              We use your information to provide and improve our services, personalize your experience, generate analytics insights, and communicate with you about your account. We do not sell your personal information to third parties.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold">3. Data Storage &amp; Security</h2>
            <p className="text-muted-foreground">
              Your data is stored securely using industry-standard encryption. We use trusted cloud infrastructure providers (Neon PostgreSQL, Supabase) to host your data. All data transmission is encrypted via TLS/SSL.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold">4. Public Cards</h2>
            <p className="text-muted-foreground">
              Information you choose to make public on your card (name, designation, company, social links, etc.) is accessible to anyone with your card URL or QR code. You can control visibility settings in your dashboard.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold">5. Analytics Data</h2>
            <p className="text-muted-foreground">
              We collect anonymous analytics data (views, scans, device types, geographic regions) to provide you with insights. This data is aggregated and does not personally identify individual visitors.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold">6. Cookies</h2>
            <p className="text-muted-foreground">
              We use essential cookies for authentication and session management. We do not use third-party tracking cookies. Analytics data is collected server-side without cookies.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold">7. Your Rights</h2>
            <p className="text-muted-foreground">
              You can access, update, or delete your account and data at any time through your dashboard settings. For data export requests, contact us at {CONTACT_EMAIL}.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold">8. Changes to This Policy</h2>
            <p className="text-muted-foreground">
              We may update this privacy policy from time to time. We will notify you of any material changes by posting the new policy on this page and updating the &quot;Last updated&quot; date.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold">9. Contact Us</h2>
            <p className="text-muted-foreground">
              If you have questions about this privacy policy, please contact us at {CONTACT_EMAIL}.
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
