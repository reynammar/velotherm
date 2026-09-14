import type { Metadata } from "next";

import { Navbar } from "@/src/shared/components/Navbar";
import { QuizModuleSelection } from "@/src/features/quiz/components/QuizModuleSelection";

export const metadata: Metadata = {
  title: "Pilih Modul Kuis | VeloTherm",
  description:
    "Pilih modul evaluasi termodinamika teknik sebelum memulai sesi kuis.",
};

export default function QuizPage() {
  return (
    <div className="min-h-screen bg-[color:var(--color-brand-bg)] text-[color:var(--color-brand-charcoal)]">
      <Navbar variant="quiz-selection" />
      <QuizModuleSelection />
    </div>
  );
}