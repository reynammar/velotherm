import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Download,
  FlaskConical,
} from "lucide-react";

import type { ModuleData } from "../data/moduleData";

const previousModule: Record<string, string | null> = {
  "1": null,
  "2": "1",
  "3": "2",
};

const nextModule: Record<string, string | null> = {
  "1": "2",
  "2": "3",
  "3": null,
};

export function ModuleReader({
  module,
}: {
  module: ModuleData;
}) {
  const previous = previousModule[module.number.replace(/^0/, "")];
  const next = nextModule[module.number.replace(/^0/, "")];

  return (
    <main className="min-h-screen bg-white text-slate-800">
      <div className="border-b-2 border-[color:var(--color-brand-red)] bg-[color:var(--color-brand-charcoal)] text-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-5 px-4 py-5 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <div className="flex min-w-0 items-center gap-4">
            <div
              className="flex size-11 shrink-0 items-center justify-center bg-[color:var(--color-brand-red)] font-racing text-lg font-bold"
              style={{ clipPath: "var(--clip-chamfer-sm)" }}
            >
              {module.number}
            </div>

            <div className="min-w-0">
              <span
                className="inline-flex max-w-full bg-red-950/80 px-2 py-0.5 font-tech text-[10px] font-bold uppercase tracking-widest text-[color:var(--color-brand-red)]"
                style={{ clipPath: "var(--clip-chamfer-sm)" }}
              >
                {module.badge}
              </span>

              <h1 className="mt-1 font-racing text-xl font-bold uppercase tracking-wide text-white sm:text-2xl">
                {module.title}
              </h1>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/"
              className="inline-flex items-center gap-2 bg-slate-800 px-4 py-2 font-tech text-xs font-bold uppercase tracking-wider text-slate-200 transition-colors hover:bg-slate-700 hover:text-white"
              style={{ clipPath: "var(--clip-chamfer-sm)" }}
            >
              <ArrowLeft className="size-3.5" />
              Beranda
            </Link>

            <a
              href={module.laboratoryHref}
              className="inline-flex items-center gap-2 bg-[color:var(--color-brand-red)] px-4 py-2 font-tech text-xs font-bold uppercase tracking-wider text-white shadow-[var(--shadow-glow-red)] transition-all hover:brightness-110"
              style={{ clipPath: "var(--clip-chamfer-sm)" }}
            >
              <FlaskConical className="size-3.5" />
              Laboratorium
            </a>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
        <div className="mb-10 max-w-3xl">
          <span className="font-tech text-xs font-bold uppercase tracking-[0.16em] text-[color:var(--color-brand-red)]">
            Learning Reader // Modul {module.number}
          </span>

          <p className="mt-3 font-body text-sm leading-relaxed text-slate-600 sm:text-base">
            {module.description}
          </p>
        </div>

        <div className="space-y-12">{module.content}</div>

        <div className="mt-14 border-t-2 border-slate-200 pt-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 bg-slate-800 px-6 py-3 font-tech text-xs font-bold uppercase tracking-wider text-white transition-colors hover:bg-slate-900"
              style={{ clipPath: "var(--clip-chamfer-sm)" }}
            >
              <ArrowLeft className="size-3.5" />
              Kembali ke Beranda Utama
            </Link>

            <div className="flex flex-col gap-3 sm:flex-row">
              <a
                href={module.pdfHref}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 border border-slate-300 bg-white px-6 py-3 font-tech text-xs font-bold uppercase tracking-wider text-slate-700 transition-colors hover:border-slate-400 hover:bg-slate-50 hover:text-slate-900"
                style={{ clipPath: "var(--clip-chamfer-sm)" }}
              >
                <Download className="size-3.5" />
                View PDF for More
              </a>

              <a
                href={module.laboratoryHref}
                className="inline-flex items-center justify-center gap-2 bg-[color:var(--color-brand-red)] px-6 py-3 font-tech text-xs font-bold uppercase tracking-wider text-white shadow-[var(--shadow-glow-red)] transition-all hover:brightness-110"
                style={{ clipPath: "var(--clip-chamfer-sm)" }}
              >
                <FlaskConical className="size-3.5" />
                Buka Laboratorium Visual Interaktif
              </a>

              <Link
                href="/quiz"
                className="inline-flex items-center justify-center gap-2 bg-amber-500 px-6 py-3 font-tech text-xs font-bold uppercase tracking-wider text-slate-950 shadow-md transition-colors hover:bg-amber-400"
                style={{ clipPath: "var(--clip-chamfer-sm)" }}
              >
                <BookOpen className="size-3.5" />
                Uji Pemahaman di Kuis
              </Link>
            </div>
          </div>
        </div>

        <nav
          aria-label="Navigasi materi"
          className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2"
        >
          {previous ? (
            <Link
              href={`/materi/${previous}`}
              className="group border border-slate-200 bg-slate-50 p-4 transition-colors hover:border-slate-300 hover:bg-white"
              style={{ clipPath: "var(--clip-chamfer-sm)" }}
            >
              <span className="font-tech text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Materi Sebelumnya
              </span>

              <span className="mt-1 flex items-center gap-2 font-racing text-base font-bold uppercase text-slate-800">
                <ArrowLeft className="size-4 transition-transform group-hover:-translate-x-1" />
                Modul 0{previous}
              </span>
            </Link>
          ) : (
            <div />
          )}

          {next ? (
            <Link
              href={`/materi/${next}`}
              className="group border border-slate-200 bg-slate-50 p-4 text-left transition-colors hover:border-slate-300 hover:bg-white sm:text-right"
              style={{ clipPath: "var(--clip-chamfer-sm)" }}
            >
              <span className="font-tech text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Materi Berikutnya
              </span>

              <span className="mt-1 flex items-center justify-end gap-2 font-racing text-base font-bold uppercase text-slate-800">
                Modul 0{next}
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
              </span>
            </Link>
          ) : (
            <div />
          )}
        </nav>
      </div>
    </main>
  );
}