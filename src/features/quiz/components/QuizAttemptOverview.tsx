"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowLeft, ArrowRight, CheckCircle2, Clock3, Flag, Play, RotateCcw, ShieldCheck, TimerReset } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { Navbar } from "@/src/shared/components/Navbar";
import {
  quizQuestions,
  type QuizModuleId,
} from "@/src/features/quiz/data/quizQuestions";

const QUIZ_DURATION_SECONDS = 30 * 60;
const STORAGE_PREFIX = "velotherm-quiz-attempt";

type AttemptStatus = "in-progress" | "completed";

type StoredAttempt = {
  moduleId: QuizModuleId;
  answers: Array<number | null>;
  flaggedQuestions: boolean[];
  startedAt: number;
  expiresAt: number;
  status: AttemptStatus;
  completedAt?: number;
};

const MODULE_META: Record<
  QuizModuleId,
  {
    label: string;
    title: string;
    description: string;
  }
> = {
  "1": {
    label: "MODUL 01",
    title: "Fondasi Termodinamika Teknik",
    description:
      "Uji pemahaman tentang sistem, boundary, properties, state, tekanan absolut, temperatur absolut, serta konsep dasar termodinamika teknik.",
  },
  "2": {
    label: "MODUL 02",
    title: "Energi, Kerja & Hukum I Termodinamika",
    description:
      "Uji pemahaman tentang energi total, boundary work, proses politropik, perpindahan kalor, dan neraca energi Hukum I.",
  },
  "3": {
    label: "MODUL 03",
    title: "Siklus Termodinamika & Kendaraan Hybrid",
    description:
      "Uji pemahaman tentang siklus, efisiensi, energi kinetik, regenerative braking, aerodynamic drag, lightweighting, dan aliran energi hybrid.",
  },
};

function getStorageKey(moduleId: QuizModuleId) {
  return `${STORAGE_PREFIX}-${moduleId}`;
}

function readAttempt(moduleId: QuizModuleId): StoredAttempt | null {
  if (typeof window === "undefined") return null;

  try {
    const raw = window.localStorage.getItem(getStorageKey(moduleId));
    if (!raw) return null;

    const parsed = JSON.parse(raw) as StoredAttempt;

    if (
      parsed.moduleId !== moduleId ||
      !Array.isArray(parsed.answers) ||
      !Array.isArray(parsed.flaggedQuestions) ||
      typeof parsed.startedAt !== "number" ||
      typeof parsed.expiresAt !== "number" ||
      (parsed.status !== "in-progress" && parsed.status !== "completed")
    ) {
      return null;
    }

    return parsed;
  } catch {
    return null;
  }
}

function createFreshAttempt(moduleId: QuizModuleId): StoredAttempt {
  const now = Date.now();
  const totalQuestions = quizQuestions.filter(
    (question) => question.moduleId === moduleId,
  ).length;

  return {
    moduleId,
    answers: new Array(totalQuestions).fill(null),
    flaggedQuestions: new Array(totalQuestions).fill(false),
    startedAt: now,
    expiresAt: now + QUIZ_DURATION_SECONDS * 1000,
    status: "in-progress",
  };
}

function persistAttempt(attempt: StoredAttempt) {
  window.localStorage.setItem(
    getStorageKey(attempt.moduleId),
    JSON.stringify(attempt),
  );
}

function clearAttempt(moduleId: QuizModuleId) {
  window.localStorage.removeItem(getStorageKey(moduleId));
}

function formatTime(seconds: number) {
  const safeSeconds = Math.max(0, seconds);
  const minutes = Math.floor(safeSeconds / 60);
  const remainingSeconds = safeSeconds % 60;

  return `${String(minutes).padStart(2, "0")}:${String(remainingSeconds).padStart(2, "0")}`;
}

function calculateScore(moduleId: QuizModuleId, answers: Array<number | null>) {
  const questions = quizQuestions.filter(
    (question) => question.moduleId === moduleId,
  );

  const correct = questions.reduce((count, question, index) => {
    return count + (answers[index] === question.correct ? 1 : 0);
  }, 0);

  return questions.length
    ? Math.round((correct / questions.length) * 100)
    : 0;
}

function getStatusLabel(score: number) {
  if (score >= 85) return "A · Sangat Memuaskan";
  if (score >= 70) return "B · Lulus / Kompeten";
  if (score >= 55) return "C · Cukup";
  return "D · Perlu Remediasi";
}

export function QuizAttemptOverview({ moduleId }: { moduleId: QuizModuleId }) {
  const meta = MODULE_META[moduleId];
  const questions = useMemo(
    () => quizQuestions.filter((question) => question.moduleId === moduleId),
    [moduleId],
  );

  const [hydrated, setHydrated] = useState(false);
  const [attempt, setAttempt] = useState<StoredAttempt | null>(null);
  const [remainingSeconds, setRemainingSeconds] = useState(0);

  useEffect(() => {
    const frameId = window.requestAnimationFrame(() => {
      const savedAttempt = readAttempt(moduleId);

      if (savedAttempt?.status === "in-progress") {
        const remaining = Math.max(
          0,
          Math.floor((savedAttempt.expiresAt - Date.now()) / 1000),
        );

        if (remaining <= 0) {
          const completedAttempt: StoredAttempt = {
            ...savedAttempt,
            status: "completed",
            completedAt: Date.now(),
          };

          persistAttempt(completedAttempt);
          setAttempt(completedAttempt);
          setRemainingSeconds(0);
        } else {
          setAttempt(savedAttempt);
          setRemainingSeconds(remaining);
        }
      } else {
        setAttempt(savedAttempt);
        setRemainingSeconds(
          savedAttempt
            ? Math.max(
                0,
                Math.floor((savedAttempt.expiresAt - Date.now()) / 1000),
              )
            : 0,
        );
      }

      setHydrated(true);
    });

    return () => window.cancelAnimationFrame(frameId);
  }, [moduleId]);

  useEffect(() => {
    if (!attempt || attempt.status !== "in-progress") return;

    const intervalId = window.setInterval(() => {
      const remaining = Math.max(
        0,
        Math.floor((attempt.expiresAt - Date.now()) / 1000),
      );

      setRemainingSeconds(remaining);

      if (remaining <= 0) {
        const completedAttempt: StoredAttempt = {
          ...attempt,
          status: "completed",
          completedAt: Date.now(),
        };

        persistAttempt(completedAttempt);
        setAttempt(completedAttempt);
        window.clearInterval(intervalId);
      }
    }, 500);

    return () => window.clearInterval(intervalId);
  }, [attempt]);

  const answeredCount = attempt?.answers.filter((answer) => answer !== null).length ?? 0;
  const flaggedCount = attempt?.flaggedQuestions.filter(Boolean).length ?? 0;
  const score = attempt?.status === "completed"
    ? calculateScore(moduleId, attempt.answers)
    : null;

  const startFreshQuiz = () => {
    const freshAttempt = createFreshAttempt(moduleId);
    persistAttempt(freshAttempt);
    window.location.href = `/quiz/attempt/${moduleId}/start`;
  };

  const restartQuiz = () => {
    clearAttempt(moduleId);
    startFreshQuiz();
  };

  if (!hydrated) {
    return (
      <div className="min-h-screen bg-[color:var(--color-brand-bg)]">
        <Navbar variant="quiz-selection" />
        <main className="flex min-h-[calc(100vh-72px)] items-center justify-center px-5">
          <div className="text-center">
            <p className="font-[var(--font-chakra-petch)] text-xs font-bold uppercase tracking-[0.2em] text-[color:var(--color-brand-red)]">
              CBT Evaluation
            </p>
            <h1 className="mt-2 font-[var(--font-oswald)] text-2xl font-bold uppercase text-[color:var(--color-brand-charcoal)]">
              Menyiapkan sesi {meta.label}
            </h1>
          </div>
        </main>
      </div>
    );
  }

  const hasActiveAttempt = attempt?.status === "in-progress";
  const hasCompletedAttempt = attempt?.status === "completed";

  return (
    <div className="min-h-screen bg-[color:var(--color-brand-bg)] text-slate-800">
      <Navbar variant="quiz-selection" />

      <main className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8 lg:py-16">
        <Link
          href="/quiz"
          className="mb-6 inline-flex items-center gap-2 font-[var(--font-chakra-petch)] text-xs font-bold uppercase tracking-wide text-slate-500 transition-colors hover:text-[color:var(--color-brand-red)]"
        >
          <ArrowLeft className="size-4" />
          Kembali Pilih Modul
        </Link>

        <section className="overflow-hidden border-2 border-slate-200 bg-white shadow-[var(--shadow-card)]">
          <div className="border-b border-slate-200 bg-[color:var(--color-brand-charcoal)] px-5 py-6 text-white sm:px-8 sm:py-8">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <span
                  className="inline-flex border border-[color:var(--color-brand-red)]/40 bg-red-950/50 px-3 py-1 font-[var(--font-chakra-petch)] text-[10px] font-bold uppercase tracking-[0.16em] text-red-300"
                  style={{ clipPath: "var(--clip-chamfer-sm)" }}
                >
                  {meta.label} · CBT EVALUATION
                </span>
                <h1 className="mt-3 max-w-3xl font-[var(--font-oswald)] text-3xl font-bold uppercase tracking-wide sm:text-4xl">
                  {meta.title}
                </h1>
                <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-300">
                  {meta.description}
                </p>
              </div>

              <div className="shrink-0 border border-slate-700 bg-slate-900/70 p-4 text-center sm:min-w-40">
                <span className="block font-[var(--font-chakra-petch)] text-[9px] font-bold uppercase tracking-[0.16em] text-slate-400">
                  Total Soal
                </span>
                <span className="mt-1 block font-[var(--font-oswald)] text-4xl font-bold text-white">
                  {questions.length}
                </span>
                <span className="font-[var(--font-jetbrains-mono)] text-[9px] uppercase tracking-wider text-slate-400">
                  Pilihan Ganda
                </span>
              </div>
            </div>
          </div>

          <div className="p-5 sm:p-8 lg:p-10">
            {hasActiveAttempt ? (
              <div className="space-y-7">
                <div className="border-2 border-emerald-200 bg-emerald-50 p-5 sm:p-6">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-start gap-3">
                      <div className="flex size-10 shrink-0 items-center justify-center bg-emerald-100 text-emerald-700">
                        <ShieldCheck className="size-5" />
                      </div>
                      <div>
                        <p className="font-[var(--font-chakra-petch)] text-[10px] font-bold uppercase tracking-[0.15em] text-emerald-700">
                          Sesi Kuis Sedang Berjalan
                        </p>
                        <h2 className="mt-1 font-[var(--font-oswald)] text-2xl font-bold uppercase text-emerald-950">
                          Jangan mulai dari nol
                        </h2>
                        <p className="mt-1 text-sm leading-relaxed text-emerald-900/70">
                          Jawaban dan status ragu-ragu tersimpan. Lo bisa keluar dari halaman kuis dan kembali ke halaman ini untuk melanjutkan sesi.
                        </p>
                      </div>
                    </div>

                    <div className="border border-emerald-200 bg-white px-5 py-3 text-center">
                      <span className="block font-[var(--font-chakra-petch)] text-[9px] font-bold uppercase tracking-wider text-slate-500">
                        Sisa Waktu
                      </span>
                      <span className="mt-1 block font-[var(--font-jetbrains-mono)] text-2xl font-bold text-[color:var(--color-brand-red)]">
                        {formatTime(remainingSeconds)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                  <InfoCard icon={<Clock3 className="size-4" />} label="Sisa Waktu" value={formatTime(remainingSeconds)} />
                  <InfoCard icon={<CheckCircle2 className="size-4" />} label="Terjawab" value={`${answeredCount}/${questions.length}`} />
                  <InfoCard icon={<Flag className="size-4" />} label="Ditandai Ragu" value={String(flaggedCount)} />
                  <InfoCard icon={<TimerReset className="size-4" />} label="Durasi Awal" value="30:00" />
                </div>

                <div className="flex flex-col gap-3 border-t border-slate-200 pt-6 sm:flex-row">
                  <Link
                    href={`/quiz/attempt/${moduleId}/start`}
                    className="inline-flex flex-1 items-center justify-center gap-2 bg-[color:var(--color-brand-red)] px-5 py-3.5 font-[var(--font-chakra-petch)] text-xs font-bold uppercase tracking-[0.12em] text-white transition-all hover:bg-[color:var(--color-brand-crimson)] hover:shadow-[var(--shadow-glow-red)]"
                    style={{ clipPath: "var(--clip-chamfer-sm)" }}
                  >
                    Lanjutkan Kuis
                    <ArrowRight className="size-4" />
                  </Link>

                  <button
                    type="button"
                    onClick={restartQuiz}
                    className="inline-flex items-center justify-center gap-2 border border-slate-300 bg-white px-5 py-3.5 font-[var(--font-chakra-petch)] text-xs font-bold uppercase tracking-[0.12em] text-slate-600 transition-colors hover:border-[color:var(--color-brand-red)] hover:text-[color:var(--color-brand-red)]"
                    style={{ clipPath: "var(--clip-chamfer-sm)" }}
                  >
                    <RotateCcw className="size-4" />
                    Mulai Ulang
                  </button>
                </div>
              </div>
            ) : hasCompletedAttempt ? (
              <div className="space-y-7">
                <div className="border-2 border-slate-200 bg-slate-50 p-5 sm:p-6">
                  <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <span className="font-[var(--font-chakra-petch)] text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500">
                        Sesi Sebelumnya
                      </span>
                      <h2 className="mt-1 font-[var(--font-oswald)] text-2xl font-bold uppercase text-[color:var(--color-brand-charcoal)]">
                        Evaluasi Sudah Selesai
                      </h2>
                      <p className="mt-1 text-sm text-slate-500">
                        Skor terakhir lo dapat dilihat kembali melalui mode review.
                      </p>
                    </div>
                    <div className="text-left sm:text-right">
                      <span className="block font-[var(--font-chakra-petch)] text-[9px] font-bold uppercase tracking-wider text-slate-500">
                        Skor Terakhir
                      </span>
                      <span className="block font-[var(--font-oswald)] text-5xl font-bold text-[color:var(--color-brand-red)]">
                        {score}
                      </span>
                      <span className="font-[var(--font-chakra-petch)] text-[10px] font-bold uppercase text-slate-500">
                        {getStatusLabel(score ?? 0)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-3 border-t border-slate-200 pt-6 sm:flex-row">
                  <Link
                    href={`/quiz/attempt/${moduleId}/start`}
                    className="inline-flex flex-1 items-center justify-center gap-2 bg-[color:var(--color-brand-charcoal)] px-5 py-3.5 font-[var(--font-chakra-petch)] text-xs font-bold uppercase tracking-[0.12em] text-white transition-colors hover:bg-[color:var(--color-brand-red)]"
                    style={{ clipPath: "var(--clip-chamfer-sm)" }}
                  >
                    Review Pembahasan
                    <ArrowRight className="size-4" />
                  </Link>
                  <button
                    type="button"
                    onClick={restartQuiz}
                    className="inline-flex items-center justify-center gap-2 border border-slate-300 bg-white px-5 py-3.5 font-[var(--font-chakra-petch)] text-xs font-bold uppercase tracking-[0.12em] text-slate-600 transition-colors hover:border-[color:var(--color-brand-red)] hover:text-[color:var(--color-brand-red)]"
                    style={{ clipPath: "var(--clip-chamfer-sm)" }}
                  >
                    <RotateCcw className="size-4" />
                    Ulangi Kuis
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-8">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <InfoCard icon={<Clock3 className="size-4" />} label="Durasi" value="30 Menit" />
                  <InfoCard icon={<CheckCircle2 className="size-4" />} label="Jumlah Soal" value={`${questions.length} Soal`} />
                  <InfoCard icon={<ShieldCheck className="size-4" />} label="Tipe" value="Pilihan Ganda" />
                </div>

                <div className="border border-slate-200 bg-slate-50 p-5 sm:p-6">
                  <div className="flex items-start gap-3">
                    <div className="flex size-9 shrink-0 items-center justify-center bg-red-50 text-[color:var(--color-brand-red)]">
                      <TimerReset className="size-4" />
                    </div>
                    <div>
                      <h2 className="font-[var(--font-chakra-petch)] text-sm font-bold uppercase tracking-wide text-[color:var(--color-brand-charcoal)]">
                        Perhatikan sebelum mulai
                      </h2>
                      <p className="mt-2 text-sm leading-relaxed text-slate-600">
                        Timer dimulai saat lo menekan tombol mulai. Sesi, jawaban, dan tanda ragu akan disimpan di perangkat ini, sehingga lo bisa keluar lalu kembali ke halaman attempt tanpa kehilangan progres.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-3 border-t border-slate-200 pt-6 sm:flex-row sm:justify-end">
                  <Link
                    href="/quiz"
                    className="inline-flex items-center justify-center gap-2 border border-slate-300 bg-white px-5 py-3.5 font-[var(--font-chakra-petch)] text-xs font-bold uppercase tracking-[0.12em] text-slate-600 transition-colors hover:border-slate-400 hover:text-slate-900"
                    style={{ clipPath: "var(--clip-chamfer-sm)" }}
                  >
                    <ArrowLeft className="size-4" />
                    Pilih Modul Lain
                  </Link>

                  <button
                    type="button"
                    onClick={startFreshQuiz}
                    className="inline-flex items-center justify-center gap-2 bg-[color:var(--color-brand-red)] px-6 py-3.5 font-[var(--font-chakra-petch)] text-xs font-bold uppercase tracking-[0.12em] text-white transition-all hover:bg-[color:var(--color-brand-crimson)] hover:shadow-[var(--shadow-glow-red)]"
                    style={{ clipPath: "var(--clip-chamfer-sm)" }}
                  >
                    <Play className="size-4 fill-current" />
                    Mulai Kuis
                  </button>
                </div>
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}

function InfoCard({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-center gap-2 text-[color:var(--color-brand-red)]">
        {icon}
        <span className="font-[var(--font-chakra-petch)] text-[9px] font-bold uppercase tracking-[0.14em] text-slate-500">
          {label}
        </span>
      </div>
      <span className="mt-2 block font-[var(--font-jetbrains-mono)] text-sm font-bold text-[color:var(--color-brand-charcoal)]">
        {value}
      </span>
    </div>
  );
}
