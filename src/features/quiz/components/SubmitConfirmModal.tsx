"use client";

import { AlertTriangle } from "lucide-react";

import { Button } from "@/src/shared/components/Button";

type SubmitConfirmModalProps = {
  open: boolean;
  answered: number;
  flagged: number;
  unanswered: number;
  onClose: () => void;
  onConfirm: () => void;
};

export function SubmitConfirmModal({
  open,
  answered,
  flagged,
  unanswered,
  onClose,
  onConfirm,
}: SubmitConfirmModalProps) {
  if (!open) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-[110] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="submit-title"
    >
      <div
        className="w-full max-w-md border border-slate-200 bg-white p-6 shadow-2xl sm:p-8"
        style={{
          clipPath:
            "var(--clip-chamfer-lg)",
        }}
      >
        <div className="flex size-12 items-center justify-center bg-amber-50 text-amber-600">
          <AlertTriangle className="size-6" />
        </div>

        <span className="mt-6 block font-[var(--font-chakra-petch)] text-[10px] font-bold uppercase tracking-[0.16em] text-amber-600">
          Confirmation Required
        </span>

        <h2
          id="submit-title"
          className="mt-1 font-[var(--font-oswald)] text-2xl font-bold uppercase tracking-wide text-[var(--color-brand-charcoal)]"
        >
          Kumpulkan Evaluasi Ujian?
        </h2>

        <p className="mt-3 text-sm leading-relaxed text-slate-500">
          Pastikan jawaban sudah
          diperiksa sebelum
          mengumpulkan evaluasi. Setelah
          dikumpulkan, hasil akan
          langsung dihitung.
        </p>

        <div className="mt-6 grid grid-cols-3 gap-2">
          <SummaryItem
            label="Terjawab"
            value={answered}
          />

          <SummaryItem
            label="Ragu-Ragu"
            value={flagged}
          />

          <SummaryItem
            label="Kosong"
            value={unanswered}
          />
        </div>

        <div className="mt-7 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <Button
            type="button"
            variant="secondary"
            size="md"
            onClick={onClose}
          >
            Periksa Lagi
          </Button>

          <Button
            type="button"
            variant="primary"
            size="md"
            onClick={onConfirm}
          >
            Ya, Kumpulkan
          </Button>
        </div>
      </div>
    </div>
  );
}

function SummaryItem({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <div className="border border-slate-200 bg-slate-50 p-3 text-center">
      <span className="block font-[var(--font-chakra-petch)] text-[8px] font-bold uppercase tracking-wider text-slate-400">
        {label}
      </span>

      <span className="mt-1 block font-[var(--font-jetbrains-mono)] text-lg font-bold text-[var(--color-brand-charcoal)]">
        {value}
      </span>
    </div>
  );
}