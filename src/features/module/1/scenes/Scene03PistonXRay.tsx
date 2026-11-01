"use client";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  BookOpen,
  ChevronRight,
  Home,
  X,
} from "lucide-react";

import {
  useRouter,
} from "next/navigation";

import {
  Button,
} from "@/src/shared/components/Button";

import {
  Panel,
} from "@/src/shared/components/Panel";

import {
  TechnicalLabel,
} from "@/src/shared/components/TechnicalLabel";

import {
  SimulationHotspotLegend,
} from "@/src/features/simulation/components/SimulationHotspotLegend";

import {
  FOUNDATION_TOPICS,
  type FoundationTopic,
} from "@/src/features/simulation/data/foundationContent";

import {
  calculateFirstLawBalance,
  getEnergyState,
} from "@/src/lib/physics/firstLaw";

import {
  PistonXRayStage,
  type PistonXRayHotspotId,
} from "./PistonXRayStage";

const DEFAULT_HEAT_INPUT_KJ = 60;
const DEFAULT_WORK_OUTPUT_KJ = 40;

const FOUNDATION_ENTRIES: Array<{
  id: PistonXRayHotspotId;
  topicId: string;
  title: string;
  shortLabel: string;
  description: string;
}> = [
  {
    id: "heat-input",
    topicId: "heat",
    title: "Heat Input (Qin):",
    shortLabel: "Heat Input",
    description:
      "Microscopic energy transfer driven by temperature gradient.",
  },
  {
    id: "boundary-work",
    topicId: "boundary-work",
    title: "Boundary Work (Wout):",
    shortLabel: "Boundary Work",
    description:
      "Macroscopic energy transfer via moving boundary, where δW = P dV.",
  },
  {
    id: "system-boundary",
    topicId: "system-classification",
    title: "Closed System Boundary:",
    shortLabel: "Closed System",
    description:
      "Fixed mass system allowing only energy (heat and work) to cross.",
  },
  {
    id: "internal-energy",
    topicId: "internal-energy",
    title: "Internal Energy (ΔU):",
    shortLabel: "Internal Energy",
    description:
      "Point function representing molecular activity within the system.",
  },
];

function getFoundationTopic(
  topicId: string,
): FoundationTopic | undefined {
  return FOUNDATION_TOPICS.find(
    (topic) => topic.id === topicId,
  );
}

export function Scene03PistonXRay() {
  const router = useRouter();

  const [isPlaying, setIsPlaying] = useState(true);
  const [resetKey, setResetKey] = useState(0);

  const [selectedHotspot, setSelectedHotspot] =
    useState<PistonXRayHotspotId | null>(null);

  const [foundationOpen, setFoundationOpen] = useState(false);
  const [infoPopupOpen, setInfoPopupOpen] = useState(false);
  const [controlsVisible, setControlsVisible] = useState(true);

  const infoPopupRef = useRef<HTMLDivElement | null>(null);

  const balance = useMemo(
    () =>
      calculateFirstLawBalance({
        heatInputKJ: DEFAULT_HEAT_INPUT_KJ,
        workOutputKJ: DEFAULT_WORK_OUTPUT_KJ,
      }),
    [],
  );

  const energyState = getEnergyState(
    balance.deltaEnergyKJ,
  );

  const activeFoundationEntry =
    FOUNDATION_ENTRIES.find(
      (entry) => entry.id === selectedHotspot,
    ) ?? FOUNDATION_ENTRIES[0];

  const activeFoundationTopic = getFoundationTopic(
    activeFoundationEntry.topicId,
  );

  const handleHotspotSelect = (
    hotspot: PistonXRayHotspotId,
  ) => {
    setSelectedHotspot(hotspot);
    setInfoPopupOpen(true);
    setFoundationOpen(true);
  };

  const handleFoundationOpen = () => {
    if (!selectedHotspot) {
      setSelectedHotspot("heat-input");
    }

    setFoundationOpen(true);
  };

  const handleCloseInfoPopup = () => {
    setInfoPopupOpen(false);
  };

  const handleCloseFoundation = () => {
    setFoundationOpen(false);
  };

  const handleFoundationTopicSelect = (
    hotspot: PistonXRayHotspotId,
  ) => {
    setSelectedHotspot(hotspot);
    setInfoPopupOpen(false);
  };

  const handleReset = () => {
    setIsPlaying(true);
    setResetKey((current) => current + 1);
  };

  useEffect(() => {
    if (!infoPopupOpen) {
      return;
    }

    const handleOutsidePointerDown = (
      event: PointerEvent,
    ) => {
      const target = event.target;

      if (
        target instanceof Node &&
        infoPopupRef.current?.contains(target)
      ) {
        return;
      }

      setInfoPopupOpen(false);
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
  }, [infoPopupOpen]);

  return (
    <main className="relative h-[100dvh] min-h-[560px] w-full overflow-hidden bg-[var(--color-brand-charcoal)] text-white">
      <div className="absolute inset-0 z-0">
        <PistonXRayStage
          isPlaying={isPlaying}
          resetKey={resetKey}
          selectedHotspot={selectedHotspot}
          onHotspotSelect={handleHotspotSelect}
        />
      </div>

      <div className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-b from-slate-950/20 via-transparent to-slate-950/35" />

      <SimulationHotspotLegend />

      <header className="pointer-events-none absolute inset-x-0 top-0 z-50 px-3 pt-3 sm:px-5 sm:pt-5 lg:px-6 xl:px-8">
        <div className="relative flex items-start justify-between gap-2">
          <div className="flex min-w-0 items-start gap-2">
            <button
              type="button"
              aria-label="Back to homepage"
              onClick={() => router.push("/")}
              className="pointer-events-auto flex h-9 w-9 shrink-0 items-center justify-center border border-slate-700/90 bg-slate-950/85 text-slate-400 shadow-lg backdrop-blur-md transition-colors hover:border-slate-500 hover:bg-slate-900 hover:text-white sm:h-10 sm:w-10"
              style={{
                clipPath: "var(--clip-chamfer-sm)",
              }}
            >
              <Home size={14} strokeWidth={1.7} />
            </button>

            <div
              className="pointer-events-auto min-w-0 max-w-[72vw] border border-slate-700/80 bg-slate-950/82 px-3 py-2 backdrop-blur-md sm:max-w-[42vw] sm:px-4 sm:py-3 lg:max-w-[420px]"
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
                  MODULE 01
                </span>
              </div>

              <div className="mt-1 flex min-w-0 items-center gap-2">
                <span className="shrink-0 font-[var(--font-jetbrains-mono)] text-[8px] text-[var(--color-brand-red)] sm:text-[9px]">
                  03
                </span>

                <span className="truncate font-[var(--font-chakra-petch)] text-[8px] font-semibold uppercase tracking-[0.1em] text-slate-300 sm:text-[9px] lg:text-[10px]">
                  Piston X-Ray
                </span>
              </div>
            </div>
          </div>

          <div className="relative flex shrink-0 flex-col items-end gap-2">
            <div
              className="pointer-events-auto border border-slate-700/80 bg-slate-950/85 px-3 py-2 backdrop-blur-md sm:px-4"
              style={{
                clipPath: "var(--clip-chamfer-sm)",
              }}
            >
              <div className="flex items-center gap-3">
                <div>
                  <span className="block font-[var(--font-chakra-petch)] text-[8px] uppercase tracking-[0.14em] text-slate-500">
                    ΔU
                  </span>

                  <span className="font-[var(--font-oswald)] text-lg font-semibold text-cyan-300">
                    {balance.deltaEnergyKJ.toFixed(1)} kJ
                  </span>
                </div>

                <span className="h-7 w-px bg-slate-700" />

                <div>
                  <span className="block font-[var(--font-chakra-petch)] text-[8px] uppercase tracking-[0.14em] text-slate-500">
                    Engine
                  </span>

                  <span className="font-[var(--font-jetbrains-mono)] text-[8px] font-semibold uppercase text-red-400 sm:text-[9px]">
                    {isPlaying ? "Running" : "Paused"}
                  </span>
                </div>
              </div>
            </div>

            <button
              type="button"
              aria-label="Open thermodynamics foundation"
              aria-expanded={foundationOpen}
              onClick={handleFoundationOpen}
              className="pointer-events-auto flex h-9 w-9 items-center justify-center border border-slate-700/90 bg-slate-950/90 text-cyan-400 shadow-lg backdrop-blur-md transition-colors hover:border-cyan-500/60 hover:bg-slate-900 hover:text-cyan-300 sm:h-10 sm:w-auto sm:gap-2 sm:px-3"
              style={{
                clipPath: "var(--clip-chamfer-sm)",
              }}
            >
              <BookOpen size={13} strokeWidth={1.6} />

              <span className="hidden font-[var(--font-chakra-petch)] text-[7px] font-semibold uppercase tracking-[0.14em] text-slate-300 sm:inline">
                Foundation
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* =====================================================
          STATIC INFORMATION POPUP
      ===================================================== */}

      {infoPopupOpen && selectedHotspot && (
        <div
          ref={infoPopupRef}
          className="pointer-events-auto absolute left-1/2 top-[20%] z-[80] w-[210px] max-w-[calc(100vw-1.5rem)] -translate-x-1/2 border border-red-500/75 bg-slate-950/97 px-3 py-2.5 shadow-[0_6px_18px_rgba(0,0,0,0.42)] backdrop-blur-md lg:top-[40%]"
        >
          <div className="flex items-start justify-between gap-2">
            <span className="min-w-0 font-[var(--font-chakra-petch)] text-[8px] font-bold uppercase leading-relaxed tracking-[0.06em] text-red-400">
              {activeFoundationEntry.title}
            </span>

            <button
              type="button"
              aria-label="Close information"
              onClick={handleCloseInfoPopup}
              className="flex h-5 w-5 shrink-0 items-center justify-center border border-slate-700 bg-slate-900/80 text-slate-400 transition-colors hover:border-red-500/70 hover:text-red-300"
            >
              <X size={10} strokeWidth={1.7} />
            </button>
          </div>

          <p className="mt-1.5 font-[var(--font-jetbrains-mono)] text-[9px] leading-[1.55] text-slate-300">
            {activeFoundationEntry.description}
          </p>

          <div className="mt-2 border-t border-slate-800 pt-1.5">
            <span className="font-[var(--font-chakra-petch)] text-[7px] uppercase tracking-[0.1em] text-slate-600">
              Information · Foundation
            </span>
          </div>
        </div>
      )}

      {/* =====================================================
          FOUNDATION PANEL
      ===================================================== */}

      {foundationOpen && (
        <>
          <button
            type="button"
            aria-label="Close foundation panel"
            onClick={handleCloseFoundation}
            className="absolute inset-0 z-[65] bg-slate-950/35 backdrop-blur-[2px] lg:hidden"
          />

          <aside className="absolute right-4 top-[200px] z-[70] hidden h-[calc(100dvh-14rem)] max-h-[500px] w-[310px] max-w-[calc(100vw-2rem)] lg:block">
            <FoundationPanel
              activeEntry={activeFoundationEntry}
              activeTopic={activeFoundationTopic}
              onSelect={handleFoundationTopicSelect}
              onClose={handleCloseFoundation}
            />
          </aside>

          <aside className="absolute inset-x-0 bottom-0 z-[75] lg:hidden">
            <div className="mx-auto max-h-[58dvh] w-full max-w-3xl px-2 pb-2 sm:px-4 sm:pb-4">
              <FoundationPanel
                activeEntry={activeFoundationEntry}
                activeTopic={activeFoundationTopic}
                onSelect={handleFoundationTopicSelect}
                onClose={handleCloseFoundation}
              />
            </div>
          </aside>
        </>
      )}

      {/* =====================================================
          ENERGY LEDGER & ENGINE CONTROLS
      ===================================================== */}

      <div
        className={[
          "pointer-events-none absolute inset-x-0 bottom-3 z-50 px-3 sm:bottom-4 sm:px-5",
          foundationOpen ? "lg:pr-[330px]" : "",
        ].join(" ")}
      >
        {controlsVisible ? (
          <div className="pointer-events-auto relative mx-auto w-full max-w-[980px]">
            <button
              type="button"
              aria-expanded={controlsVisible}
              aria-controls="scene03-energy-controls"
              aria-label="Hide simulation controls"
              onClick={() => setControlsVisible(false)}
              className="group absolute left-1/2 top-0 z-[60] flex -translate-x-1/2 -translate-y-full items-center gap-1.5 border border-b-0 border-slate-700/90 bg-slate-950/95 px-3 py-1.5 shadow-lg backdrop-blur-md transition-colors hover:border-slate-500 hover:bg-slate-900"
              style={{
                clipPath: "var(--clip-chamfer-sm)",
              }}
            >
              <span className="font-[var(--font-chakra-petch)] text-[7px] font-semibold uppercase tracking-[0.14em] text-slate-400 transition-colors group-hover:text-white">
                Hide Controls
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
              id="scene03-energy-controls"
              className="grid gap-2.5 sm:gap-3 md:grid-cols-[1.45fr_0.75fr]"
            >
              <Panel
                variant="dark"
                className="border-slate-700/90 bg-slate-950/88 p-3 shadow-2xl backdrop-blur-xl sm:p-4 lg:p-5"
              >
                <div className="flex items-center justify-between gap-3">
                  <TechnicalLabel accent="cyan">
                    Energy Ledger
                  </TechnicalLabel>

                  <span className="font-[var(--font-jetbrains-mono)] text-[7px] uppercase tracking-[0.12em] text-slate-500 sm:text-[8px]">
                    First Law · kJ
                  </span>
                </div>

                <div className="mt-3 grid grid-cols-3 gap-2 sm:mt-4 sm:gap-4">
                  <EnergyMetric
                    label="Heat Input · Qin"
                    value={`+${balance.heatInputKJ.toFixed(1)}`}
                    accent="red"
                  />

                  <EnergyMetric
                    label="Work Output · Wout"
                    value={`−${balance.workOutputKJ.toFixed(1)}`}
                    accent="white"
                  />

                  <EnergyMetric
                    label="Internal Energy · ΔU"
                    value={`${balance.deltaEnergyKJ >= 0 ? "+" : ""}${balance.deltaEnergyKJ.toFixed(1)}`}
                    accent="cyan"
                  />
                </div>

                <div className="mt-3 border-t border-slate-700 pt-2.5 sm:mt-4 sm:pt-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="font-[var(--font-chakra-petch)] text-[7px] font-semibold uppercase tracking-[0.14em] text-slate-500 sm:text-[8px]">
                      First Law of Thermodynamics
                    </span>

                    <span className="font-[var(--font-jetbrains-mono)] text-[7px] uppercase text-slate-500 sm:text-[8px]">
                      {energyState}
                    </span>
                  </div>

                  <div className="mt-1.5 flex flex-wrap items-baseline gap-x-3 gap-y-1">
                    <span className="font-[var(--font-jetbrains-mono)] text-lg font-bold tracking-tight text-cyan-300 sm:text-2xl lg:text-[27px]">
                      ΔU = Qin − Wout
                    </span>

                    <span className="font-[var(--font-jetbrains-mono)] text-[8px] text-slate-400 sm:text-[9px]">
                      {balance.heatInputKJ.toFixed(1)} − {balance.workOutputKJ.toFixed(1)} = {balance.deltaEnergyKJ.toFixed(1)} kJ
                    </span>
                  </div>
                </div>
              </Panel>

              <Panel
                variant="dark"
                className="flex flex-col justify-between border-slate-700/90 bg-slate-950/88 p-3 shadow-2xl backdrop-blur-xl sm:p-4 lg:p-5"
              >
                <div>
                  <div className="flex items-center justify-between gap-3">
                    <TechnicalLabel>
                      Engine System
                    </TechnicalLabel>

                    <span
                      className={[
                        "h-1.5 w-1.5 rounded-full",
                        isPlaying
                          ? "bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.8)]"
                          : "bg-slate-600",
                      ].join(" ")}
                    />
                  </div>

                  <div className="mt-3 space-y-2 sm:mt-4">
                    <EngineReadout
                      label="Piston Motion"
                      value={isPlaying ? "Active" : "Paused"}
                    />

                    <EngineReadout
                      label="Heat Particles"
                      value={isPlaying ? "Active" : "Paused"}
                    />

                    <EngineReadout
                      label="Energy State"
                      value={energyState}
                    />
                  </div>
                </div>

                <div className="mt-3 grid grid-cols-2 gap-2 sm:mt-4 sm:grid-cols-1">
                  <Button
                    type="button"
                    size="sm"
                    variant="primary"
                    onClick={() => setIsPlaying((current) => !current)}
                  >
                    {isPlaying ? "Pause Engine" : "Run Engine"}
                  </Button>

                  <Button
                    type="button"
                    size="sm"
                    variant="secondary"
                    onClick={handleReset}
                  >
                    Reset
                  </Button>
                </div>
              </Panel>
            </div>
          </div>
        ) : (
          <button
            type="button"
            aria-expanded={controlsVisible}
            aria-controls="scene03-energy-controls"
            aria-label="Show simulation controls"
            onClick={() => setControlsVisible(true)}
            className="pointer-events-auto absolute bottom-0 left-1/2 flex -translate-x-1/2 items-center gap-2 border border-slate-700/90 bg-slate-950/92 px-4 py-2 shadow-lg backdrop-blur-md transition-all duration-200 hover:border-slate-500 hover:bg-slate-900"
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
    </main>
  );
}

type EnergyMetricProps = {
  label: string;
  value: string;
  accent: "red" | "white" | "cyan";
};

function EnergyMetric({
  label,
  value,
  accent,
}: EnergyMetricProps) {
  const valueClass = {
    red: "text-red-400",
    white: "text-white",
    cyan: "text-cyan-300",
  }[accent];

  return (
    <div className="min-w-0">
      <span className="block truncate font-[var(--font-chakra-petch)] text-[6px] font-semibold uppercase tracking-wide text-slate-500 sm:text-[8px]">
        {label}
      </span>

      <div className="mt-1 flex items-baseline gap-1">
        <span className={`font-[var(--font-oswald)] text-xl font-semibold tabular-nums sm:text-2xl lg:text-3xl ${valueClass}`}>
          {value}
        </span>

        <span className="font-[var(--font-jetbrains-mono)] text-[7px] text-slate-500 sm:text-[8px]">
          kJ
        </span>
      </div>
    </div>
  );
}

function EngineReadout({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center justify-between gap-2">
      <span className="font-[var(--font-chakra-petch)] text-[7px] uppercase tracking-wide text-slate-500 sm:text-[8px]">
        {label}
      </span>

      <span className="font-[var(--font-jetbrains-mono)] text-[8px] font-semibold uppercase text-slate-200 sm:text-[9px]">
        {value}
      </span>
    </div>
  );
}

type FoundationPanelProps = {
  activeEntry: (typeof FOUNDATION_ENTRIES)[number];
  activeTopic: FoundationTopic | undefined;
  onSelect: (
    hotspot: PistonXRayHotspotId,
  ) => void;
  onClose: () => void;
};

function FoundationPanel({
  activeEntry,
  activeTopic,
  onSelect,
  onClose,
}: FoundationPanelProps) {
  return (
    <div
      className="flex max-h-full min-h-0 flex-col overflow-hidden border border-slate-700/90 bg-slate-950/97 shadow-2xl backdrop-blur-xl"
      style={{
        clipPath: "var(--clip-chamfer-sm)",
      }}
    >
      <div className="shrink-0 border-b border-slate-800 px-3 py-2.5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <BookOpen
                size={12}
                strokeWidth={1.6}
                className="shrink-0 text-cyan-400"
              />

              <span className="font-[var(--font-chakra-petch)] text-[7px] font-semibold uppercase tracking-[0.16em] text-cyan-400">
                Foundation
              </span>
            </div>

            <span className="mt-1 block truncate font-[var(--font-oswald)] text-sm font-semibold uppercase text-white">
              First Law of Thermodynamics
            </span>

            <span className="mt-0.5 block font-[var(--font-jetbrains-mono)] text-[6px] uppercase tracking-wide text-slate-500">
              Module 01 · Scene 03
            </span>
          </div>

          <button
            type="button"
            aria-label="Close foundation"
            onClick={onClose}
            className="flex h-6 w-6 shrink-0 items-center justify-center border border-slate-700 text-slate-400 transition-colors hover:border-slate-500 hover:text-white"
          >
            <X size={12} strokeWidth={1.7} />
          </button>
        </div>
      </div>

      <div className="shrink-0 border-b border-slate-800 p-2">
        <div className="grid grid-cols-2 gap-1">
          {FOUNDATION_ENTRIES.map((entry) => {
            const active = entry.id === activeEntry.id;

            return (
              <button
                key={entry.id}
                type="button"
                onClick={() => onSelect(entry.id)}
                className={[
                  "flex min-w-0 items-center gap-1.5 border px-2 py-1.5 text-left transition-colors",
                  active
                    ? "border-cyan-400/60 bg-cyan-500/10 text-cyan-300"
                    : "border-slate-800 bg-slate-950/45 text-slate-500 hover:border-slate-600 hover:text-white",
                ].join(" ")}
              >
                <span
                  className={[
                    "h-1.5 w-1.5 shrink-0 rounded-full",
                    active ? "bg-red-500" : "bg-slate-700",
                  ].join(" ")}
                />

                <span className="min-w-0 truncate font-[var(--font-chakra-petch)] text-[6px] font-semibold uppercase tracking-[0.02em]">
                  {entry.shortLabel}
                </span>

                <ChevronRight
                  size={9}
                  className="ml-auto hidden shrink-0 sm:block"
                />
              </button>
            );
          })}
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto p-3">
        <span className="block font-[var(--font-jetbrains-mono)] text-[6px] font-semibold uppercase tracking-[0.15em] text-red-400">
          {activeTopic?.eyebrow ?? "THERMODYNAMICS"}
        </span>

        <h2 className="mt-1 font-[var(--font-oswald)] text-xl font-semibold uppercase leading-tight text-white">
          {activeEntry.title}
        </h2>

        <div className="mt-3">
          <span className="block font-[var(--font-chakra-petch)] text-[6px] font-semibold uppercase tracking-[0.12em] text-slate-600">
            Concept
          </span>

          <p className="mt-1 font-[var(--font-jetbrains-mono)] text-[7px] leading-relaxed text-slate-300">
            {activeEntry.description}
          </p>
        </div>

        {activeEntry.id === "boundary-work" && (
          <div className="mt-3 border border-slate-800 bg-slate-900/55 p-2.5">
            <span className="block font-[var(--font-chakra-petch)] text-[6px] font-semibold uppercase tracking-[0.12em] text-slate-600">
              Differential Boundary Work
            </span>

            <span className="mt-1.5 block font-[var(--font-jetbrains-mono)] text-base font-semibold text-cyan-300">
              δW = P dV
            </span>
          </div>
        )}

        {activeTopic?.terms && (
          <div className="mt-3">
            <span className="block font-[var(--font-chakra-petch)] text-[6px] font-semibold uppercase tracking-[0.12em] text-slate-600">
              Key Terms
            </span>

            <div className="mt-1.5 flex flex-wrap gap-1">
              {activeTopic.terms.map((term) => (
                <span
                  key={term}
                  className="border border-slate-800 bg-slate-950 px-1.5 py-1 font-[var(--font-jetbrains-mono)] text-[6px] text-slate-400"
                >
                  {term}
                </span>
              ))}
            </div>
          </div>
        )}

        {activeTopic?.takeaway && (
          <div className="mt-3 border-l-2 border-cyan-400 bg-cyan-500/5 px-2.5 py-2">
            <span className="block font-[var(--font-chakra-petch)] text-[6px] font-semibold uppercase tracking-[0.12em] text-cyan-500">
              Takeaway
            </span>

            <p className="mt-1 font-[var(--font-jetbrains-mono)] text-[6px] leading-relaxed text-slate-400">
              {activeTopic.takeaway}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}