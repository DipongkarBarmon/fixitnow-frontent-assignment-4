import type { Metadata } from "next";
import { HeroSection } from "./_components/hero-section";
import { FeaturedServices } from "./_components/featured-services";
import { PopularCategories } from "./_components/popular-categories";
import { TopTechnicians } from "./_components/top-technicians";
import { StatsSection } from "./_components/stats-section";
import { TestimonialsSection } from "./_components/testimonials-section";
import { FaqSection } from "./_components/faq-section";
import { CtaSection } from "./_components/cta-section";

export const metadata: Metadata = {
  title: "FixItNow - Professional Home Service Marketplace",
  description:
    "Find trusted technicians for plumbing, electrical, cleaning, and more. Book services instantly with FixItNow.",
};

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <PopularCategories />
      <FeaturedServices />
      <TopTechnicians />
      <StatsSection />
      <TestimonialsSection />
      <FaqSection />
      <CtaSection />
    </>
  );
}
