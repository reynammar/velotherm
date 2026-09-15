"use client";

import {
  ArrowLeft,
  ArrowRight,
  Check,
  Flag,
  Menu,
  RotateCcw,
  Send,
  X,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import { Navbar } from "@/src/shared/components/Navbar";
import {
  quizQuestions,
  type QuizQuestion,
} from "@/src/features/quiz/data/quizQuestions";

type QuizWorkspaceProps = Record<string, never>;

type AttemptStatus = "in-progress" | "completed";

type StoredAttempt = {
  answers: Array<number | null>;
  flaggedQuestions: boolean[];
  startedAt: number;
  expiresAt: number;
  status: AttemptStatus;
  completedAt?: number;
};

type ResultSummary = {
  score: number;
  correct: number;
  wrong: number;
  empty: number;
};

const QUIZ_DURATION_SECONDS = 30 * 60;
const STORAGE_KEY = "velotherm-thermodynamics-quiz-attempt";

function getStorageKey() {
  return STORAGE_KEY;
}

function createFreshAttempt(): StoredAttempt {
  const now = Date.now();
  const totalQuestions = quizQuestions.length;

  return {
    answers: new Array(totalQuestions).fill(null),
    flaggedQuestions: new Array(totalQuestions).fill(false),
    startedAt: now,
    expiresAt: now + QUIZ_DURATION_SECONDS * 1000,
    status: "in-progress",
  };
}

function readAttempt(): StoredAttempt | null {
  if (typeof window === "undefined") return null;

  try {
    const raw = window.localStorage.getItem(getStorageKey());
    if (!raw) return null;

    const parsed = JSON.parse(raw) as StoredAttempt;

    if (
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

function persistAttempt(attempt: StoredAttempt) {
  window.localStorage.setItem(getStorageKey(), JSON.stringify(attempt));
}

function clearAttempt() {
  window.localStorage.removeItem(getStorageKey());
}

function formatTime(seconds: number) {
  const safeSeconds = Math.max(0, seconds);
  const minutes = Math.floor(safeSeconds / 60);
  const remainingSeconds = safeSeconds % 60;

  return `${String(minutes).padStart(2, "0")}:${String(remainingSeconds).padStart(2, "0")}`;
}

function getPredicate(score: number) {
  if (score >= 85) {
    return {
      label: "A · Sangat Memuaskan",
      className: "bg-emerald-100 text-emerald-800 border-emerald-200",
      advice:
        "Pemahaman konsep sudah sangat kuat. Review pembahasan tetap disarankan untuk memastikan setiap konsep dikuasai dengan konsisten.",
    };
  }

  if (score >= 70) {
    return {
      label: "B · Lulus / Kompeten",
      className: "bg-blue-100 text-blue-800 border-blue-200",
      advice:
        "Sebagian besar konsep sudah dikuasai. Periksa kembali soal yang masih keliru melalui mode review.",
    };
  }

  if (score >= 55) {
    return {
      label: "C · Cukup",
      className: "bg-amber-100 text-amber-800 border-amber-200",
      advice:
        "Pemahaman dasar sudah terbentuk, tetapi beberapa konsep utama masih perlu diperkuat melalui materi pembelajaran.",
    };
  }

  return {
    label: "D · Perlu Remediasi",
    className: "bg-rose-100 text-rose-800 border-rose-200",
    advice:
      "Disarankan kembali ke materi pembelajaran, lalu ulangi evaluasi setelah konsep-konsep utamanya lebih mantap.",
  };
}

function calculateResult(
  questions: QuizQuestion[],
  answers: Array<number | null>,
): ResultSummary {
  let correct = 0;
  let wrong = 0;
  let empty = 0;

  questions.forEach((question, index) => {
    const answer = answers[index];

    if (answer === null || answer === undefined) {
      empty += 1;
      return;
    }

    if (answer === question.correct) {
      correct += 1;
    } else {
      wrong += 1;
    }
  });

  return {
    correct,
    wrong,
    empty,
    score: questions.length
      ? Math.round((correct / questions.length) * 100)
      : 0,
  };
}

export function QuizWorkspace(_: QuizWorkspaceProps) {
  const router = useRouter();
  const questions = useMemo(() => quizQuestions, []);

  const [attempt, setAttempt] = useState<StoredAttempt | null>(null);
  const [hydrated, setHydrated] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [remainingSeconds, setRemainingSeconds] = useState(0);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [resultOpen, setResultOpen] = useState(false);
  const [reviewMode, setReviewMode] = useState(false);

  const currentQuestion = questions[currentQuestionIndex];
  const answeredCount =
    attempt?.answers.filter((answer) => answer !== null).length ?? 0;
  const flaggedCount =
    attempt?.flaggedQuestions.filter(Boolean).length ?? 0;
  const unansweredCount = Math.max(0, questions.length - answeredCount);

  const result = useMemo(() => {
    if (!attempt) return null;
    return calculateResult(questions, attempt.answers);
  }, [attempt, questions]);

  const initializeAttempt = useCallback(() => {
    const savedAttempt = readAttempt();

    if (!savedAttempt) {
      const freshAttempt = createFreshAttempt();
      persistAttempt(freshAttempt);
      setAttempt(freshAttempt);
      setRemainingSeconds(QUIZ_DURATION_SECONDS);
      return;
    }

    setAttempt(savedAttempt);

    const remaining = Math.max(
      0,
      Math.floor((savedAttempt.expiresAt - Date.now()) / 1000),
    );

    setRemainingSeconds(remaining);

    if (savedAttempt.status === "completed") {
      setResultOpen(true);
      return;
    }

    if (remaining <= 0) {
      const completedAttempt: StoredAttempt = {
        ...savedAttempt,
        status: "completed",
        completedAt: Date.now(),
      };

      persistAttempt(completedAttempt);
      setAttempt(completedAttempt);
      setRemainingSeconds(0);
      setResultOpen(true);
    }
  }, []);

  useEffect(() => {
    if (questions.length !== 25) {
      router.replace("/quiz/attempt");
      return;
    }

    const frameId = window.requestAnimationFrame(() => {
      initializeAttempt();
      setHydrated(true);
    });

    return () => window.cancelAnimationFrame(frameId);
  }, [initializeAttempt, questions.length, router]);

  useEffect(() => {
    if (!attempt || attempt.status !== "in-progress" || reviewMode) {
      return;
    }

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
        setConfirmOpen(false);
        setResultOpen(true);
        window.clearInterval(intervalId);
      }
    }, 500);

    return () => window.clearInterval(intervalId);
  }, [attempt, reviewMode]);

  useEffect(() => {
    if (!mobileDrawerOpen) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMobileDrawerOpen(false);
    };

    document.addEventListener("keydown", handleEscape);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [mobileDrawerOpen]);

  const updateAttempt = useCallback(
    (updater: (current: StoredAttempt) => StoredAttempt) => {
      setAttempt((current) => {
        if (!current) return current;
        const next = updater(current);
        persistAttempt(next);
        return next;
      });
    },
    [],
  );

  const selectAnswer = (answerIndex: number) => {
    if (!attempt || attempt.status !== "in-progress" || reviewMode) return;

    updateAttempt((current) => {
      const answers = [...current.answers];
      answers[currentQuestionIndex] = answerIndex;
      return { ...current, answers };
    });
  };

  const toggleFlag = () => {
    if (!attempt || attempt.status !== "in-progress" || reviewMode) return;

    updateAttempt((current) => {
      const flaggedQuestions = [...current.flaggedQuestions];
      flaggedQuestions[currentQuestionIndex] =
        !flaggedQuestions[currentQuestionIndex];
      return { ...current, flaggedQuestions };
    });
  };

  const submitQuiz = useCallback(() => {
    if (!attempt || attempt.status === "completed") return;

    const completedAttempt: StoredAttempt = {
      ...attempt,
      status: "completed",
      completedAt: Date.now(),
    };

    persistAttempt(completedAttempt);
    setAttempt(completedAttempt);
    setConfirmOpen(false);
    setResultOpen(true);
    setRemainingSeconds(0);
  }, [attempt]);

  const restartQuiz = () => {
    clearAttempt();
    setCurrentQuestionIndex(0);
    setConfirmOpen(false);
    setResultOpen(false);
    setReviewMode(false);
    initializeAttempt();
  };

  const enterReviewMode = () => {
    setResultOpen(false);
    setReviewMode(true);
    setCurrentQuestionIndex(0);
  };

  const quitToAttemptOverview = () => {
    router.push("/quiz/attempt");
  };

  const timeIsWarning = remainingSeconds <= 300;

  if (!hydrated || !attempt || !currentQuestion) {
    return (
      <div className="min-h-screen bg-[color:var(--color-brand-bg)]">
        <Navbar variant="quiz" quizTime="30:00" />
        <div className="flex min-h-[calc(100vh-72px)] items-center justify-center px-5">
          <div className="text-center">
            <p className="font-[var(--font-chakra-petch)] text-xs font-bold uppercase tracking-[0.2em] text-[color:var(--color-brand-red)]">
              Loading CBT
            </p>
            <h1 className="mt-2 font-[var(--font-oswald)] text-2xl font-bold uppercase text-[color:var(--color-brand-charcoal)]">
              Menyiapkan evaluasi Uji Pemahaman Termodinamika
            </h1>
          </div>
        </div>
      </div>
    );
  }

  const selectedAnswer = attempt.answers[currentQuestionIndex];
  const isCurrentFlagged = attempt.flaggedQuestions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === questions.length - 1;
  const predicate = result ? getPredicate(result.score) : null;

  return (
    <div className="min-h-screen overflow-x-hidden bg-[color:var(--color-brand-bg)] text-slate-800">
      <Navbar
        variant="quiz"
        quizTime={formatTime(remainingSeconds)}
      />

      <main className="mx-auto w-full max-w-7xl px-4 py-4 sm:px-6 sm:py-8 lg:px-8">
        <div className="mb-4 flex flex-col gap-3 sm:mb-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="mb-2 flex flex-wrap items-center gap-2">
              <span
                className="border border-red-200 bg-red-50 px-2.5 py-1 font-[var(--font-chakra-petch)] text-[10px] font-bold uppercase tracking-[0.14em] text-[color:var(--color-brand-red)]"
                style={{ clipPath: "var(--clip-chamfer-sm)" }}
              >
                UJI PEMAHAMAN
              </span>
              <span className="border border-slate-200 bg-white px-2.5 py-1 font-[var(--font-jetbrains-mono)] text-[10px] font-bold text-slate-500">
                {answeredCount}/{questions.length} TERJAWAB
              </span>
            </div>
            <h1 className="font-[var(--font-oswald)] text-2xl font-bold uppercase tracking-wide text-[color:var(--color-brand-charcoal)] sm:text-3xl">
              Uji Pemahaman Termodinamika
            </h1>
          </div>

          <button
            type="button"
            onClick={quitToAttemptOverview}
            className="hidden items-center gap-2 self-start border border-slate-300 bg-white px-4 py-2.5 font-[var(--font-chakra-petch)] text-xs font-bold uppercase tracking-wide text-slate-600 transition-colors hover:border-[color:var(--color-brand-red)] hover:text-[color:var(--color-brand-red)] lg:inline-flex"
            style={{ clipPath: "var(--clip-chamfer-sm)" }}
          >
            <ArrowLeft className="size-4" />
            Simpan & Keluar
          </button>
        </div>

        <div className="flex flex-col items-start gap-6 lg:flex-row">
          <aside className="hidden w-80 shrink-0 border border-slate-200 bg-white p-5 shadow-[var(--shadow-card)] lg:block">
            <div className="border-b border-slate-100 pb-4">
              <div className="flex items-center justify-between gap-3">
                <h2 className="font-[var(--font-oswald)] text-lg font-bold uppercase text-[color:var(--color-brand-charcoal)]">
                  Daftar Nomor Soal
                </h2>
                <span
                  className="border border-slate-200 bg-slate-100 px-2 py-0.5 font-[var(--font-jetbrains-mono)] text-xs font-bold text-slate-600"
                  style={{ clipPath: "var(--clip-chamfer-sm)" }}
                >
                  {answeredCount}/{questions.length}
                </span>
              </div>
              <p className="mt-1 font-[var(--font-chakra-petch)] text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-400">
                Uji Pemahaman Termodinamika
              </p>
            </div>

            <QuestionGrid
              questions={questions}
              answers={attempt.answers}
              flaggedQuestions={attempt.flaggedQuestions}
              currentQuestionIndex={currentQuestionIndex}
              onSelect={setCurrentQuestionIndex}
            />

            <StatusLegend />

            <button
              type="button"
              onClick={() => setConfirmOpen(true)}
              disabled={attempt.status === "completed" || reviewMode}
              className="mt-5 flex w-full items-center justify-center gap-2 bg-slate-900 px-4 py-3 font-[var(--font-chakra-petch)] text-xs font-bold uppercase tracking-[0.12em] text-white transition-colors hover:bg-[color:var(--color-brand-red)] disabled:cursor-not-allowed disabled:opacity-40"
              style={{ clipPath: "var(--clip-chamfer-sm)" }}
            >
              <Send className="size-4" />
              Selesaikan & Kumpulkan
            </button>
          </aside>

          <section className="flex min-w-0 flex-1 flex-col border border-slate-200 bg-white p-4 shadow-[var(--shadow-card)] sm:p-8">
            <div className="mb-5 flex items-center justify-between gap-3 border-b border-slate-100 pb-4 sm:mb-7">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="font-[var(--font-oswald)] text-xl font-bold uppercase tracking-wide text-[color:var(--color-brand-charcoal)] sm:text-2xl">
                  Soal Nomor {String(currentQuestionIndex + 1).padStart(2, "0")}
                </h2>
                <span
                  className="border border-slate-200 bg-slate-100 px-2 py-0.5 font-[var(--font-jetbrains-mono)] text-[10px] font-bold text-slate-600 sm:text-xs"
                  style={{ clipPath: "var(--clip-chamfer-sm)" }}
                >
                  4 Poin
                </span>
                {reviewMode && (
                  <span
                    className="border border-amber-200 bg-amber-50 px-2 py-0.5 font-[var(--font-chakra-petch)] text-[10px] font-bold uppercase text-amber-800"
                    style={{ clipPath: "var(--clip-chamfer-sm)" }}
                  >
                    Mode Review
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setMobileDrawerOpen(true)}
                  className="inline-flex items-center gap-2 border border-slate-300 bg-slate-100 px-3 py-2 font-[var(--font-chakra-petch)] text-[10px] font-bold uppercase tracking-wide text-slate-700 lg:hidden"
                  style={{ clipPath: "var(--clip-chamfer-sm)" }}
                >
                  <Menu className="size-4 text-[color:var(--color-brand-red)]" />
                  Daftar Soal
                  <span className="font-[var(--font-jetbrains-mono)] text-[9px]">
                    {answeredCount}/{questions.length}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={toggleFlag}
                  disabled={attempt.status === "completed" || reviewMode}
                  className={[
                    "hidden items-center gap-2 border px-3 py-2 font-[var(--font-chakra-petch)] text-xs font-bold transition-colors lg:inline-flex",
                    isCurrentFlagged
                      ? "border-amber-500 bg-amber-50 text-amber-700"
                      : "border-slate-300 bg-white text-slate-600 hover:border-amber-500 hover:text-amber-600",
                  ].join(" ")}
                  style={{ clipPath: "var(--clip-chamfer-sm)" }}
                >
                  <Flag className="size-4" />
                  {isCurrentFlagged ? "Ditandai Ragu" : "Tandai Ragu"}
                </button>
              </div>
            </div>

            <div className="flex-1">
              <p className="mb-6 font-[var(--font-inter)] text-base leading-relaxed text-slate-900 sm:text-lg lg:text-xl">
                {currentQuestion.question}
              </p>

              <div className="space-y-3 sm:space-y-3.5">
                {currentQuestion.options.map((option, optionIndex) => {
                  const isSelected = selectedAnswer === optionIndex;
                  const isCorrect = optionIndex === currentQuestion.correct;
                  const isWrongSelection =
                    reviewMode && isSelected && !isCorrect;

                  return (
                    <button
                      key={`${currentQuestion.id}-${optionIndex}`}
                      type="button"
                      onClick={() => selectAnswer(optionIndex)}
                      disabled={reviewMode || attempt.status === "completed"}
                      className={[
                        "flex min-h-[56px] w-full items-center gap-3 border p-3.5 text-left transition-all sm:gap-4 sm:p-4",
                        reviewMode
                          ? isCorrect
                            ? "border-2 border-emerald-600 bg-emerald-50/70 text-emerald-950"
                            : isWrongSelection
                              ? "border-2 border-rose-600 bg-rose-50/70 text-rose-950"
                              : "border-slate-200 bg-white opacity-60"
                          : isSelected
                            ? "border-2 border-[color:var(--color-brand-red)] bg-red-50/50 text-[color:var(--color-brand-charcoal)] shadow-sm"
                            : "border-slate-200 bg-white text-slate-700 hover:border-red-200 hover:bg-slate-50",
                        reviewMode || attempt.status === "completed"
                          ? "cursor-default"
                          : "cursor-pointer",
                      ].join(" ")}
                      style={{ clipPath: "var(--clip-chamfer-md)" }}
                    >
                      <span
                        className={[
                          "flex size-6 shrink-0 items-center justify-center border-2",
                          isSelected
                            ? "border-[color:var(--color-brand-red)]"
                            : "border-slate-400",
                        ].join(" ")}
                        style={{ clipPath: "var(--clip-chamfer-sm)" }}
                      >
                        <span
                          className={[
                            "size-2.5",
                            isSelected
                              ? "bg-[color:var(--color-brand-red)]"
                              : "bg-transparent",
                          ].join(" ")}
                        />
                      </span>

                      <span
                        className={[
                          "flex size-7 shrink-0 items-center justify-center font-[var(--font-jetbrains-mono)] text-xs font-bold",
                          isSelected
                            ? "bg-[color:var(--color-brand-red)] text-white"
                            : "bg-slate-100 text-slate-600",
                        ].join(" ")}
                        style={{ clipPath: "var(--clip-chamfer-sm)" }}
                      >
                        {String.fromCharCode(65 + optionIndex)}
                      </span>

                      <span className="min-w-0 flex-1 text-sm leading-relaxed sm:text-base">
                        {option.replace(/^[A-D]\.\s*/, "")}
                      </span>

                      {reviewMode && isCorrect && (
                        <span
                          className="hidden shrink-0 border border-emerald-200 bg-emerald-100 px-2 py-1 font-[var(--font-chakra-petch)] text-[9px] font-bold uppercase text-emerald-700 sm:inline-flex"
                          style={{ clipPath: "var(--clip-chamfer-sm)" }}
                        >
                          Kunci Benar
                        </span>
                      )}

                      {reviewMode && isWrongSelection && (
                        <span
                          className="hidden shrink-0 border border-rose-200 bg-rose-100 px-2 py-1 font-[var(--font-chakra-petch)] text-[9px] font-bold uppercase text-rose-700 sm:inline-flex"
                          style={{ clipPath: "var(--clip-chamfer-sm)" }}
                        >
                          Pilihan Anda
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              {reviewMode && (
                <div
                  className="mt-6 border border-slate-200 bg-slate-50 p-4 sm:p-5"
                  style={{ clipPath: "var(--clip-chamfer-md)" }}
                >
                  <span className="font-[var(--font-chakra-petch)] text-[10px] font-bold uppercase tracking-[0.16em] text-[color:var(--color-brand-red)]">
                    Pembahasan
                  </span>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">
                    {currentQuestion.explanation}
                  </p>
                </div>
              )}
            </div>

            <div className="mt-7 border-t border-slate-100 pt-5 sm:mt-8 sm:pt-6">
              <div className="flex items-center justify-between gap-2 sm:gap-3">
                <button
                  type="button"
                  disabled={currentQuestionIndex === 0}
                  onClick={() => setCurrentQuestionIndex((value) => value - 1)}
                  className="inline-flex flex-1 items-center justify-center gap-2 border border-slate-300 bg-white px-4 py-3 font-[var(--font-chakra-petch)] text-[10px] font-bold uppercase tracking-wide text-slate-700 transition-colors hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-30 sm:flex-initial sm:px-5"
                  style={{ clipPath: "var(--clip-chamfer-sm)" }}
                >
                  <ArrowLeft className="size-4" />
                  Sebelumnya
                </button>

                <button
                  type="button"
                  onClick={toggleFlag}
                  disabled={attempt.status === "completed" || reviewMode}
                  className={[
                    "inline-flex items-center justify-center gap-2 border px-3 py-3 font-[var(--font-chakra-petch)] text-[10px] font-bold uppercase tracking-wide lg:hidden",
                    isCurrentFlagged
                      ? "border-amber-500 bg-amber-50 text-amber-700"
                      : "border-slate-300 bg-white text-slate-600",
                  ].join(" ")}
                  style={{ clipPath: "var(--clip-chamfer-sm)" }}
                >
                  <Flag className="size-4" />
                  Ragu
                </button>

                {isLastQuestion ? (
                  <button
                    type="button"
                    onClick={() =>
                      reviewMode ? setResultOpen(true) : setConfirmOpen(true)
                    }
                    className="inline-flex flex-1 items-center justify-center gap-2 bg-[color:var(--color-brand-red)] px-4 py-3 font-[var(--font-chakra-petch)] text-[10px] font-bold uppercase tracking-wide text-white shadow-[var(--shadow-glow-red)] transition-colors hover:bg-[color:var(--color-brand-crimson)] sm:flex-initial sm:px-6"
                    style={{ clipPath: "var(--clip-chamfer-sm)" }}
                  >
                    <Check className="size-4" />
                    {reviewMode ? "Lihat Hasil" : "Kumpulkan"}
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => setCurrentQuestionIndex((value) => value + 1)}
                    className="inline-flex flex-1 items-center justify-center gap-2 bg-[color:var(--color-brand-red)] px-4 py-3 font-[var(--font-chakra-petch)] text-[10px] font-bold uppercase tracking-wide text-white shadow-[var(--shadow-glow-red)] transition-colors hover:bg-[color:var(--color-brand-crimson)] sm:flex-initial sm:px-6"
                    style={{ clipPath: "var(--clip-chamfer-sm)" }}
                  >
                    Selanjutnya
                    <ArrowRight className="size-4" />
                  </button>
                )}
              </div>

              <div className="mt-4 flex flex-wrap items-center justify-between gap-2 font-[var(--font-jetbrains-mono)] text-[9px] uppercase tracking-[0.12em] text-slate-400">
                <span>
                  {reviewMode
                    ? "Review aktif · jawaban tidak dapat diubah"
                    : "Jawaban tersimpan otomatis di perangkat"}
                </span>
                <span
                  className={timeIsWarning ? "font-bold text-[color:var(--color-brand-red)]" : ""}
                >
                  Waktu {formatTime(remainingSeconds)}
                </span>
              </div>
            </div>
          </section>
        </div>
      </main>

      {mobileDrawerOpen && (
        <div className="fixed inset-0 z-[100] lg:hidden">
          <button
            type="button"
            aria-label="Tutup daftar soal"
            onClick={() => setMobileDrawerOpen(false)}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />
          <aside className="absolute right-0 top-0 flex h-full w-[88%] max-w-sm flex-col overflow-y-auto border-l border-slate-200 bg-white p-5 shadow-2xl">
            <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <span className="font-[var(--font-chakra-petch)] text-[9px] font-bold uppercase tracking-[0.18em] text-[color:var(--color-brand-red)]">
                  UJI PEMAHAMAN
                </span>
                <h3 className="mt-1 font-[var(--font-oswald)] text-xl font-bold uppercase text-[color:var(--color-brand-charcoal)]">
                  Daftar Nomor Soal
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setMobileDrawerOpen(false)}
                className="flex size-9 items-center justify-center border border-slate-200 bg-slate-50 text-slate-600"
                aria-label="Tutup panel"
              >
                <X className="size-4" />
              </button>
            </div>

            <div className="mt-4 border border-slate-200 bg-slate-50 p-3 text-xs">
              <div className="flex items-center justify-between font-[var(--font-jetbrains-mono)]">
                <span className="text-slate-500">Status Terjawab</span>
                <span className="font-bold text-slate-800">
                  {answeredCount}/{questions.length}
                </span>
              </div>
            </div>

            <QuestionGrid
              questions={questions}
              answers={attempt.answers}
              flaggedQuestions={attempt.flaggedQuestions}
              currentQuestionIndex={currentQuestionIndex}
              onSelect={(index) => {
                setCurrentQuestionIndex(index);
                setMobileDrawerOpen(false);
              }}
              mobile
            />

            <StatusLegend />

            <button
              type="button"
              onClick={() => {
                setMobileDrawerOpen(false);
                setConfirmOpen(true);
              }}
              disabled={attempt.status === "completed" || reviewMode}
              className="mt-auto flex w-full items-center justify-center gap-2 bg-slate-900 px-4 py-3 font-[var(--font-chakra-petch)] text-xs font-bold uppercase tracking-wide text-white disabled:opacity-40"
              style={{ clipPath: "var(--clip-chamfer-sm)" }}
            >
              <Send className="size-4" />
              Selesaikan & Kumpulkan
            </button>
          </aside>
        </div>
      )}

      {confirmOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div
            className="w-full max-w-md border-2 border-slate-300 bg-white p-6 shadow-2xl sm:p-8"
            style={{ clipPath: "var(--clip-chamfer-lg)" }}
          >
            <div className="mx-auto flex size-14 items-center justify-center bg-red-100 text-[color:var(--color-brand-red)]">
              <Send className="size-6" />
            </div>

            <div className="mt-5 text-center">
              <span className="font-[var(--font-chakra-petch)] text-[9px] font-bold uppercase tracking-[0.18em] text-[color:var(--color-brand-red)]">
                UJI PEMAHAMAN
              </span>
              <h3 className="mt-1 font-[var(--font-oswald)] text-2xl font-bold uppercase text-[color:var(--color-brand-charcoal)]">
                Kumpulkan Evaluasi?
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-500">
                Pastikan jawaban sudah ditinjau sebelum sesi evaluasi diselesaikan.
              </p>
            </div>

            <div className="mt-6 grid grid-cols-3 gap-2 border border-slate-200 bg-slate-50 p-3 text-center font-[var(--font-jetbrains-mono)]">
              <div>
                <span className="block text-[9px] uppercase text-slate-400">Terjawab</span>
                <span className="text-lg font-bold text-emerald-700">{answeredCount}</span>
              </div>
              <div>
                <span className="block text-[9px] uppercase text-slate-400">Ragu</span>
                <span className="text-lg font-bold text-amber-600">{flaggedCount}</span>
              </div>
              <div>
                <span className="block text-[9px] uppercase text-slate-400">Kosong</span>
                <span className="text-lg font-bold text-rose-600">{unansweredCount}</span>
              </div>
            </div>

            <div className="mt-6 flex gap-3">
              <button
                type="button"
                onClick={() => setConfirmOpen(false)}
                className="flex-1 border border-slate-300 bg-slate-100 px-4 py-3 font-[var(--font-chakra-petch)] text-xs font-bold uppercase tracking-wide text-slate-700"
                style={{ clipPath: "var(--clip-chamfer-sm)" }}
              >
                Periksa Lagi
              </button>
              <button
                type="button"
                onClick={submitQuiz}
                className="flex-1 bg-[color:var(--color-brand-red)] px-4 py-3 font-[var(--font-chakra-petch)] text-xs font-bold uppercase tracking-wide text-white shadow-[var(--shadow-glow-red)]"
                style={{ clipPath: "var(--clip-chamfer-sm)" }}
              >
                Ya, Kumpulkan
              </button>
            </div>
          </div>
        </div>
      )}

      {resultOpen && result && predicate && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center overflow-y-auto bg-black/75 p-4 backdrop-blur-sm">
          <div
            className="my-6 w-full max-w-lg overflow-hidden border-2 border-[color:var(--color-brand-red)] bg-white shadow-2xl"
            style={{ clipPath: "var(--clip-chamfer-lg)" }}
          >
            <div className="border-b-2 border-[color:var(--color-brand-red)] bg-[color:var(--color-brand-charcoal)] p-5 text-white sm:p-6">
              <span className="font-[var(--font-jetbrains-mono)] text-[9px] font-bold uppercase tracking-[0.18em] text-[color:var(--color-brand-red)]">
                Laporan Evaluasi Resmi
              </span>
              <h3 className="mt-1 font-[var(--font-oswald)] text-2xl font-bold uppercase tracking-wide sm:text-3xl">
                Hasil Penilaian CBT
              </h3>
              <p className="mt-1 font-[var(--font-chakra-petch)] text-[10px] uppercase tracking-[0.12em] text-slate-400">
                Uji Pemahaman Termodinamika
              </p>
            </div>

            <div className="space-y-5 p-5 text-center sm:space-y-6 sm:p-8">
              <div
                className="inline-block min-w-[220px] border border-slate-200 bg-slate-50 p-5"
                style={{ clipPath: "var(--clip-chamfer-md)" }}
              >
                <span className="block font-[var(--font-chakra-petch)] text-[10px] font-bold uppercase tracking-wide text-slate-500">
                  Skor Akhir Mahasiswa
                </span>
                <div className="mt-1 flex items-baseline justify-center gap-1">
                  <span className="font-[var(--font-oswald)] text-6xl font-bold text-[color:var(--color-brand-red)]">
                    {result.score}
                  </span>
                  <span className="font-[var(--font-jetbrains-mono)] text-sm font-bold text-slate-400">
                    / 100
                  </span>
                </div>
                <span
                  className={`mt-2 inline-flex border px-3 py-1 font-[var(--font-chakra-petch)] text-[10px] font-bold uppercase ${predicate.className}`}
                  style={{ clipPath: "var(--clip-chamfer-sm)" }}
                >
                  {predicate.label}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2 text-center font-[var(--font-jetbrains-mono)]">
                <ResultMetric label="Benar" value={result.correct} className="border-emerald-200 bg-emerald-50 text-emerald-800" />
                <ResultMetric label="Salah" value={result.wrong} className="border-rose-200 bg-rose-50 text-rose-800" />
                <ResultMetric label="Kosong" value={result.empty} className="border-slate-200 bg-slate-100 text-slate-800" />
              </div>

              <p className="mx-auto max-w-md text-sm leading-relaxed text-slate-600">
                {predicate.advice}
              </p>

              <div className="flex flex-col gap-2.5 border-t border-slate-200 pt-4 font-[var(--font-chakra-petch)] sm:flex-row sm:justify-center">
                <button
                  type="button"
                  onClick={enterReviewMode}
                  className="inline-flex items-center justify-center gap-2 bg-[color:var(--color-brand-charcoal)] px-5 py-3 text-xs font-bold uppercase tracking-wide text-white"
                  style={{ clipPath: "var(--clip-chamfer-sm)" }}
                >
                  <Check className="size-4" />
                  Review Pembahasan
                </button>
                <button
                  type="button"
                  onClick={restartQuiz}
                  className="inline-flex items-center justify-center gap-2 border border-slate-300 bg-white px-5 py-3 text-xs font-bold uppercase tracking-wide text-slate-800"
                  style={{ clipPath: "var(--clip-chamfer-sm)" }}
                >
                  <RotateCcw className="size-4" />
                  Ulangi Ujian
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function QuestionGrid({
  questions,
  answers,
  flaggedQuestions,
  currentQuestionIndex,
  onSelect,
  mobile = false,
}: {
  questions: QuizQuestion[];
  answers: Array<number | null>;
  flaggedQuestions: boolean[];
  currentQuestionIndex: number;
  onSelect: (index: number) => void;
  mobile?: boolean;
}) {
  return (
    <div className={mobile ? "mt-5 grid grid-cols-5 gap-2.5" : "mt-5 grid grid-cols-5 gap-2.5"}>
      {questions.map((question, index) => {
        const isCurrent = index === currentQuestionIndex;
        const isAnswered = answers[index] !== null;
        const isFlagged = flaggedQuestions[index];

        const className = isCurrent
          ? "border-2 border-[color:var(--color-brand-red)] bg-red-50 text-[color:var(--color-brand-red)] shadow-sm ring-2 ring-red-100"
          : isFlagged
            ? "border-2 border-amber-500 bg-amber-100 text-amber-900"
            : isAnswered
              ? "border border-[color:var(--color-brand-charcoal)] bg-[color:var(--color-brand-charcoal)] text-white"
              : "border border-slate-300 bg-white text-slate-700 hover:border-slate-400";

        return (
          <button
            key={question.id}
            type="button"
            onClick={() => onSelect(index)}
            className={`flex h-10 items-center justify-center font-[var(--font-jetbrains-mono)] text-xs font-bold transition-all sm:h-11 ${className}`}
            style={{ clipPath: "var(--clip-chamfer-sm)" }}
            aria-label={`Buka soal ${index + 1}`}
          >
            {index + 1}
          </button>
        );
      })}
    </div>
  );
}

function StatusLegend() {
  return (
    <div className="mt-5 border-t border-slate-100 pt-4 font-[var(--font-chakra-petch)] text-[10px]">
      <span className="font-bold uppercase tracking-[0.14em] text-slate-400">
        Keterangan Status
      </span>
      <div className="mt-3 grid grid-cols-2 gap-2">
        <LegendItem className="border border-slate-300 bg-white" label="Belum Dijawab" />
        <LegendItem className="bg-[color:var(--color-brand-charcoal)]" label="Sudah Dijawab" check />
        <LegendItem className="border-2 border-[color:var(--color-brand-red)] bg-red-50" label="Sedang Dibuka" />
        <LegendItem className="border-2 border-amber-500 bg-amber-100" label="Ragu-Ragu" />
      </div>
    </div>
  );
}

function LegendItem({
  label,
  className,
  check = false,
}: {
  label: string;
  className: string;
  check?: boolean;
}) {
  return (
    <div className="flex items-center gap-2 text-slate-600">
      <span
        className={`flex size-4 shrink-0 items-center justify-center ${className}`}
      >
        {check && <Check className="size-2.5 text-white" />}
      </span>
      <span>{label}</span>
    </div>
  );
}

function ResultMetric({
  label,
  value,
  className,
}: {
  label: string;
  value: number;
  className: string;
}) {
  return (
    <div
      className={`border p-3 ${className}`}
      style={{ clipPath: "var(--clip-chamfer-sm)" }}
    >
      <span className="block text-[9px] font-bold uppercase tracking-wide">
        {label}
      </span>
      <span className="text-xl font-bold">{value}</span>
    </div>
  );
}
