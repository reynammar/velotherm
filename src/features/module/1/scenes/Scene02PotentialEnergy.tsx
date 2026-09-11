"use client";

import {
  Html,
  Line,
} from "@react-three/drei";
import { useMemo, useState } from "react";

import {
  calculatePotentialEnergy,
  joulesToKilojoules,
  STANDARD_GRAVITY,
} from "@/src/lib/physics/potentialEnergy";

import { usePotentialEnergyMotion } from "../hooks/usePotentialEnergyMotion";

import { SimulationCanvas } from "@/src/features/simulation/components/SimulationCanvas";

import { vehicleSpeedToWheelAngularVelocity } from "@/src/features/simulation/utils/wheelKinematics";

import { Button } from "@/src/shared/components/Button";

import { Metric } from "@/src/shared/components/Metric";

import { Panel } from "@/src/shared/components/Panel";

import { TechnicalLabel } from "@/src/shared/components/TechnicalLabel";

const DEFAULT_MASS_KG = 1200;
const DEFAULT_HEIGHT_M = 10;

const SLOPE_ANGLE_DEG = 18;
const SLOPE_ANGLE_RAD =
  (SLOPE_ANGLE_DEG * Math.PI) / 180;

const SLOPE_WIDTH = 8;

/**
 * Physics height is intentionally mapped into
 * a readable visual height in Three.js world space.
 */
const VISUAL_HEIGHT_SCALE = 0.22;

/**
 * Prevents very large physics heights from
 * creating an excessively long visual ramp.
 */
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
      <mesh position={[0, 0.35, 0]}>
        <boxGeometry
          args={[0.18, 0.7, 0.18]}
        />

        <meshStandardMaterial
          color={markerColor}
          roughness={0.55}
        />
      </mesh>

      <Html
        position={[0, 0.9, 0]}
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

type SlopeGeometryProps = {
  startPoint: Point3;
  bottomPoint: Point3;
};

function SlopeGeometry({
  startPoint,
  bottomPoint,
}: SlopeGeometryProps) {
  const centerPoint = useMemo<Point3>(
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
    [startPoint, bottomPoint],
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
      {/* =========================
          INCLINED PLANE
      ========================= */}

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

      {/* =========================
          GRID OVERLAY
      ========================= */}

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
        scale={[
          Math.min(
            SLOPE_WIDTH /
              rampLength,
            1,
          ),
          1,
          1,
        ]}
      />

      {/* =========================
          START MARKER
      ========================= */}

      <Marker
        position={startPoint}
        label="START"
        description="Initial position"
        variant="start"
      />

      {/* =========================
          BOTTOM MARKER
      ========================= */}

      <Marker
        position={bottomPoint}
        label="BOTTOM"
        description="Reference level"
        variant="bottom"
      />

      {/* =========================
          HEIGHT MEASUREMENT
      ========================= */}

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
        <div className="pointer-events-none border border-slate-600 bg-slate-950/90 px-2 py-1 font-[var(--font-jetbrains-mono)] text-[10px] font-medium text-slate-300">
          h
        </div>
      </Html>

      {/* =========================
          SLOPE PATH
      ========================= */}

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

type EnergyDistributionProps = {
  potentialEnergyKJ: number;
  kineticEnergyKJ: number;
  totalEnergyKJ: number;
};

function EnergyDistribution({
  potentialEnergyKJ,
  kineticEnergyKJ,
  totalEnergyKJ,
}: EnergyDistributionProps) {
  const potentialRatio =
    totalEnergyKJ > 0
      ? potentialEnergyKJ /
        totalEnergyKJ
      : 0;

  const kineticRatio =
    totalEnergyKJ > 0
      ? kineticEnergyKJ /
        totalEnergyKJ
      : 0;

  return (
    <div className="space-y-4">
      <div>
        <div className="mb-2 flex items-center justify-between">
          <span className="font-[var(--font-chakra-petch)] text-xs font-semibold uppercase tracking-wide text-slate-400">
            Potential
          </span>

          <span className="font-[var(--font-jetbrains-mono)] text-xs text-white">
            {potentialEnergyKJ.toFixed(
              2,
            )}{" "}
            kJ
          </span>
        </div>

        <div className="h-2 overflow-hidden bg-slate-800">
          <div
            className="h-full bg-cyan-500 transition-[width] duration-100"
            style={{
              width: `${potentialRatio * 100}%`,
            }}
          />
        </div>
      </div>

      <div>
        <div className="mb-2 flex items-center justify-between">
          <span className="font-[var(--font-chakra-petch)] text-xs font-semibold uppercase tracking-wide text-slate-400">
            Kinetic
          </span>

          <span className="font-[var(--font-jetbrains-mono)] text-xs text-white">
            {kineticEnergyKJ.toFixed(
              2,
            )}{" "}
            kJ
          </span>
        </div>

        <div className="h-2 overflow-hidden bg-slate-800">
          <div
            className="h-full bg-[var(--color-brand-red)] transition-[width] duration-100"
            style={{
              width: `${kineticRatio * 100}%`,
            }}
          />
        </div>
      </div>
    </div>
  );
}

export function Scene02PotentialEnergy() {
  const [massKg, setMassKg] =
    useState(DEFAULT_MASS_KG);

  const [heightM, setHeightM] =
    useState(DEFAULT_HEIGHT_M);

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
      initialHeightM: heightM,
      gravityMs2:
        STANDARD_GRAVITY,
      slopeAngleDeg:
        SLOPE_ANGLE_DEG,
    });

  /* =========================
     ENERGY CALCULATION
  ========================= */

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

  const totalMechanicalEnergyKJ =
    initialPotentialEnergyKJ;

  /* =========================
     3D VISUAL MAPPING
  ========================= */

  const wheelAngularVelocity =
    vehicleSpeedToWheelAngularVelocity(
      currentSpeedMs * 3.6,
    );

  const visualHeight = Math.min(
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

  const currentCarPosition: Point3 = [
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

  /* =========================
     HANDLERS
  ========================= */

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
    <div className="space-y-6">
      {/* =========================
          SIMULATION
      ========================= */}

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        <Panel className="overflow-hidden p-0">
          <SimulationCanvas
            angularVelocity={
              isRunning ||
              isFinished
                ? wheelAngularVelocity
                : 0
            }
            motionSpeedMs={0}
            carPosition={
              currentCarPosition
            }
            carRotation={[
              SLOPE_ANGLE_RAD,
              0,
              0,
            ]}
            cameraPosition={[
              6.5,
              3.8,
              7.5,
            ]}
            cameraTarget={[
              0,
              1.2,
              -1,
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
        </Panel>

        {/* =========================
            LIVE ENERGY
        ========================= */}

        <div className="space-y-6">
          <Panel variant="dark">
            <TechnicalLabel accent="cyan">
              Live Energy State
            </TechnicalLabel>

            <div className="mt-6 space-y-6">
              <Metric
                value={currentPotentialEnergyKJ.toFixed(
                  2,
                )}
                unit="kJ"
                label="Potential Energy"
                variant="dark"
              />

              <Metric
                value={kineticEnergyKJ.toFixed(
                  2,
                )}
                unit="kJ"
                label="Kinetic Energy"
                variant="dark"
              />

              <div className="border-t border-slate-700 pt-5">
                <div className="flex items-center justify-between">
                  <span className="font-[var(--font-chakra-petch)] text-xs uppercase tracking-wide text-slate-400">
                    Total Mechanical Energy
                  </span>

                  <span className="font-[var(--font-jetbrains-mono)] text-sm font-semibold text-white">
                    {totalMechanicalEnergyKJ.toFixed(
                      2,
                    )}{" "}
                    kJ
                  </span>
                </div>
              </div>
            </div>
          </Panel>

          <Panel variant="dark">
            <TechnicalLabel>
              Energy Distribution
            </TechnicalLabel>

            <div className="mt-6">
              <EnergyDistribution
                potentialEnergyKJ={
                  currentPotentialEnergyKJ
                }
                kineticEnergyKJ={
                  kineticEnergyKJ
                }
                totalEnergyKJ={
                  totalMechanicalEnergyKJ
                }
              />
            </div>
          </Panel>
        </div>
      </div>

      {/* =========================
          PARAMETERS
      ========================= */}

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        <Panel>
          <TechnicalLabel>
            Experiment Parameters
          </TechnicalLabel>

          <div className="mt-6 space-y-8">
            {/* MASS */}

            <div>
              <div className="flex items-center justify-between gap-4">
                <label
                  htmlFor="potential-mass"
                  className="font-[var(--font-chakra-petch)] text-xs font-semibold uppercase tracking-wide text-[var(--color-brand-charcoal)]"
                >
                  Mass
                </label>

                <span className="font-[var(--font-jetbrains-mono)] text-xs text-[var(--color-brand-muted)]">
                  {massKg.toLocaleString(
                    "en-US",
                  )}{" "}
                  kg
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
                      event.target
                        .value,
                    ),
                  )
                }
                className="mt-4 w-full accent-[var(--color-brand-red)]"
              />

              <div className="mt-2 flex justify-between font-[var(--font-jetbrains-mono)] text-[10px] text-slate-400">
                <span>
                  600 kg
                </span>

                <span>
                  1200 kg
                </span>

                <span>
                  1800 kg
                </span>
              </div>
            </div>

            {/* HEIGHT */}

            <div>
              <div className="flex items-center justify-between gap-4">
                <label
                  htmlFor="potential-height"
                  className="font-[var(--font-chakra-petch)] text-xs font-semibold uppercase tracking-wide text-[var(--color-brand-charcoal)]"
                >
                  Initial Height
                </label>

                <span className="font-[var(--font-jetbrains-mono)] text-xs text-[var(--color-brand-muted)]">
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
                      event.target
                        .value,
                    ),
                  )
                }
                className="mt-4 w-full accent-[var(--color-brand-red)]"
              />

              <div className="mt-2 flex justify-between font-[var(--font-jetbrains-mono)] text-[10px] text-slate-400">
                <span>
                  0 m
                </span>

                <span>
                  10 m
                </span>

                <span>
                  20 m
                </span>
              </div>
            </div>
          </div>
        </Panel>

        {/* =========================
            CONTROL
        ========================= */}

        <Panel>
          <TechnicalLabel>
            Simulation Control
          </TechnicalLabel>

          <div className="mt-6 space-y-3">
            <Button
              type="button"
              variant="primary"
              className="w-full"
              disabled={
                heightM <= 0
              }
              onClick={
                handlePlayPause
              }
            >
              {isRunning
                ? "Pause"
                : isFinished
                  ? "Finished"
                  : "Play"}
            </Button>

            <Button
              type="button"
              variant="secondary"
              className="w-full"
              onClick={
                handleReset
              }
            >
              Reset
            </Button>
          </div>

          <div className="mt-8 space-y-5 border-t border-slate-200 pt-6">
            <div>
              <span className="block font-[var(--font-chakra-petch)] text-xs uppercase tracking-wide text-[var(--color-brand-muted)]">
                Current Height
              </span>

              <span className="mt-1 block font-[var(--font-jetbrains-mono)] text-sm">
                {currentHeightM.toFixed(
                  2,
                )}{" "}
                m
              </span>
            </div>

            <div>
              <span className="block font-[var(--font-chakra-petch)] text-xs uppercase tracking-wide text-[var(--color-brand-muted)]">
                Current Velocity
              </span>

              <span className="mt-1 block font-[var(--font-jetbrains-mono)] text-sm">
                {currentSpeedMs.toFixed(
                  2,
                )}{" "}
                m/s
              </span>
            </div>

            <div>
              <span className="block font-[var(--font-chakra-petch)] text-xs uppercase tracking-wide text-[var(--color-brand-muted)]">
                Slope Acceleration
              </span>

              <span className="mt-1 block font-[var(--font-jetbrains-mono)] text-sm">
                {slopeAccelerationMs2.toFixed(
                  2,
                )}{" "}
                m/s²
              </span>
            </div>

            <div>
              <span className="block font-[var(--font-chakra-petch)] text-xs uppercase tracking-wide text-[var(--color-brand-muted)]">
                Progress
              </span>

              <span className="mt-1 block font-[var(--font-jetbrains-mono)] text-sm">
                {(
                  progress *
                  100
                ).toFixed(
                  0,
                )}{" "}
                %
              </span>
            </div>
          </div>
        </Panel>
      </div>

      {/* =========================
          FORMULA
      ========================= */}

      <Panel>
        <TechnicalLabel>
          Potential Energy Formula
        </TechnicalLabel>

        <div className="mt-6 bg-[var(--color-brand-charcoal)] p-6">
          <p className="font-[var(--font-jetbrains-mono)] text-sm leading-relaxed text-white">
            PE = mgh
          </p>

          <p className="mt-3 font-[var(--font-jetbrains-mono)] text-sm leading-relaxed text-slate-300">
            = ({massKg} kg) × (
            {STANDARD_GRAVITY.toFixed(
              2,
            )}{" "}
            m/s²) × (
            {currentHeightM.toFixed(
              2,
            )}{" "}
            m)
          </p>

          <p className="mt-3 font-[var(--font-jetbrains-mono)] text-sm font-semibold leading-relaxed text-[var(--color-brand-red)]">
            ={" "}
            {currentPotentialEnergyKJ.toFixed(
              2,
            )}{" "}
            kJ
          </p>
        </div>

        <p className="mt-5 text-sm leading-relaxed text-[var(--color-brand-muted)]">
          As the vehicle descends, its
          gravitational potential energy decreases.
          In this idealized frictionless model, the
          lost potential energy is converted into
          kinetic energy.
        </p>
      </Panel>

      {/* =========================
          EXPERIMENT NOTE
      ========================= */}

      <Panel variant="dark">
        <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
          <div>
            <TechnicalLabel accent="cyan">
              Experiment Note
            </TechnicalLabel>

            <p className="mt-4 max-w-3xl text-sm leading-relaxed text-slate-300">
              Changing mass changes the amount of
              potential and kinetic energy, but it
              does not change gravitational
              acceleration in this idealized model.
              Changing the initial height changes the
              available potential energy and the
              visual distance represented by the
              inclined plane.
            </p>
          </div>

          <div className="shrink-0 border border-slate-700 px-4 py-3">
            <span className="block font-[var(--font-chakra-petch)] text-xs uppercase tracking-wide text-slate-500">
              Model
            </span>

            <span className="mt-1 block font-[var(--font-jetbrains-mono)] text-xs text-white">
              IDEAL / FRICTIONLESS
            </span>
          </div>
        </div>
      </Panel>
    </div>
  );
}