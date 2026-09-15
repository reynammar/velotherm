import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { QuizWorkspace } from "@/src/features/quiz/components/QuizWorkspace";
import {
  quizQuestions,
  type QuizModuleId,
} from "@/src/features/quiz/data/quizQuestions";

const validModuleIds = ["1", "2", "3"] as const;

type PageProps = {
  params: Promise<{ moduleId: string }>;
};

export function generateStaticParams() {
  return validModuleIds.map((moduleId) => ({ moduleId }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { moduleId } = await params;

  if (!validModuleIds.includes(moduleId as QuizModuleId)) {
    return { title: "Kuis Tidak Ditemukan | VeloTherm" };
  }

  const total = quizQuestions.filter(
    (question) => question.moduleId === moduleId,
  ).length;

  return {
    title: `Pengerjaan Kuis Modul ${moduleId} | VeloTherm`,
    description: `Sesi pengerjaan ${total} soal evaluasi Modul ${moduleId}.`,
  };
}

export default async function QuizAttemptStartPage({ params }: PageProps) {
  const { moduleId } = await params;

  if (!validModuleIds.includes(moduleId as QuizModuleId)) {
    notFound();
  }

  return <QuizWorkspace moduleId={moduleId as QuizModuleId} />;
}
