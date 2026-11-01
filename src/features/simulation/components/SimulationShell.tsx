"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";

import {
  BookOpen,
  Home,
  X,
} from "lucide-react";

import {
  useRouter,
} from "next/navigation";

import {
  FoundationLayer,
} from "./FoundationLayer";

import {
  SimulationHotspotLegend,
} from "./SimulationHotspotLegend";

import {
  SIMULATION_INFORMATION_EVENT,
  type SimulationInformationEventDetail,
} from "@/src/features/simulation/utils/simulationHotspotEvents";

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

  /* =======================================================
     CONTROL DRAWER
  ======================================================= */

  const [
    controlsOpen,
    setControlsOpen,
  ] = useState(false);

  /* =======================================================
     DESKTOP CONTROL HUD
  ======================================================= */

  const [
    desktopControlsOpen,
    setDesktopControlsOpen,
  ] = useState(true);

  /* =======================================================
     FOUNDATION
  ======================================================= */

  const [
    foundationOpen,
    setFoundationOpen,
  ] = useState(false);

  const [
    foundationTopicId,
    setFoundationTopicId,
  ] = useState<string | null>(null);

  const [
    foundationRequestKey,
    setFoundationRequestKey,
  ] = useState(0);

  /* =======================================================
     INFORMATION POPUP
  ======================================================= */

  const [
    informationPopup,
    setInformationPopup,
  ] = useState<SimulationInformationEventDetail | null>(
    null,
  );

  const informationPopupRef =
    useRef<HTMLDivElement | null>(null);

  const handleBackHome = () => {
    setControlsOpen(false);
    setDesktopControlsOpen(true);
    setFoundationOpen(false);
    setInformationPopup(null);

    router.push("/");
  };

  const handleOpenFoundation = () => {
    setFoundationTopicId(null);

    setFoundationOpen(true);

    setControlsOpen(false);
  };

  const handleCloseFoundation = () => {
    setFoundationOpen(false);
  };

  const handleCloseInformationPopup = () => {
    setInformationPopup(null);
  };

  const handleInformationSelect = useCallback(
    (
      detail: SimulationInformationEventDetail,
    ) => {
      setInformationPopup(detail);

      setFoundationTopicId(
        detail.topicId,
      );

      setFoundationRequestKey(
        (current) => current + 1,
      );

      setFoundationOpen(true);
      setControlsOpen(false);
    },
    [],
  );

  /* =======================================================
     INFORMATION EVENT LISTENER

     Receives information from EngineInformationMarkers
     inside the Three.js canvas.
  ======================================================= */

  useEffect(() => {
    const handleInformationEvent = (
      event: Event,
    ) => {
      const customEvent = event as CustomEvent<
        SimulationInformationEventDetail
      >;

      const detail = customEvent.detail;

      if (
        !detail ||
        typeof detail.topicId !== "string" ||
        typeof detail.title !== "string" ||
        typeof detail.description !== "string"
      ) {
        return;
      }

      handleInformationSelect(detail);
    };

    window.addEventListener(
      SIMULATION_INFORMATION_EVENT,
      handleInformationEvent,
    );

    return () => {
      window.removeEventListener(
        SIMULATION_INFORMATION_EVENT,
        handleInformationEvent,
      );
    };
  }, [handleInformationSelect]);

  /* =======================================================
     INFORMATION POPUP OUTSIDE CLICK

     Closing this popup does not close Foundation.
  ======================================================= */

  useEffect(() => {
    if (!informationPopup) {
      return;
    }

    const handleOutsidePointerDown = (
      event: PointerEvent,
    ) => {
      const target = event.target;

      if (
        target instanceof Node &&
        informationPopupRef.current?.contains(target)
      ) {
        return;
      }

      setInformationPopup(null);
    };

    document.addEventListener(
      "pointerdown",
      handleOutsidePointerDown,
      true,
    );

    return () => {
      document.removeEventListener(
        "pointerdown",
        handleOutsidePointerDown,
        true,
      );
    };
  }, [informationPopup]);

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

      <SimulationHotspotLegend />

      {/* =====================================================
          HEADER
      ===================================================== */}

      <header className="pointer-events-none absolute inset-x-0 top-0 z-50 px-3 pt-3 sm:px-5 sm:pt-5 lg:px-6 xl:px-8">
        <div className="relative flex items-start justify-between gap-2">
          {/* =================================================
              LEFT HEADER
          ================================================= */}

          <div className="flex min-w-0 items-start gap-2">
            {/* =================================================
                HOME
            ================================================= */}

            <button
              type="button"
              aria-label="Back to homepage"
              onClick={handleBackHome}
              className="pointer-events-auto flex h-9 w-9 shrink-0 items-center justify-center border border-slate-700/90 bg-slate-950/78 text-slate-400 shadow-lg backdrop-blur-md transition-all duration-200 hover:border-slate-500 hover:bg-slate-900 hover:text-white focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-red)]/70 sm:h-10 sm:w-10"
              style={{
                clipPath: "var(--clip-chamfer-sm)",
              }}
            >
              <Home
                size={14}
                strokeWidth={1.7}
              />
            </button>

            {/* =================================================
                BRAND
            ================================================= */}

            <div
              className="pointer-events-auto min-w-0 max-w-[72vw] border border-slate-700/80 bg-slate-950/72 px-3 py-2 backdrop-blur-md sm:max-w-[42vw] sm:px-4 sm:py-3 lg:max-w-[420px]"
              style={{
                clipPath: "var(--clip-chamfer-sm)",
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

          <div className="relative flex shrink-0 flex-col items-end">
            {topRight && (
              <div className="pointer-events-auto hidden max-w-[30vw] sm:block lg:max-w-none">
                {topRight}
              </div>
            )}

            <button
              type="button"
              aria-label="Open thermodynamics foundation"
              aria-expanded={foundationOpen}
              onClick={handleOpenFoundation}
              className="pointer-events-auto mt-2 flex h-9 w-9 items-center justify-center border border-slate-700/90 bg-slate-950/90 text-cyan-400 shadow-lg backdrop-blur-md transition-all duration-200 hover:border-cyan-500/60 hover:bg-slate-900 hover:text-cyan-300 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 sm:h-10 sm:w-auto sm:gap-2 sm:px-3"
              style={{
                clipPath: "var(--clip-chamfer-sm)",
              }}
            >
              <BookOpen
                size={13}
                strokeWidth={1.6}
              />

              <span className="hidden font-[var(--font-chakra-petch)] text-[7px] font-semibold uppercase tracking-[0.14em] text-slate-300 sm:inline">
                Foundation
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* =====================================================
          STATIC INFORMATION POPUP

          This popup is rendered in screen space.
          It does not follow the 3D component position.
      ===================================================== */}

      {informationPopup && (
        <div className="pointer-events-none absolute inset-x-0 top-[38%] z-[80] flex justify-center px-3">
          <div
            id="simulation-information-popup"
            ref={informationPopupRef}
            className="pointer-events-auto w-[210px] max-w-[calc(100vw-1.5rem)] border border-red-500/75 bg-slate-950/97 px-3 py-2.5 shadow-[0_6px_18px_rgba(0,0,0,0.42)] backdrop-blur-md"
          >
            <div className="flex items-start justify-between gap-2">
              <span className="min-w-0 font-[var(--font-chakra-petch)] text-[8px] font-bold uppercase leading-relaxed tracking-[0.06em] text-red-400">
                {informationPopup.title}
              </span>

              <button
                type="button"
                aria-label="Close information"
                onClick={handleCloseInformationPopup}
                className="flex h-5 w-5 shrink-0 items-center justify-center border border-slate-700 bg-slate-900/80 text-slate-400 transition-colors hover:border-red-500/70 hover:text-red-300"
              >
                <X
                  size={10}
                  strokeWidth={1.7}
                />
              </button>
            </div>

            <p className="mt-1.5 font-[var(--font-jetbrains-mono)] text-[9px] leading-[1.55] text-slate-300">
              {informationPopup.description}
            </p>

            <div className="mt-2 border-t border-slate-800 pt-1.5">
              <span className="font-[var(--font-chakra-petch)] text-[7px] uppercase tracking-[0.1em] text-slate-600">
                Information · Foundation
              </span>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================
          FOUNDATION LAYER
      ===================================================== */}

      <FoundationLayer
        key={sceneNumber}
        moduleLabel={moduleLabel}
        sceneNumber={sceneNumber}
        sceneLabel={sceneLabel}
        open={foundationOpen}
        preferredTopicId={foundationTopicId}
        preferredTopicRequestKey={foundationRequestKey}
        onClose={handleCloseFoundation}
      />

      {/* =====================================================
          CONTROL UI

          Layer order:

          z-70 → mobile/tablet drawer
          z-65 → drawer backdrop
          z-60 → desktop foundation
          z-50 → header / controls
          z-10 → global overlay
          z-0  → 3D canvas
      ===================================================== */}

      {bottomContent && (
        <>
          {/* =================================================
              DESKTOP CONTROL HUD
              ≥ 1280px
          ================================================= */}

          <div className="pointer-events-none absolute inset-x-0 bottom-0 z-50 hidden min-[1280px]:block">
            <div className="mx-auto flex w-full max-w-[1160px] items-end justify-center px-2">
              {desktopControlsOpen ? (
                <div className="pointer-events-auto relative w-full">
                  <div
                    className="relative w-full origin-bottom"
                    style={{
                      transform: "scale(0.78)",
                      transformOrigin: "bottom center",
                    }}
                  >
                    <button
                      type="button"
                      aria-expanded={desktopControlsOpen}
                      aria-controls="desktop-simulation-controls"
                      aria-label="Hide simulation controls"
                      onClick={() =>
                        setDesktopControlsOpen(false)
                      }
                      className="group absolute left-1/2 top-0 z-[60] flex -translate-x-1/2 -translate-y-full items-center gap-1.5 border border-b-0 border-slate-700/90 bg-slate-950/95 px-3 py-1.5 shadow-lg backdrop-blur-md transition-colors hover:border-slate-500 hover:bg-slate-900"
                      style={{
                        clipPath: "var(--clip-chamfer-sm)",
                      }}
                    >
                      <span className="font-[var(--font-chakra-petch)] text-[7px] font-semibold uppercase tracking-[0.14em] text-slate-400 transition-colors group-hover:text-white">
                        Hide
                      </span>

                      <svg
                        aria-hidden="true"
                        viewBox="0 0 12 12"
                        className="h-2.5 w-2.5 text-slate-500 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:text-slate-200"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                      >
                        <path d="M2.5 7.5 6 4l3.5 3.5" />
                      </svg>
                    </button>

                    <div
                      id="desktop-simulation-controls"
                      className="w-full"
                    >
                      {bottomContent}
                    </div>
                  </div>
                </div>
              ) : (
                <button
                  id="desktop-simulation-controls-show"
                  type="button"
                  aria-expanded={desktopControlsOpen}
                  aria-controls="desktop-simulation-controls"
                  aria-label="Show simulation controls"
                  onClick={() =>
                    setDesktopControlsOpen(true)
                  }
                  className="pointer-events-auto absolute bottom-1 left-1/2 flex -translate-x-1/2 items-center gap-2 border border-slate-700/90 bg-slate-950/92 px-4 py-2 shadow-lg backdrop-blur-md transition-all duration-200 hover:border-slate-500 hover:bg-slate-900"
                  style={{
                    clipPath: "var(--clip-chamfer-sm)",
                  }}
                >
                  <svg
                    aria-hidden="true"
                    viewBox="0 0 12 12"
                    className="h-2.5 w-2.5 text-slate-500"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  >
                    <path d="m2.5 4.5 3.5 3.5 3.5-3.5" />
                  </svg>

                  <span className="font-[var(--font-chakra-petch)] text-[7px] font-semibold uppercase tracking-[0.14em] text-slate-400">
                    Show Controls
                  </span>
                </button>
              )}
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
                  clipPath: "var(--clip-chamfer-sm)",
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
                  clipPath: "var(--clip-chamfer-sm)",
                }}
              >
                <div className="flex items-center justify-between gap-3 border-b border-slate-800 px-3 py-2.5 sm:px-4 sm:py-3">
                  <div className="min-w-0">
                    <span className="block font-[var(--font-chakra-petch)] text-[8px] font-semibold uppercase tracking-[0.18em] text-[var(--color-brand-red)]">
                      Simulation Controls
                    </span>

                    <span className="mt-0.5 block truncate font-[var(--font-jetbrains-mono)] text-[7px] uppercase tracking-wide text-slate-500 sm:text-[8px]">
                      {sceneNumber} · {sceneLabel}
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

                <div className="max-h-[42dvh] overflow-y-auto overscroll-contain px-2 py-2 sm:max-h-[46dvh] sm:px-3 sm:py-3">
                  <div
                    className="origin-bottom"
                    style={{
                      transform: "scale(0.86)",
                      transformOrigin: "bottom center",
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