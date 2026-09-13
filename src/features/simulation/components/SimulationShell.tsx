"use client";

import {
  useState,
  type ReactNode,
} from "react";

import { Home } from "lucide-react";
import { useRouter } from "next/navigation";

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
  const router = useRouter();

  const [
    controlsOpen,
    setControlsOpen,
  ] = useState(false);

  const handleBackHome = () => {
    setControlsOpen(false);
    router.push("/");
  };

  return (
    <main className="relative h-[100dvh] min-h-[560px] w-full overflow-hidden bg-[var(--color-brand-charcoal)] text-white">
      {/* =====================================================
          3D EXPERIENCE
      ===================================================== */}

      <div className="absolute inset-0 z-0">
        {children}
      </div>

      {/* =====================================================
          GLOBAL OVERLAY
      ===================================================== */}

      <div className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-b from-slate-950/15 via-transparent to-slate-950/22" />

      {/* =====================================================
          HEADER
      ===================================================== */}

      <header className="pointer-events-none absolute inset-x-0 top-0 z-50 px-3 pt-3 sm:px-5 sm:pt-5 lg:px-6 xl:px-8">
        <div className="relative flex items-start justify-between gap-2">
          {/* =================================================
              LEFT HEADER
          ================================================= */}

          <div className="flex min-w-0 items-start gap-2">
            {/* HOME */}

            <button
              type="button"
              aria-label="Back to homepage"
              onClick={handleBackHome}
              className="pointer-events-auto flex h-9 w-9 shrink-0 items-center justify-center border border-slate-700/90 bg-slate-950/78 text-slate-400 shadow-lg backdrop-blur-md transition-all duration-200 hover:border-slate-500 hover:bg-slate-900 hover:text-white focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-red)]/70 sm:h-10 sm:w-10"
              style={{
                clipPath:
                  "var(--clip-chamfer-sm)",
              }}
            >
              <Home
                size={14}
                strokeWidth={1.7}
              />
            </button>

            {/* BRAND */}

            <div
              className="pointer-events-auto min-w-0 max-w-[72vw] border border-slate-700/80 bg-slate-950/72 px-3 py-2 backdrop-blur-md sm:max-w-[42vw] sm:px-4 sm:py-3 lg:max-w-[420px]"
              style={{
                clipPath:
                  "var(--clip-chamfer-sm)",
              }}
            >
              <div className="flex min-w-0 items-center gap-2 sm:gap-3">
                <span className="shrink-0 font-[var(--font-oswald)] text-base font-bold tracking-tight text-white sm:text-lg lg:text-xl">
                  VELOTHERM
                </span>

                <span className="h-3.5 w-px shrink-0 bg-slate-600 sm:h-4" />

                <span className="truncate font-[var(--font-chakra-petch)] text-[8px] font-semibold uppercase tracking-[0.15em] text-slate-400 sm:text-[10px] lg:text-xs">
                  {moduleLabel}
                </span>
              </div>

              <div className="mt-1 flex min-w-0 items-center gap-2">
                <span className="shrink-0 font-[var(--font-jetbrains-mono)] text-[8px] text-[var(--color-brand-red)] sm:text-[9px]">
                  {sceneNumber}
                </span>

                <span className="truncate font-[var(--font-chakra-petch)] text-[8px] font-semibold uppercase tracking-[0.1em] text-slate-300 sm:text-[9px] lg:text-[10px]">
                  {sceneLabel}
                </span>
              </div>
            </div>
          </div>

          {/* =================================================
              TOP RIGHT STATUS
          ================================================= */}

          {topRight && (
            <div className="pointer-events-auto hidden max-w-[30vw] shrink-0 sm:block lg:max-w-none">
              {topRight}
            </div>
          )}
        </div>
      </header>

      {/* =====================================================
          CONTROL UI
          
          Layer order:

          z-70 → drawer
          z-65 → drawer backdrop
          z-55 → scene-specific graph overlays
          z-50 → header / navigator / control trigger
          z-10 → screen overlay
          z-0  → 3D canvas
      ===================================================== */}

      {bottomContent && (
        <>
          {/* =================================================
              DESKTOP CONTROL HUD
              ≥ 1280px
          ================================================= */}

          <div className="pointer-events-none absolute inset-x-0 bottom-0 z-50 hidden min-[1280px]:flex min-[1280px]:items-end min-[1280px]:justify-center">
            <div className="pointer-events-auto flex w-full max-w-[1160px] items-end justify-center px-2 pb-0">
              <div
                className="w-full origin-bottom"
                style={{
                  transform:
                    "scale(0.78)",
                  transformOrigin:
                    "bottom center",
                }}
              >
                {bottomContent}
              </div>
            </div>
          </div>

          {/* =================================================
              TABLET / MOBILE CONTROL TRIGGER
          ================================================= */}

          {!controlsOpen && (
            <div className="absolute bottom-[76px] right-3 z-50 min-[1280px]:hidden sm:right-5">
              <button
                type="button"
                aria-expanded={false}
                aria-controls="simulation-controls-drawer"
                onClick={() =>
                  setControlsOpen(true)
                }
                className="flex items-center gap-2 border border-slate-600/90 bg-slate-950/94 px-3 py-2.5 shadow-xl backdrop-blur-md transition-all duration-200 hover:border-slate-400 hover:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-red)]/70 sm:px-4 sm:py-3"
                style={{
                  clipPath:
                    "var(--clip-chamfer-sm)",
                }}
              >
                <span className="flex h-5 w-5 items-center justify-center border border-slate-500 text-slate-200">
                  <span className="font-[var(--font-jetbrains-mono)] text-[10px] leading-none">
                    ≡
                  </span>
                </span>

                <span className="font-[var(--font-chakra-petch)] text-[8px] font-semibold uppercase tracking-[0.16em] text-white sm:text-[9px]">
                  Controls
                </span>
              </button>
            </div>
          )}

          {/* =================================================
              DRAWER BACKDROP
          ================================================= */}

          {controlsOpen && (
            <button
              type="button"
              aria-label="Close simulation controls"
              onClick={() =>
                setControlsOpen(false)
              }
              className="absolute inset-0 z-[65] bg-slate-950/30 backdrop-blur-[2px] min-[1280px]:hidden"
            />
          )}

          {/* =================================================
              TABLET / MOBILE DRAWER
          ================================================= */}

          <aside
            id="simulation-controls-drawer"
            aria-hidden={!controlsOpen}
            className={[
              "absolute inset-x-0 bottom-0 z-[70] min-[1280px]:hidden",
              "transform-gpu transition-transform duration-300 ease-out",
              controlsOpen
                ? "translate-y-0"
                : "pointer-events-none translate-y-full",
            ].join(" ")}
          >
            <div className="mx-auto w-full max-w-3xl px-2 pb-2 sm:px-4 sm:pb-4">
              <div
                className="overflow-hidden border border-slate-700/90 bg-slate-950/97 shadow-[0_-18px_50px_rgba(0,0,0,0.5)] backdrop-blur-xl"
                style={{
                  clipPath:
                    "var(--clip-chamfer-sm)",
                }}
              >
                {/* DRAWER HEADER */}

                <div className="flex items-center justify-between gap-3 border-b border-slate-800 px-3 py-2.5 sm:px-4 sm:py-3">
                  <div className="min-w-0">
                    <span className="block font-[var(--font-chakra-petch)] text-[8px] font-semibold uppercase tracking-[0.18em] text-[var(--color-brand-red)]">
                      Simulation Controls
                    </span>

                    <span className="mt-0.5 block truncate font-[var(--font-jetbrains-mono)] text-[7px] uppercase tracking-wide text-slate-500 sm:text-[8px]">
                      {sceneNumber} ·{" "}
                      {sceneLabel}
                    </span>
                  </div>

                  <button
                    type="button"
                    aria-label="Close simulation controls"
                    onClick={() =>
                      setControlsOpen(false)
                    }
                    className="flex h-7 w-7 shrink-0 items-center justify-center border border-slate-700 text-slate-400 transition-colors hover:border-slate-500 hover:text-white sm:h-8 sm:w-8"
                  >
                    <span className="font-[var(--font-jetbrains-mono)] text-sm leading-none">
                      ×
                    </span>
                  </button>
                </div>

                {/* DRAWER CONTENT */}

                <div className="max-h-[42dvh] overflow-y-auto overscroll-contain px-2 py-2 sm:max-h-[46dvh] sm:px-3 sm:py-3">
                  <div
                    className="origin-bottom"
                    style={{
                      transform:
                        "scale(0.86)",
                      transformOrigin:
                        "bottom center",
                    }}
                  >
                    {bottomContent}
                  </div>
                </div>
              </div>
            </div>
          </aside>
        </>
      )}
    </main>
  );
}