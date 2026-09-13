"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import { Button } from "@/src/shared/components/Button";
import { Panel } from "@/src/shared/components/Panel";
import { TechnicalLabel } from "@/src/shared/components/TechnicalLabel";

import { SimulationShell } from "@/src/features/simulation/components/SimulationShell";
import { SimulationCanvas } from "@/src/features/simulation/components/SimulationCanvas";
import { EngineMechanism } from "@/src/features/simulation/components/EngineMechanism";
import { PowerRotationVisualization } from "@/src/features/simulation/components/PowerRotationVisualization";

import {
  calculateRotationalPower,
  calculateRotationalWork,
  radiansPerSecondToRpm,
  radiansToRevolutions,
  wattsToKilowatts,
} from "@/src/lib/physics/power";

import {
  enginePlaybackRateToWheelAngularVelocity,
} from "@/src/features/simulation/utils/engineWheelCoupling";

const DEFAULT_TORQUE_NM = 200;
const DEFAULT_ANGULAR_VELOCITY = 100;

const MIN_ANGULAR_VELOCITY = 20;
const MAX_ANGULAR_VELOCITY = 200;

const MIN_PLAYBACK_RATE = 0.5;
const MAX_PLAYBACK_RATE = 2;

function mapAngularVelocityToPlaybackRate(
  angularVelocityRadS: number,
): number {
  const normalized =
    Math.min(
      Math.max(
        (angularVelocityRadS -
          MIN_ANGULAR_VELOCITY) /
          (MAX_ANGULAR_VELOCITY -
            MIN_ANGULAR_VELOCITY),
        0,
      ),
      1,
    );

  return (
    MIN_PLAYBACK_RATE +
    normalized *
      (MAX_PLAYBACK_RATE -
        MIN_PLAYBACK_RATE)
  );
}

export function Scene05PowerRotation() {
  const [
    torqueNm,
    setTorqueNm,
  ] = useState(
    DEFAULT_TORQUE_NM,
  );

  const [
    angularVelocityRadS,
    setAngularVelocityRadS,
  ] = useState(
    DEFAULT_ANGULAR_VELOCITY,
  );

  const [
    elapsedTimeS,
    setElapsedTimeS,
  ] = useState(0);

  const [
    isPlaying,
    setIsPlaying,
  ] = useState(false);

  const [
    engineFocus,
    setEngineFocus,
  ] = useState(false);

  const powerW = useMemo(
    () =>
      calculateRotationalPower(
        torqueNm,
        angularVelocityRadS,
      ),
    [
      torqueNm,
      angularVelocityRadS,
    ],
  );

  const powerKW =
    wattsToKilowatts(
      powerW,
    );

  const angleRad =
    angularVelocityRadS *
    elapsedTimeS;

  const revolutions =
    radiansToRevolutions(
      angleRad,
    );

  const workJ =
    calculateRotationalWork(
      torqueNm,
      angleRad,
    );

  const rpm =
    radiansPerSecondToRpm(
      angularVelocityRadS,
    );

  const playbackRate =
    mapAngularVelocityToPlaybackRate(
      angularVelocityRadS,
    );

  const workPerRevolutionJ =
    calculateRotationalWork(
      torqueNm,
      2 * Math.PI,
    );

  const wheelAngularVelocity =
    isPlaying
      ? enginePlaybackRateToWheelAngularVelocity(
          playbackRate,
        )
      : 0;

  useEffect(() => {
    if (!isPlaying) {
      return;
    }

    let animationFrameId = 0;

    let previousTimestamp:
      | number
      | null = null;

    const updateClock =
      (timestamp: number) => {
        if (
          previousTimestamp ===
          null
        ) {
          previousTimestamp =
            timestamp;
        }

        const deltaSeconds =
          (timestamp -
            previousTimestamp) /
          1000;

        previousTimestamp =
          timestamp;

        setElapsedTimeS(
          (current) =>
            current +
            deltaSeconds,
        );

        animationFrameId =
          requestAnimationFrame(
            updateClock,
          );
      };

    animationFrameId =
      requestAnimationFrame(
        updateClock,
      );

    return () => {
      cancelAnimationFrame(
        animationFrameId,
      );
    };
  }, [isPlaying]);

  const handleTorqueChange = (
    value: number,
  ) => {
    setTorqueNm(value);
    setElapsedTimeS(0);
    setIsPlaying(false);
  };

  const handleVelocityChange = (
    value: number,
  ) => {
    setAngularVelocityRadS(
      value,
    );

    setElapsedTimeS(0);
    setIsPlaying(false);
  };

  const handleRun = () => {
    setEngineFocus(true);

    setIsPlaying(
      (current) =>
        !current,
    );
  };

  const handleReset = () => {
    setTorqueNm(
      DEFAULT_TORQUE_NM,
    );

    setAngularVelocityRadS(
      DEFAULT_ANGULAR_VELOCITY,
    );

    setElapsedTimeS(0);
    setIsPlaying(false);
    setEngineFocus(false);
  };

  return (
    <SimulationShell
      moduleLabel="Module 02"
      sceneNumber="05"
      sceneLabel="Power & Rotational Work"
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
                Power
              </span>

              <span className="font-[var(--font-oswald)] text-lg font-semibold text-white">
                {powerKW.toFixed(
                  1,
                )}{" "}
                kW
              </span>
            </div>

            <div className="h-7 w-px bg-slate-700" />

            <div>
              <span className="block font-[var(--font-chakra-petch)] text-[8px] uppercase tracking-[0.14em] text-slate-500">
                Speed
              </span>

              <span className="font-[var(--font-jetbrains-mono)] text-[9px] text-white">
                {rpm.toFixed(
                  0,
                )}{" "}
                RPM
              </span>
            </div>
          </div>
        </div>
      }
      bottomContent={
        <div className="grid gap-3 lg:grid-cols-[1fr_1.6fr_auto]">
          <Panel
            variant="dark"
            className="border-slate-700/80 bg-slate-950/78 p-4 backdrop-blur-md sm:p-5"
          >
            <div className="flex items-center justify-between gap-3">
              <TechnicalLabel accent="cyan">
                Power
              </TechnicalLabel>

              <span className="font-[var(--font-jetbrains-mono)] text-[9px] text-slate-500">
                P = τω
              </span>
            </div>

            <div className="mt-3 flex items-end gap-2">
              <span className="font-[var(--font-oswald)] text-4xl font-semibold leading-none text-white sm:text-5xl">
                {powerKW.toFixed(
                  2,
                )}
              </span>

              <span className="mb-1 font-[var(--font-jetbrains-mono)] text-xs text-slate-400">
                kW
              </span>
            </div>

            <div className="mt-4 border-t border-slate-700 pt-3">
              <span className="font-[var(--font-jetbrains-mono)] text-[9px] text-slate-400">
                τ × ω
              </span>

              <p className="mt-1 font-[var(--font-jetbrains-mono)] text-[9px] text-slate-500">
                {torqueNm} ×{" "}
                {angularVelocityRadS.toFixed(
                  1,
                )}
              </p>
            </div>
          </Panel>

          <Panel
            variant="dark"
            className="border-slate-700/80 bg-slate-950/78 p-4 backdrop-blur-md sm:p-5"
          >
            <TechnicalLabel>
              Experiment Parameters
            </TechnicalLabel>

            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <ParameterControl
                label="Torque"
                value={`${torqueNm} N·m`}
                min={0}
                max={500}
                step={10}
                numericValue={
                  torqueNm
                }
                onChange={
                  handleTorqueChange
                }
              />

              <ParameterControl
                label="Angular Velocity"
                value={`${angularVelocityRadS.toFixed(
                  1,
                )} rad/s`}
                min={
                  MIN_ANGULAR_VELOCITY
                }
                max={
                  MAX_ANGULAR_VELOCITY
                }
                step={5}
                numericValue={
                  angularVelocityRadS
                }
                onChange={
                  handleVelocityChange
                }
              />
            </div>
          </Panel>

          <Panel
            variant="dark"
            className="flex min-w-[190px] flex-col justify-between border-slate-700/80 bg-slate-950/78 p-4 backdrop-blur-md sm:p-5"
          >
            <div>
              <TechnicalLabel>
                Rotation
              </TechnicalLabel>

              <div className="mt-4 space-y-2">
                <Readout
                  label="Angle"
                  value={`${angleRad.toFixed(
                    2,
                  )} rad`}
                />

                <Readout
                  label="Revolutions"
                  value={revolutions.toFixed(
                    2,
                  )}
                />

                <Readout
                  label="Work"
                  value={`${(
                    workJ / 1000
                  ).toFixed(
                    2,
                  )} kJ`}
                />

                <Readout
                  label="Animation"
                  value={`${playbackRate.toFixed(
                    2,
                  )}×`}
                />
              </div>
            </div>

            <div className="mt-4 grid gap-2">
              <Button
                type="button"
                size="sm"
                variant="primary"
                onClick={
                  handleRun
                }
              >
                {isPlaying
                  ? "Pause Engine"
                  : "Run Engine"}
              </Button>

              <Button
                type="button"
                size="sm"
                variant={
                  engineFocus
                    ? "secondary"
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
                  ? "Exit Focus"
                  : "Focus Engine"}
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
        angularVelocity={
          wheelAngularVelocity
        }
        engineRunning={
          isPlaying
        }
        enginePlaybackRate={
          playbackRate
        }
        engineOverlay={
          <PowerRotationVisualization
            torqueNm={torqueNm}
            angularVelocityRadS={
              angularVelocityRadS
            }
            isPlaying={
              isPlaying
            }
          />
        }
      >
        <EngineMechanism
          isPlaying={
            isPlaying
          }
          playbackRate={
            playbackRate
          }
        />
      </SimulationCanvas>
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
      <div className="flex items-center justify-between gap-3">
        <span className="font-[var(--font-chakra-petch)] text-[10px] font-semibold uppercase tracking-wide text-slate-300">
          {label}
        </span>

        <span className="font-[var(--font-jetbrains-mono)] text-[10px] text-white">
          {value}
        </span>
      </div>

      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={numericValue}
        onChange={(event) =>
          onChange(
            Number(
              event.target.value,
            ),
          )
        }
        className="mt-3 w-full accent-[var(--color-brand-red)]"
      />
    </div>
  );
}

function Readout({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="font-[var(--font-chakra-petch)] text-[9px] uppercase tracking-wide text-slate-500">
        {label}
      </span>

      <span className="font-[var(--font-jetbrains-mono)] text-[10px] text-white">
        {value}
      </span>
    </div>
  );
}