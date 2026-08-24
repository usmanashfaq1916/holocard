import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

export const metadata = {
  title: "Terms of Service | HoloCard",
  description: "HoloCard terms of service. Read the rules and guidelines for using our platform.",
};

export default function TermsPage() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="mx-auto max-w-3xl px-4 py-24">
        <h1 className="mb-8 text-4xl font-bold">Terms of Service</h1>
        <p className="mb-6 text-sm text-muted-foreground">Last updated: August 23, 2026</p>

        <div className="prose prose-neutral dark:prose-invert max-w-none space-y-8">
          <section>
            <h2 className="text-2xl font-semibold">1. Acceptance of Terms</h2>
            <p className="text-muted-foreground">
              By accessing or using HoloCard, you agree to be bound by these Terms of Service. If you do not agree, do not use the service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold">2. Account Registration</h2>
            <p className="text-muted-foreground">
              You must provide accurate and complete information when creating an account. You are responsible for maintaining the security of your account credentials.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold">3. User Content</h2>
            <p className="text-muted-foreground">
              You retain ownership of all content you upload to HoloCard, including profile information, images, and 3D models. By using the service, you grant us a limited license to display your content as part of your public card.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold">4. Acceptable Use</h2>
            <p className="text-muted-foreground">
              You may not use HoloCard for any unlawful purpose, to distribute spam or malicious content, to impersonate others, or to interfere with the service. We reserve the right to suspend accounts that violate these terms.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold">5. Plans &amp; Billing</h2>
            <p className="text-muted-foreground">
              Free tier features are provided as-is. Paid plans (Pro, Business) are billed in advance. You may cancel at any time. Refunds are handled on a case-by-case basis within 14 days of purchase.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold">6. Intellectual Property</h2>
            <p className="text-muted-foreground">
              HoloCard and its original content, features, and functionality are owned by HoloCard and are protected by international copyright, trademark, and other intellectual property laws.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold">7. Limitation of Liability</h2>
            <p className="text-muted-foreground">
              HoloCard is provided &quot;as is&quot; without warranties of any kind. We are not liable for any indirect, incidental, or consequential damages arising from your use of the service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold">8. Termination</h2>
            <p className="text-muted-foreground">
              We may terminate or suspend your account at any time for violation of these terms. You may delete your account at any time through your dashboard settings.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold">9. Changes to Terms</h2>
            <p className="text-muted-foreground">
              We reserve the right to modify these terms at any time. Continued use of the service after changes constitutes acceptance of the new terms.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold">10. Contact</h2>
            <p className="text-muted-foreground">
              Questions about these terms? Contact us at hello@holocard.com.
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
