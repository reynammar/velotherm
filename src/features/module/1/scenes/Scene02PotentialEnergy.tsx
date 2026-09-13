"use client";

import {
  Html,
  Line,
} from "@react-three/drei";

import {
  useMemo,
  useState,
} from "react";

import {
  calculatePotentialEnergy,
  joulesToKilojoules,
  STANDARD_GRAVITY,
} from "@/src/lib/physics/potentialEnergy";

import { usePotentialEnergyMotion } from "../hooks/usePotentialEnergyMotion";

import { SimulationCanvas } from "@/src/features/simulation/components/SimulationCanvas";

import { SimulationShell } from "@/src/features/simulation/components/SimulationShell";

import { Button } from "@/src/shared/components/Button";

import { Panel } from "@/src/shared/components/Panel";

import { TechnicalLabel } from "@/src/shared/components/TechnicalLabel";
import { vehicleSpeedToWheelAngularVelocity } from "@/src/features/simulation/utils/wheelKinematics";

const DEFAULT_MASS_KG = 1200;

const DEFAULT_HEIGHT_M = 10;

const SLOPE_ANGLE_DEG = 18;

const SLOPE_ANGLE_RAD =
  (SLOPE_ANGLE_DEG * Math.PI) /
  180;

const SLOPE_WIDTH = 8;

const VISUAL_HEIGHT_SCALE = 0.22;

const MAX_VISUAL_HEIGHT = 4.2;

const BOTTOM_POINT: [
  number,
  number,
  number,
] = [0, 0.08, 3];

type Point3 = [
  number,
  number,
  number,
];

type MarkerProps = {
  position: Point3;
  label: string;
  description: string;
  variant: "start" | "bottom";
};

function Marker({
  position,
  label,
  description,
  variant,
}: MarkerProps) {
  const accent =
    variant === "start"
      ? "var(--color-brand-red)"
      : "var(--color-brand-cyan)";

  const markerColor =
    variant === "start"
      ? "#dc2626"
      : "#0891b2";

  return (
    <group position={position}>
      <mesh
        position={[
          0,
          0.35,
          0,
        ]}
      >
        <boxGeometry
          args={[
            0.18,
            0.7,
            0.18,
          ]}
        />

        <meshStandardMaterial
          color={markerColor}
          roughness={0.55}
        />
      </mesh>

      <Html
        position={[
          0,
          0.9,
          0,
        ]}
        center
        distanceFactor={8}
        transform
      >
        <div
          className="pointer-events-none select-none border bg-slate-950/95 px-3 py-2 text-center shadow-lg"
          style={{
            borderColor: accent,
            clipPath:
              "var(--clip-chamfer-sm)",
          }}
        >
          <span
            className="block font-[var(--font-chakra-petch)] text-[10px] font-semibold uppercase tracking-[0.18em]"
            style={{
              color: accent,
            }}
          >
            {label}
          </span>

          <span className="mt-1 block whitespace-nowrap font-[var(--font-jetbrains-mono)] text-[9px] text-slate-400">
            {description}
          </span>
        </div>
      </Html>
    </group>
  );
}

function SlopeGeometry({
  startPoint,
  bottomPoint,
}: {
  startPoint: Point3;
  bottomPoint: Point3;
}) {
  const centerPoint =
    useMemo<Point3>(
      () => [
        (startPoint[0] +
          bottomPoint[0]) /
          2,

        (startPoint[1] +
          bottomPoint[1]) /
          2,

        (startPoint[2] +
          bottomPoint[2]) /
          2,
      ],
      [
        startPoint,
        bottomPoint,
      ],
    );

  const rampLength = Math.max(
    Math.sqrt(
      (startPoint[1] -
        bottomPoint[1]) ** 2 +
        (startPoint[2] -
          bottomPoint[2]) ** 2,
    ),
    0.5,
  );

  const heightMarkerX =
    -(SLOPE_WIDTH / 2 + 0.8);

  return (
    <group>
      <mesh
        position={centerPoint}
        rotation={[
          -Math.PI / 2 +
            SLOPE_ANGLE_RAD,
          0,
          0,
        ]}
      >
        <planeGeometry
          args={[
            SLOPE_WIDTH,
            rampLength,
          ]}
        />

        <meshStandardMaterial
          color="#172033"
          roughness={0.94}
          metalness={0.02}
        />
      </mesh>

      <gridHelper
        args={[
          Math.max(
            rampLength,
            1,
          ),
          Math.max(
            Math.ceil(
              rampLength,
            ),
            1,
          ),
          "#64748b",
          "#334155",
        ]}
        position={centerPoint}
        rotation={[
          SLOPE_ANGLE_RAD,
          0,
          0,
        ]}
      />

      <Marker
        position={startPoint}
        label="START"
        description="Initial position"
        variant="start"
      />

      <Marker
        position={bottomPoint}
        label="BOTTOM"
        description="Reference level"
        variant="bottom"
      />

      <Line
        points={[
          [
            heightMarkerX,
            bottomPoint[1],
            startPoint[2],
          ],
          [
            heightMarkerX,
            startPoint[1],
            startPoint[2],
          ],
        ]}
        color="#e2e8f0"
        lineWidth={1.5}
        dashed
        dashSize={0.1}
        gapSize={0.08}
      />

      <Line
        points={[
          [
            heightMarkerX - 0.18,
            bottomPoint[1],
            startPoint[2],
          ],
          [
            heightMarkerX + 0.18,
            bottomPoint[1],
            startPoint[2],
          ],
        ]}
        color="#e2e8f0"
        lineWidth={1.5}
      />

      <Line
        points={[
          [
            heightMarkerX - 0.18,
            startPoint[1],
            startPoint[2],
          ],
          [
            heightMarkerX + 0.18,
            startPoint[1],
            startPoint[2],
          ],
        ]}
        color="#e2e8f0"
        lineWidth={1.5}
      />

      <Html
        position={[
          heightMarkerX - 0.4,
          (startPoint[1] +
            bottomPoint[1]) /
            2,
          startPoint[2],
        ]}
        center
        distanceFactor={8}
        transform
      >
        <div className="pointer-events-none border border-slate-600 bg-slate-950/90 px-2 py-1 font-[var(--font-jetbrains-mono)] text-[10px] text-slate-300">
          h
        </div>
      </Html>

      <Line
        points={[
          startPoint,
          bottomPoint,
        ]}
        color="#dc2626"
        lineWidth={1}
        transparent
        opacity={0.22}
        dashed
        dashSize={0.08}
        gapSize={0.08}
      />
    </group>
  );
}

export function Scene02PotentialEnergy() {
  const [
    massKg,
    setMassKg,
  ] = useState(
    DEFAULT_MASS_KG,
  );

  const [
    heightM,
    setHeightM,
  ] = useState(
    DEFAULT_HEIGHT_M,
  );

  const {
    currentHeightM,
    currentSpeedMs,
    progress,
    isRunning,
    isFinished,
    slopeAccelerationMs2,
    play,
    pause,
    resetMotion,
  } =
    usePotentialEnergyMotion({
      initialHeightM:
        heightM,
      gravityMs2:
        STANDARD_GRAVITY,
      slopeAngleDeg:
        SLOPE_ANGLE_DEG,
    });

  const initialPotentialEnergyJ =
    calculatePotentialEnergy(
      massKg,
      STANDARD_GRAVITY,
      heightM,
    );

  const currentPotentialEnergyJ =
    calculatePotentialEnergy(
      massKg,
      STANDARD_GRAVITY,
      currentHeightM,
    );

  const kineticEnergyJ =
    Math.max(
      initialPotentialEnergyJ -
        currentPotentialEnergyJ,
      0,
    );

  const initialPotentialEnergyKJ =
    joulesToKilojoules(
      initialPotentialEnergyJ,
    );

  const currentPotentialEnergyKJ =
    joulesToKilojoules(
      currentPotentialEnergyJ,
    );

  const kineticEnergyKJ =
    joulesToKilojoules(
      kineticEnergyJ,
    );

  const visualHeight =
    Math.min(
      heightM *
        VISUAL_HEIGHT_SCALE,
      MAX_VISUAL_HEIGHT,
    );

  const rampLength =
    visualHeight > 0
      ? visualHeight /
        Math.sin(
          SLOPE_ANGLE_RAD,
        )
      : 0.5;

  const startPoint: Point3 = [
    BOTTOM_POINT[0],
    BOTTOM_POINT[1] +
      visualHeight,
    BOTTOM_POINT[2] -
      rampLength *
        Math.cos(
          SLOPE_ANGLE_RAD,
        ),
  ];

  const currentCarPosition: Point3 =
    [
      startPoint[0],

      startPoint[1] +
        (BOTTOM_POINT[1] -
          startPoint[1]) *
          progress,

      startPoint[2] +
        (BOTTOM_POINT[2] -
          startPoint[2]) *
          progress,
    ];

  const potentialRatio =
    initialPotentialEnergyKJ >
    0
      ? currentPotentialEnergyKJ /
        initialPotentialEnergyKJ
      : 0;

  const kineticRatio =
    initialPotentialEnergyKJ >
    0
      ? kineticEnergyKJ /
        initialPotentialEnergyKJ
      : 0;

  const handleMassChange = (
    value: number,
  ) => {
    setMassKg(value);
    resetMotion();
  };

  const handleHeightChange = (
    value: number,
  ) => {
    setHeightM(value);
    resetMotion(value);
  };

  const handleReset = () => {
    setMassKg(
      DEFAULT_MASS_KG,
    );

    setHeightM(
      DEFAULT_HEIGHT_M,
    );

    resetMotion(
      DEFAULT_HEIGHT_M,
    );
  };

  const handlePlayPause = () => {
    if (isRunning) {
      pause();
      return;
    }

    play();
  };

  return (
    <SimulationShell
      moduleLabel="Module 01"
      sceneNumber="02"
      sceneLabel="Potential Energy"
      topRight={
        <div
          className="border border-slate-700/80 bg-slate-950/75 px-3 py-2 backdrop-blur-sm sm:px-4"
          style={{
            clipPath:
              "var(--clip-chamfer-sm)",
          }}
        >
          <div className="flex items-center gap-4">
            <div>
              <span className="block font-[var(--font-chakra-petch)] text-[8px] uppercase tracking-[0.14em] text-slate-500">
                Height
              </span>

              <span className="font-[var(--font-jetbrains-mono)] text-xs text-white">
                {currentHeightM.toFixed(
                  1,
                )}{" "}
                m
              </span>
            </div>

            <div className="h-6 w-px bg-slate-700" />

            <div>
              <span className="block font-[var(--font-chakra-petch)] text-[8px] uppercase tracking-[0.14em] text-slate-500">
                Velocity
              </span>

              <span className="font-[var(--font-jetbrains-mono)] text-xs text-white">
                {currentSpeedMs.toFixed(
                  1,
                )}{" "}
                m/s
              </span>
            </div>
          </div>
        </div>
      }
      bottomContent={
        <div className="grid gap-3 lg:grid-cols-[1.1fr_1.6fr_auto]">
          <Panel
            variant="dark"
            className="border-slate-700/80 bg-slate-950/78 p-4 backdrop-blur-md sm:p-5"
          >
            <div className="flex items-center justify-between">
              <TechnicalLabel accent="cyan">
                Energy Conversion
              </TechnicalLabel>

              <span className="font-[var(--font-jetbrains-mono)] text-[9px] text-slate-500">
                {(
                  progress *
                  100
                ).toFixed(
                  0,
                )}
                %
              </span>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3">
              <div>
                <span className="block font-[var(--font-chakra-petch)] text-[9px] uppercase tracking-wide text-slate-500">
                  Potential
                </span>

                <span className="mt-1 block font-[var(--font-oswald)] text-2xl font-semibold text-cyan-400">
                  {currentPotentialEnergyKJ.toFixed(
                    1,
                  )}
                  <span className="ml-1 text-xs text-slate-400">
                    kJ
                  </span>
                </span>
              </div>

              <div>
                <span className="block font-[var(--font-chakra-petch)] text-[9px] uppercase tracking-wide text-slate-500">
                  Kinetic
                </span>

                <span className="mt-1 block font-[var(--font-oswald)] text-2xl font-semibold text-[var(--color-brand-red)]">
                  {kineticEnergyKJ.toFixed(
                    1,
                  )}
                  <span className="ml-1 text-xs text-slate-400">
                    kJ
                  </span>
                </span>
              </div>
            </div>

            <div className="mt-4 flex gap-1 overflow-hidden bg-slate-800">
              <div
                className="h-1.5 bg-cyan-500 transition-[width] duration-100"
                style={{
                  width: `${potentialRatio * 100}%`,
                }}
              />

              <div
                className="h-1.5 bg-[var(--color-brand-red)] transition-[width] duration-100"
                style={{
                  width: `${kineticRatio * 100}%`,
                }}
              />
            </div>
          </Panel>

          <Panel
            variant="dark"
            className="border-slate-700/80 bg-slate-950/78 p-4 backdrop-blur-md sm:p-5"
          >
            <TechnicalLabel>
              Experiment
            </TechnicalLabel>

            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div>
                <div className="flex items-center justify-between gap-3">
                  <span className="font-[var(--font-chakra-petch)] text-[10px] font-semibold uppercase tracking-wide text-slate-300">
                    Mass
                  </span>

                  <span className="font-[var(--font-jetbrains-mono)] text-[10px] text-white">
                    {massKg} kg
                  </span>
                </div>

                <input
                  id="potential-mass"
                  type="range"
                  min="600"
                  max="1800"
                  step="50"
                  value={massKg}
                  onChange={(event) =>
                    handleMassChange(
                      Number(
                        event
                          .target
                          .value,
                      ),
                    )
                  }
                  className="mt-3 w-full accent-[var(--color-brand-red)]"
                />
              </div>

              <div>
                <div className="flex items-center justify-between gap-3">
                  <span className="font-[var(--font-chakra-petch)] text-[10px] font-semibold uppercase tracking-wide text-slate-300">
                    Initial Height
                  </span>

                  <span className="font-[var(--font-jetbrains-mono)] text-[10px] text-white">
                    {heightM.toFixed(
                      1,
                    )}{" "}
                    m
                  </span>
                </div>

                <input
                  id="potential-height"
                  type="range"
                  min="0"
                  max="20"
                  step="0.5"
                  value={heightM}
                  onChange={(event) =>
                    handleHeightChange(
                      Number(
                        event
                          .target
                          .value,
                      ),
                    )
                  }
                  className="mt-3 w-full accent-[var(--color-brand-red)]"
                />
              </div>
            </div>
          </Panel>

          <Panel
            variant="dark"
            className="flex min-w-[175px] flex-col justify-between border-slate-700/80 bg-slate-950/78 p-4 backdrop-blur-md sm:p-5"
          >
            <div>
              <TechnicalLabel>
                Simulation
              </TechnicalLabel>

              <div className="mt-4">
                <span className="block font-[var(--font-chakra-petch)] text-[9px] uppercase tracking-wide text-slate-500">
                  Total Mechanical Energy
                </span>

                <span className="mt-1 block font-[var(--font-oswald)] text-2xl font-semibold text-white">
                  {initialPotentialEnergyKJ.toFixed(
                    1,
                  )}{" "}
                  kJ
                </span>
              </div>
            </div>

            <div className="mt-4 flex gap-2">
              <Button
                type="button"
                size="sm"
                variant="primary"
                className="flex-1"
                disabled={
                  heightM <= 0 ||
                  isFinished
                }
                onClick={
                  handlePlayPause
                }
              >
                {isRunning
                  ? "Pause"
                  : isFinished
                    ? "Done"
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
            </div>
          </Panel>
        </div>
      }
    >
      <SimulationCanvas
        fullScreen
        angularVelocity={
          isRunning ||
          isFinished
            ? vehicleSpeedToWheelAngularVelocity(
                currentSpeedMs * 3.6,
              )
            : 0
        }
        carPosition={
          currentCarPosition
        }
        carRotation={[
          SLOPE_ANGLE_RAD,
          0,
          0,
        ]}
        cameraPosition={[
          7.2,
          4.2,
          8.5,
        ]}
        cameraTarget={[
          0,
          1.25,
          -0.5,
        ]}
        showFloor={false}
      >
        <SlopeGeometry
          startPoint={
            startPoint
          }
          bottomPoint={
            BOTTOM_POINT
          }
        />
      </SimulationCanvas>
    </SimulationShell>
  );
}