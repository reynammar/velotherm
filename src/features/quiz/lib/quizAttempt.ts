import { quizQuestions } from "@/src/features/quiz/data/quizQuestions";

export const QUIZ_ATTEMPT_STORAGE_KEY =
  "velotherm-quiz-attempt";

export const QUIZ_ATTEMPT_CHANGE_EVENT =
  "velotherm-quiz-attempt-change";

export const QUIZ_DURATION_SECONDS = 30 * 60;

const QUIZ_DURATION_MS =
  QUIZ_DURATION_SECONDS * 1000;

export type QuizAttemptStatus =
  | "in-progress"
  | "completed";

export type QuizAttempt = {
  startedAt: number;
  expiresAt: number;
  answers: Array<number | null>;
  flaggedQuestions: boolean[];
  status: QuizAttemptStatus;
};

function createEmptyAttempt(
  startedAt: number,
): QuizAttempt {
  return {
    startedAt,
    expiresAt:
      startedAt + QUIZ_DURATION_MS,
    answers: new Array(
      quizQuestions.length,
    ).fill(null),
    flaggedQuestions: new Array(
      quizQuestions.length,
    ).fill(false),
    status: "in-progress",
  };
}

function isValidAttempt(
  value: unknown,
): value is QuizAttempt {
  if (
    typeof value !== "object" ||
    value === null
  ) {
    return false;
  }

  const attempt =
    value as Partial<QuizAttempt>;

  return (
    typeof attempt.startedAt === "number" &&
    typeof attempt.expiresAt === "number" &&
    Array.isArray(attempt.answers) &&
    Array.isArray(
      attempt.flaggedQuestions,
    )
  );
}

export function getQuizAttempt(): QuizAttempt | null {
  if (typeof window === "undefined") {
    return null;
  }

  const stored = localStorage.getItem(
    QUIZ_ATTEMPT_STORAGE_KEY,
  );

  if (!stored) {
    return null;
  }

  try {
    const parsed: unknown = JSON.parse(
      stored,
    );

    if (!isValidAttempt(parsed)) {
      localStorage.removeItem(
        QUIZ_ATTEMPT_STORAGE_KEY,
      );

      return null;
    }

    return {
      startedAt: parsed.startedAt,
      expiresAt: parsed.expiresAt,
      answers: parsed.answers,
      flaggedQuestions:
        parsed.flaggedQuestions,
      status:
        parsed.status === "completed"
          ? "completed"
          : "in-progress",
    };
  } catch {
    localStorage.removeItem(
      QUIZ_ATTEMPT_STORAGE_KEY,
    );

    return null;
  }
}

export function createQuizAttempt(): QuizAttempt {
  const attempt = createEmptyAttempt(
    Date.now(),
  );

  saveQuizAttempt(attempt);

  return attempt;
}

export function saveQuizAttempt(
  attempt: QuizAttempt,
): void {
  if (typeof window === "undefined") {
    return;
  }

  localStorage.setItem(
    QUIZ_ATTEMPT_STORAGE_KEY,
    JSON.stringify(attempt),
  );

  window.dispatchEvent(
    new Event(QUIZ_ATTEMPT_CHANGE_EVENT),
  );
}

export function completeQuizAttempt(
  attempt: QuizAttempt,
): QuizAttempt {
  const completedAttempt: QuizAttempt = {
    ...attempt,
    status: "completed",
  };

  saveQuizAttempt(completedAttempt);

  return completedAttempt;
}

export function clearQuizAttempt(): void {
  if (typeof window === "undefined") {
    return;
  }

  localStorage.removeItem(
    QUIZ_ATTEMPT_STORAGE_KEY,
  );

  window.dispatchEvent(
    new Event(QUIZ_ATTEMPT_CHANGE_EVENT),
  );
}

export function getRemainingSeconds(
  attempt: QuizAttempt,
): number {
  if (attempt.status === "completed") {
    return 0;
  }

  const remaining =
    attempt.expiresAt - Date.now();

  return Math.max(
    0,
    Math.ceil(remaining / 1000),
  );
}

export function isAttemptExpired(
  attempt: QuizAttempt,
): boolean {
  if (attempt.status === "completed") {
    return true;
  }

  return Date.now() >= attempt.expiresAt;
}

export function getAnsweredCount(
  attempt: QuizAttempt,
): number {
  return attempt.answers.filter(
    (answer) => answer !== null,
  ).length;
}

export function getFlaggedCount(
  attempt: QuizAttempt,
): number {
  return attempt.flaggedQuestions.filter(
    Boolean,
  ).length;
}

export function subscribeQuizAttempt(
  callback: () => void,
): () => void {
  if (typeof window === "undefined") {
    return () => {};
  }

  const handleChange = () => {
    callback();
  };

  window.addEventListener(
    QUIZ_ATTEMPT_CHANGE_EVENT,
    handleChange,
  );

  window.addEventListener(
    "storage",
    handleChange,
  );

  return () => {
    window.removeEventListener(
      QUIZ_ATTEMPT_CHANGE_EVENT,
      handleChange,
    );

    window.removeEventListener(
      "storage",
      handleChange,
    );
  };
}

export function getQuizAttemptSnapshot(): string | null {
  if (typeof window === "undefined") {
    return null;
  }

  return localStorage.getItem(
    QUIZ_ATTEMPT_STORAGE_KEY,
  );
}

export function getQuizAttemptServerSnapshot(): null {
  return null;
}