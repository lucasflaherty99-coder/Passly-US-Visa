import { Navbar } from "@/components/landing/Navbar";
import { Hero } from "@/components/landing/Hero";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { VisaTypes } from "@/components/landing/VisaTypes";
import { Testimonials } from "@/components/landing/Testimonials";
import { FAQ } from "@/components/landing/FAQ";
import { LeadCapture } from "@/components/landing/LeadCapture";
import { Footer } from "@/components/landing/Footer";

export default function LandingPage() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <HowItWorks />
        <VisaTypes />
        <Testimonials />
        <FAQ />
        <LeadCapture />
      </main>
      <Footer />
    </>
  );
}
