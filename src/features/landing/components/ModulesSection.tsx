import Link from "next/link";
import { ArrowRight, BatteryCharging, Bolt, Box, FileText } from "lucide-react";

import { landingModules } from "../data/landingData";

const moduleIcons = [Box, Bolt, BatteryCharging];

export function ModulesSection() {
  return (
    <section
      id="modules"
      className="border-b border-slate-200 bg-white"
    >
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
        <div className="mx-auto mb-14 max-w-3xl text-center">
          <div
            className="mb-3 inline-flex items-center gap-2 border border-red-200 bg-red-50 px-4 py-1.5 font-[var(--font-chakra-petch)] text-[10px] font-bold uppercase tracking-wider text-[color:var(--color-brand-red)]"
            style={{
              clipPath: "var(--clip-chamfer-sm)",
            }}
          >
            <span>◈</span>
            Engineering Learning Curriculum
          </div>

          <h2 className="font-[var(--font-oswald)] text-3xl font-bold uppercase tracking-tight text-[color:var(--color-brand-charcoal)] sm:text-5xl">
            3 Core{" "}
            <span className="text-[color:var(--color-brand-red)]">
              Learning Modules
            </span>
          </h2>

          <p className="mt-4 text-sm leading-relaxed text-[color:var(--color-brand-muted)] sm:text-base">
            A structured thermodynamics curriculum connected directly to
            interactive simulation scenes and automotive engineering
            applications.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {landingModules.map((module, index) => {
            const Icon = moduleIcons[index];

            return (
              <article
                key={module.number}
                className="group flex flex-col border-2 border-slate-200 bg-[color:var(--color-brand-bg)] p-6 shadow-[var(--shadow-card)] transition-all duration-300 hover:-translate-y-1 hover:border-[color:var(--color-brand-red)]/50 hover:shadow-[var(--shadow-card-hover)] sm:p-8"
                style={{
                  clipPath: "var(--clip-chamfer-lg)",
                }}
              >
                <div className="flex items-center justify-between gap-4">
                  <div
                    className="flex size-12 items-center justify-center bg-[color:var(--color-brand-charcoal)] text-white transition-colors duration-300 group-hover:bg-[color:var(--color-brand-red)]"
                    style={{
                      clipPath: "var(--clip-chamfer-sm)",
                    }}
                  >
                    <Icon className="size-6" />
                  </div>

                  <span
                    className="bg-red-100 px-3 py-1 font-[var(--font-chakra-petch)] text-[10px] font-bold uppercase tracking-wider text-[color:var(--color-brand-red)]"
                    style={{
                      clipPath: "var(--clip-chamfer-sm)",
                    }}
                  >
                    Module {module.number}
                  </span>
                </div>

                <h3 className="mt-6 font-[var(--font-oswald)] text-2xl font-bold uppercase leading-tight text-[color:var(--color-brand-charcoal)] transition-colors group-hover:text-[color:var(--color-brand-red)]">
                  {module.title}
                </h3>

                <p className="mt-4 text-sm leading-relaxed text-[color:var(--color-brand-muted)]">
                  {module.description}
                </p>

                <div className="mt-6 flex flex-wrap gap-2">
                  {module.tags.map((tag) => (
                    <span
                      key={tag.label}
                      className="inline-flex items-center gap-1.5 border border-slate-300 bg-white px-2.5 py-1.5 font-[var(--font-chakra-petch)] text-[10px] font-semibold text-slate-700"
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

                <div className="mt-8 border-t border-slate-200 pt-6">
                  <div className="grid gap-3 sm:grid-cols-2">
                    <Link
                      href={module.href}
                      className="group/button flex min-h-11 items-center justify-between gap-3 bg-[color:var(--color-brand-charcoal)] px-4 py-3 font-[var(--font-chakra-petch)] text-[10px] font-bold uppercase tracking-wider text-white transition-colors hover:bg-[color:var(--color-brand-red)] sm:px-5"
                      style={{
                        clipPath: "var(--clip-chamfer-md)",
                      }}
                    >
                      <span>{module.simulationLabel}</span>

                      <ArrowRight className="size-4 shrink-0 transition-transform group-hover/button:translate-x-1" />
                    </Link>

                    <a
                      href={module.pdfHref}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group/pdf flex min-h-11 items-center justify-between gap-3 bg-slate-200/70 px-4 py-3 font-[var(--font-chakra-petch)] text-[10px] font-semibold uppercase tracking-wider text-slate-700 transition-colors hover:bg-red-50 hover:text-[color:var(--color-brand-red)] sm:px-5"
                      style={{
                        clipPath: "var(--clip-chamfer-md)",
                      }}
                    >
                      <span>{module.materialLabel}</span>

                      <FileText className="size-4 shrink-0 transition-transform group-hover/pdf:-translate-y-0.5" />
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