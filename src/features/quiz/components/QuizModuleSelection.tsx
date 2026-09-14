import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
} from "lucide-react";

import { landingModules } from "@/src/features/landing/data/landingData";

export function QuizModuleSelection() {
  return (
    <main className="min-h-[calc(100vh-72px)] bg-[color:var(--color-brand-bg)]">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8 lg:py-16">
        <section className="relative overflow-hidden border-2 border-slate-200 bg-white px-5 py-8 shadow-[var(--shadow-card)] sm:px-8 sm:py-10 lg:px-12 lg:py-12">
          <div
            className="pointer-events-none absolute right-0 top-0 hidden font-formula text-[120px] font-bold leading-none text-slate-950/[0.025] lg:block"
            aria-hidden="true"
          >
            CBT
          </div>

          <div className="relative max-w-3xl">
            <div
              className="inline-flex items-center gap-2 bg-red-50 px-3 py-1.5 font-tech text-[10px] font-bold uppercase tracking-[0.16em] text-[color:var(--color-brand-red)]"
              style={{
                clipPath:
                  "var(--clip-chamfer-sm)",
              }}
            >
              <BookOpen className="size-3.5" />
              Kuis Pemahaman Evaluasi
            </div>

            <h1 className="mt-5 font-racing text-4xl font-bold uppercase leading-[1.05] tracking-tight text-[color:var(--color-brand-charcoal)] sm:text-5xl lg:text-6xl">
              Pilih Modul{" "}
              <span className="text-[color:var(--color-brand-red)]">
                Kuis
              </span>
            </h1>

            <p className="mt-4 max-w-2xl font-body text-sm leading-relaxed text-slate-600 sm:text-base">
              Pilih materi termodinamika yang ingin kamu evaluasi. Setiap
              modul memiliki rangkaian soal yang disusun berdasarkan materi
              pembelajarannya masing-masing.
            </p>
          </div>
        </section>

        <section className="mt-6">
          <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <span className="font-tech text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">
                Available Evaluations
              </span>

              <h2 className="mt-1 font-racing text-2xl font-bold uppercase tracking-tight text-[color:var(--color-brand-charcoal)] sm:text-3xl">
                3 Modul Termodinamika
              </h2>
            </div>

            <span className="font-formula text-[10px] uppercase tracking-wider text-slate-400">
              Select one module to continue
            </span>
          </div>

          <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
            {landingModules.map((module) => {
              const Icon = module.Icon;

              return (
                <article
                  key={module.number}
                  className="group flex h-full flex-col justify-between overflow-hidden border-2 border-slate-200 bg-white shadow-[var(--shadow-card)] transition-all duration-200 hover:-translate-y-0.5 hover:border-[color:var(--color-brand-red)]/50 hover:shadow-[var(--shadow-card-hover)]"
                  style={{
                    clipPath:
                      "var(--clip-chamfer-lg)",
                  }}
                >
                  <div className="p-5 sm:p-6">
                    <div className="flex items-start justify-between gap-4">
                      <div
                        className="flex size-11 shrink-0 items-center justify-center bg-[color:var(--color-brand-charcoal)] text-white transition-colors duration-200 group-hover:bg-[color:var(--color-brand-red)]"
                        style={{
                          clipPath:
                            "var(--clip-chamfer-sm)",
                        }}
                      >
                        <Icon
                          className="size-5"
                        />
                      </div>

                      <span
                        className="bg-red-50 px-2.5 py-1 font-formula text-[10px] font-bold uppercase tracking-wider text-[color:var(--color-brand-red)]"
                        style={{
                          clipPath:
                            "var(--clip-chamfer-sm)",
                        }}
                      >
                        Module {module.number}
                      </span>
                    </div>

                    <div className="mt-6">
                      <span className="font-tech text-[9px] font-bold uppercase tracking-[0.14em] text-slate-400">
                        CBT Evaluation
                      </span>

                      <h3 className="mt-1 font-racing text-2xl font-bold uppercase leading-tight text-[color:var(--color-brand-charcoal)] transition-colors group-hover:text-[color:var(--color-brand-red)]">
                        {module.title}
                      </h3>

                      <p className="mt-3 text-sm leading-relaxed text-slate-600">
                        {module.description}
                      </p>
                    </div>

                    <div className="mt-5 space-y-2 border-t border-slate-100 pt-5">
                      {module.tags.map(
                        (tag) => (
                          <div
                            key={tag}
                            className="flex items-center gap-2 font-body text-xs text-slate-500"
                          >
                            <CheckCircle2 className="size-3.5 shrink-0 text-[color:var(--color-brand-red)]" />
                            <span>{tag}</span>
                          </div>
                        ),
                      )}
                    </div>
                  </div>

                  <div className="border-t border-slate-100 p-5 sm:p-6">
                    <Link
                      href={`/quiz/attempt/${Number(module.number)}`}
                      className="group/button flex w-full items-center justify-between bg-[color:var(--color-brand-charcoal)] px-4 py-3 font-tech text-xs font-bold uppercase tracking-wider text-white transition-all duration-200 hover:bg-[color:var(--color-brand-red)]"
                      style={{
                        clipPath:
                          "var(--clip-chamfer-sm)",
                      }}
                    >
                      <span>Mulai Kuis Modul {module.number}</span>

                      <ArrowRight className="size-4 transition-transform duration-200 group-hover/button:translate-x-1" />
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        <section className="mt-6 border border-slate-200 bg-slate-50 px-5 py-4 sm:px-6">
          <div className="flex flex-col gap-2 text-center sm:flex-row sm:items-center sm:justify-between sm:text-left">
            <p className="font-body text-xs leading-relaxed text-slate-500">
              Pastikan kamu sudah mempelajari materi modul terkait sebelum
              memulai evaluasi.
            </p>

            <Link
              href="/#modules"
              className="shrink-0 font-tech text-[10px] font-bold uppercase tracking-wider text-[color:var(--color-brand-red)] transition-colors hover:text-[color:var(--color-brand-crimson)]"
            >
              Review Materi →
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}