"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

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
  SimulationShell,
} from "@/src/features/simulation/components/SimulationShell";

import {
  SimulationCanvas,
} from "@/src/features/simulation/components/SimulationCanvas";

import {
  EngineMechanism,
} from "@/src/features/simulation/components/EngineMechanism";

import {
  PVProcessVisualization,
} from "@/src/features/simulation/components/PVProcessVisualization";

import {
  calculatePVPath,
  calculatePVWork,
} from "@/src/lib/physics/pvWork";

const DEFAULT_P1_KPA = 100;
const DEFAULT_P2_KPA = 500;

const DEFAULT_V1_M3 = 0.001;
const DEFAULT_V2_M3 = 0.003;

const GRAPH_WIDTH = 430;
const GRAPH_HEIGHT = 270;

const GRAPH_LEFT = 52;
const GRAPH_RIGHT = 18;
const GRAPH_TOP = 22;
const GRAPH_BOTTOM = 42;

const PRESSURE_MIN = 0;
const PRESSURE_MAX = 600;

const VOLUME_MIN = 0;
const VOLUME_MAX = 0.004;

type ChartPoint = {
  x: number;
  y: number;
};

function mapVolumeToX(
  volumeM3: number,
) {
  const width =
    GRAPH_WIDTH -
    GRAPH_LEFT -
    GRAPH_RIGHT;

  const normalized =
    (volumeM3 -
      VOLUME_MIN) /
    (VOLUME_MAX -
      VOLUME_MIN);

  return (
    GRAPH_LEFT +
    normalized *
      width
  );
}

function mapPressureToY(
  pressureKPa: number,
) {
  const height =
    GRAPH_HEIGHT -
    GRAPH_TOP -
    GRAPH_BOTTOM;

  const normalized =
    (pressureKPa -
      PRESSURE_MIN) /
    (PRESSURE_MAX -
      PRESSURE_MIN);

  return (
    GRAPH_HEIGHT -
    GRAPH_BOTTOM -
    normalized *
      height
  );
}

function buildPath(
  points: ChartPoint[],
) {
  if (points.length === 0) {
    return "";
  }

  return points
    .map(
      (
        point,
        index,
      ) =>
        `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`,
    )
    .join(" ");
}

function buildAreaPath(
  points: ChartPoint[],
) {
  if (points.length === 0) {
    return "";
  }

  const baseline =
    GRAPH_HEIGHT -
    GRAPH_BOTTOM;

  const first =
    points[0];

  const last =
    points[
      points.length - 1
    ];

  return [
    `M ${first.x} ${baseline}`,
    `L ${first.x} ${first.y}`,
    ...points
      .slice(1)
      .map(
        (
          point,
        ) =>
          `L ${point.x} ${point.y}`,
      ),
    `L ${last.x} ${baseline}`,
    "Z",
  ].join(" ");
}

function PVGraph({
  p1KPa,
  p2KPa,
  v1M3,
  v2M3,
  progress,
}: {
  p1KPa: number;
  p2KPa: number;
  v1M3: number;
  v2M3: number;
  progress: number;
}) {
  const allPoints =
    useMemo(
      () =>
        calculatePVPath(
          p1KPa,
          p2KPa,
          v1M3,
          v2M3,
          30,
        ),
      [
        p1KPa,
        p2KPa,
        v1M3,
        v2M3,
      ],
    );

  const visibleCount =
    Math.max(
      2,
      Math.ceil(
        (allPoints.length -
          1) *
          progress,
      ) + 1,
    );

  const visiblePoints =
    allPoints.slice(
      0,
      visibleCount,
    );

  const chartPoints =
    visiblePoints.map(
      (point) => ({
        x: mapVolumeToX(
          point.volumeM3,
        ),
        y: mapPressureToY(
          point.pressureKPa,
        ),
      }),
    );

  const curvePath =
    buildPath(
      chartPoints,
    );

  const areaPath =
    buildAreaPath(
      chartPoints,
    );

  const currentPressure =
    p1KPa +
    (p2KPa - p1KPa) *
      progress;

  const currentVolume =
    v1M3 +
    (v2M3 - v1M3) *
      progress;

  const currentPoint =
    chartPoints[
      chartPoints.length - 1
    ];

  const xTicks = [
    0,
    0.001,
    0.002,
    0.003,
    0.004,
  ];

  const yTicks = [
    0,
    200,
    400,
    600,
  ];

  return (
    <div className="w-full">
      <svg
        viewBox={`0 0 ${GRAPH_WIDTH} ${GRAPH_HEIGHT}`}
        className="w-full"
      >
        <rect
          x="0"
          y="0"
          width={GRAPH_WIDTH}
          height={GRAPH_HEIGHT}
          fill="#0b1120"
        />

        {xTicks.map(
          (tick) => {
            const x =
              mapVolumeToX(
                tick,
              );

            return (
              <line
                key={`x-${tick}`}
                x1={x}
                y1={GRAPH_TOP}
                x2={x}
                y2={
                  GRAPH_HEIGHT -
                  GRAPH_BOTTOM
                }
                stroke="#334155"
                strokeWidth="1"
              />
            );
          },
        )}

        {yTicks.map(
          (tick) => {
            const y =
              mapPressureToY(
                tick,
              );

            return (
              <line
                key={`y-${tick}`}
                x1={GRAPH_LEFT}
                y1={y}
                x2={
                  GRAPH_WIDTH -
                  GRAPH_RIGHT
                }
                y2={y}
                stroke="#334155"
                strokeWidth="1"
              />
            );
          },
        )}

        <line
          x1={GRAPH_LEFT}
          y1={GRAPH_TOP}
          x2={GRAPH_LEFT}
          y2={
            GRAPH_HEIGHT -
            GRAPH_BOTTOM
          }
          stroke="#cbd5e1"
          strokeWidth="1.5"
        />

        <line
          x1={GRAPH_LEFT}
          y1={
            GRAPH_HEIGHT -
            GRAPH_BOTTOM
          }
          x2={
            GRAPH_WIDTH -
            GRAPH_RIGHT
          }
          y2={
            GRAPH_HEIGHT -
            GRAPH_BOTTOM
          }
          stroke="#cbd5e1"
          strokeWidth="1.5"
        />

        <path
          d={areaPath}
          fill="#22c55e"
          fillOpacity="0.18"
        />

        <path
          d={curvePath}
          fill="none"
          stroke="#f8fafc"
          strokeWidth="3"
          strokeLinecap="round"
        />

        {currentPoint && (
          <circle
            cx={
              currentPoint.x
            }
            cy={
              currentPoint.y
            }
            r="5"
            fill="#dc2626"
            stroke="#ffffff"
            strokeWidth="2"
          />
        )}

        {xTicks.map(
          (tick) => {
            const x =
              mapVolumeToX(
                tick,
              );

            return (
              <text
                key={`xt-${tick}`}
                x={x}
                y={
                  GRAPH_HEIGHT -
                  GRAPH_BOTTOM +
                  20
                }
                textAnchor="middle"
                fill="#64748b"
                fontSize="9"
                fontFamily="var(--font-jetbrains-mono)"
              >
                {tick.toFixed(
                  3,
                )}
              </text>
            );
          },
        )}

        {yTicks.map(
          (tick) => {
            const y =
              mapPressureToY(
                tick,
              );

            return (
              <text
                key={`yt-${tick}`}
                x={
                  GRAPH_LEFT -
                  9
                }
                y={y + 3}
                textAnchor="end"
                fill="#64748b"
                fontSize="9"
                fontFamily="var(--font-jetbrains-mono)"
              >
                {tick}
              </text>
            );
          },
        )}

        <text
          x={
            GRAPH_WIDTH / 2
          }
          y={
            GRAPH_HEIGHT -
            10
          }
          textAnchor="middle"
          fill="#94a3b8"
          fontSize="10"
          fontFamily="var(--font-chakra-petch)"
        >
          VOLUME (m³)
        </text>

        <text
          x="13"
          y={
            GRAPH_HEIGHT / 2
          }
          textAnchor="middle"
          fill="#94a3b8"
          fontSize="10"
          fontFamily="var(--font-chakra-petch)"
          transform={`rotate(-90 13 ${
            GRAPH_HEIGHT / 2
          })`}
        >
          PRESSURE (kPa)
        </text>

        <text
          x={
            GRAPH_WIDTH -
            GRAPH_RIGHT
          }
          y={GRAPH_TOP + 2}
          textAnchor="end"
          fill="#67e8f9"
          fontSize="9"
          fontFamily="var(--font-jetbrains-mono)"
        >
          P {currentPressure.toFixed(0)} kPa
        </text>

        <text
          x={
            GRAPH_WIDTH -
            GRAPH_RIGHT
          }
          y={
            GRAPH_TOP +
            15
          }
          textAnchor="end"
          fill="#67e8f9"
          fontSize="9"
          fontFamily="var(--font-jetbrains-mono)"
        >
          V {currentVolume.toFixed(4)} m³
        </text>
      </svg>
    </div>
  );
}

export function Scene04PVWork() {
  const [
    p1KPa,
    setP1KPa,
  ] = useState(
    DEFAULT_P1_KPA,
  );

  const [
    p2KPa,
    setP2KPa,
  ] = useState(
    DEFAULT_P2_KPA,
  );

  const [
    v1M3,
    setV1M3,
  ] = useState(
    DEFAULT_V1_M3,
  );

  const [
    v2M3,
    setV2M3,
  ] = useState(
    DEFAULT_V2_M3,
  );

  const [
    isPlaying,
    setIsPlaying,
  ] = useState(false);

  const [
    progress,
    setProgress,
  ] = useState(0);

  const [
    engineFocus,
    setEngineFocus,
  ] = useState(false);

  const workKJ =
    calculatePVWork(
      p1KPa,
      p2KPa,
      v1M3,
      v2M3,
    );

  const currentPressure =
    p1KPa +
    (p2KPa - p1KPa) *
      progress;

  const currentVolume =
    v1M3 +
    (v2M3 - v1M3) *
      progress;

  const handlePlay = () => {
    if (
      progress >= 1
    ) {
      setProgress(0);
    }

    setEngineFocus(true);
    setIsPlaying(true);
  };

  const handlePause = () => {
    setIsPlaying(false);
  };

  const handleReset = () => {
    setP1KPa(
      DEFAULT_P1_KPA,
    );

    setP2KPa(
      DEFAULT_P2_KPA,
    );

    setV1M3(
      DEFAULT_V1_M3,
    );

    setV2M3(
      DEFAULT_V2_M3,
    );

    setProgress(0);
    setIsPlaying(false);
    setEngineFocus(false);
  };

  const handleV1Change = (
    value: number,
  ) => {
    const nextValue =
      Math.min(
        value,
        v2M3,
      );

    setV1M3(
      nextValue,
    );

    setProgress(0);
    setIsPlaying(false);
  };

  const handleV2Change = (
    value: number,
  ) => {
    const nextValue =
      Math.max(
        value,
        v1M3,
      );

    setV2M3(
      nextValue,
    );

    setProgress(0);
    setIsPlaying(false);
  };

  useEffect(() => {
    if (!isPlaying) {
      return;
    }

    let animationFrameId =
      0;

    let lastTimestamp:
      | number
      | null = null;

    const duration = 5000;

    const animate = (
      timestamp: number,
    ) => {
      if (
        lastTimestamp ===
        null
      ) {
        lastTimestamp =
          timestamp;
      }

      const delta =
        timestamp -
        lastTimestamp;

      lastTimestamp =
        timestamp;

      setProgress(
        (current) => {
          const next =
            current +
            delta /
              duration;

          if (next >= 1) {
            setIsPlaying(
              false,
            );

            return 1;
          }

          return next;
        },
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
  }, [isPlaying]);

  return (
    <SimulationShell
      moduleLabel="Module 02"
      sceneNumber="04"
      sceneLabel="Pressure–Volume Work"
      topRight={
        <div
          className="border border-slate-700/80 bg-slate-950/75 px-3 py-2 backdrop-blur-sm"
          style={{
            clipPath:
              "var(--clip-chamfer-sm)",
          }}
        >
          <span className="block font-[var(--font-chakra-petch)] text-[8px] uppercase tracking-[0.14em] text-slate-500">
            Boundary Work
          </span>

          <span className="font-[var(--font-oswald)] text-lg font-semibold text-white">
            {workKJ.toFixed(
              2,
            )}{" "}
            kJ
          </span>
        </div>
      }
      bottomContent={
        <div className="grid gap-2 lg:grid-cols-[0.9fr_1.7fr_auto]">
          {/* WORK */}

          <Panel
            variant="dark"
            className="border-slate-700/80 bg-slate-950/78 p-3 backdrop-blur-md sm:p-4"
          >
            <TechnicalLabel accent="cyan">
              Work
            </TechnicalLabel>

            <div className="mt-2 flex items-end gap-2">
              <span className="font-[var(--font-oswald)] text-3xl font-semibold leading-none text-white sm:text-4xl">
                {workKJ.toFixed(
                  2,
                )}
              </span>

              <span className="mb-0.5 font-[var(--font-jetbrains-mono)] text-[10px] text-slate-400">
                kJ
              </span>
            </div>

            <span className="mt-2 block font-[var(--font-jetbrains-mono)] text-[8px] text-slate-500">
              W = ∫ P dV
            </span>
          </Panel>

          {/* PARAMETERS */}

          <Panel
            variant="dark"
            className="border-slate-700/80 bg-slate-950/78 p-3 backdrop-blur-md sm:p-4"
          >
            <div className="grid gap-3 sm:grid-cols-4">
              <ParameterControl
                label="P1"
                value={`${p1KPa} kPa`}
                min={0}
                max={600}
                step={10}
                numericValue={
                  p1KPa
                }
                onChange={
                  setP1KPa
                }
              />

              <ParameterControl
                label="P2"
                value={`${p2KPa} kPa`}
                min={0}
                max={600}
                step={10}
                numericValue={
                  p2KPa
                }
                onChange={
                  setP2KPa
                }
              />

              <ParameterControl
                label="V1"
                value={`${v1M3.toFixed(4)} m³`}
                min={0.001}
                max={v2M3}
                step={0.0001}
                numericValue={
                  v1M3
                }
                onChange={
                  handleV1Change
                }
              />

              <ParameterControl
                label="V2"
                value={`${v2M3.toFixed(4)} m³`}
                min={v1M3}
                max={0.004}
                step={0.0001}
                numericValue={
                  v2M3
                }
                onChange={
                  handleV2Change
                }
              />
            </div>
          </Panel>

          {/* CONTROL */}

          <Panel
            variant="dark"
            className="flex min-w-[180px] items-end gap-2 border-slate-700/80 bg-slate-950/78 p-3 backdrop-blur-md sm:p-4"
          >
            <Button
              type="button"
              size="sm"
              variant="primary"
              className="flex-1"
              onClick={
                isPlaying
                  ? handlePause
                  : handlePlay
              }
            >
              {isPlaying
                ? "Pause"
                : "Play"}
            </Button>

            <Button
              type="button"
              size="sm"
              variant="secondary"
              onClick={
                handleReset
              }
            >
              Reset
            </Button>

            <Button
              type="button"
              size="sm"
              variant={
                engineFocus
                  ? "primary"
                  : "dark"
              }
              onClick={() =>
                setEngineFocus(
                  (current) =>
                    !current,
                )
              }
            >
              {engineFocus
                ? "Exit"
                : "Focus"}
            </Button>
          </Panel>
        </div>
      }
    >
      <div className="absolute inset-0">
        <SimulationCanvas
          fullScreen
          cameraFocus={
            engineFocus
              ? "engine"
              : null
          }
          cameraPosition={[
            5.2,
            2.3,
            5.6,
          ]}
          cameraTarget={[
            0,
            1.15,
            -2.13,
          ]}

          engineRunning={
            isPlaying
          }

          enginePlaybackRate={
            0.8 +
            progress * 0.8
          }
          
          engineOverlay={
            <PVProcessVisualization
              pressureKPa={
                currentPressure
              }
              volumeM3={
                currentVolume
              }
              progress={
                progress
              }
            />
          }
        >
          <EngineMechanism
            isPlaying={
              isPlaying
            }
            playbackRate={
              0.8 +
              progress *
                0.8
            }
          />
        </SimulationCanvas>

        {/* P–V INSTRUMENT PANEL */}

        <div className="pointer-events-none absolute right-4 top-[92px] z-20 sm:right-6 lg:right-8">
          <div className="pointer-events-auto w-[310px] border border-slate-700/80 bg-slate-950/78 p-3 shadow-2xl backdrop-blur-md sm:w-[360px]">
            <div className="mb-2 flex items-center justify-between gap-3">
              <TechnicalLabel accent="cyan">
                P–V Diagram
              </TechnicalLabel>

              <span className="font-[var(--font-jetbrains-mono)] text-[8px] uppercase text-slate-500">
                Area = Work
              </span>
            </div>

            <PVGraph
              p1KPa={
                p1KPa
              }
              p2KPa={
                p2KPa
              }
              v1M3={
                v1M3
              }
              v2M3={
                v2M3
              }
              progress={
                progress
              }
            />
          </div>
        </div>

        {/* CURRENT STATE */}

        <div className="pointer-events-none absolute left-4 top-[170px] z-20 sm:left-6 lg:left-8">
          <div
            className="border border-slate-700/80 bg-slate-950/70 px-3 py-2 backdrop-blur-sm"
            style={{
              clipPath:
                "var(--clip-chamfer-sm)",
            }}
          >
            <span className="block font-[var(--font-chakra-petch)] text-[8px] uppercase tracking-[0.14em] text-slate-500">
              Current State
            </span>

            <div className="mt-2 grid grid-cols-2 gap-x-5 gap-y-1">
              <StateValue
                label="Pressure"
                value={`${currentPressure.toFixed(0)} kPa`}
              />

              <StateValue
                label="Volume"
                value={`${currentVolume.toFixed(4)} m³`}
              />

              <StateValue
                label="Progress"
                value={`${(progress * 100).toFixed(0)}%`}
              />

              <StateValue
                label="Process"
                value={
                  progress >=
                  1
                    ? "COMPLETE"
                    : isPlaying
                      ? "RUNNING"
                      : "READY"
                }
              />
            </div>
          </div>
        </div>
      </div>
    </SimulationShell>
  );
}

function ParameterControl({
  label,
  value,
  min,
  max,
  step,
  numericValue,
  onChange,
}: {
  label: string;
  value: string;
  min: number;
  max: number;
  step: number;
  numericValue: number;
  onChange: (
    value: number,
  ) => void;
}) {
  return (
    <div>
      <div className="flex items-center justify-between gap-2">
        <span className="font-[var(--font-chakra-petch)] text-[9px] font-semibold uppercase tracking-wide text-slate-400">
          {label}
        </span>

        <span className="font-[var(--font-jetbrains-mono)] text-[8px] text-white">
          {value}
        </span>
      </div>

      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={
          numericValue
        }
        onChange={(
          event,
        ) =>
          onChange(
            Number(
              event.target.value,
            ),
          )
        }
        className="mt-2 w-full accent-[var(--color-brand-red)]"
      />
    </div>
  );
}

function StateValue({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div>
      <span className="block font-[var(--font-chakra-petch)] text-[7px] uppercase tracking-wide text-slate-500">
        {label}
      </span>

      <span className="font-[var(--font-jetbrains-mono)] text-[9px] text-white">
        {value}
      </span>
    </div>
  );
}