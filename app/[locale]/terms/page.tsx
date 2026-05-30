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
    title: "Terms of Use",
    description:
      "Terms of use for Passly AI — an educational U.S. immigration information tool.",
    alternates: {
      canonical: `${appUrl}/${locale}/terms`,
    },
  };
}

export default async function TermsPage() {
  return (
    <>
      <Navbar />
      <main className="max-w-3xl mx-auto px-4 py-16">
        <h1 className="text-3xl font-bold text-navy mb-2">Terms of Use</h1>
        <p className="text-sm text-muted mb-10">Last updated: May 2026</p>

        <div className="space-y-10 text-sm text-navy leading-relaxed">
          <section>
            <h2 className="text-lg font-semibold mb-3">1. Acceptance of Terms</h2>
            <p>
              By accessing or using Passly AI (&ldquo;the Service&rdquo;), you agree to be bound by
              these Terms of Use. If you do not agree, please do not use the Service.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-3">2. Educational Purpose Only</h2>
            <p>
              Passly AI provides general educational information about U.S. immigration visa
              categories. The content on this site, including eligibility assessments, visa guides,
              and quiz results, is for informational purposes only. Nothing on this site constitutes
              legal advice, and no attorney-client relationship is created by your use of this
              Service.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-3">3. No Warranty of Accuracy</h2>
            <p>
              Immigration law changes frequently. While we strive to keep our content current and
              accurate, we make no representations or warranties about the completeness, accuracy,
              or applicability of any information to your specific situation. USCIS adjudications
              are inherently fact-specific and unpredictable.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-3">4. Limitation of Liability</h2>
            <p>
              Passly AI and its operators shall not be liable for any decisions made in reliance on
              information provided by this Service, including visa application outcomes, denials, or
              immigration-related consequences.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-3">5. Not a Substitute for Legal Counsel</h2>
            <p>
              We strongly encourage all users to consult with a licensed U.S. immigration attorney
              before filing any immigration petition or application. Passly AI is a starting point
              for education, not a replacement for professional legal advice.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-3">6. Use of the Service</h2>
            <p>
              You agree not to use the Service for any unlawful purpose, to misrepresent your
              identity, or to attempt to extract or scrape data from the Service by automated means.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-3">7. Changes to Terms</h2>
            <p>
              We may update these Terms at any time. Continued use of the Service after changes
              constitutes acceptance of the new Terms.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-3">8. Contact</h2>
            <p>
              For questions about these Terms, please contact us at{" "}
              <a
                href="mailto:hello@passly.ai"
                className="text-primary hover:underline"
              >
                hello@passly.ai
              </a>
              .
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
