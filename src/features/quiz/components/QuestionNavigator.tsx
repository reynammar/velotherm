"use client";

import { Flag } from "lucide-react";

type QuestionNavigatorProps = {
  totalQuestions: number;
  currentQuestion: number;
  answers: Array<number | null>;
  flaggedQuestions: boolean[];
  onSelectQuestion: (index: number) => void;
};

export function QuestionNavigator({
  totalQuestions,
  currentQuestion,
  answers,
  flaggedQuestions,
  onSelectQuestion,
}: QuestionNavigatorProps) {
  const answeredCount = answers.filter(
    (answer) => answer !== null,
  ).length;

  const progressPercentage =
    totalQuestions > 0
      ? (answeredCount / totalQuestions) * 100
      : 0;

  return (
    <aside className="hidden w-80 shrink-0 lg:block">
      <div
        className="border border-slate-200 bg-white p-5 shadow-[var(--shadow-card)]"
        style={{
          clipPath: "var(--clip-chamfer-md)",
        }}
      >
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <span className="font-[var(--font-chakra-petch)] text-[10px] font-bold uppercase tracking-wider text-slate-400">
              CBT Navigation
            </span>

            <h2 className="mt-1 font-[var(--font-oswald)] text-xl font-semibold uppercase tracking-wide text-[var(--color-brand-charcoal)]">
              Daftar Nomor Soal
            </h2>
          </div>

          <span className="font-[var(--font-jetbrains-mono)] text-xs font-bold text-[var(--color-brand-red)]">
            {answeredCount} / {totalQuestions}
          </span>
        </div>

        <div className="mb-6">
          <div className="mb-2 flex items-center justify-between">
            <span className="font-[var(--font-chakra-petch)] text-[9px] font-semibold uppercase tracking-wider text-slate-400">
              Progress
            </span>

            <span className="font-[var(--font-jetbrains-mono)] text-[9px] text-slate-500">
              {Math.round(progressPercentage)}%
            </span>
          </div>

          <div className="h-1.5 overflow-hidden bg-slate-100">
            <div
              className="h-full bg-[var(--color-brand-red)] transition-all duration-[var(--duration-base)]"
              style={{
                width: `${progressPercentage}%`,
              }}
            />
          </div>
        </div>

        <div className="grid grid-cols-5 gap-2">
          {Array.from(
            { length: totalQuestions },
            (_, index) => {
              const isCurrent =
                currentQuestion === index;

              const isAnswered =
                answers[index] !== null;

              const isFlagged =
                flaggedQuestions[index];

              return (
                <button
                  key={index}
                  type="button"
                  onClick={() =>
                    onSelectQuestion(index)
                  }
                  aria-label={`Buka soal ${index + 1}`}
                  className={[
                    "relative flex aspect-square items-center justify-center border text-xs font-bold transition-all",
                    "font-[var(--font-jetbrains-mono)]",
                    isCurrent
                      ? "border-[var(--color-brand-red)] bg-[var(--color-brand-red)] text-white shadow-[var(--shadow-glow-red)] ring-2 ring-red-100"
                      : isFlagged
                        ? "border-amber-400 bg-amber-50 text-amber-700"
                        : isAnswered
                          ? "border-[var(--color-brand-charcoal)] bg-[var(--color-brand-charcoal)] text-white"
                          : "border-slate-200 bg-white text-slate-500 hover:border-slate-400",
                  ].join(" ")}
                  style={{
                    clipPath:
                      "var(--clip-chamfer-sm)",
                  }}
                >
                  {index + 1}

                  {isFlagged && !isCurrent && (
                    <Flag className="absolute right-0.5 top-0.5 size-2.5 fill-current" />
                  )}
                </button>
              );
            },
          )}
        </div>

        <div className="mt-6 space-y-2 border-t border-slate-100 pt-5">
          <LegendItem
            className="border-slate-200 bg-white"
            label="Belum Dijawab"
          />

          <LegendItem
            className="border-[var(--color-brand-charcoal)] bg-[var(--color-brand-charcoal)]"
            label="Sudah Dijawab"
          />

          <LegendItem
            className="border-[var(--color-brand-red)] bg-[var(--color-brand-red)]"
            label="Sedang Dibuka"
          />

          <LegendItem
            className="border-amber-400 bg-amber-50"
            label="Ragu-Ragu"
          />
        </div>
      </div>
    </aside>
  );
}

function LegendItem({
  className,
  label,
}: {
  className: string;
  label: string;
}) {
  return (
    <div className="flex items-center gap-2.5">
      <span
        className={`size-3 border ${className}`}
        style={{
          clipPath: "var(--clip-chamfer-sm)",
        }}
      />

      <span className="font-[var(--font-chakra-petch)] text-[9px] font-medium uppercase tracking-wide text-slate-500">
        {label}
      </span>
    </div>
  );
}