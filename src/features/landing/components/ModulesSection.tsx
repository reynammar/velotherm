"use client";

import Link from "next/link";
import { ArrowRight, ExternalLink } from "lucide-react";
import { useEffect, useState } from "react";

import { landingModules } from "../data/landingData";

export function ModulesSection() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      setVisible(true);
    });

    return () => {
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <section
      id="modules"
      className="relative border-b border-slate-200 bg-white py-20 lg:py-28"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-16 max-w-3xl text-center">
          <div className="mb-3 inline-flex items-center gap-2 bg-red-50 px-4 py-1.5 font-tech text-xs font-bold uppercase tracking-wider text-[color:var(--color-brand-red)]">
            <span>◆</span>
            <span>Kurikulum Perkuliahan Teknik</span>
          </div>

          <h2 className="font-racing text-3xl font-bold uppercase tracking-tight text-[color:var(--color-brand-charcoal)] sm:text-5xl">
            3 Modul{" "}
            <span className="text-[color:var(--color-brand-red)]">
              Termodinamika Teknik
            </span>
          </h2>

          <p className="mt-3 font-body text-base leading-relaxed text-slate-600">
            Materi lengkap disusun berdasarkan struktur materi perkuliahan
            teknik mesin. Pelajari konsepnya terlebih dahulu, lalu lanjutkan
            ke visualisasi interaktif untuk memahami penerapannya.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {landingModules.map((module, index) => {
            const Icon = module.Icon;

            return (
              <article
                key={module.number}
                className={[
                  "group flex flex-col justify-between border-2 border-slate-200",
                  "bg-[color:var(--color-brand-bg)] p-8",
                  "shadow-[var(--shadow-card)]",
                  "transition-all duration-500",
                  "hover:border-[color:var(--color-brand-red)]/60",
                  "hover:shadow-[var(--shadow-card-hover)]",
                  visible
                    ? "translate-y-0 opacity-100"
                    : "translate-y-4 opacity-0",
                ].join(" ")}
                style={{
                  clipPath: "var(--clip-chamfer-lg)",
                  transitionDelay: `${index * 100}ms`,
                }}
              >
                <div>
                  <div className="mb-6 flex items-center justify-between">
                    <div
                      className="flex size-[52px] items-center justify-center bg-[color:var(--color-brand-charcoal)] text-white transition-colors duration-300 group-hover:bg-[color:var(--color-brand-red)]"
                      style={{
                        clipPath: "var(--clip-chamfer-sm)",
                      }}
                    >
                      <Icon className="size-6" />
                    </div>

                    <span
                      className="bg-red-100 px-3 py-1 font-tech text-xs font-bold uppercase tracking-wider text-[color:var(--color-brand-red)]"
                      style={{
                        clipPath: "var(--clip-chamfer-sm)",
                      }}
                    >
                      Modul {module.number}
                    </span>
                  </div>

                  <h3 className="font-racing text-2xl font-bold uppercase text-[color:var(--color-brand-charcoal)] transition-colors group-hover:text-[color:var(--color-brand-red)]">
                    {module.title}
                  </h3>

                  <p className="mb-6 mt-3 font-body text-sm leading-relaxed text-slate-600">
                    {module.description}
                  </p>

                  <div className="mb-6 flex flex-wrap gap-2 font-tech text-xs">
                    {module.tags.map((tag) => (
                      <span
                        key={tag}
                        className="border border-slate-300 bg-white px-2.5 py-1 font-semibold text-slate-700"
                        style={{
                          clipPath: "var(--clip-chamfer-sm)",
                        }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="space-y-3 border-t border-slate-200 pt-6">
                  <Link
                    href={module.href}
                    className="group/module flex w-full items-center justify-between bg-[color:var(--color-brand-charcoal)] px-5 py-3.5 font-tech text-xs font-bold uppercase tracking-wider text-white shadow-sm transition-all duration-200 hover:bg-[color:var(--color-brand-red)]"
                    style={{
                      clipPath: "var(--clip-chamfer-sm)",
                    }}
                  >
                    <span>Pelajari Materi Lengkap</span>

                    <ArrowRight className="size-4 transition-transform duration-200 group-hover/module:translate-x-1" />
                  </Link>

                  <Link
                    href={module.laboratoryHref}
                    className="group/lab flex w-full items-center justify-center gap-2 bg-slate-200/80 px-4 py-2.5 font-tech text-xs font-semibold text-slate-700 transition-colors hover:bg-red-50 hover:text-[color:var(--color-brand-red)]"
                    style={{
                      clipPath: "var(--clip-chamfer-sm)",
                    }}
                  >
                    <span>{module.laboratoryLabel}</span>

                    <ExternalLink className="size-3 transition-transform duration-200 group-hover/lab:translate-x-0.5 group-hover/lab:-translate-y-0.5" />
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}