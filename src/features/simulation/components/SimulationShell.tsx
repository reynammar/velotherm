"use client";

import type { ReactNode } from "react";

type SimulationShellProps = {
  moduleLabel: string;
  sceneLabel: string;
  sceneNumber: string;
  topRight?: ReactNode;
  bottomContent?: ReactNode;
  children: ReactNode;
};

export function SimulationShell({
  moduleLabel,
  sceneLabel,
  sceneNumber,
  topRight,
  bottomContent,
  children,
}: SimulationShellProps) {
  return (
    <main className="relative h-[100dvh] min-h-[560px] w-full overflow-hidden bg-[var(--color-brand-charcoal)] text-white">
      <div className="absolute inset-0">
        {children}
      </div>

      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-slate-950/45 via-transparent to-slate-950/55" />

      <header className="pointer-events-none absolute left-4 right-4 top-4 z-30 flex items-start justify-between gap-4 sm:left-6 sm:right-6 sm:top-6 lg:left-8 lg:right-8">
        <div
          className="max-w-[calc(100%-100px)] border border-slate-700/80 bg-slate-950/65 px-3 py-2 backdrop-blur-sm sm:px-4 sm:py-3"
          style={{
            clipPath:
              "var(--clip-chamfer-sm)",
          }}
        >
          <div className="flex items-center gap-3">
            <span className="font-[var(--font-oswald)] text-lg font-bold tracking-tight text-white sm:text-xl">
              VELOTHERM
            </span>

            <span className="h-4 w-px bg-slate-600" />

            <span className="font-[var(--font-chakra-petch)] text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400 sm:text-xs">
              {moduleLabel}
            </span>
          </div>

          <div className="mt-1 flex items-center gap-2">
            <span className="font-[var(--font-jetbrains-mono)] text-[9px] text-[var(--color-brand-red)]">
              {sceneNumber}
            </span>

            <span className="font-[var(--font-chakra-petch)] text-[9px] font-semibold uppercase tracking-[0.12em] text-slate-300 sm:text-[10px]">
              {sceneLabel}
            </span>
          </div>
        </div>

        {topRight && (
          <div className="pointer-events-auto shrink-0">
            {topRight}
          </div>
        )}
      </header>

      {bottomContent && (
        <div className="absolute inset-x-3 bottom-3 z-30 sm:inset-x-6 sm:bottom-6 lg:inset-x-8 lg:bottom-8">
          <div className="mx-auto max-w-7xl">
            {bottomContent}
          </div>
        </div>
      )}
    </main>
  );
}