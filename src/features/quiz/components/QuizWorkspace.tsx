"use client";

import {
  ArrowLeft,
  ArrowRight,
  Check,
  Flag,
  Menu,
  RotateCcw,
  Send,
} from "lucide-react";
import { useRouter } from "next/navigation";
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  useSyncExternalStore,
} from "react";

import { Badge } from "@/src/shared/components/Badge";
import { Button } from "@/src/shared/components/Button";
import { Navbar } from "@/src/shared/components/Navbar";

import {
  completeQuizAttempt,
  getAnsweredCount,
  getFlaggedCount,
  getQuizAttemptServerSnapshot,
  getQuizAttemptSnapshot,
  getRemainingSeconds,
  saveQuizAttempt,
  subscribeQuizAttempt,
  type QuizAttempt,
} from "@/src/features/quiz/lib/quizAttempt";

import {
  quizQuestions,
  type QuizQuestion,
} from "@/src/features/quiz/data/quizQuestions";

import { QuestionNavigator } from "./QuestionNavigator";
import { MobileQuestionDrawer } from "./MobileQuestionDrawer";
import { SubmitConfirmModal } from "./SubmitConfirmModal";
import { QuizResultModal } from "./QuizResultModal";

type QuizResult = {
  score: number;
  correctCount: number;
  wrongCount: number;
  unansweredCount: number;
};

type Predicate = {
  grade: string;
  label: string;
  variant: "success" | "info" | "warning" | "error";
  feedback: string;
};

function useQuizAttempt(): QuizAttempt | null {
  const snapshot = useSyncExternalStore(
    subscribeQuizAttempt,
    getQuizAttemptSnapshot,
    getQuizAttemptServerSnapshot,
  );

  return useMemo(() => {
    if (!snapshot) {
      return null;
    }

    try {
      const parsed: unknown = JSON.parse(
        snapshot,
      );

      if (
        typeof parsed !== "object" ||
        parsed === null
      ) {
        return null;
      }

      const value =
        parsed as Partial<QuizAttempt>;

      if (
        typeof value.startedAt !==
          "number" ||
        typeof value.expiresAt !==
          "number" ||
        !Array.isArray(value.answers) ||
        !Array.isArray(
          value.flaggedQuestions,
        )
      ) {
        return null;
      }

      return {
        startedAt: value.startedAt,
        expiresAt: value.expiresAt,
        answers: value.answers,
        flaggedQuestions:
          value.flaggedQuestions,
        status:
          value.status === "completed"
            ? "completed"
            : "in-progress",
      };
    } catch {
      return null;
    }
  }, [snapshot]);
}

function formatTime(
  seconds: number,
): string {
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

function getQuestion(
  index: number,
): QuizQuestion {
  const question = quizQuestions[index];

  if (!question) {
    return quizQuestions[0];
  }

  return question;
}

function calculateResult(
  attempt: QuizAttempt,
): QuizResult {
  const total: number =
    quizQuestions.length;

  let correctCount = 0;
  let unansweredCount = 0;

  for (
    let index = 0;
    index < total;
    index += 1
  ) {
    const answer =
      attempt.answers[index];

    const question =
      quizQuestions[index];

    if (!question) {
      continue;
    }

    if (answer === null) {
      unansweredCount += 1;
      continue;
    }

    if (answer === question.correct) {
      correctCount += 1;
    }
  }

  const wrongCount: number =
    total -
    correctCount -
    unansweredCount;

  const score: number =
    total > 0
      ? Math.round(
          (correctCount / total) * 100,
        )
      : 0;

  return {
    score,
    correctCount,
    wrongCount,
    unansweredCount,
  };
}

function getPredicate(
  score: number,
): Predicate {
  if (score >= 85) {
    return {
      grade: "A",
      label: "Sangat Memuaskan",
      variant: "success",
      feedback:
        "Pemahaman kamu terhadap materi sudah sangat baik. Pertahankan konsistensi dan terus perdalam penerapannya pada kasus nyata.",
    };
  }

  if (score >= 70) {
    return {
      grade: "B",
      label: "Lulus / Kompeten",
      variant: "info",
      feedback:
        "Pemahaman dasar materi sudah tercapai dengan baik. Beberapa bagian masih dapat diperdalam agar penguasaan konsep semakin kuat.",
    };
  }

  if (score >= 55) {
    return {
      grade: "C",
      label: "Cukup",
      variant: "warning",
      feedback:
        "Sebagian konsep sudah dipahami, tetapi masih terdapat beberapa bagian yang perlu ditinjau kembali sebelum melanjutkan ke materi yang lebih kompleks.",
    };
  }

  return {
    grade: "D",
    label: "Perlu Remediasi",
    variant: "error",
    feedback:
      "Hasil evaluasi menunjukkan bahwa beberapa konsep utama masih perlu dipelajari kembali. Gunakan materi pembelajaran sebagai dasar untuk melakukan remediasi.",
  };
}

export function QuizWorkspace() {
  const router = useRouter();

  const attempt = useQuizAttempt();

  const [currentQuestionIdx, setCurrentQuestionIdx] =
    useState<number>(0);

  const [drawerOpen, setDrawerOpen] =
    useState<boolean>(false);

  const [confirmOpen, setConfirmOpen] =
    useState<boolean>(false);

  const [isReviewMode, setIsReviewMode] =
    useState<boolean>(false);

  /*
   * Redirect jika tidak ada attempt.
   *
   * Tidak ada setState synchronous
   * di dalam effect ini.
   */
  useEffect(() => {
    if (attempt === null) {
      router.replace("/quiz");
    }
  }, [attempt, router]);

  const remainingSeconds: number =
    attempt &&
    attempt.status === "in-progress"
      ? getRemainingSeconds(attempt)
      : 0;

  const answeredCount: number =
    attempt
      ? getAnsweredCount(attempt)
      : 0;

  const flaggedCount: number =
    attempt
      ? getFlaggedCount(attempt)
      : 0;

  const totalQuestions: number =
    quizQuestions.length;

  const unansweredCount: number =
    Math.max(
      0,
      totalQuestions - answeredCount,
    );

  const result: QuizResult = useMemo(() => {
    if (!attempt) {
      return {
        score: 0,
        correctCount: 0,
        wrongCount: 0,
        unansweredCount:
          quizQuestions.length,
      };
    }

    return calculateResult(attempt);
  }, [attempt]);

  const predicate: Predicate = useMemo(
    () => getPredicate(result.score),
    [result.score],
  );

  const safeQuestionIndex: number =
    Math.min(
      Math.max(currentQuestionIdx, 0),
      Math.max(totalQuestions - 1, 0),
    );

  const currentQuestion: QuizQuestion =
    getQuestion(safeQuestionIndex);

  const selectedAnswer: number | null =
    attempt?.answers[safeQuestionIndex] ??
    null;

  const isCurrentQuestionFlagged: boolean =
    attempt?.flaggedQuestions[
      safeQuestionIndex
    ] ?? false;

  const executeSubmit = useCallback(
    (currentAttempt: QuizAttempt) => {
      if (
        currentAttempt.status !==
        "in-progress"
      ) {
        return;
      }

      completeQuizAttempt(
        currentAttempt,
      );

      setConfirmOpen(false);
      setIsReviewMode(false);
    },
    [],
  );

  /*
   * Auto-submit ketika waktu habis.
   *
   * Effect hanya membuat subscription
   * interval. Perubahan state terjadi
   * dari callback interval.
   */
  useEffect(() => {
    if (
      !attempt ||
      attempt.status !==
        "in-progress"
    ) {
      return;
    }

    const intervalId =
      window.setInterval(() => {
        const remaining =
          getRemainingSeconds(attempt);

        if (remaining <= 0) {
          window.clearInterval(
            intervalId,
          );

          executeSubmit(attempt);
        }
      }, 500);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [
    attempt,
    executeSubmit,
  ]);

  const handleSelectAnswer = (
    optionIndex: number,
  ): void => {
    if (
      !attempt ||
      attempt.status !==
        "in-progress" ||
      isReviewMode
    ) {
      return;
    }

    const answers = [
      ...attempt.answers,
    ];

    answers[safeQuestionIndex] =
      optionIndex;

    saveQuizAttempt({
      ...attempt,
      answers,
    });
  };

  const handleToggleFlag = (): void => {
    if (
      !attempt ||
      attempt.status !==
        "in-progress" ||
      isReviewMode
    ) {
      return;
    }

    const flaggedQuestions = [
      ...attempt.flaggedQuestions,
    ];

    flaggedQuestions[
      safeQuestionIndex
    ] =
      !flaggedQuestions[
        safeQuestionIndex
      ];

    saveQuizAttempt({
      ...attempt,
      flaggedQuestions,
    });
  };

  const handlePrevious = (): void => {
    setCurrentQuestionIdx(
      (current) =>
        Math.max(0, current - 1),
    );
  };

  const handleNext = (): void => {
    setCurrentQuestionIdx(
      (current) =>
        Math.min(
          totalQuestions - 1,
          current + 1,
        ),
    );
  };

  const handleSelectQuestion = (
    index: number,
  ): void => {
    if (
      index < 0 ||
      index >= totalQuestions
    ) {
      return;
    }

    setCurrentQuestionIdx(index);
  };

  const handleReview = (): void => {
    setIsReviewMode(true);
    setConfirmOpen(false);
    setCurrentQuestionIdx(0);
  };

  const handleRestart = (): void => {
    router.push("/quiz");
  };

  const handlePortal = (): void => {
    router.push("/");
  };

  const handleSubmitRequest = (): void => {
    if (
      !attempt ||
      attempt.status !==
        "in-progress"
    ) {
      return;
    }

    setConfirmOpen(true);
  };

  if (!attempt) {
    return (
      <div className="min-h-screen bg-[color:var(--color-brand-bg)]">
        <Navbar variant="quiz" />

        <main className="flex min-h-[calc(100vh-72px)] items-center justify-center px-5">
          <div className="text-center">
            <span className="font-[var(--font-chakra-petch)] text-xs font-bold uppercase tracking-[0.18em] text-slate-400">
              Loading Evaluation
            </span>

            <div className="mx-auto mt-4 size-7 animate-spin border-2 border-slate-200 border-t-[var(--color-brand-red)]" />
          </div>
        </main>
      </div>
    );
  }

  const isCompleted: boolean =
    attempt.status === "completed";

  return (
    <div className="min-h-screen bg-[color:var(--color-brand-bg)] text-[color:var(--color-brand-charcoal)]">
      <Navbar
        variant="quiz"
        quizTime={
          isCompleted ||
          isReviewMode
            ? "00:00"
            : formatTime(
                remainingSeconds,
              )
        }
      />

      <main className="relative">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(220,38,38,0.045),transparent_32%)]" />

        <div className="relative mx-auto flex w-full max-w-[1600px] gap-5 px-4 py-5 sm:px-6 lg:px-8 lg:py-7">
          <QuestionNavigator
            totalQuestions={
              totalQuestions
            }
            currentQuestion={
              safeQuestionIndex
            }
            answers={attempt.answers}
            flaggedQuestions={
              attempt.flaggedQuestions
            }
            onSelectQuestion={
              handleSelectQuestion
            }
          />

          <section className="min-w-0 flex-1">
            <div className="mb-4 flex items-center justify-between gap-3 lg:hidden">
              <button
                type="button"
                onClick={() =>
                  setDrawerOpen(true)
                }
                className="inline-flex items-center gap-2 border border-slate-200 bg-white px-3 py-2 font-[var(--font-chakra-petch)] text-[10px] font-bold uppercase tracking-wide text-slate-600 transition-colors hover:border-[var(--color-brand-red)] hover:text-[var(--color-brand-red)]"
              >
                <Menu className="size-4" />
                Daftar Soal
              </button>

              <span className="font-[var(--font-jetbrains-mono)] text-xs font-bold text-slate-400">
                {safeQuestionIndex +
                  1}{" "}
                / {totalQuestions}
              </span>
            </div>

            <div
              className="overflow-hidden border border-slate-200 bg-white shadow-[var(--shadow-card)]"
              style={{
                clipPath:
                  "var(--clip-chamfer-lg)",
              }}
            >
              <div className="border-b border-slate-200 bg-[var(--color-brand-charcoal)] px-5 py-4 sm:px-7">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex size-10 shrink-0 items-center justify-center bg-[var(--color-brand-red)]">
                      <span className="font-[var(--font-jetbrains-mono)] text-sm font-bold text-white">
                        {String(
                          safeQuestionIndex +
                            1,
                        ).padStart(
                          2,
                          "0",
                        )}
                      </span>
                    </div>

                    <div>
                      <span className="block font-[var(--font-chakra-petch)] text-[9px] font-bold uppercase tracking-[0.16em] text-slate-400">
                        {isReviewMode
                          ? "Review Mode"
                          : "Current Question"}
                      </span>

                      <span className="mt-0.5 block font-[var(--font-oswald)] text-lg font-semibold uppercase tracking-wide text-white">
                        Question{" "}
                        {safeQuestionIndex +
                          1}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {isReviewMode && (
                      <Badge variant="cyan">
                        Review
                      </Badge>
                    )}

                    {isCurrentQuestionFlagged &&
                      !isReviewMode && (
                        <Badge variant="warning">
                          Ragu-Ragu
                        </Badge>
                      )}
                  </div>
                </div>
              </div>

              <div className="p-5 sm:p-7 lg:p-9">
                <div className="flex flex-col gap-6">
                  <div>
                    <div className="flex items-start justify-between gap-4">
                      <h1 className="max-w-4xl font-[var(--font-oswald)] text-xl font-semibold leading-relaxed tracking-wide text-[var(--color-brand-charcoal)] sm:text-2xl">
                        {
                          currentQuestion.question
                        }
                      </h1>

                      {!isReviewMode &&
                        !isCompleted && (
                          <button
                            type="button"
                            onClick={
                              handleToggleFlag
                            }
                            aria-label={
                              isCurrentQuestionFlagged
                                ? "Hapus tanda ragu-ragu"
                                : "Tandai soal sebagai ragu-ragu"
                            }
                            aria-pressed={
                              isCurrentQuestionFlagged
                            }
                            className={[
                              "flex size-10 shrink-0 items-center justify-center border",
                              isCurrentQuestionFlagged
                                ? "border-amber-400 bg-amber-50 text-amber-600"
                                : "border-slate-200 bg-white text-slate-400 hover:border-amber-300 hover:text-amber-500",
                            ].join(
                              " ",
                            )}
                          >
                            <Flag
                              className={
                                isCurrentQuestionFlagged
                                  ? "size-4 fill-current"
                                  : "size-4"
                              }
                            />
                          </button>
                        )}
                    </div>

                    <span className="mt-3 block font-[var(--font-chakra-petch)] text-[9px] font-semibold uppercase tracking-wider text-slate-400">
                      Pilih satu jawaban yang paling tepat
                    </span>
                  </div>

                  <div className="space-y-2.5">
                    {currentQuestion.options.map(
                      (
                        option,
                        optionIndex,
                      ) => {
                        const isSelected: boolean =
                          selectedAnswer ===
                          optionIndex;

                        const isCorrect: boolean =
                          currentQuestion.correct ===
                          optionIndex;

                        let stateClass =
                          "border-slate-200 bg-white hover:border-slate-400 hover:bg-slate-50";

                        if (
                          isReviewMode &&
                          isCorrect
                        ) {
                          stateClass =
                            "border-emerald-500 bg-emerald-50";
                        } else if (
                          isReviewMode &&
                          isSelected &&
                          !isCorrect
                        ) {
                          stateClass =
                            "border-rose-500 bg-rose-50";
                        } else if (
                          isSelected
                        ) {
                          stateClass =
                            "border-[var(--color-brand-red)] bg-red-50";
                        }

                        return (
                          <button
                            key={
                              optionIndex
                            }
                            type="button"
                            disabled={
                              isReviewMode ||
                              isCompleted
                            }
                            onClick={() =>
                              handleSelectAnswer(
                                optionIndex,
                              )
                            }
                            className={[
                              "group flex w-full items-start gap-3 border p-4 text-left transition-all duration-[var(--duration-fast)]",
                              "disabled:cursor-default",
                              stateClass,
                            ].join(
                              " ",
                            )}
                            style={{
                              clipPath:
                                "var(--clip-chamfer-sm)",
                            }}
                          >
                            <span
                              className={[
                                "flex size-8 shrink-0 items-center justify-center border font-[var(--font-jetbrains-mono)] text-xs font-bold",
                                isSelected &&
                                !isReviewMode
                                  ? "border-[var(--color-brand-red)] bg-[var(--color-brand-red)] text-white"
                                  : isReviewMode &&
                                      isCorrect
                                    ? "border-emerald-500 bg-emerald-500 text-white"
                                    : isReviewMode &&
                                        isSelected
                                      ? "border-rose-500 bg-rose-500 text-white"
                                      : "border-slate-200 bg-slate-50 text-slate-500",
                              ].join(
                                " ",
                              )}
                            >
                              {String.fromCharCode(
                                65 +
                                  optionIndex,
                              )}
                            </span>

                            <span className="min-w-0 flex-1 pt-1 text-sm leading-6 text-slate-600">
                              {option}
                            </span>

                            {isReviewMode &&
                              isCorrect && (
                                <Check className="mt-1 size-4 shrink-0 text-emerald-600" />
                              )}
                          </button>
                        );
                      },
                    )}
                  </div>

                  {isReviewMode && (
                    <ReviewSummary
                      selectedAnswer={
                        selectedAnswer
                      }
                      correctAnswer={
                        currentQuestion.correct
                      }
                    />
                  )}
                </div>
              </div>

              <div className="border-t border-slate-200 bg-slate-50 px-5 py-4 sm:px-7">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <Button
                    type="button"
                    variant="secondary"
                    size="md"
                    onClick={
                      handlePrevious
                    }
                    disabled={
                      safeQuestionIndex ===
                      0
                    }
                  >
                    <ArrowLeft className="size-4" />
                    Sebelumnya
                  </Button>

                  <span className="hidden font-[var(--font-jetbrains-mono)] text-[10px] font-bold tracking-wider text-slate-400 sm:block">
                    {String(
                      safeQuestionIndex +
                        1,
                    ).padStart(
                      2,
                      "0",
                    )}{" "}
                    /{" "}
                    {String(
                      totalQuestions,
                    ).padStart(
                      2,
                      "0",
                    )}
                  </span>

                  {safeQuestionIndex <
                  totalQuestions - 1 ? (
                    <Button
                      type="button"
                      variant="dark"
                      size="md"
                      onClick={handleNext}
                    >
                      Berikutnya
                      <ArrowRight className="size-4" />
                    </Button>
                  ) : isReviewMode ? (
                    <Button
                      type="button"
                      variant="primary"
                      size="md"
                      onClick={() =>
                        setIsReviewMode(
                          false,
                        )
                      }
                    >
                      <RotateCcw className="size-4" />
                      Kembali ke Hasil
                    </Button>
                  ) : (
                    <Button
                      type="button"
                      variant="primary"
                      size="md"
                      onClick={
                        handleSubmitRequest
                      }
                      disabled={
                        isCompleted
                      }
                    >
                      <Send className="size-4" />
                      Kumpulkan Evaluasi
                    </Button>
                  )}
                </div>
              </div>
            </div>

            {!isReviewMode && (
              <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-2">
                  <span className="size-2 bg-[var(--color-brand-red)]" />

                  <span className="font-[var(--font-chakra-petch)] text-[9px] font-medium uppercase tracking-wider text-slate-400">
                    Jawaban tersimpan otomatis
                  </span>
                </div>

                <div className="font-[var(--font-jetbrains-mono)] text-[9px] text-slate-400">
                  {answeredCount}{" "}
                  answered ·{" "}
                  {flaggedCount}{" "}
                  flagged ·{" "}
                  {unansweredCount}{" "}
                  unanswered
                </div>
              </div>
            )}
          </section>
        </div>
      </main>

      <MobileQuestionDrawer
        open={drawerOpen}
        totalQuestions={
          totalQuestions
        }
        currentQuestion={
          safeQuestionIndex
        }
        answers={attempt.answers}
        flaggedQuestions={
          attempt.flaggedQuestions
        }
        onClose={() =>
          setDrawerOpen(false)
        }
        onSelectQuestion={(
          index: number,
        ) => {
          handleSelectQuestion(index);
          setDrawerOpen(false);
        }}
      />

      <SubmitConfirmModal
        open={confirmOpen}
        answered={answeredCount}
        flagged={flaggedCount}
        unanswered={unansweredCount}
        onClose={() =>
          setConfirmOpen(false)
        }
        onConfirm={() =>
          executeSubmit(attempt)
        }
      />

      <QuizResultModal
        open={
          isCompleted &&
          !isReviewMode
        }
        score={result.score}
        correctCount={
          result.correctCount
        }
        wrongCount={
          result.wrongCount
        }
        unansweredCount={
          result.unansweredCount
        }
        predicate={predicate}
        onReview={handleReview}
        onRestart={handleRestart}
        onPortal={handlePortal}
      />
    </div>
  );
}

function ReviewSummary({
  selectedAnswer,
  correctAnswer,
}: {
  selectedAnswer: number | null;
  correctAnswer: number;
}) {
  const hasAnswer: boolean =
    selectedAnswer !== null;

  const isCorrect: boolean =
    hasAnswer &&
    selectedAnswer === correctAnswer;

  return (
    <div
      className={[
        "border-l-2 px-4 py-3",
        isCorrect
          ? "border-emerald-500 bg-emerald-50"
          : hasAnswer
            ? "border-rose-500 bg-rose-50"
            : "border-slate-300 bg-slate-50",
      ].join(" ")}
    >
      <span
        className={[
          "font-[var(--font-chakra-petch)] text-[9px] font-bold uppercase tracking-wider",
          isCorrect
            ? "text-emerald-600"
            : hasAnswer
              ? "text-rose-600"
              : "text-slate-500",
        ].join(" ")}
      >
        {isCorrect
          ? "Jawaban Benar"
          : hasAnswer
            ? "Jawaban Salah"
            : "Tidak Dijawab"}
      </span>

      <p className="mt-1 text-xs leading-relaxed text-slate-600">
        {hasAnswer
          ? isCorrect
            ? "Jawaban yang kamu pilih sesuai dengan kunci jawaban."
            : `Kunci jawaban: ${String.fromCharCode(
                65 + correctAnswer,
              )}.`
          : `Kunci jawaban: ${String.fromCharCode(
              65 + correctAnswer,
            )}.`}
      </p>
    </div>
  );
}