import type { Metadata } from "next";

import { QuizWorkspace } from "@/src/features/quiz/components/QuizWorkspace";

export const metadata: Metadata = {
  title: "Pengerjaan Uji Pemahaman Termodinamika | VeloTherm",
  description:
    "Pengerjaan CBT Uji Pemahaman Termodinamika VeloTherm dengan 25 soal pilihan ganda.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function QuizAttemptStartPage() {
  return <QuizWorkspace />;
}
