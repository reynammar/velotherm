import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { QuizWorkspace } from "@/src/features/quiz/components/QuizWorkspace";
import { quizQuestions, type QuizModuleId } from "@/src/features/quiz/data/quizQuestions";

const validModuleIds: QuizModuleId[] = ["1", "2", "3"];

const moduleTitles: Record<QuizModuleId, string> = {
  "1": "Fondasi Termodinamika Teknik",
  "2": "Energi, Kerja & Hukum I Termodinamika",
  "3": "Siklus Termodinamika & Kendaraan Hybrid",
};

type QuizAttemptPageProps = {
  params: Promise<{ moduleId: string }>;
};

export function generateStaticParams() {
  return validModuleIds.map((moduleId) => ({ moduleId }));
}

export async function generateMetadata({
  params,
}: QuizAttemptPageProps): Promise<Metadata> {
  const { moduleId } = await params;

  if (!validModuleIds.includes(moduleId as QuizModuleId)) {
    return {
      title: "Kuis Tidak Ditemukan | VeloTherm",
    };
  }

  const currentModuleId = moduleId as QuizModuleId;

  return {
    title: `Kuis ${moduleTitles[currentModuleId]} | VeloTherm`,
    description: `Evaluasi 25 soal untuk ${moduleTitles[currentModuleId]}.`,
  };
}

export default async function QuizAttemptPage({
  params,
}: QuizAttemptPageProps) {
  const { moduleId } = await params;

  if (!validModuleIds.includes(moduleId as QuizModuleId)) {
    notFound();
  }

  const currentModuleId = moduleId as QuizModuleId;
  const moduleQuestionCount = quizQuestions.filter(
    (question) => question.moduleId === currentModuleId,
  ).length;

  if (moduleQuestionCount !== 25) {
    notFound();
  }

  return <QuizWorkspace moduleId={currentModuleId} />;
}
