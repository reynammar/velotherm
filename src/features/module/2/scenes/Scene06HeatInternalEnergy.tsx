"use client";

import { useState } from "react";

import { Button } from "@/src/shared/components/Button";
import { Panel } from "@/src/shared/components/Panel";
import { TechnicalLabel } from "@/src/shared/components/TechnicalLabel";

import { SimulationShell } from "@/src/features/simulation/components/SimulationShell";

import { SimulationCanvas } from "@/src/features/simulation/components/SimulationCanvas";

import { EngineMechanism } from "@/src/features/simulation/components/EngineMechanism";

import { HeatInternalEnergyVisualization } from "@/src/features/simulation/components/HeatInternalEnergyVisualization";

type HeatTransferMode =
  | "microscopic"
  | "conduction"
  | "convection"
  | "radiation";

const DEFAULT_TEMPERATURE_K = 800;

const DEFAULT_HEAT_RATE_KW = 5;

export function Scene06HeatInternalEnergy() {
  const [
    temperatureK,
    setTemperatureK,
  ] = useState(
    DEFAULT_TEMPERATURE_K,
  );

  const [
    heatRateKW,
    setHeatRateKW,
  ] = useState(
    DEFAULT_HEAT_RATE_KW,
  );

  const [
    mode,
    setMode,
  ] = useState<HeatTransferMode>(
    "microscopic",
  );

  const [
    isPlaying,
    setIsPlaying,
  ] = useState(false);

  const [
    engineFocus,
    setEngineFocus,
  ] = useState(false);

  const temperatureNorm =
    Math.min(
      Math.max(
        (temperatureK - 300) /
          900,
        0,
      ),
      1,
    );

  const thermalActivity =
    Math.round(
      20 +
        temperatureNorm * 80,
    );

  const handleReset = () => {
    setTemperatureK(
      DEFAULT_TEMPERATURE_K,
    );

    setHeatRateKW(
      DEFAULT_HEAT_RATE_KW,
    );

    setMode("microscopic");

    setIsPlaying(false);

    setEngineFocus(false);
  };

  const handleRun = () => {
    setEngineFocus(true);

    setIsPlaying(
      (current) => !current,
    );
  };

  return (
    <SimulationShell
      moduleLabel="Module 02"
      sceneNumber="06"
      sceneLabel="Heat & Internal Energy"
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
                Temperature
              </span>

              <span className="font-[var(--font-oswald)] text-lg font-semibold text-white">
                {temperatureK} K
              </span>
            </div>

            <div className="h-7 w-px bg-slate-700" />

            <div>
              <span className="block font-[var(--font-chakra-petch)] text-[8px] uppercase tracking-[0.14em] text-slate-500">
                Heat Rate
              </span>

              <span className="font-[var(--font-jetbrains-mono)] text-[9px] text-white">
                {heatRateKW.toFixed(
                  1,
                )}{" "}
                kW
              </span>
            </div>
          </div>
        </div>
      }
      bottomContent={
        <div className="grid gap-3 lg:grid-cols-[1fr_1.55fr_auto]">
          {/* =================================================
              INTERNAL ENERGY
          ================================================= */}

          <Panel
            variant="dark"
            className="h-fit border-slate-700/80 bg-slate-950/80 p-4 backdrop-blur-md sm:p-5"
          >
            <div className="flex items-center justify-between gap-3">
              <TechnicalLabel accent="cyan">
                Internal Energy
              </TechnicalLabel>

              <span className="font-[var(--font-jetbrains-mono)] text-[9px] text-slate-500">
                U
              </span>
            </div>

            <div className="mt-4">
              <span className="block font-[var(--font-chakra-petch)] text-[9px] uppercase tracking-wide text-slate-500">
                Microscopic Activity
              </span>

              <div className="mt-2 flex items-end gap-2">
                <span className="font-[var(--font-oswald)] text-4xl font-semibold leading-none text-white sm:text-5xl">
                  {thermalActivity}
                </span>

                <span className="mb-1 font-[var(--font-jetbrains-mono)] text-[10px] text-slate-400">
                  %
                </span>
              </div>

              <div className="mt-4 h-1.5 overflow-hidden bg-slate-800">
                <div
                  className="h-full bg-red-500 transition-[width] duration-200"
                  style={{
                    width: `${thermalActivity}%`,
                  }}
                />
              </div>
            </div>

            <div className="mt-5 border-t border-slate-700 pt-4">
              <p className="font-[var(--font-jetbrains-mono)] text-[9px] leading-relaxed text-slate-400">
                E = KE + PE + U
              </p>

              <p className="mt-2 font-[var(--font-jetbrains-mono)] text-[9px] leading-relaxed text-slate-500">
                ΔE = ΔKE + ΔPE + ΔU
              </p>
            </div>
          </Panel>

          {/* =================================================
              THERMAL EXPERIMENT
          ================================================= */}

          <Panel
            variant="dark"
            className="h-fit border-slate-700/80 bg-slate-950/80 p-4 backdrop-blur-md sm:p-5"
          >
            <TechnicalLabel>
              Thermal Experiment
            </TechnicalLabel>

            <div className="mt-4 grid gap-5 sm:grid-cols-2">
              <ParameterControl
                label="Temperature"
                value={`${temperatureK} K`}
                min={300}
                max={1200}
                step={25}
                numericValue={
                  temperatureK
                }
                onChange={
                  setTemperatureK
                }
              />

              <ParameterControl
                label="Heat Transfer Rate"
                value={`${heatRateKW.toFixed(
                  1,
                )} kW`}
                min={0}
                max={10}
                step={0.5}
                numericValue={
                  heatRateKW
                }
                onChange={
                  setHeatRateKW
                }
              />
            </div>

            {/* =================================================
                VISUALIZATION MODES

                2 columns on small screens.
                4 columns when enough width exists.
            ================================================= */}

            <div className="mt-6 border-t border-slate-700 pt-5">
              <TechnicalLabel>
                Visualization Mode
              </TechnicalLabel>

              <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
                <ModeButton
                  label="Microscopic"
                  active={
                    mode ===
                    "microscopic"
                  }
                  onClick={() =>
                    setMode(
                      "microscopic",
                    )
                  }
                />

                <ModeButton
                  label="Conduction"
                  active={
                    mode ===
                    "conduction"
                  }
                  onClick={() =>
                    setMode(
                      "conduction",
                    )
                  }
                />

                <ModeButton
                  label="Convection"
                  active={
                    mode ===
                    "convection"
                  }
                  onClick={() =>
                    setMode(
                      "convection",
                    )
                  }
                />

                <ModeButton
                  label="Radiation"
                  active={
                    mode ===
                    "radiation"
                  }
                  onClick={() =>
                    setMode(
                      "radiation",
                    )
                  }
                />
              </div>
            </div>
          </Panel>

          {/* =================================================
              ENGINE CONTROLS
          ================================================= */}

          <Panel
            variant="dark"
            className="flex min-w-[190px] flex-col justify-between border-slate-700/80 bg-slate-950/80 p-4 backdrop-blur-md sm:p-5"
          >
            <div>
              <TechnicalLabel>
                Engine
              </TechnicalLabel>

              <div className="mt-4 space-y-3">
                <Readout
                  label="State"
                  value={
                    isPlaying
                      ? "ACTIVE"
                      : "PAUSED"
                  }
                />

                <Readout
                  label="Mode"
                  value={mode.toUpperCase()}
                />

                <Readout
                  label="Thermal Activity"
                  value={`${thermalActivity}%`}
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
                  ? "Pause"
                  : "Run Lab"}
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
          0.8
        }
        engineOverlay={
          <HeatInternalEnergyVisualization
            temperatureK={
              temperatureK
            }
            heatRateKW={
              heatRateKW
            }
            mode={mode}
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
            0.8
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
    <div className="min-w-0">
      <div className="flex items-center justify-between gap-3">
        <span className="min-w-0 truncate font-[var(--font-chakra-petch)] text-[10px] font-semibold uppercase tracking-wide text-slate-300">
          {label}
        </span>

        <span className="shrink-0 font-[var(--font-jetbrains-mono)] text-[10px] text-white">
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

function ModeButton({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={label}
      className={[
        "min-w-0 w-full overflow-hidden border px-2 py-2",
        "font-[var(--font-chakra-petch)]",
        "text-[7px] font-semibold uppercase",
        "tracking-[0.04em] leading-none",
        "transition-colors duration-150",
        "whitespace-nowrap",
        active
          ? "border-[var(--color-brand-red)] bg-[var(--color-brand-red)] text-white"
          : "border-slate-700 bg-slate-900/70 text-slate-400 hover:border-slate-500 hover:text-white",
      ].join(" ")}
    >
      <span className="block w-full truncate">
        {label}
      </span>
    </button>
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

      <span className="max-w-[55%] truncate text-right font-[var(--font-jetbrains-mono)] text-[9px] text-white">
        {value}
      </span>
    </div>
  );
}