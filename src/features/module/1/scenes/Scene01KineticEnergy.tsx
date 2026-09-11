"use client";

import { useState } from "react";

import { Button } from "@/src/shared/components/Button";
import { Metric } from "@/src/shared/components/Metric";
import { Panel } from "@/src/shared/components/Panel";
import { TechnicalLabel } from "@/src/shared/components/TechnicalLabel";

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
  const [massKg, setMassKg] =
    useState(DEFAULT_MASS);

  const [speedMs, setSpeedMs] =
    useState(DEFAULT_SPEED_MS);

  const [isPlaying, setIsPlaying] =
    useState(false);

  const [resetKey, setResetKey] =
    useState(0);

  const {
    currentSpeedMs,
    accelerationMs2,
    resetMotion,
  } = useVehicleMotion({
    targetSpeedMs: speedMs,
    massKg,
    isPlaying,
  });

  /**
   * Convert the current physical velocity
   * to km/h for the vehicle speedometer.
   */
  const currentSpeedKmh =
    currentSpeedMs * 3.6;

  const targetSpeedKmh =
    speedMs * 3.6;

  /**
   * Educational physics uses the user's
   * target/input velocity.
   *
   * This keeps the formula deterministic
   * while the current velocity controls
   * visual motion.
   */
  const kineticEnergyJ =
    calculateKineticEnergy(
      massKg,
      speedMs,
    );

  const kineticEnergyKJ =
    joulesToKilojoules(
      kineticEnergyJ,
    );

  /**
   * Current vehicle velocity drives
   * wheel angular velocity.
   */
  const wheelAngularVelocity =
    vehicleSpeedToWheelAngularVelocity(
      currentSpeedKmh,
    );

  const handlePlayPause = () => {
    setIsPlaying(
      (current) => !current,
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
    <div className="space-y-6">
      {/* =========================
          SIMULATION
      ========================= */}

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_300px]">
        <Panel className="overflow-hidden p-0">
          <SimulationCanvas
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
            resetKey={
              resetKey
            }
          >
            <DustEffect
              speedKmh={
                isPlaying
                  ? currentSpeedKmh
                  : 0
              }
            />
          </SimulationCanvas>
        </Panel>

        <div className="space-y-6">
          <Speedometer
            speedKmh={
              isPlaying
                ? currentSpeedKmh
                : 0
            }
            maxSpeedKmh={144}
          />

          <Panel variant="dark">
            <TechnicalLabel accent="cyan">
              Energy Result
            </TechnicalLabel>

            <div className="mt-6">
              <Metric
                value={kineticEnergyKJ.toFixed(
                  2,
                )}
                unit="kJ"
                label="Kinetic Energy"
                variant="dark"
              />
            </div>

            <div className="mt-6 space-y-5 border-t border-slate-700 pt-5">
              <div>
                <span className="block font-[var(--font-chakra-petch)] text-xs uppercase tracking-wide text-slate-400">
                  Target Velocity
                </span>

                <span className="mt-1 block font-[var(--font-jetbrains-mono)] text-sm text-white">
                  {speedMs.toFixed(
                    2,
                  )}{" "}
                  m/s
                </span>
              </div>

              <div>
                <span className="block font-[var(--font-chakra-petch)] text-xs uppercase tracking-wide text-slate-400">
                  Current Velocity
                </span>

                <span className="mt-1 block font-[var(--font-jetbrains-mono)] text-sm text-white">
                  {currentSpeedMs.toFixed(
                    2,
                  )}{" "}
                  m/s
                </span>
              </div>

              <div>
                <span className="block font-[var(--font-chakra-petch)] text-xs uppercase tracking-wide text-slate-400">
                  Target Speed
                </span>

                <span className="mt-1 block font-[var(--font-jetbrains-mono)] text-sm text-white">
                  {targetSpeedKmh.toFixed(
                    1,
                  )}{" "}
                  km/h
                </span>
              </div>
            </div>
          </Panel>
        </div>
      </div>

      {/* =========================
          PARAMETERS + CONTROL
      ========================= */}

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_300px]">
        <Panel>
          <TechnicalLabel>
            Parameters
          </TechnicalLabel>

          <div className="mt-6 space-y-8">
            {/* MASS */}

            <div>
              <div className="flex items-center justify-between gap-4">
                <label
                  htmlFor="kinetic-mass"
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
                id="kinetic-mass"
                type="range"
                min="600"
                max="1800"
                step="50"
                value={massKg}
                onChange={(event) =>
                  setMassKg(
                    Number(
                      event
                        .target
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

            {/* VELOCITY */}

            <div>
              <div className="flex items-center justify-between gap-4">
                <label
                  htmlFor="kinetic-speed"
                  className="font-[var(--font-chakra-petch)] text-xs font-semibold uppercase tracking-wide text-[var(--color-brand-charcoal)]"
                >
                  Target Velocity
                </label>

                <span className="font-[var(--font-jetbrains-mono)] text-xs text-[var(--color-brand-muted)]">
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
                onChange={(event) =>
                  setSpeedMs(
                    Number(
                      event
                        .target
                        .value,
                    ),
                  )
                }
                className="mt-4 w-full accent-[var(--color-brand-red)]"
              />

              <div className="mt-2 flex justify-between font-[var(--font-jetbrains-mono)] text-[10px] text-slate-400">
                <span>
                  0 m/s
                </span>

                <span>
                  20 m/s
                </span>

                <span>
                  40 m/s
                </span>
              </div>
            </div>
          </div>
        </Panel>

        <Panel>
          <TechnicalLabel>
            Simulation Control
          </TechnicalLabel>

          <div className="mt-6 space-y-3">
            <Button
              type="button"
              variant="primary"
              className="w-full"
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
                Current Speed
              </span>

              <span className="mt-1 block font-[var(--font-jetbrains-mono)] text-sm">
                {currentSpeedKmh.toFixed(
                  1,
                )}{" "}
                km/h
              </span>
            </div>

            <div>
              <span className="block font-[var(--font-chakra-petch)] text-xs uppercase tracking-wide text-[var(--color-brand-muted)]">
                Wheel Angular Velocity
              </span>

              <span className="mt-1 block font-[var(--font-jetbrains-mono)] text-sm">
                {wheelAngularVelocity.toFixed(
                  2,
                )}{" "}
                rad/s
              </span>
            </div>

            <div>
              <span className="block font-[var(--font-chakra-petch)] text-xs uppercase tracking-wide text-[var(--color-brand-muted)]">
                Visual Acceleration
              </span>

              <span className="mt-1 block font-[var(--font-jetbrains-mono)] text-sm">
                {accelerationMs2.toFixed(
                  2,
                )}{" "}
                m/s²
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
          Formula
        </TechnicalLabel>

        <div className="mt-6 bg-[var(--color-brand-charcoal)] p-6">
          <p className="font-[var(--font-jetbrains-mono)] text-sm leading-relaxed text-white">
            KE = ½mv²
          </p>

          <p className="mt-3 font-[var(--font-jetbrains-mono)] text-sm leading-relaxed text-slate-300">
            = ½({massKg} kg)
            × ({speedMs.toFixed(
              2,
            )}{" "}
            m/s)²
          </p>

          <p className="mt-3 font-[var(--font-jetbrains-mono)] text-sm font-semibold leading-relaxed text-[var(--color-brand-red)]">
            ={" "}
            {kineticEnergyKJ.toFixed(
              2,
            )}{" "}
            kJ
          </p>
        </div>

        <p className="mt-5 text-sm leading-relaxed text-[var(--color-brand-muted)]">
          Kinetic energy is the energy
          associated with the motion of an
          object. Because velocity is squared,
          increasing speed produces a larger
          change in kinetic energy.
        </p>
      </Panel>
    </div>
  );
}