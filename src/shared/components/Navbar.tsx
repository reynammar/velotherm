"use client";

import Link from "next/link";
import {
  FaArrowUpRightFromSquare,
  FaBookOpen,
  FaCircleInfo,
  FaClipboardCheck,
  FaClipboardQuestion,
  FaFireFlameCurved,
  FaHouse,
} from "react-icons/fa6";
import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";

type NavbarVariant = "landing" | "quiz";

type NavbarProps = {
  variant?: NavbarVariant;
  quizTime?: string;
};

const landingLinks = [
  {
    label: "Beranda",
    href: "/#home",
    icon: FaHouse,
  },
  {
    label: "Prinsip & Nilai",
    href: "/#principles",
    icon: FaCircleInfo,
  },
  {
    label: "Modul Materi",
    href: "/#modules",
    icon: FaBookOpen,
  },
];

export function Navbar({
  variant = "landing",
  quizTime = "30:00",
}: NavbarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const isQuiz = variant === "quiz";

  useEffect(() => {
    if (!isMenuOpen) {
      return;
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsMenuOpen(false);
      }
    };

    window.addEventListener("keydown", handleEscape);

    return () => {
      window.removeEventListener("keydown", handleEscape);
    };
  }, [isMenuOpen]);

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [isMenuOpen]);

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-slate-800 bg-[color:var(--color-brand-charcoal)]/95 backdrop-blur-md">
        <div className="mx-auto h-20 max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="relative flex h-full items-center justify-between">
            {isQuiz ? <QuizBrand /> : <LandingBrand />}

            {isQuiz ? (
              <QuizActions time={quizTime} />
            ) : (
              <LandingActions
                onMenuOpen={() => setIsMenuOpen(true)}
              />
            )}
          </div>
        </div>
      </header>

      {!isQuiz && (
        <MobileNavigation
          open={isMenuOpen}
          onClose={() => setIsMenuOpen(false)}
        />
      )}
    </>
  );
}

function LandingBrand() {
  return (
    <Link
      href="/#home"
      className="group flex min-w-0 items-center gap-3"
      aria-label="VeloTherm Home"
    >
      <BrandMark />

      <span className="min-w-0 leading-none">
        <span className="flex items-center gap-1 font-racing text-2xl font-bold uppercase tracking-[0.06em] text-white sm:text-3xl">
          VELO<span className="text-[color:var(--color-brand-red)]">THERM</span>
        </span>

        <span className="mt-0.5 block truncate font-tech text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-400">
          Automotive Thermodynamics Blueprint
        </span>
      </span>
    </Link>
  );
}

function QuizBrand() {
  return (
    <Link
      href="/"
      className="group flex min-w-0 items-center gap-3"
      aria-label="Kembali ke VeloTherm"
    >
      <BrandMark />

      <span className="min-w-0 leading-none">
        <span className="flex items-center gap-1 font-racing text-2xl font-bold uppercase tracking-[0.06em] text-white sm:text-3xl">
          VELO<span className="text-[color:var(--color-brand-red)]">THERM</span>
        </span>

        <span className="mt-0.5 block truncate font-tech text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-400">
          CBT Evaluation
        </span>
      </span>
    </Link>
  );
}

function BrandMark() {
  return (
    <span
      className="relative flex size-11 shrink-0 items-center justify-center bg-gradient-to-br from-[color:var(--color-brand-red)] to-[color:var(--color-brand-crimson)] text-white shadow-[var(--shadow-glow-red)] transition-transform duration-300 group-hover:scale-105"
      style={{
        clipPath: "var(--clip-chamfer-md)",
      }}
    >
      <FaFireFlameCurved className="text-xl transition-transform duration-300 group-hover:animate-pulse" />
    </span>
  );
}

function LandingActions({
  onMenuOpen,
}: {
  onMenuOpen: () => void;
}) {
  return (
    <>
      <nav
        aria-label="Navigasi utama"
        className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-1 md:flex"
      >
        {landingLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="px-3.5 py-2 font-tech text-xs font-semibold uppercase tracking-wider text-slate-300 transition-all duration-[var(--duration-fast)] hover:bg-slate-800/70 hover:text-[color:var(--color-brand-red)]"
          >
            {link.label}
          </Link>
        ))}

        <Link
          href="/quiz"
          className="ml-1 inline-flex items-center gap-1.5 border border-amber-500/50 bg-amber-950/50 px-3 py-1.5 font-tech text-xs font-bold uppercase tracking-wider text-amber-400 transition-all duration-[var(--duration-fast)] hover:bg-amber-900/50"
          style={{
            clipPath: "var(--clip-chamfer-sm)",
          }}
        >
          <FaClipboardCheck className="text-[10px]" />
          <span>Kuis</span>
        </Link>
      </nav>

      <div className="ml-auto flex items-center gap-3">
        <Link
          href="/#modules"
          className="hidden items-center gap-2 bg-gradient-to-r from-[color:var(--color-brand-red)] via-[color:var(--color-brand-crimson)] to-red-600 px-5 py-2.5 font-tech text-xs font-bold uppercase tracking-wider text-white shadow-[var(--shadow-glow-red)] transition-all duration-200 hover:brightness-110 active:scale-95 sm:inline-flex"
          style={{
            clipPath: "var(--clip-chamfer-md)",
          }}
        >
          <span className="size-2 animate-ping rounded-full bg-white" />
          <span>Mulai Eksperimen Virtual</span>
          <FaArrowUpRightFromSquare className="text-[10px]" />
        </Link>

        <button
          type="button"
          onClick={onMenuOpen}
          aria-label="Buka navigasi"
          aria-expanded="false"
          className="flex size-10 items-center justify-center border border-slate-700 bg-slate-800 text-slate-300 transition-colors duration-[var(--duration-fast)] hover:border-[color:var(--color-brand-red)] hover:text-white md:hidden"
          style={{
            clipPath: "var(--clip-chamfer-sm)",
          }}
        >
          <Menu className="size-5" />
        </button>
      </div>
    </>
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
          clipPath: "var(--clip-chamfer-sm)",
        }}
      >
        <span className="size-2 animate-pulse rounded-full bg-[color:var(--color-brand-red)]" />

        <div className="text-right">
          <span className="block font-tech text-[8px] font-bold uppercase tracking-wider text-slate-400">
            Time
          </span>

          <span className="font-formula text-sm font-bold tracking-wider text-[color:var(--color-brand-red)] sm:text-base">
            {time}
          </span>
        </div>
      </div>

      <Link
        href="/"
        className="hidden items-center justify-center border border-slate-700 bg-slate-800 px-3 py-2 font-tech text-[10px] font-bold uppercase tracking-wide text-slate-300 transition-colors duration-[var(--duration-fast)] hover:border-[color:var(--color-brand-red)] hover:text-[color:var(--color-brand-red)] sm:flex"
        style={{
          clipPath: "var(--clip-chamfer-sm)",
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

  const mobileLinks = [
    ...landingLinks,
    {
      label: "Kuis Evaluasi",
      href: "/quiz",
      icon: FaClipboardQuestion,
    },
  ];

  return (
    <div
      className="fixed inset-0 z-[100] md:hidden"
      role="dialog"
      aria-modal="true"
      aria-label="Navigasi utama"
    >
      <button
        type="button"
        onClick={onClose}
        aria-label="Tutup navigasi"
        className="absolute inset-0 bg-black/70 backdrop-blur-[2px]"
      />

      <aside className="absolute right-0 top-0 flex h-full w-[86%] max-w-sm flex-col border-l border-slate-700 bg-[color:var(--color-brand-charcoal)] shadow-[-20px_0_60px_rgba(15,23,42,0.35)]">
        <div className="flex shrink-0 items-center justify-between border-b border-slate-800 px-5 py-5">
          <LandingBrand />

          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup navigasi"
            className="flex size-9 items-center justify-center border border-slate-700 bg-slate-800 text-slate-300 transition-colors hover:border-[color:var(--color-brand-red)] hover:text-white"
            style={{
              clipPath: "var(--clip-chamfer-sm)",
            }}
          >
            <X className="size-4" />
          </button>
        </div>

        <nav className="flex flex-1 flex-col p-5">
          <span className="mb-4 font-tech text-[9px] font-bold uppercase tracking-[0.18em] text-slate-500">
            Navigation
          </span>

          <div className="space-y-2">
            {mobileLinks.map((link, index) => {
              const Icon = link.icon;

              const isQuizLink = link.href === "/quiz";

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={onClose}
                  className={[
                    "flex items-center justify-between border px-3 py-3.5 font-tech text-sm font-semibold uppercase tracking-wide transition-colors",
                    isQuizLink
                      ? "border-amber-500/40 bg-amber-950/40 text-amber-400 hover:bg-amber-900/40"
                      : "border-slate-800 text-slate-300 hover:border-[color:var(--color-brand-red)] hover:bg-slate-800 hover:text-[color:var(--color-brand-red)]",
                  ].join(" ")}
                  style={{
                    clipPath: "var(--clip-chamfer-sm)",
                  }}
                >
                  <span className="flex items-center gap-3">
                    <Icon
                      className={
                        isQuizLink
                          ? "text-amber-400"
                          : "text-[color:var(--color-brand-red)]"
                      }
                    />
                    <span>{link.label}</span>
                  </span>

                  <span className="font-formula text-[9px] text-slate-500">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </Link>
              );
            })}
          </div>

          <div className="mt-7 border-t border-slate-800 pt-6">
            <Link
              href="/#modules"
              onClick={onClose}
              className="flex w-full items-center justify-center gap-2 bg-[color:var(--color-brand-red)] px-5 py-3.5 font-tech text-xs font-bold uppercase tracking-wider text-white shadow-[var(--shadow-glow-red)] transition-all hover:bg-[color:var(--color-brand-crimson)] active:scale-95"
              style={{
                clipPath: "var(--clip-chamfer-md)",
              }}
            >
              <span>Mulai Eksperimen Virtual</span>
              <FaArrowUpRightFromSquare className="text-[10px]" />
            </Link>
          </div>
        </nav>

        <div className="border-t border-slate-800 px-5 py-5">
          <span className="font-formula text-[8px] uppercase tracking-[0.16em] text-slate-500">
            VeloTherm · Automotive
            <br />
            Thermodynamics Blueprint
          </span>
        </div>
      </aside>
    </div>
  );
}