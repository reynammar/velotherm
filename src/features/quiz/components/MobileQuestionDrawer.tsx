"use client";

import { Flag, X } from "lucide-react";

type MobileQuestionDrawerProps = {
  open: boolean;
  totalQuestions: number;
  currentQuestion: number;
  answers: Array<number | null>;
  flaggedQuestions: boolean[];
  onClose: () => void;
  onSelectQuestion: (index: number) => void;
};

export function MobileQuestionDrawer({
  open,
  totalQuestions,
  currentQuestion,
  answers,
  flaggedQuestions,
  onClose,
  onSelectQuestion,
}: MobileQuestionDrawerProps) {
  if (!open) {
    return null;
  }

  const answeredCount = answers.filter(
    (answer) => answer !== null,
  ).length;

  const progressPercentage =
    totalQuestions > 0
      ? (answeredCount / totalQuestions) * 100
      : 0;

  return (
    <div
      className="fixed inset-0 z-[100] lg:hidden"
      role="dialog"
      aria-modal="true"
      aria-label="Daftar soal"
    >
      <button
        type="button"
        aria-label="Tutup daftar soal"
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-[2px]"
      />

      <aside className="absolute right-0 top-0 flex h-full w-[86%] max-w-sm flex-col border-l border-slate-200 bg-white shadow-[-20px_0_60px_rgba(15,23,42,0.2)]">
        <div className="flex shrink-0 items-center justify-between border-b border-slate-200 px-5 py-5">
          <div>
            <span className="font-[var(--font-chakra-petch)] text-[9px] font-bold uppercase tracking-[0.16em] text-[var(--color-brand-red)]">
              Question Navigator
            </span>

            <h2 className="mt-1 font-[var(--font-oswald)] text-xl font-semibold uppercase tracking-wide text-[var(--color-brand-charcoal)]">
              Daftar Nomor Soal
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup"
            className="flex size-9 items-center justify-center border border-slate-200 bg-slate-50 text-slate-500 transition-colors hover:border-slate-300 hover:bg-slate-100 hover:text-slate-900"
          >
            <X className="size-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5">
          <div className="mb-6 border border-slate-200 bg-slate-50 p-4">
            <div className="flex items-center justify-between">
              <span className="font-[var(--font-chakra-petch)] text-[9px] font-bold uppercase tracking-wider text-slate-500">
                Progress
              </span>

              <span className="font-[var(--font-jetbrains-mono)] text-xs font-bold text-[var(--color-brand-red)]">
                {answeredCount}/{totalQuestions}
              </span>
            </div>

            <div className="mt-3 h-1.5 bg-slate-200">
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
                    onClick={() => {
                      onSelectQuestion(index);
                      onClose();
                    }}
                    aria-label={`Buka soal ${index + 1}`}
                    className={[
                      "relative flex aspect-square items-center justify-center border text-xs font-bold transition-all",
                      "font-[var(--font-jetbrains-mono)]",
                      isCurrent
                        ? "border-[var(--color-brand-red)] bg-[var(--color-brand-red)] text-white"
                        : isFlagged
                          ? "border-amber-400 bg-amber-50 text-amber-700"
                          : isAnswered
                            ? "border-[var(--color-brand-charcoal)] bg-[var(--color-brand-charcoal)] text-white"
                            : "border-slate-200 bg-white text-slate-500",
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

          <div className="mt-7 space-y-2 border-t border-slate-100 pt-5">
            <Legend
              label="Belum Dijawab"
              className="border-slate-200 bg-white"
            />

            <Legend
              label="Sudah Dijawab"
              className="border-[var(--color-brand-charcoal)] bg-[var(--color-brand-charcoal)]"
            />

            <Legend
              label="Sedang Dibuka"
              className="border-[var(--color-brand-red)] bg-[var(--color-brand-red)]"
            />

            <Legend
              label="Ragu-Ragu"
              className="border-amber-400 bg-amber-50"
            />
          </div>
        </div>
      </aside>
    </div>
  );
}

function Legend({
  label,
  className,
}: {
  label: string;
  className: string;
}) {
  return (
    <div className="flex items-center gap-2.5">
      <span
        className={`size-3 border ${className}`}
        style={{
          clipPath: "var(--clip-chamfer-sm)",
        }}
      />

      <span className="font-[var(--font-chakra-petch)] text-[9px] uppercase tracking-wide text-slate-500">
        {label}
      </span>
    </div>
  );
}