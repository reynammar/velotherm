import type { Metadata } from "next";

import { QuizAttemptOverview } from "@/src/features/quiz/components/QuizAttemptOverview";

export const metadata: Metadata = {
  title: "Uji Pemahaman Termodinamika | VeloTherm",
  description:
    "Uji pemahaman termodinamika VeloTherm dengan 25 soal pilihan ganda dan durasi pengerjaan 30 menit.",
};

export default function QuizAttemptOverviewPage() {
  return <QuizAttemptOverview />;
}
