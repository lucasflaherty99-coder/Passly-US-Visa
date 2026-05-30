import type { Metadata } from "next";
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://passly.ai";

  return {
    title: "Privacy Policy",
    description:
      "Passly AI privacy policy — how we collect, use, and protect your information.",
    alternates: {
      canonical: `${appUrl}/${locale}/privacy`,
    },
  };
}

export default async function PrivacyPage() {
  return (
    <>
      <Navbar />
      <main className="max-w-3xl mx-auto px-4 py-16">
        <h1 className="text-3xl font-bold text-navy mb-2">Privacy Policy</h1>
        <p className="text-sm text-muted mb-10">Last updated: May 2026</p>

        <div className="space-y-10 text-sm text-navy leading-relaxed">
          <section>
            <h2 className="text-lg font-semibold mb-3">1. Information We Collect</h2>
            <p>
              We collect information you provide directly, including your email address when you
              submit it through our eligibility analysis form, and your quiz responses (immigration
              goals, professional background, education level, and similar profile information). We
              do not collect your name, passport number, date of birth, or any government
              identification.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-3">2. How We Use Your Information</h2>
            <p>
              We use your email address to send your eligibility analysis results and, if you opt
              in, periodic educational content about U.S. immigration pathways. We use your quiz
              responses solely to generate your eligibility analysis. We do not sell, rent, or share
              your personal information with third parties for their marketing purposes.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-3">3. Third-Party Services</h2>
            <p>
              We use Vercel for hosting and may use analytics tools (such as Google Analytics or
              Plausible) to understand site usage. These services may collect anonymized usage data
              including pages visited and time spent. We do not use advertising networks or tracking
              pixels.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-3">4. Cookies</h2>
            <p>
              We use essential cookies necessary for the site to function (session cookies, language
              preference). We do not use tracking cookies or advertising cookies without your
              consent.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-3">5. Data Retention</h2>
            <p>
              We retain email addresses until you unsubscribe or request deletion. Quiz responses
              may be stored in anonymized, aggregated form for the purpose of improving our analysis
              engine.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-3">6. Your Rights</h2>
            <p>
              You may request deletion of your personal data at any time by emailing us. If you are
              in the European Economic Area, you have additional rights under GDPR including the
              right to access, rectify, and erase your personal data.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-3">7. Contact</h2>
            <p>
              For privacy-related inquiries, please contact us at{" "}
              <a
                href="mailto:hello@passly.ai"
                className="text-primary hover:underline"
              >
                hello@passly.ai
              </a>
              .
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-3">8. Disclaimer</h2>
            <p>
              Passly AI is an educational tool. The information provided does not constitute legal
              advice and does not create an attorney-client relationship. Always consult a licensed
              immigration attorney for advice specific to your situation.
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
