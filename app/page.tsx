import { Footer } from "@/src/shared/components/Footer";
import { Navbar } from "@/src/shared/components/Navbar";

import { HeroSection } from "@/src/features/landing/components/HeroSection";
import { ModulesSection } from "@/src/features/landing/components/ModulesSection";
import { PrinciplesSection } from "@/src/features/landing/components/PrinciplesSection";
import { QuizCtaSection } from "@/src/features/landing/components/QuizCtaSection";
import { StatsSection } from "@/src/features/landing/components/StatsSection";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[color:var(--color-brand-bg)] text-[color:var(--color-brand-charcoal)]">
      <Navbar variant="landing" />

      <main>
        <HeroSection />
        <PrinciplesSection />
        <ModulesSection />
        <StatsSection />
        <QuizCtaSection />
      </main>

      <Footer />
    </div>
  );
}