"use client";

import {
  Award,
  BookOpen,
  RotateCcw,
} from "lucide-react";

import { Button } from "@/src/shared/components/Button";

type Predicate = {
  grade: string;
  label: string;
  variant: "success" | "info" | "warning" | "error";
  feedback: string;
};

type QuizResultModalProps = {
  open: boolean;
  score: number;
  correctCount: number;
  wrongCount: number;
  unansweredCount: number;
  predicate: Predicate;
  onReview: () => void;
  onRestart: () => void;
  onPortal: () => void;
};

export function QuizResultModal({
  open,
  score,
  correctCount,
  wrongCount,
  unansweredCount,
  predicate,
  onReview,
  onRestart,
  onPortal,
}: QuizResultModalProps) {
  if (!open) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-[120] flex items-center justify-center overflow-y-auto bg-black/70 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="result-title"
    >
      <div
        className="my-8 w-full max-w-2xl overflow-hidden border-2 border-[var(--color-brand-red)] bg-white shadow-[var(--shadow-glow-red-lg)]"
        style={{
          clipPath: "var(--clip-chamfer-lg)",
        }}
      >
        <div className="bg-[var(--color-brand-charcoal)] px-6 py-7 text-white sm:px-8">
          <div className="flex items-start justify-between gap-5">
            <div>
              <span className="font-[var(--font-chakra-petch)] text-[9px] font-bold uppercase tracking-[0.2em] text-[var(--color-brand-red)]">
                Official Evaluation Report
              </span>

              <h2
                id="result-title"
                className="mt-1 font-[var(--font-oswald)] text-2xl font-bold uppercase tracking-wide sm:text-3xl"
              >
                Hasil Penilaian CBT
              </h2>
            </div>

            <div className="flex size-12 shrink-0 items-center justify-center bg-red-950/50 text-[var(--color-brand-red)]">
              <Award className="size-6" />
            </div>
          </div>
        </div>

        <div className="p-6 sm:p-8">
          <div className="flex flex-col items-center border-b border-slate-100 pb-7 text-center">
            <span className="font-[var(--font-chakra-petch)] text-[9px] font-bold uppercase tracking-[0.18em] text-slate-400">
              Final Score
            </span>

            <div className="mt-2 flex items-end gap-1">
              <span className="font-[var(--font-jetbrains-mono)] text-6xl font-bold tracking-tight text-[var(--color-brand-charcoal)]">
                {score}
              </span>

              <span className="mb-2 font-[var(--font-jetbrains-mono)] text-sm text-slate-400">
                /100
              </span>
            </div>

            <span
              className={[
                "mt-3 inline-flex items-center px-4 py-2 font-[var(--font-chakra-petch)] text-xs font-bold uppercase tracking-wider",
                predicate.variant === "success"
                  ? "bg-emerald-50 text-emerald-600"
                  : predicate.variant === "info"
                    ? "bg-sky-50 text-sky-600"
                    : predicate.variant === "warning"
                      ? "bg-amber-50 text-amber-600"
                      : "bg-rose-50 text-rose-600",
              ].join(" ")}
              style={{
                clipPath:
                  "var(--clip-chamfer-sm)",
              }}
            >
              {predicate.grade} · {predicate.label}
            </span>
          </div>

          <div className="mt-7 grid grid-cols-3 gap-2 sm:gap-4">
            <Metric
              label="Benar"
              value={correctCount}
              className="text-emerald-600"
            />

            <Metric
              label="Salah"
              value={wrongCount}
              className="text-rose-600"
            />

            <Metric
              label="Kosong"
              value={unansweredCount}
              className="text-slate-500"
            />
          </div>

          <div className="mt-7 border-l-2 border-[var(--color-brand-red)] bg-slate-50 px-4 py-4">
            <span className="font-[var(--font-chakra-petch)] text-[9px] font-bold uppercase tracking-wider text-slate-400">
              Evaluation Note
            </span>

            <p className="mt-1 text-sm leading-relaxed text-slate-600">
              {predicate.feedback}
            </p>
          </div>

          <div className="mt-7 flex flex-col gap-2 sm:flex-row">
            <Button
              type="button"
              variant="dark"
              size="md"
              onClick={onReview}
              className="flex-1"
            >
              <BookOpen className="size-4" />
              Review Pembahasan
            </Button>

            <Button
              type="button"
              variant="secondary"
              size="md"
              onClick={onRestart}
              className="flex-1"
            >
              <RotateCcw className="size-4" />
              Ulangi Ujian
            </Button>

            <Button
              type="button"
              variant="primary"
              size="md"
              onClick={onPortal}
              className="flex-1"
            >
              Portal Materi
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Metric({
  label,
  value,
  className,
}: {
  label: string;
  value: number;
  className: string;
}) {
  return (
    <div className="border border-slate-200 bg-slate-50 px-3 py-4 text-center">
      <span className="block font-[var(--font-chakra-petch)] text-[9px] font-bold uppercase tracking-wider text-slate-400">
        {label}
      </span>

      <span
        className={`mt-1 block font-[var(--font-jetbrains-mono)] text-2xl font-bold ${className}`}
      >
        {value}
      </span>
    </div>
  );
}