"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import { Button } from "@/src/shared/components/Button";
import { Panel } from "@/src/shared/components/Panel";
import { TechnicalLabel } from "@/src/shared/components/TechnicalLabel";

import {
  SimulationCanvas,
} from "@/src/features/simulation/components/SimulationCanvas";

import {
  EngineMechanism,
} from "@/src/features/simulation/components/EngineMechanism";

import {
  SimulationShell,
} from "@/src/features/simulation/components/SimulationShell";

import type {
  CarFocusComponent,
} from "@/src/features/simulation/components/CarModel";

const DEFAULT_PLAYBACK_RATE =
  0.8;

const MIN_PLAYBACK_RATE =
  0.35;

const MAX_PLAYBACK_RATE =
  1.8;

const CYCLE_DURATION_MS =
  4000;

type InspectionSelection =
  | CarFocusComponent
  | null;

type RelationshipInfo = {
  title: string;

  shortTitle: string;

  category: string;

  connected: string[];

  role: string;
};

type QuickSelectItem = {
  component: CarFocusComponent;

  label: string;

  shortLabel: string;
};

const QUICK_SELECT_ITEMS: QuickSelectItem[] =
  [
    {
      component:
        "piston1",
      label: "Piston 01",
      shortLabel: "P01",
    },
    {
      component:
        "rod1",
      label:
        "Connecting Rod 01",
      shortLabel: "R01",
    },
    {
      component:
        "piston2",
      label: "Piston 02",
      shortLabel: "P02",
    },
    {
      component:
        "rod2",
      label:
        "Connecting Rod 02",
      shortLabel: "R02",
    },
    {
      component:
        "piston3",
      label: "Piston 03",
      shortLabel: "P03",
    },
    {
      component:
        "rod3",
      label:
        "Connecting Rod 03",
      shortLabel: "R03",
    },
    {
      component:
        "piston4",
      label: "Piston 04",
      shortLabel: "P04",
    },
    {
      component:
        "rod4",
      label:
        "Connecting Rod 04",
      shortLabel: "R04",
    },
    {
      component:
        "crankshaft",
      label:
        "Crankshaft",
      shortLabel: "CRANK",
    },
  ];

function getRelationshipInfo(
  component:
    | InspectionSelection,
): RelationshipInfo {
  switch (component) {
    case "piston1":
      return {
        title: "PISTON 01",
        shortTitle: "P01",
        category:
          "RECIPROCATING PART",
        connected: [
          "CONNECTING ROD 01",
          "CRANKSHAFT",
        ],
        role:
          "Transfers linear piston motion through the connecting rod.",
      };

    case "piston2":
      return {
        title: "PISTON 02",
        shortTitle: "P02",
        category:
          "RECIPROCATING PART",
        connected: [
          "CONNECTING ROD 02",
          "CRANKSHAFT",
        ],
        role:
          "Transfers linear piston motion through the connecting rod.",
      };

    case "piston3":
      return {
        title: "PISTON 03",
        shortTitle: "P03",
        category:
          "RECIPROCATING PART",
        connected: [
          "CONNECTING ROD 03",
          "CRANKSHAFT",
        ],
        role:
          "Transfers linear piston motion through the connecting rod.",
      };

    case "piston4":
      return {
        title: "PISTON 04",
        shortTitle: "P04",
        category:
          "RECIPROCATING PART",
        connected: [
          "CONNECTING ROD 04",
          "CRANKSHAFT",
        ],
        role:
          "Transfers linear piston motion through the connecting rod.",
      };

    case "rod1":
      return {
        title:
          "CONNECTING ROD 01",
        shortTitle: "R01",
        category: "LINKAGE",
        connected: [
          "PISTON 01",
          "CRANKSHAFT",
        ],
        role:
          "Transfers piston motion toward the crankshaft.",
      };

    case "rod2":
      return {
        title:
          "CONNECTING ROD 02",
        shortTitle: "R02",
        category: "LINKAGE",
        connected: [
          "PISTON 02",
          "CRANKSHAFT",
        ],
        role:
          "Transfers piston motion toward the crankshaft.",
      };

    case "rod3":
      return {
        title:
          "CONNECTING ROD 03",
        shortTitle: "R03",
        category: "LINKAGE",
        connected: [
          "PISTON 03",
          "CRANKSHAFT",
        ],
        role:
          "Transfers piston motion toward the crankshaft.",
      };

    case "rod4":
      return {
        title:
          "CONNECTING ROD 04",
        shortTitle: "R04",
        category: "LINKAGE",
        connected: [
          "PISTON 04",
          "CRANKSHAFT",
        ],
        role:
          "Transfers piston motion toward the crankshaft.",
      };

    case "crankshaft":
      return {
        title: "CRANKSHAFT",
        shortTitle: "CRANK",
        category:
          "ROTATING PART",
        connected: [
          "PISTON 01",
          "PISTON 02",
          "PISTON 03",
          "PISTON 04",
        ],
        role:
          "Coordinates piston motion and converts it into rotational motion.",
      };

    case "engine":
      return {
        title: "ENGINE",
        shortTitle: "ENGINE",
        category:
          "ENGINE SYSTEM",
        connected: [
          "PISTON 01–04",
          "CONNECTING ROD 01–04",
          "CRANKSHAFT",
        ],
        role:
          "Contains the main reciprocating and rotating mechanism.",
      };

    default:
      return {
        title: "ENGINE",
        shortTitle: "ENGINE",
        category:
          "ENGINE SYSTEM",
        connected: [
          "PISTON 01–04",
          "CONNECTING ROD 01–04",
          "CRANKSHAFT",
        ],
        role:
          "Select a component to inspect its mechanical relationship.",
      };
  }
}

function getCycleStage(
  progress: number,
) {
  if (progress < 0.25) {
    return "INTAKE";
  }

  if (progress < 0.5) {
    return "COMPRESSION";
  }

  if (progress < 0.75) {
    return "POWER";
  }

  return "EXHAUST";
}

function isEngineInternal(
  component:
    | InspectionSelection,
) {
  return (
    component ===
      "crankshaft" ||
    component ===
      "piston1" ||
    component ===
      "rod1" ||
    component ===
      "piston2" ||
    component ===
      "rod2" ||
    component ===
      "piston3" ||
    component ===
      "rod3" ||
    component ===
      "piston4" ||
    component ===
      "rod4"
  );
}

export function Scene09InternalEngineARView() {
  const [
    isPlaying,
    setIsPlaying,
  ] = useState(false);

  const [
    playbackRate,
    setPlaybackRate,
  ] = useState(
    DEFAULT_PLAYBACK_RATE,
  );

  const [
    cycleProgress,
    setCycleProgress,
  ] = useState(0);

  const [
    selectedComponent,
    setSelectedComponent,
  ] =
    useState<InspectionSelection>(
      null,
    );

  const [
    internalView,
    setInternalView,
  ] = useState(false);

  const [
    resetKey,
    setResetKey,
  ] = useState(0);

  useEffect(() => {
    if (!isPlaying) {
      return;
    }

    let animationFrameId = 0;

    let previousTimestamp:
      | number
      | null = null;

    const animate = (
      timestamp: number,
    ) => {
      if (
        previousTimestamp ===
        null
      ) {
        previousTimestamp =
          timestamp;
      }

      const delta =
        timestamp -
        previousTimestamp;

      previousTimestamp =
        timestamp;

      setCycleProgress(
        (current) =>
          (
            current +
            (delta /
              CYCLE_DURATION_MS) *
              playbackRate
          ) % 1,
      );

      animationFrameId =
        requestAnimationFrame(
          animate,
        );
    };

    animationFrameId =
      requestAnimationFrame(
        animate,
      );

    return () => {
      cancelAnimationFrame(
        animationFrameId,
      );
    };
  }, [
    isPlaying,
    playbackRate,
  ]);

  const cycleAngle =
    cycleProgress *
    720;

  const cycleStage =
    getCycleStage(
      cycleProgress,
    );

  const relationship =
    useMemo(
      () =>
        getRelationshipInfo(
          selectedComponent,
        ),
      [
        selectedComponent,
      ],
    );

  const cameraFocus =
    internalView
      ? selectedComponent ??
        "engine"
      : null;

  const handleModelSelect =
    (
      component: CarFocusComponent,
    ) => {
      if (
        component ===
          "engine" ||
        isEngineInternal(
          component,
        )
      ) {
        setInternalView(
          true,
        );

        setSelectedComponent(
          component,
        );
      }
    };

  const handleQuickSelect =
    (
      component: CarFocusComponent,
    ) => {
      setInternalView(
        true,
      );

      setSelectedComponent(
        component,
      );
    };

  const handleInternalView =
    () => {
      setInternalView(
        (current) =>
          !current,
      );

      if (internalView) {
        setSelectedComponent(
          null,
        );
      }
    };

  const handleReset =
    () => {
      setIsPlaying(false);

      setPlaybackRate(
        DEFAULT_PLAYBACK_RATE,
      );

      setCycleProgress(0);

      setSelectedComponent(
        null,
      );

      setInternalView(false);

      setResetKey(
        (current) =>
          current + 1,
      );
    };

  const handleRun =
    () => {
      setInternalView(
        true,
      );

      setIsPlaying(
        (current) =>
          !current,
      );
    };

  const handleScrub =
    (value: number) => {
      setIsPlaying(false);

      setCycleProgress(
        value,
      );
    };

  return (
    <SimulationShell
      moduleLabel="Module 03"
      sceneNumber="09"
      sceneLabel="Interactive Engine Anatomy"
      topRight={
        <div
          className="border border-slate-700/80 bg-slate-950/75 px-3 py-2 backdrop-blur-sm sm:px-4"
          style={{
            clipPath:
              "var(--clip-chamfer-sm)",
          }}
        >
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="min-w-0">
              <span className="block font-[var(--font-chakra-petch)] text-[7px] uppercase tracking-[0.14em] text-slate-500 sm:text-[8px]">
                Selected
              </span>

              <span className="block max-w-[110px] truncate font-[var(--font-oswald)] text-lg font-semibold text-white sm:max-w-[150px] sm:text-xl">
                {
                  relationship.shortTitle
                }
              </span>
            </div>

            <span className="h-7 w-px bg-slate-700" />

            <div className="shrink-0">
              <span className="block font-[var(--font-chakra-petch)] text-[7px] uppercase tracking-[0.14em] text-slate-500 sm:text-[8px]">
                Cycle
              </span>

              <span className="font-[var(--font-jetbrains-mono)] text-[8px] text-cyan-400">
                {cycleAngle.toFixed(
                  0,
                )}
                °
              </span>
            </div>
          </div>
        </div>
      }
      bottomContent={
        <div className="grid w-full items-end gap-2 lg:grid-cols-[1.05fr_1.5fr_auto]">
          {/* =================================================
              COMPONENT
          ================================================= */}

          <Panel
            variant="dark"
            className="h-fit min-w-0 border-slate-700/80 bg-slate-950/80 p-3 backdrop-blur-md sm:p-3.5"
          >
            <div className="flex items-center justify-between gap-3">
              <TechnicalLabel accent="cyan">
                Component
              </TechnicalLabel>

              <span className="max-w-[120px] truncate font-[var(--font-jetbrains-mono)] text-[7px] uppercase tracking-wide text-cyan-400">
                {
                  relationship.category
                }
              </span>
            </div>

            <div className="mt-2 min-w-0">
              <span className="block truncate font-[var(--font-oswald)] text-xl font-semibold leading-none text-white sm:text-2xl">
                {
                  relationship.title
                }
              </span>
            </div>

            {/* QUICK SELECT */}

            <div className="mt-3 border-t border-slate-800 pt-2.5">
              <div className="flex items-center justify-between gap-2">
                <span className="font-[var(--font-chakra-petch)] text-[7px] uppercase tracking-[0.12em] text-slate-500">
                  Quick Select
                </span>

                <span className="shrink-0 font-[var(--font-jetbrains-mono)] text-[6px] text-slate-600">
                  MODEL
                </span>
              </div>

              <div className="mt-2 grid min-w-0 grid-cols-5 gap-1.5">
                {QUICK_SELECT_ITEMS.map(
                  (
                    item,
                  ) => {
                    const active =
                      selectedComponent ===
                      item.component;

                    return (
                      <button
                        key={
                          item.component
                        }
                        type="button"
                        title={
                          item.label
                        }
                        aria-label={`Focus ${item.label}`}
                        onClick={() =>
                          handleQuickSelect(
                            item.component,
                          )
                        }
                        className={[
                          "flex min-w-0 max-w-full items-center justify-center overflow-hidden",
                          "border px-1.5 py-1.5",
                          "transition-colors",
                          active
                            ? "border-cyan-400 bg-cyan-500/15 text-cyan-300"
                            : "border-slate-700 bg-slate-950/65 text-slate-400 hover:border-slate-500 hover:text-white",
                        ].join(
                          " ",
                        )}
                      >
                        <span className="block min-w-0 max-w-full truncate whitespace-nowrap font-[var(--font-jetbrains-mono)] text-[7px] font-semibold leading-none">
                          {
                            item.shortLabel
                          }
                        </span>
                      </button>
                    );
                  },
                )}
              </div>
            </div>

            {/* CONNECTIONS */}

            <div className="mt-2.5 flex min-w-0 flex-wrap gap-1.5">
              {relationship.connected.map(
                (
                  part,
                ) => (
                  <span
                    key={
                      part
                    }
                    className="max-w-full truncate border border-slate-800 bg-slate-950/70 px-2 py-1 font-[var(--font-jetbrains-mono)] text-[6px] text-slate-400"
                  >
                    {part}
                  </span>
                ),
              )}
            </div>
          </Panel>

          {/* =================================================
              ENGINE CYCLE
          ================================================= */}

          <Panel
            variant="dark"
            className="h-fit min-w-0 border-slate-700/80 bg-slate-950/80 p-3 backdrop-blur-md sm:p-3.5"
          >
            <div className="flex items-center justify-between gap-3">
              <TechnicalLabel>
                Engine Cycle
              </TechnicalLabel>

              <span className="shrink-0 font-[var(--font-jetbrains-mono)] text-[8px] text-cyan-400">
                {cycleAngle.toFixed(
                  0,
                )}
                °
              </span>
            </div>

            <input
              type="range"
              min={0}
              max={1}
              step={0.001}
              value={
                cycleProgress
              }
              disabled={
                isPlaying
              }
              onChange={(
                event,
              ) =>
                handleScrub(
                  Number(
                    event.target
                      .value,
                  ),
                )
              }
              className="mt-2.5 w-full accent-[var(--color-brand-red)] disabled:opacity-40"
            />

            <div className="flex justify-between font-[var(--font-jetbrains-mono)] text-[6px] text-slate-600">
              <span>0°</span>
              <span>180°</span>
              <span>360°</span>
              <span>540°</span>
              <span>720°</span>
            </div>

            <div className="mt-2.5 flex items-center justify-between gap-3">
              <div className="flex min-w-0 items-center gap-2">
                <span className="shrink-0 font-[var(--font-chakra-petch)] text-[7px] uppercase tracking-wide text-slate-500">
                  Stage
                </span>

                <span className="truncate font-[var(--font-jetbrains-mono)] text-[8px] font-semibold text-white">
                  {
                    cycleStage
                  }
                </span>
              </div>

              <div className="flex shrink-0 items-center gap-2">
                <span className="font-[var(--font-chakra-petch)] text-[7px] uppercase tracking-wide text-slate-500">
                  Speed
                </span>

                <span className="font-[var(--font-jetbrains-mono)] text-[8px] font-semibold text-white">
                  {playbackRate.toFixed(
                    2,
                  )}
                  ×
                </span>
              </div>
            </div>

            <input
              type="range"
              min={
                MIN_PLAYBACK_RATE
              }
              max={
                MAX_PLAYBACK_RATE
              }
              step={0.05}
              value={
                playbackRate
              }
              onChange={(
                event,
              ) =>
                setPlaybackRate(
                  Number(
                    event.target
                      .value,
                  ),
                )
              }
              className="mt-1.5 w-full accent-[var(--color-brand-red)]"
            />
          </Panel>

          {/* =================================================
              TOOLS
          ================================================= */}

          <Panel
            variant="dark"
            className="h-fit min-w-[205px] max-w-full overflow-hidden border-slate-700/80 bg-slate-950/80 p-3 backdrop-blur-md sm:p-3.5"
          >
            <TechnicalLabel>
              Tools
            </TechnicalLabel>

            <div className="mt-2.5 grid min-w-0 grid-cols-3 gap-2">
              <Button
                type="button"
                size="sm"
                variant="primary"
                onClick={
                  handleRun
                }
              >
                <span className="block min-w-0 truncate">
                  {isPlaying
                    ? "Pause"
                    : "Run"}
                </span>
              </Button>

              <Button
                type="button"
                size="sm"
                variant={
                  internalView
                    ? "primary"
                    : "secondary"
                }
                onClick={
                  handleInternalView
                }
              >
                <span className="block min-w-0 truncate">
                  {internalView
                    ? "Exit"
                    : "Focus"}
                </span>
              </Button>

              <Button
                type="button"
                size="sm"
                variant="secondary"
                onClick={
                  handleReset
                }
              >
                <span className="block min-w-0 truncate">
                  Reset
                </span>
              </Button>
            </div>

            <div className="mt-2.5 flex min-w-0 items-center gap-2 border-t border-slate-800 pt-2.5">
              <span className="shrink-0 font-[var(--font-chakra-petch)] text-[7px] uppercase tracking-[0.12em] text-slate-500">
                Interaction
              </span>

              <span className="min-w-0 truncate font-[var(--font-jetbrains-mono)] text-[7px] text-slate-500">
                Click model marker or Quick
                Select.
              </span>
            </div>
          </Panel>
        </div>
      }
    >
      <SimulationCanvas
        fullScreen
        resetKey={
          resetKey
        }
        cameraFocus={
          cameraFocus
        }

        /**
         * Keep the engine view slightly
         * above the bottom HUD.
         */
        focusVerticalOffset={
          0.72
        }

        /**
         * Keep a medium front-engine
         * inspection distance.
         */
        focusDistanceMultiplier={
          2.15
        }

        focusMinimumDistance={
          2.35
        }

        /**
         * Small frontward adjustment only.
         * No aggressive camera push.
         */
        focusCameraOffset={[
          0,
          0.03,
          -0.18,
        ]}

        /**
         * User can still manually zoom
         * closer after entering the view,
         * but the automatic focus will not
         * start extremely close.
         */
        minDistance={
          2.0
        }
        maxDistance={
          14
        }

        cameraPosition={[
          5.2,
          2.15,
          5.35,
        ]}
        cameraTarget={[
          0,
          1.1,
          -2.13,
        ]}
        engineRunning={
          isPlaying
        }
        enginePlaybackRate={
          playbackRate
        }
        onNodeSelect={
          handleModelSelect
        }
      >
        <EngineMechanism
          isPlaying={
            isPlaying
          }
          playbackRate={
            playbackRate
          }
          resetKey={
            resetKey
          }
          cycleProgress={
            isPlaying
              ? null
              : cycleProgress
          }
          showTrace={false}
          selectedComponent={
            selectedComponent
          }
        />
      </SimulationCanvas>
    </SimulationShell>
  );
}