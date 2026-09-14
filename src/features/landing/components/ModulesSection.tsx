"use client";

import Link from "next/link";
import {
  ArrowRight,
  BatteryCharging,
  Bolt,
  Box,
  FileText,
  FlaskConical,
  GraduationCap,
} from "lucide-react";
import { useEffect, useState } from "react";

import { landingModules } from "../data/landingData";

const moduleIcons = [Box, Bolt, BatteryCharging];

export function ModulesSection() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const frameId = window.requestAnimationFrame(() => {
      setIsVisible(true);
    });

    return () => {
      window.cancelAnimationFrame(frameId);
    };
  }, []);

  return (
    <section
      id="modules"
      className="border-b border-slate-200 bg-white"
    >
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
        {/* Section Header */}
        <div className="mx-auto mb-14 max-w-3xl text-center">
          <div
            className="mb-3 inline-flex items-center gap-2 border border-red-200 bg-red-50 px-4 py-1.5 font-tech text-[10px] font-bold uppercase tracking-wider text-[color:var(--color-brand-red)]"
            style={{
              clipPath: "var(--clip-chamfer-sm)",
            }}
          >
            <GraduationCap className="size-3.5" />
            <span>Kurikulum Perkuliahan Teknik</span>
          </div>

          <h2 className="font-racing text-3xl font-bold uppercase leading-[1.05] tracking-tight text-[color:var(--color-brand-charcoal)] sm:text-5xl">
            3 Modul{" "}
            <span className="text-[color:var(--color-brand-red)]">
              Termodinamika Teknik
            </span>
          </h2>

          <p className="mx-auto mt-4 max-w-3xl font-body text-sm leading-relaxed text-[color:var(--color-brand-muted)] sm:text-base">
            Materi lengkap 100% disusun sesuai slide presentasi perkuliahan
            teknik mesin. Klik tombol untuk membuka Interactive Full-Page
            Reader.
          </p>
        </div>

        {/* Modules */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {landingModules.map((module, index) => {
            const Icon = moduleIcons[index];

            return (
              <article
                key={module.number}
                className={[
                  "group flex flex-col border-2 border-slate-200 bg-[color:var(--color-brand-bg)] p-8",
                  "shadow-[var(--shadow-card)]",
                  "transition-all duration-700 ease-[var(--ease-technical)]",
                  "hover:-translate-y-1 hover:border-[color:var(--color-brand-red)]/60",
                  "hover:shadow-[var(--shadow-card-hover)]",
                  isVisible
                    ? "translate-y-0 opacity-100"
                    : "translate-y-6 opacity-0",
                ].join(" ")}
                style={{
                  clipPath: "var(--clip-chamfer-lg)",
                  transitionDelay: `${index * 120}ms`,
                }}
              >
                {/* Card Top */}
                <div className="flex items-center justify-between gap-4">
                  <div
                    className="flex size-13 items-center justify-center bg-[color:var(--color-brand-charcoal)] text-white transition-colors duration-300 group-hover:bg-[color:var(--color-brand-red)]"
                    style={{
                      clipPath: "var(--clip-chamfer-sm)",
                    }}
                  >
                    <Icon className="size-6" />
                  </div>

                  <span
                    className="bg-red-100 px-3 py-1 font-tech text-[10px] font-bold uppercase tracking-wider text-[color:var(--color-brand-red)]"
                    style={{
                      clipPath: "var(--clip-chamfer-sm)",
                    }}
                  >
                    Modul {module.number}
                  </span>
                </div>

                {/* Title */}
                <h3 className="mt-7 font-racing text-2xl font-bold uppercase leading-[1.08] text-[color:var(--color-brand-charcoal)] transition-colors duration-200 group-hover:text-[color:var(--color-brand-red)]">
                  {module.title}
                </h3>

                {/* Description */}
                <p className="mt-4 font-body text-sm leading-relaxed text-[color:var(--color-brand-muted)]">
                  {module.description}
                </p>

                {/* Technical Tags */}
                <div className="mt-6 flex flex-wrap gap-2">
                  {module.tags.map((tag) => (
                    <span
                      key={tag.label}
                      className="inline-flex items-center gap-1.5 border border-slate-300 bg-white px-2.5 py-1.5 font-tech text-[10px] font-semibold text-slate-700"
                      style={{
                        clipPath: "var(--clip-chamfer-sm)",
                      }}
                    >
                      <span className="text-[color:var(--color-brand-red)]">
                        {tag.icon}
                      </span>

                      {tag.label}
                    </span>
                  ))}
                </div>

                {/* Actions */}
                <div className="mt-auto pt-8">
                  <div className="border-t border-slate-200 pt-6">
                    {/* Primary */}
                    <Link
                      href={module.href}
                      className="group/button flex min-h-11 w-full items-center justify-between gap-3 bg-[color:var(--color-brand-charcoal)] px-5 py-3.5 font-tech text-[10px] font-bold uppercase tracking-wider text-white transition-colors duration-200 hover:bg-[color:var(--color-brand-red)]"
                      style={{
                        clipPath: "var(--clip-chamfer-md)",
                      }}
                    >
                      <span>Pelajari Materi Lengkap</span>

                      <ArrowRight className="size-4 shrink-0 transition-transform duration-200 group-hover/button:translate-x-1" />
                    </Link>

                    {/* Laboratory */}
                    <Link
                      href={module.simulationHref ?? module.href}
                      className="group/lab mt-3 flex min-h-11 w-full items-center justify-center gap-2 bg-slate-200/80 px-5 py-3.5 font-tech text-[10px] font-semibold uppercase tracking-wider text-slate-700 transition-colors duration-200 hover:bg-red-50 hover:text-[color:var(--color-brand-red)]"
                      style={{
                        clipPath: "var(--clip-chamfer-md)",
                      }}
                    >
                      <FlaskConical className="size-3.5 shrink-0 text-[color:var(--color-brand-red)]" />

                      <span>Buka Laboratorium Visual Interaktif</span>
                    </Link>

                    {/* Existing material/pdf access */}
                    <a
                      href={module.pdfHref}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-3 flex min-h-10 w-full items-center justify-center gap-2 border border-slate-200 bg-white px-5 py-2.5 font-tech text-[9px] font-medium uppercase tracking-wider text-slate-500 transition-colors duration-200 hover:border-slate-300 hover:text-slate-700"
                      style={{
                        clipPath: "var(--clip-chamfer-sm)",
                      }}
                    >
                      <FileText className="size-3.5 shrink-0" />
                      <span>{module.materialLabel}</span>
                    </a>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}