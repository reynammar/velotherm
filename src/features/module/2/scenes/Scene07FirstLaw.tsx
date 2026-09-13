"use client";

import {
  useMemo,
  useState,
} from "react";

import { Button } from "@/src/shared/components/Button";
import { Panel } from "@/src/shared/components/Panel";
import { TechnicalLabel } from "@/src/shared/components/TechnicalLabel";

import { SimulationShell } from "@/src/features/simulation/components/SimulationShell";
import { SimulationCanvas } from "@/src/features/simulation/components/SimulationCanvas";
import { EngineMechanism } from "@/src/features/simulation/components/EngineMechanism";
import { FirstLawEnergyVisualization } from "@/src/features/simulation/components/FirstLawEnergyVisualization";

import {
  calculateFirstLawBalance,
  getEnergyState,
} from "@/src/lib/physics/firstLaw";

const DEFAULT_HEAT_INPUT_KJ = 60;
const DEFAULT_WORK_OUTPUT_KJ = 40;

const MAX_HEAT_INPUT_KJ = 100;
const MAX_WORK_OUTPUT_KJ = 100;

export function Scene07FirstLaw() {
  const [
    heatInputKJ,
    setHeatInputKJ,
  ] = useState(
    DEFAULT_HEAT_INPUT_KJ,
  );

  const [
    workOutputKJ,
    setWorkOutputKJ,
  ] = useState(
    DEFAULT_WORK_OUTPUT_KJ,
  );

  const [
    isPlaying,
    setIsPlaying,
  ] = useState(false);

  const [
    engineFocus,
    setEngineFocus,
  ] = useState(false);

  const balance =
    useMemo(
      () =>
        calculateFirstLawBalance({
          heatInputKJ,
          workOutputKJ,
        }),
      [
        heatInputKJ,
        workOutputKJ,
      ],
    );

  const energyState =
    getEnergyState(
      balance.deltaEnergyKJ,
    );

  const playbackRate =
    0.5 +
    (workOutputKJ /
      MAX_WORK_OUTPUT_KJ) *
      1.5;

  const handleHeatChange = (
    value: number,
  ) => {
    setHeatInputKJ(value);
    setIsPlaying(false);
  };

  const handleWorkChange = (
    value: number,
  ) => {
    setWorkOutputKJ(value);
    setIsPlaying(false);
  };

  const handleReset = () => {
    setHeatInputKJ(
      DEFAULT_HEAT_INPUT_KJ,
    );

    setWorkOutputKJ(
      DEFAULT_WORK_OUTPUT_KJ,
    );

    setIsPlaying(false);
    setEngineFocus(false);
  };

  const handleRun = () => {
    setEngineFocus(true);

    setIsPlaying(
      (current) =>
        !current,
    );
  };

  return (
    <SimulationShell
      moduleLabel="Module 02"
      sceneNumber="07"
      sceneLabel="First Law & Energy Balance"
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
                ΔE
              </span>

              <span
                className={[
                  "font-[var(--font-oswald)] text-lg font-semibold",
                  energyState ===
                  "STORING"
                    ? "text-cyan-400"
                    : energyState ===
                        "RELEASING"
                      ? "text-amber-400"
                      : "text-white",
                ].join(" ")}
              >
                {balance.deltaEnergyKJ.toFixed(
                  1,
                )}{" "}
                kJ
              </span>
            </div>

            <div className="h-7 w-px bg-slate-700" />

            <div>
              <span className="block font-[var(--font-chakra-petch)] text-[8px] uppercase tracking-[0.14em] text-slate-500">
                System
              </span>

              <span className="font-[var(--font-jetbrains-mono)] text-[9px] font-semibold uppercase text-[var(--color-brand-red)]">
                {energyState}
              </span>
            </div>
          </div>
        </div>
      }
      bottomContent={
        <div className="grid gap-3 lg:grid-cols-[1fr_1.6fr_auto]">
          <Panel
            variant="dark"
            className="border-slate-700/80 bg-slate-950/80 p-4 backdrop-blur-md sm:p-5"
          >
            <TechnicalLabel accent="cyan">
              Energy Ledger
            </TechnicalLabel>

            <div className="mt-4 space-y-3">
              <LedgerRow
                label="Heat In"
                value={`+ ${heatInputKJ.toFixed(
                  1,
                )} kJ`}
                accent="red"
              />

              <LedgerRow
                label="Work Out"
                value={`− ${workOutputKJ.toFixed(
                  1,
                )} kJ`}
              />

              <div className="border-t border-slate-700 pt-3">
                <LedgerRow
                  label="ΔE"
                  value={`${balance.deltaEnergyKJ.toFixed(
                    1,
                  )} kJ`}
                  accent="cyan"
                />
              </div>
            </div>

            <div className="mt-4 border-t border-slate-700 pt-3">
              <span className="font-[var(--font-jetbrains-mono)] text-[10px] text-slate-300">
                ΔE = Q − W
              </span>

              <p className="mt-1 font-[var(--font-jetbrains-mono)] text-[9px] text-slate-500">
                ={" "}
                {heatInputKJ.toFixed(
                  1,
                )}{" "}
                −{" "}
                {workOutputKJ.toFixed(
                  1,
                )}
              </p>
            </div>
          </Panel>

          <Panel
            variant="dark"
            className="border-slate-700/80 bg-slate-950/80 p-4 backdrop-blur-md sm:p-5"
          >
            <TechnicalLabel>
              Energy Transfer
            </TechnicalLabel>

            <div className="mt-4 grid gap-5 sm:grid-cols-2">
              <EnergySlider
                label="Heat Input · Q"
                value={
                  heatInputKJ
                }
                min={0}
                max={
                  MAX_HEAT_INPUT_KJ
                }
                step={5}
                unit="kJ"
                onChange={
                  handleHeatChange
                }
              />

              <EnergySlider
                label="Work Output · W"
                value={
                  workOutputKJ
                }
                min={0}
                max={
                  MAX_WORK_OUTPUT_KJ
                }
                step={5}
                unit="kJ"
                onChange={
                  handleWorkChange
                }
              />
            </div>

            <div className="mt-6 border-t border-slate-700 pt-5">
              <TechnicalLabel>
                System Response
              </TechnicalLabel>

              <div className="mt-3 grid grid-cols-3 gap-2">
                <ResponseMetric
                  label="Input"
                  value={`${heatInputKJ.toFixed(
                    0,
                  )} kJ`}
                />

                <ResponseMetric
                  label="Output"
                  value={`${workOutputKJ.toFixed(
                    0,
                  )} kJ`}
                />

                <ResponseMetric
                  label="Balance"
                  value={`${balance.deltaEnergyKJ.toFixed(
                    0,
                  )} kJ`}
                />
              </div>
            </div>
          </Panel>

          <Panel
            variant="dark"
            className="flex min-w-[190px] flex-col justify-between border-slate-700/80 bg-slate-950/80 p-4 backdrop-blur-md sm:p-5"
          >
            <div>
              <TechnicalLabel>
                Engine System
              </TechnicalLabel>

              <div className="mt-4 space-y-2">
                <SystemReadout
                  label="Heat"
                  value={
                    isPlaying
                      ? "ACTIVE"
                      : "READY"
                  }
                />

                <SystemReadout
                  label="Energy State"
                  value={
                    energyState
                  }
                />

                <SystemReadout
                  label="ΔE"
                  value={`${balance.deltaEnergyKJ.toFixed(
                    1,
                  )} kJ`}
                />

                <SystemReadout
                  label="Engine"
                  value={`${playbackRate.toFixed(
                    2,
                  )}×`}
                />
              </div>
            </div>

            <div className="mt-5 grid gap-2">
              <Button
                type="button"
                size="sm"
                variant="primary"
                onClick={
                  handleRun
                }
              >
                {isPlaying
                  ? "Pause System"
                  : "Run System"}
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
          5.4,
          2.5,
          5.7,
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
          <FirstLawEnergyVisualization
            heatInputKJ={
              heatInputKJ
            }
            workOutputKJ={
              workOutputKJ
            }
            deltaEnergyKJ={
              balance.deltaEnergyKJ
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

function LedgerRow({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent?:
    | "red"
    | "cyan";
}) {
  const valueClass =
    accent === "red"
      ? "text-red-400"
      : accent === "cyan"
        ? "text-cyan-400"
        : "text-white";

  return (
    <div className="flex items-center justify-between gap-4">
      <span className="font-[var(--font-chakra-petch)] text-[9px] uppercase tracking-wide text-slate-500">
        {label}
      </span>

      <span
        className={`font-[var(--font-jetbrains-mono)] text-[10px] ${valueClass}`}
      >
        {value}
      </span>
    </div>
  );
}

function EnergySlider({
  label,
  value,
  min,
  max,
  step,
  unit,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  unit: string;
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
          {value} {unit}
        </span>
      </div>

      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(event) =>
          onChange(
            Number(
              event.target.value,
            ),
          )
        }
        className="mt-3 w-full accent-[var(--color-brand-red)]"
      />

      <div className="mt-2 flex justify-between font-[var(--font-jetbrains-mono)] text-[8px] text-slate-500">
        <span>
          {min} {unit}
        </span>

        <span>
          {max} {unit}
        </span>
      </div>
    </div>
  );
}

function ResponseMetric({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="border border-slate-800 bg-slate-950/50 px-3 py-2">
      <span className="block font-[var(--font-chakra-petch)] text-[7px] uppercase tracking-wide text-slate-500">
        {label}
      </span>

      <span className="mt-1 block font-[var(--font-jetbrains-mono)] text-[9px] text-white">
        {value}
      </span>
    </div>
  );
}

function SystemReadout({
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

      <span className="font-[var(--font-jetbrains-mono)] text-[9px] font-semibold uppercase text-white">
        {value}
      </span>
    </div>
  );
}