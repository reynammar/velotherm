"use client";

import {
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
  PistonWorkVisualization,
} from "@/src/features/simulation/components/PistonWorkVisualization";

import {
  calculateWork,
  joulesToKilojoules,
} from "@/src/lib/physics/work";

const DEFAULT_FORCE_N = 1000;

const DEFAULT_DISPLACEMENT_M = 0.2;

const MIN_ENGINE_PLAYBACK_RATE = 0.5;

const MAX_ENGINE_PLAYBACK_RATE = 2;

function mapForceToPlaybackRate(
  forceN: number,
): number {
  const normalizedForce =
    Math.min(
      Math.max(
        forceN / 5000,
        0,
      ),
      1,
    );

  return (
    MIN_ENGINE_PLAYBACK_RATE +
    normalizedForce *
      (MAX_ENGINE_PLAYBACK_RATE -
        MIN_ENGINE_PLAYBACK_RATE)
  );
}

export function Scene03PistonWork() {
  const [
    forceN,
    setForceN,
  ] = useState(
    DEFAULT_FORCE_N,
  );

  const [
    displacementM,
    setDisplacementM,
  ] = useState(
    DEFAULT_DISPLACEMENT_M,
  );

  const [
    isPlaying,
    setIsPlaying,
  ] = useState(false);

  const [
    engineFocus,
    setEngineFocus,
  ] = useState(false);

  const workJ =
    calculateWork(
      forceN,
      displacementM,
    );

  const workKJ =
    joulesToKilojoules(
      workJ,
    );

  const playbackRate =
    useMemo(
      () =>
        mapForceToPlaybackRate(
          forceN,
        ),
      [forceN],
    );

  const handleEngineToggle =
    () => {
      setEngineFocus(
        (current) =>
          !current,
      );
    };

  const handleEnginePlay =
    () => {
      setEngineFocus(true);

      setIsPlaying(
        (current) =>
          !current,
      );
    };

  const handleReset = () => {
    setForceN(
      DEFAULT_FORCE_N,
    );

    setDisplacementM(
      DEFAULT_DISPLACEMENT_M,
    );

    setIsPlaying(false);

    setEngineFocus(false);
  };

  return (
    <SimulationShell
      moduleLabel="Module 02"
      sceneNumber="03"
      sceneLabel="Piston Work"
      topRight={
        <div
          className="border border-slate-700/80 bg-slate-950/75 px-3 py-2 backdrop-blur-sm sm:px-4"
          style={{
            clipPath:
              "var(--clip-chamfer-sm)",
          }}
        >
          <div className="flex items-center gap-3">
            <div>
              <span className="block font-[var(--font-chakra-petch)] text-[8px] uppercase tracking-[0.14em] text-slate-500">
                Work
              </span>

              <span className="font-[var(--font-oswald)] text-lg font-semibold text-white">
                {workJ.toFixed(
                  0,
                )}{" "}
                J
              </span>
            </div>

            <div className="h-7 w-px bg-slate-700" />

            <div>
              <span className="block font-[var(--font-chakra-petch)] text-[8px] uppercase tracking-[0.14em] text-slate-500">
                Engine
              </span>

              <span className="font-[var(--font-jetbrains-mono)] text-[9px] font-semibold uppercase text-[var(--color-brand-red)]">
                {isPlaying
                  ? "Running"
                  : "Paused"}
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
                Work
              </TechnicalLabel>

              <span className="font-[var(--font-jetbrains-mono)] text-[9px] text-slate-500">
                W = FΔs
              </span>
            </div>

            <div className="mt-3 flex items-end gap-2">
              <span className="font-[var(--font-oswald)] text-4xl font-semibold leading-none text-white sm:text-5xl">
                {workJ.toFixed(
                  2,
                )}
              </span>

              <span className="mb-1 font-[var(--font-jetbrains-mono)] text-xs text-slate-400">
                J
              </span>
            </div>

            <p className="mt-3 font-[var(--font-jetbrains-mono)] text-[9px] text-slate-500">
              = {forceN} ×{" "}
              {displacementM.toFixed(
                2,
              )}
            </p>
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
                    Force
                  </span>

                  <span className="font-[var(--font-jetbrains-mono)] text-[10px] text-white">
                    {forceN} N
                  </span>
                </div>

                <input
                  id="work-force"
                  type="range"
                  min="0"
                  max="5000"
                  step="100"
                  value={forceN}
                  onChange={(event) =>
                    setForceN(
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
                    Displacement
                  </span>

                  <span className="font-[var(--font-jetbrains-mono)] text-[10px] text-white">
                    {displacementM.toFixed(
                      2,
                    )}{" "}
                    m
                  </span>
                </div>

                <input
                  id="work-displacement"
                  type="range"
                  min="0"
                  max="0.5"
                  step="0.01"
                  value={
                    displacementM
                  }
                  onChange={(event) =>
                    setDisplacementM(
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
            className="flex min-w-[190px] flex-col justify-between border-slate-700/80 bg-slate-950/78 p-4 backdrop-blur-md sm:p-5"
          >
            <div>
              <TechnicalLabel>
                Engine
              </TechnicalLabel>

              <div className="mt-4 space-y-2">
                <div className="flex items-center justify-between gap-3">
                  <span className="font-[var(--font-chakra-petch)] text-[9px] uppercase tracking-wide text-slate-500">
                    Force Mapping
                  </span>

                  <span className="font-[var(--font-jetbrains-mono)] text-[10px] text-white">
                    {playbackRate.toFixed(
                      2,
                    )}x
                  </span>
                </div>

                <div className="flex items-center justify-between gap-3">
                  <span className="font-[var(--font-chakra-petch)] text-[9px] uppercase tracking-wide text-slate-500">
                    Displacement
                  </span>

                  <span className="font-[var(--font-jetbrains-mono)] text-[10px] text-white">
                    {displacementM.toFixed(
                      2,
                    )}{" "}
                    m
                  </span>
                </div>

                <div className="flex items-center justify-between gap-3">
                  <span className="font-[var(--font-chakra-petch)] text-[9px] uppercase tracking-wide text-slate-500">
                    Work
                  </span>

                  <span className="font-[var(--font-jetbrains-mono)] text-[10px] text-white">
                    {workKJ.toFixed(
                      2,
                    )}{" "}
                    kJ
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-4 grid gap-2">
              <Button
                type="button"
                size="sm"
                variant="primary"
                onClick={
                  handleEnginePlay
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
                onClick={
                  handleEngineToggle
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
          4.8,
          2.2,
          4.3,
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
          playbackRate
        }

        engineOverlay={
          <PistonWorkVisualization
            forceN={forceN}
            displacementM={
              displacementM
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