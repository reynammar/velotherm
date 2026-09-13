"use client";

import { useState } from "react";

import { Button } from "@/src/shared/components/Button";
import { Panel } from "@/src/shared/components/Panel";
import { TechnicalLabel } from "@/src/shared/components/TechnicalLabel";

import { SimulationShell } from "@/src/features/simulation/components/SimulationShell";

import { SimulationCanvas } from "@/src/features/simulation/components/SimulationCanvas";

import { Speedometer } from "@/src/shared/components/Speedometer";

import { DustEffect } from "@/src/features/simulation/components/DustEffect";

import { useVehicleMotion } from "@/src/features/simulation/hooks/useVehicleMotion";

import {
  calculateKineticEnergy,
  joulesToKilojoules,
} from "@/src/lib/physics/kineticEnergy";

import {
  vehicleSpeedToWheelAngularVelocity,
} from "@/src/features/simulation/utils/wheelKinematics";

const DEFAULT_MASS = 1200;
const DEFAULT_SPEED_MS = 20;

export function Scene01KineticEnergy() {
  const [
    massKg,
    setMassKg,
  ] = useState(DEFAULT_MASS);

  const [
    speedMs,
    setSpeedMs,
  ] = useState(
    DEFAULT_SPEED_MS,
  );

  const [
    isPlaying,
    setIsPlaying,
  ] = useState(false);

  const [
    resetKey,
    setResetKey,
  ] = useState(0);

  const {
    currentSpeedMs,
    accelerationMs2,
    resetMotion,
  } =
    useVehicleMotion({
      targetSpeedMs:
        speedMs,
      massKg,
      isPlaying,
    });

  const currentSpeedKmh =
    currentSpeedMs * 3.6;

  const targetSpeedKmh =
    speedMs * 3.6;

  const kineticEnergyJ =
    calculateKineticEnergy(
      massKg,
      speedMs,
    );

  const kineticEnergyKJ =
    joulesToKilojoules(
      kineticEnergyJ,
    );

  const wheelAngularVelocity =
    vehicleSpeedToWheelAngularVelocity(
      currentSpeedKmh,
    );

  const handlePlayPause = () => {
    setIsPlaying(
      (current) =>
        !current,
    );
  };

  const handleReset = () => {
    setMassKg(DEFAULT_MASS);

    setSpeedMs(
      DEFAULT_SPEED_MS,
    );

    resetMotion();

    setResetKey(
      (current) =>
        current + 1,
    );

    setIsPlaying(false);
  };

  return (
    <SimulationShell
      moduleLabel="Module 01"
      sceneNumber="01"
      sceneLabel="Kinetic Energy"
      topRight={
        <Speedometer
          speedKmh={
            isPlaying
              ? currentSpeedKmh
              : 0
          }
          maxSpeedKmh={144}
          compact
        />
      }
      bottomContent={
        <div className="grid gap-3 lg:grid-cols-[1.05fr_1.6fr_auto]">
          <Panel
            variant="dark"
            className="border-slate-700/80 bg-slate-950/78 p-4 backdrop-blur-md sm:p-5"
          >
            <div className="flex items-start justify-between gap-4">
              <TechnicalLabel accent="cyan">
                Kinetic Energy
              </TechnicalLabel>

              <span className="font-[var(--font-jetbrains-mono)] text-[9px] uppercase tracking-wide text-slate-500">
                LIVE
              </span>
            </div>

            <div className="mt-3 flex items-end gap-2">
              <span className="font-[var(--font-oswald)] text-4xl font-semibold leading-none text-white sm:text-5xl">
                {kineticEnergyKJ.toFixed(
                  2,
                )}
              </span>

              <span className="mb-1 font-[var(--font-jetbrains-mono)] text-xs text-slate-400">
                kJ
              </span>
            </div>

            <div className="mt-4 border-t border-slate-700 pt-3">
              <span className="font-[var(--font-jetbrains-mono)] text-[10px] text-slate-300">
                KE = ½mv²
              </span>

              <p className="mt-1 font-[var(--font-jetbrains-mono)] text-[9px] text-slate-500">
                ½ × {massKg} ×{" "}
                {speedMs.toFixed(
                  2,
                )}²
              </p>
            </div>
          </Panel>

          <Panel
            variant="dark"
            className="border-slate-700/80 bg-slate-950/78 p-4 backdrop-blur-md sm:p-5"
          >
            <TechnicalLabel>
              Parameters
            </TechnicalLabel>

            <div className="mt-4 space-y-4">
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
                  id="kinetic-mass"
                  type="range"
                  min="600"
                  max="1800"
                  step="50"
                  value={massKg}
                  onChange={(
                    event,
                  ) =>
                    setMassKg(
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
                    Target Velocity
                  </span>

                  <span className="font-[var(--font-jetbrains-mono)] text-[10px] text-white">
                    {speedMs.toFixed(
                      1,
                    )}{" "}
                    m/s
                  </span>
                </div>

                <input
                  id="kinetic-speed"
                  type="range"
                  min="0"
                  max="40"
                  step="0.5"
                  value={speedMs}
                  onChange={(
                    event,
                  ) =>
                    setSpeedMs(
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
            className="flex min-w-[170px] flex-col justify-between border-slate-700/80 bg-slate-950/78 p-4 backdrop-blur-md sm:p-5"
          >
            <div>
              <TechnicalLabel>
                Motion
              </TechnicalLabel>

              <div className="mt-4 space-y-2">
                <div className="flex items-center justify-between gap-4">
                  <span className="font-[var(--font-chakra-petch)] text-[9px] uppercase tracking-wide text-slate-500">
                    Current
                  </span>

                  <span className="font-[var(--font-jetbrains-mono)] text-[10px] text-white">
                    {currentSpeedMs.toFixed(
                      1,
                    )}{" "}
                    m/s
                  </span>
                </div>

                <div className="flex items-center justify-between gap-4">
                  <span className="font-[var(--font-chakra-petch)] text-[9px] uppercase tracking-wide text-slate-500">
                    Acceleration
                  </span>

                  <span className="font-[var(--font-jetbrains-mono)] text-[10px] text-white">
                    {accelerationMs2.toFixed(
                      1,
                    )}{" "}
                    m/s²
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-4 flex gap-2">
              <Button
                type="button"
                size="sm"
                variant="primary"
                className="flex-1"
                onClick={
                  handlePlayPause
                }
                disabled={
                  speedMs <= 0
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
            </div>
          </Panel>
        </div>
      }
    >
      <SimulationCanvas
        fullScreen
        angularVelocity={
          isPlaying
            ? wheelAngularVelocity
            : 0
        }
        motionSpeedMs={
          isPlaying
            ? currentSpeedMs
            : 0
        }
        resetKey={resetKey}
      >
        <DustEffect
          speedKmh={
            isPlaying
              ? currentSpeedKmh
              : 0
          }
        />
      </SimulationCanvas>
    </SimulationShell>
  );
}