"use client";

import {
  Clock3,
  FileText,
  RotateCcw,
} from "lucide-react";
import { useRouter } from "next/navigation";
import {
  useMemo,
  useSyncExternalStore,
  useEffect,
  useState,
} from "react";

import { Badge } from "@/src/shared/components/Badge";
import { Button } from "@/src/shared/components/Button";
import { Navbar } from "@/src/shared/components/Navbar";

import {
  createQuizAttempt,
  getAnsweredCount,
  getFlaggedCount,
  getRemainingSeconds,
  getQuizAttempt,
  getQuizAttemptServerSnapshot,
  getQuizAttemptSnapshot,
  subscribeQuizAttempt,
  type QuizAttempt,
} from "@/src/features/quiz/lib/quizAttempt";

function useQuizAttempt(): QuizAttempt | null {
  const snapshot =
    useSyncExternalStore(
      subscribeQuizAttempt,
      getQuizAttemptSnapshot,
      getQuizAttemptServerSnapshot,
    );

  return useMemo(() => {
    if (!snapshot) {
      return null;
    }

    try {
      return JSON.parse(
        snapshot,
      ) as QuizAttempt;
    } catch {
      return null;
    }
  }, [snapshot]);
}

function formatTime(seconds: number): string {
  const safeSeconds = Math.max(
    0,
    seconds,
  );

  const minutes = Math.floor(
    safeSeconds / 60,
  );

  const remainingSeconds =
    safeSeconds % 60;

  return `${minutes
    .toString()
    .padStart(2, "0")}:${remainingSeconds
    .toString()
    .padStart(2, "0")}`;
}

export function QuizPreparation() {
  const router = useRouter();

  const attempt = useQuizAttempt();

  const [now, setNow] = useState(
    Date.now,
  );

  useEffect(() => {
    const interval = window.setInterval(
      () => {
        setNow(Date.now());
      },
      1000,
    );

    return () => {
      window.clearInterval(interval);
    };
  }, []);

  const remainingSeconds =
    attempt &&
    attempt.status === "in-progress"
      ? getRemainingSeconds(attempt)
      : 0;

  const hasActiveAttempt =
    attempt !== null &&
    attempt.status === "in-progress" &&
    remainingSeconds > 0;

  const answeredCount = attempt
    ? getAnsweredCount(attempt)
    : 0;

  const flaggedCount = attempt
    ? getFlaggedCount(attempt)
    : 0;

  const handleStart = () => {
    createQuizAttempt();
    router.push("/quiz/attempt");
  };

  const handleContinue = () => {
    router.push("/quiz/attempt");
  };

  const handleNewAttempt = () => {
    createQuizAttempt();
    router.push("/quiz/attempt");
  };

  void now;

  return (
    <div className="min-h-screen bg-[color:var(--color-brand-bg)] text-[color:var(--color-brand-charcoal)]">
      <Navbar
        variant="quiz"
        quizTime={
          hasActiveAttempt
            ? formatTime(
                remainingSeconds,
              )
            : "30:00"
        }
      />

      <main className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(220,38,38,0.06),transparent_35%)]" />

        <section className="relative mx-auto flex min-h-[calc(100vh-72px)] w-full max-w-6xl items-center px-5 py-12 sm:px-8 lg:px-10">
          <div className="mx-auto w-full max-w-3xl">
            <div className="mb-8 text-center">
              <Badge variant="red">
                VeloTherm CBT Evaluation
              </Badge>

              <h1 className="mt-4 font-[var(--font-oswald)] text-4xl font-bold uppercase tracking-wide text-[var(--color-brand-charcoal)] sm:text-5xl">
                {hasActiveAttempt
                  ? "Continue Your Attempt"
                  : "Ready For Evaluation?"}
              </h1>

              <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-slate-500 sm:text-base">
                {hasActiveAttempt
                  ? "Attempt yang sedang berjalan tersimpan di browser. Lanjutkan dari posisi terakhir tanpa kehilangan jawaban."
                  : "Uji pemahaman kamu terhadap materi termodinamika dan energi melalui evaluasi CBT VeloTherm."}
              </p>
            </div>

            <div
              className="border border-slate-200 bg-white p-6 shadow-[var(--shadow-card)] sm:p-8"
              style={{
                clipPath:
                  "var(--clip-chamfer-lg)",
              }}
            >
              {hasActiveAttempt ? (
                <ContinueCard
                  answeredCount={
                    answeredCount
                  }
                  flaggedCount={
                    flaggedCount
                  }
                  remainingSeconds={
                    remainingSeconds
                  }
                  onContinue={
                    handleContinue
                  }
                  onNewAttempt={
                    handleNewAttempt
                  }
                />
              ) : (
                <StartCard
                  onStart={handleStart}
                />
              )}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

function StartCard({
  onStart,
}: {
  onStart: () => void;
}) {
  return (
    <>
      <div className="grid gap-3 sm:grid-cols-3">
        <InfoCard
          icon={
            <FileText className="size-5" />
          }
          label="Questions"
          value="25"
        />

        <InfoCard
          icon={
            <Clock3 className="size-5" />
          }
          label="Duration"
          value="30 Min"
        />

        <InfoCard
          icon={
            <span className="text-sm font-bold">
              100
            </span>
          }
          label="Max Score"
          value="100"
        />
      </div>

      <div className="mt-8 border-t border-slate-100 pt-7">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <span className="font-[var(--font-chakra-petch)] text-[9px] font-bold uppercase tracking-[0.16em] text-slate-400">
              Before You Start
            </span>

            <p className="mt-1 max-w-xl text-sm leading-relaxed text-slate-500">
              Timer dimulai ketika kamu
              menekan tombol mulai.
              Progress, jawaban, dan
              status ragu-ragu akan
              tersimpan selama attempt
              berlangsung.
            </p>
          </div>

          <Button
            type="button"
            variant="primary"
            size="lg"
            onClick={onStart}
            className="shrink-0"
          >
            Your Attempt
          </Button>
        </div>
      </div>
    </>
  );
}

function ContinueCard({
  answeredCount,
  flaggedCount,
  remainingSeconds,
  onContinue,
  onNewAttempt,
}: {
  answeredCount: number;
  flaggedCount: number;
  remainingSeconds: number;
  onContinue: () => void;
  onNewAttempt: () => void;
}) {
  const totalQuestions = 25;

  const progress =
    (answeredCount /
      totalQuestions) *
    100;

  return (
    <>
      <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <span className="font-[var(--font-chakra-petch)] text-[9px] font-bold uppercase tracking-[0.16em] text-[var(--color-brand-red)]">
            Active Attempt
          </span>

          <h2 className="mt-1 font-[var(--font-oswald)] text-2xl font-bold uppercase tracking-wide text-[var(--color-brand-charcoal)]">
            Continue Your Attempt
          </h2>
        </div>

        <div className="flex items-center gap-2 border border-red-200 bg-red-50 px-4 py-3">
          <Clock3 className="size-4 text-[var(--color-brand-red)]" />

          <div>
            <span className="block font-[var(--font-chakra-petch)] text-[8px] font-bold uppercase tracking-wider text-slate-400">
              Time Remaining
            </span>

            <span className="font-[var(--font-jetbrains-mono)] text-lg font-bold text-[var(--color-brand-red)]">
              {formatTime(
                remainingSeconds,
              )}
            </span>
          </div>
        </div>
      </div>

      <div className="mt-7">
        <div className="mb-2 flex items-center justify-between">
          <span className="font-[var(--font-chakra-petch)] text-[9px] font-bold uppercase tracking-wider text-slate-400">
            Attempt Progress
          </span>

          <span className="font-[var(--font-jetbrains-mono)] text-xs font-bold text-slate-600">
            {answeredCount}/
            {totalQuestions}
          </span>
        </div>

        <div className="h-2 bg-slate-100">
          <div
            className="h-full bg-[var(--color-brand-red)] transition-all duration-[var(--duration-base)]"
            style={{
              width: `${progress}%`,
            }}
          />
        </div>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3">
        <InfoCard
          icon={
            <FileText className="size-5" />
          }
          label="Answered"
          value={`${answeredCount}`}
        />

        <InfoCard
          icon={
            <RotateCcw className="size-5" />
          }
          label="Flagged"
          value={`${flaggedCount}`}
        />
      </div>

      <div className="mt-8 flex flex-col gap-2 border-t border-slate-100 pt-7 sm:flex-row sm:justify-end">
        <Button
          type="button"
          variant="secondary"
          size="md"
          onClick={onNewAttempt}
        >
          New Attempt
        </Button>

        <Button
          type="button"
          variant="primary"
          size="md"
          onClick={onContinue}
        >
          Continue Your Attempt
        </Button>
      </div>
    </>
  );
}

function InfoCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="border border-slate-200 bg-slate-50 p-4">
      <div className="flex items-center gap-3">
        <div className="flex size-10 shrink-0 items-center justify-center bg-white text-[var(--color-brand-red)]">
          {icon}
        </div>

        <div className="min-w-0">
          <span className="block font-[var(--font-chakra-petch)] text-[8px] font-bold uppercase tracking-wider text-slate-400">
            {label}
          </span>

          <span className="mt-0.5 block font-[var(--font-jetbrains-mono)] text-lg font-bold text-[var(--color-brand-charcoal)]">
            {value}
          </span>
        </div>
      </div>
    </div>
  );
}