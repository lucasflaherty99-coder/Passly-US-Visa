import Link from "next/link";
import { CTAButton } from "@/components/ui/CTAButton";
import { FAQAccordion, FAQItem } from "@/components/seo/FAQAccordion";
import { DisclaimerBanner } from "@/components/ui/DisclaimerBanner";

type EligibilityFactor = { label: string; description: string };

type Props = {
  locale: string;
  title: string;
  visaType: string;
  intro: string;
  eligibilityFactors: EligibilityFactor[];
  commonMistakes: string[];
  faqs: FAQItem[];
  relatedSlugs: { slug: string; label: string }[];
  ctaLabel: string;
  quizLabel: string;
  mistakesTitle: string;
  eligibilityTitle: string;
  faqTitle: string;
  relatedTitle: string;
};

export function SEOPageTemplate({
  locale,
  title,
  visaType,
  intro,
  eligibilityFactors,
  commonMistakes,
  faqs,
  relatedSlugs,
  ctaLabel,
  quizLabel,
  mistakesTitle,
  eligibilityTitle,
  faqTitle,
  relatedTitle,
}: Props) {
  return (
    <div className="min-h-screen bg-bg">
      {/* Hero */}
      <section className="gradient-hero py-16 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 border border-primary/20 px-4 py-1.5 mb-6">
            <span className="text-xs font-bold text-primary uppercase tracking-wide">{visaType}</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-bold text-navy leading-tight mb-6">{title}</h1>
          <p className="text-lg text-muted max-w-2xl mx-auto mb-8 leading-relaxed">{intro}</p>
          <CTAButton href={`/${locale}/quiz`} size="lg">
            {ctaLabel} →
          </CTAButton>
          <div className="mt-6 flex justify-center">
            <DisclaimerBanner variant="inline" />
          </div>
        </div>
      </section>

      <div className="max-w-3xl mx-auto px-4 py-14 space-y-14">
        {/* Eligibility Factors */}
        <section>
          <h2 className="text-2xl font-bold text-navy mb-6">{eligibilityTitle}</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {eligibilityFactors.map((f, i) => (
              <div key={i} className="rounded-2xl border border-border bg-white p-5">
                <p className="font-semibold text-navy text-sm mb-1">{f.label}</p>
                <p className="text-xs text-muted leading-relaxed">{f.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Common Mistakes */}
        <section>
          <h2 className="text-2xl font-bold text-navy mb-6">{mistakesTitle}</h2>
          <ul className="space-y-3">
            {commonMistakes.map((m, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="text-red-400 mt-0.5 flex-shrink-0">✗</span>
                <p className="text-sm text-muted leading-relaxed">{m}</p>
              </li>
            ))}
          </ul>
        </section>

        {/* FAQ */}
        <section>
          <h2 className="text-2xl font-bold text-navy mb-6">{faqTitle}</h2>
          <FAQAccordion items={faqs} />
        </section>

        {/* Related Pages */}
        {relatedSlugs.length > 0 && (
          <section>
            <h2 className="text-2xl font-bold text-navy mb-6">{relatedTitle}</h2>
            <div className="flex flex-wrap gap-3">
              {relatedSlugs.map((r) => (
                <Link
                  key={r.slug}
                  href={`/${locale}/${r.slug}`}
                  className="rounded-full border border-border bg-white px-4 py-2 text-sm text-primary hover:border-primary/40 hover:shadow-card transition-all"
                >
                  {r.label}
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* CTA */}
        <section className="rounded-2xl bg-navy p-8 text-center">
          <p className="text-white font-bold text-xl mb-3">{quizLabel}</p>
          <CTAButton href={`/${locale}/quiz`} variant="secondary" size="lg">
            {ctaLabel} →
          </CTAButton>
        </section>
      </div>
    </div>
  );
}
