"use client";

import Link from "next/link";
import { Menu, X } from "lucide-react";
import {
  useEffect,
  useState,
} from "react";

type NavbarVariant =
  | "landing"
  | "quiz";

type NavbarProps = {
  variant?: NavbarVariant;
  quizTime?: string;
};

const landingLinks = [
  {
    label: "Home",
    href: "/",
  },
  {
    label: "Modules",
    href: "/#modules",
  },
  {
    label: "Principles",
    href: "/#principles",
  },
  {
    label: "Quiz",
    href: "/quiz",
  },
];

export function Navbar({
  variant = "landing",
  quizTime = "30:00",
}: NavbarProps) {
  const [isMenuOpen, setIsMenuOpen] =
    useState(false);

  const isQuiz =
    variant === "quiz";

  useEffect(() => {
    if (!isMenuOpen) {
      return;
    }

    const handleEscape = (
      event: KeyboardEvent,
    ) => {
      if (event.key === "Escape") {
        setIsMenuOpen(false);
      }
    };

    window.addEventListener(
      "keydown",
      handleEscape,
    );

    return () => {
      window.removeEventListener(
        "keydown",
        handleEscape,
      );
    };
  }, [isMenuOpen]);

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow =
        "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isMenuOpen]);

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-slate-200/80 bg-white/95 backdrop-blur-md">
        <div
          className={[
            "mx-auto flex h-[72px] w-full items-center",
            "px-5 sm:px-8 lg:px-10",
            isQuiz
              ? "max-w-[1600px]"
              : "max-w-7xl",
          ].join(" ")}
        >
          {isQuiz ? (
            <QuizBrand />
          ) : (
            <LandingBrand />
          )}

          {isQuiz ? (
            <QuizActions
              time={quizTime}
            />
          ) : (
            <LandingActions
              onMenuOpen={() =>
                setIsMenuOpen(true)
              }
            />
          )}
        </div>
      </header>

      {!isQuiz && (
        <MobileNavigation
          open={isMenuOpen}
          onClose={() =>
            setIsMenuOpen(false)
          }
        />
      )}
    </>
  );
}

function LandingBrand() {
  return (
    <Link
      href="/"
      className="group flex items-center gap-3"
      aria-label="VeloTherm Home"
    >
      <BrandMark />

      <div className="leading-none">
        <span className="block font-[var(--font-chakra-petch)] text-sm font-bold uppercase tracking-[0.18em] text-[var(--color-brand-charcoal)]">
          VeloTherm
        </span>

        <span className="mt-1 block font-[var(--font-jetbrains-mono)] text-[8px] uppercase tracking-[0.18em] text-slate-400">
          Automotive Learning System
        </span>
      </div>
    </Link>
  );
}

function QuizBrand() {
  return (
    <Link
      href="/"
      className="group flex items-center gap-3"
      aria-label="Kembali ke VeloTherm"
    >
      <BrandMark />

      <div className="leading-none">
        <span className="block font-[var(--font-chakra-petch)] text-sm font-bold uppercase tracking-[0.18em] text-[var(--color-brand-charcoal)]">
          VeloTherm
        </span>

        <span className="mt-1 block font-[var(--font-jetbrains-mono)] text-[8px] uppercase tracking-[0.18em] text-slate-400">
          CBT Evaluation
        </span>
      </div>
    </Link>
  );
}

function BrandMark() {
  return (
    <span
      className="relative flex size-10 shrink-0 items-center justify-center bg-[var(--color-brand-charcoal)] transition-colors duration-[var(--duration-fast)] group-hover:bg-[var(--color-brand-red)]"
      style={{
        clipPath:
          "var(--clip-chamfer-sm)",
      }}
    >
      <span className="font-[var(--font-chakra-petch)] text-sm font-bold text-white">
        VT
      </span>

      <span className="absolute bottom-1 right-1 size-1.5 bg-[var(--color-brand-red)] group-hover:bg-white" />
    </span>
  );
}

function LandingActions({
  onMenuOpen,
}: {
  onMenuOpen: () => void;
}) {
  return (
    <div className="ml-auto flex items-center gap-3">
      <nav className="hidden items-center gap-1 lg:flex">
        {landingLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="px-3 py-2 font-[var(--font-chakra-petch)] text-xs font-semibold uppercase tracking-wide text-slate-500 transition-colors duration-[var(--duration-fast)] hover:text-[var(--color-brand-red)]"
          >
            {link.label}
          </Link>
        ))}
      </nav>

      <Link
        href="/quiz"
        className="hidden items-center justify-center border border-[var(--color-brand-red)] bg-[var(--color-brand-red)] px-4 py-2.5 font-[var(--font-chakra-petch)] text-xs font-bold uppercase tracking-wide text-white transition-all duration-[var(--duration-fast)] hover:bg-[var(--color-brand-crimson)] hover:shadow-[var(--shadow-glow-red)] active:scale-95 sm:flex"
        style={{
          clipPath:
            "var(--clip-chamfer-sm)",
        }}
      >
        Start Quiz
      </Link>

      <button
        type="button"
        onClick={onMenuOpen}
        aria-label="Buka navigasi"
        className="flex size-10 items-center justify-center border border-slate-200 bg-white text-slate-600 transition-colors duration-[var(--duration-fast)] hover:border-[var(--color-brand-red)] hover:text-[var(--color-brand-red)] lg:hidden"
      >
        <Menu className="size-5" />
      </button>
    </div>
  );
}

function QuizActions({
  time,
}: {
  time: string;
}) {
  return (
    <div className="ml-auto flex items-center gap-2">
      <div
        className="flex items-center gap-2 border border-[color:var(--color-brand-red)]/30 bg-red-950/30 px-3 py-1.5 sm:px-4 sm:py-2"
        style={{
          clipPath:
            "var(--clip-chamfer-sm)",
        }}
      >
        <span className="size-2 animate-pulse rounded-full bg-[color:var(--color-brand-red)]" />

        <div className="text-right">
          <span className="block font-[var(--font-chakra-petch)] text-[8px] font-bold uppercase tracking-wider text-slate-400">
            Time
          </span>

          <span className="font-[var(--font-jetbrains-mono)] text-sm font-bold tracking-wider text-[color:var(--color-brand-red)] sm:text-base">
            {time}
          </span>
        </div>
      </div>

      <Link
        href="/"
        className="hidden items-center justify-center border border-slate-200 bg-white px-3 py-2 font-[var(--font-chakra-petch)] text-[10px] font-bold uppercase tracking-wide text-slate-500 transition-colors duration-[var(--duration-fast)] hover:border-[var(--color-brand-red)] hover:text-[var(--color-brand-red)] sm:flex"
        style={{
          clipPath:
            "var(--clip-chamfer-sm)",
        }}
      >
        Portal
      </Link>
    </div>
  );
}

function MobileNavigation({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  if (!open) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-[100] lg:hidden"
      role="dialog"
      aria-modal="true"
      aria-label="Navigasi utama"
    >
      <button
        type="button"
        onClick={onClose}
        aria-label="Tutup navigasi"
        className="absolute inset-0 bg-black/60 backdrop-blur-[2px]"
      />

      <aside className="absolute right-0 top-0 flex h-full w-[86%] max-w-sm flex-col border-l border-slate-200 bg-white shadow-[-20px_0_60px_rgba(15,23,42,0.2)]">
        <div className="flex shrink-0 items-center justify-between border-b border-slate-200 px-5 py-5">
          <LandingBrand />

          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup navigasi"
            className="flex size-9 items-center justify-center border border-slate-200 bg-slate-50 text-slate-500 transition-colors hover:border-slate-300 hover:bg-slate-100 hover:text-slate-900"
          >
            <X className="size-4" />
          </button>
        </div>

        <nav className="flex flex-1 flex-col p-5">
          <span className="mb-4 font-[var(--font-chakra-petch)] text-[9px] font-bold uppercase tracking-[0.18em] text-slate-400">
            Navigation
          </span>

          <div className="space-y-1">
            {landingLinks.map(
              (link, index) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={onClose}
                  className="flex items-center justify-between border-b border-slate-100 px-3 py-4 font-[var(--font-chakra-petch)] text-sm font-semibold uppercase tracking-wide text-slate-600 transition-colors duration-[var(--duration-fast)] hover:border-[var(--color-brand-red)] hover:text-[var(--color-brand-red)]"
                >
                  <span>{link.label}</span>

                  <span className="font-[var(--font-jetbrains-mono)] text-[9px] text-slate-300">
                    {String(index + 1).padStart(
                      2,
                      "0",
                    )}
                  </span>
                </Link>
              ),
            )}
          </div>

          <div className="mt-7 border-t border-slate-100 pt-6">
            <Link
              href="/quiz"
              onClick={onClose}
              className="flex w-full items-center justify-center border border-[var(--color-brand-red)] bg-[var(--color-brand-red)] px-5 py-3.5 font-[var(--font-chakra-petch)] text-xs font-bold uppercase tracking-wide text-white transition-all duration-[var(--duration-fast)] hover:bg-[var(--color-brand-crimson)] hover:shadow-[var(--shadow-glow-red)] active:scale-95"
              style={{
                clipPath:
                  "var(--clip-chamfer-sm)",
              }}
            >
              Start Quiz
            </Link>
          </div>
        </nav>

        <div className="border-t border-slate-100 px-5 py-5">
          <span className="font-[var(--font-jetbrains-mono)] text-[8px] uppercase tracking-[0.16em] text-slate-400">
            VeloTherm · Automotive
            Learning System
          </span>
        </div>
      </aside>
    </div>
  );
}