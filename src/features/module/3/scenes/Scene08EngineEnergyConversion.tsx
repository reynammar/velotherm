"use client";

import {
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
  HybridComponent,
} from "@/src/features/simulation/components/HybridSystem";

import type {
  CarFocusComponent,
} from "@/src/features/simulation/components/CarModel";

import {
  calculateEnergyConversion,
} from "@/src/lib/physics/energyConversion";

import {
  calculateVehicleMotion,
} from "@/src/lib/physics/vehicleMotion";

const COMPONENTS: Array<{
  id: HybridComponent;
  label: string;
}> = [
  {
    id: "generator",
    label: "Generator",
  },
  {
    id: "inverter",
    label: "Inverter",
  },
  {
    id: "electricMotor",
    label: "E-Motor",
  },
  {
    id: "battery",
    label: "Battery",
  },
];

export function Scene08EngineEnergyConversion() {
  const [
    inputPowerKw,
    setInputPowerKw,
  ] = useState(60);

  const [
    efficiency,
    setEfficiency,
  ] = useState(0.82);

  const [
    running,
    setRunning,
  ] = useState(false);

  const [
    selectedComponent,
    setSelectedComponent,
  ] =
    useState<CarFocusComponent | null>(
      null,
    );

  const [
    resetKey,
    setResetKey,
  ] = useState(0);

  const conversion =
    useMemo(
      () =>
        calculateEnergyConversion(
          inputPowerKw,
          efficiency,
        ),
      [
        inputPowerKw,
        efficiency,
      ],
    );

  /**
   * Vehicle motion is derived from the
   * calculated electrical output.
   *
   * This makes the visual feedback respond
   * directly to the experiment parameters.
   */
  const vehicleMotion =
    useMemo(
      () =>
        calculateVehicleMotion(
          conversion.outputPowerKw,
          running,
        ),
      [
        conversion.outputPowerKw,
        running,
      ],
    );

  /**
   * Engine playback follows the same output
   * power intensity as the vehicle motion.
   */
  const playbackRate =
    running
      ? 0.65 +
        vehicleMotion.intensity *
          1.35
      : 0;

  const selectedHybridComponent =
    selectedComponent ===
      "generator" ||
    selectedComponent ===
      "inverter" ||
    selectedComponent ===
      "electricMotor" ||
    selectedComponent ===
      "battery"
      ? selectedComponent
      : null;

  const handleSelect =
    (
      component: CarFocusComponent,
    ) => {
      setSelectedComponent(
        component,
      );
    };

  const handleComponentButton =
    (
      component: HybridComponent,
    ) => {
      setSelectedComponent(
        component,
      );
    };

  const handleReset = () => {
    setInputPowerKw(60);

    setEfficiency(0.82);

    setRunning(false);

    setSelectedComponent(
      null,
    );

    setResetKey(
      (current) =>
        current + 1,
    );
  };

  const handleToggleRun =
    () => {
      setRunning(
        (current) =>
          !current,
      );
    };

  const handleExitFocus =
    () => {
      setSelectedComponent(
        null,
      );
    };

  return (
    <SimulationShell
      moduleLabel="Module 03"
      sceneNumber="08"
      sceneLabel="Engine Energy Conversion"
      topRight={
        <div
          className="border border-slate-700/80 bg-slate-950/75 px-3 py-2 backdrop-blur-sm sm:px-4"
          style={{
            clipPath:
              "var(--clip-chamfer-sm)",
          }}
        >
          <div className="flex items-center gap-3 sm:gap-4">
            {/* SPEED */}

            <div>
              <span className="block font-[var(--font-chakra-petch)] text-[7px] uppercase tracking-[0.14em] text-slate-500 sm:text-[8px]">
                Lab Speed
              </span>

              <span className="font-[var(--font-oswald)] text-lg font-semibold text-white sm:text-xl">
                {vehicleMotion.speedKmh.toFixed(
                  0,
                )}{" "}
                <span className="text-[10px] text-slate-400 sm:text-xs">
                  km/h
                </span>
              </span>
            </div>

            <span className="h-7 w-px bg-slate-700" />

            {/* OUTPUT */}

            <div>
              <span className="block font-[var(--font-chakra-petch)] text-[7px] uppercase tracking-[0.14em] text-slate-500 sm:text-[8px]">
                Output
              </span>

              <span className="font-[var(--font-oswald)] text-lg font-semibold text-white sm:text-xl">
                {conversion.outputPowerKw.toFixed(
                  1,
                )}{" "}
                <span className="text-[10px] text-slate-400 sm:text-xs">
                  kW
                </span>
              </span>
            </div>

            <span className="h-7 w-px bg-slate-700" />

            {/* STATE */}

            <div>
              <span className="block font-[var(--font-chakra-petch)] text-[7px] uppercase tracking-[0.14em] text-slate-500 sm:text-[8px]">
                System
              </span>

              <span
                className={[
                  "font-[var(--font-jetbrains-mono)] text-[7px] font-semibold sm:text-[8px]",
                  running
                    ? "text-cyan-400"
                    : "text-red-400",
                ].join(
                  " ",
                )}
              >
                {running
                  ? "RUNNING"
                  : "PAUSED"}
              </span>
            </div>
          </div>
        </div>
      }
      bottomContent={
        <div className="grid w-full gap-2 lg:grid-cols-[0.82fr_1.8fr_auto]">
          {/* =================================================
              OUTPUT
          ================================================= */}

          <Panel
            variant="dark"
            className="h-fit border-slate-700/80 bg-slate-950/80 p-3 backdrop-blur-md sm:p-4"
          >
            <TechnicalLabel accent="cyan">
              Energy Conversion
            </TechnicalLabel>

            <div className="mt-3">
              <span className="block font-[var(--font-chakra-petch)] text-[8px] uppercase tracking-[0.12em] text-slate-500">
                Output Power
              </span>

              <div className="mt-1 flex items-end gap-2">
                <span className="font-[var(--font-oswald)] text-3xl font-semibold leading-none text-white sm:text-4xl">
                  {conversion.outputPowerKw.toFixed(
                    1,
                  )}
                </span>

                <span className="mb-0.5 font-[var(--font-jetbrains-mono)] text-[9px] text-slate-400">
                  kW
                </span>
              </div>
            </div>

            <div className="mt-3 border-t border-slate-800 pt-3">
              <span className="block font-[var(--font-jetbrains-mono)] text-[8px] text-slate-500">
                Pout = Pin × η
              </span>

              <span className="mt-1 block font-[var(--font-jetbrains-mono)] text-[8px] text-slate-400">
                {inputPowerKw.toFixed(
                  0,
                )}{" "}
                ×{" "}
                {(efficiency *
                  100).toFixed(
                  0,
                )}
                %
              </span>
            </div>

            {/* VISUAL SPEED */}

            <div className="mt-3 border-t border-slate-800 pt-3">
              <span className="block font-[var(--font-chakra-petch)] text-[8px] uppercase tracking-[0.12em] text-slate-500">
                Vehicle Response
              </span>

              <div className="mt-1 flex items-end gap-2">
                <span className="font-[var(--font-oswald)] text-2xl font-semibold leading-none text-white">
                  {vehicleMotion.speedKmh.toFixed(
                    0,
                  )}
                </span>

                <span className="mb-0.5 font-[var(--font-jetbrains-mono)] text-[8px] text-slate-400">
                  km/h
                </span>
              </div>
            </div>
          </Panel>

          {/* =================================================
              EXPERIMENT
          ================================================= */}

          <Panel
            variant="dark"
            className="h-fit border-slate-700/80 bg-slate-950/80 p-3 backdrop-blur-md sm:p-4"
          >
            <TechnicalLabel>
              Conversion Experiment
            </TechnicalLabel>

            {/* INPUT POWER */}

            <div className="mt-3">
              <div className="flex items-center justify-between gap-2">
                <span className="font-[var(--font-chakra-petch)] text-[9px] font-semibold uppercase tracking-wide text-slate-400">
                  Input Power
                </span>

                <span className="font-[var(--font-jetbrains-mono)] text-[8px] text-white">
                  {inputPowerKw}{" "}
                  kW
                </span>
              </div>

              <input
                type="range"
                min={20}
                max={120}
                step={5}
                value={
                  inputPowerKw
                }
                onChange={(
                  event,
                ) =>
                  setInputPowerKw(
                    Number(
                      event.target
                        .value,
                    ),
                  )
                }
                className="mt-2 w-full accent-[var(--color-brand-red)]"
              />
            </div>

            {/* EFFICIENCY */}

            <div className="mt-3">
              <div className="flex items-center justify-between gap-2">
                <span className="font-[var(--font-chakra-petch)] text-[9px] font-semibold uppercase tracking-wide text-slate-400">
                  Efficiency
                </span>

                <span className="font-[var(--font-jetbrains-mono)] text-[8px] text-white">
                  {(
                    efficiency *
                    100
                  ).toFixed(
                    0,
                  )}
                  %
                </span>
              </div>

              <input
                type="range"
                min={0.5}
                max={0.95}
                step={0.01}
                value={
                  efficiency
                }
                onChange={(
                  event,
                ) =>
                  setEfficiency(
                    Number(
                      event.target
                        .value,
                    ),
                  )
                }
                className="mt-2 w-full accent-[var(--color-brand-red)]"
              />
            </div>

            {/* COMPONENT SELECTOR */}

            <div className="mt-4 border-t border-slate-800 pt-3">
              <TechnicalLabel>
                Hybrid Components
              </TechnicalLabel>

              <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-4">
                {COMPONENTS.map(
                  (
                    component,
                  ) => {
                    const active =
                      selectedHybridComponent ===
                      component.id;

                    return (
                      <button
                        key={
                          component.id
                        }
                        type="button"
                        onClick={() =>
                          handleComponentButton(
                            component.id,
                          )
                        }
                        className={[
                          "min-w-0 overflow-hidden border px-2 py-2 transition-colors",
                          "font-[var(--font-chakra-petch)] text-[7px] font-semibold uppercase tracking-[0.04em]",
                          "whitespace-nowrap",
                          active
                            ? "border-cyan-400 bg-cyan-500/15 text-cyan-300"
                            : "border-slate-700 bg-slate-900/55 text-slate-400 hover:border-slate-500 hover:text-white",
                        ].join(
                          " ",
                        )}
                      >
                        <span className="block truncate">
                          {
                            component.label
                          }
                        </span>
                      </button>
                    );
                  },
                )}
              </div>
            </div>
          </Panel>

          {/* =================================================
              SYSTEM
          ================================================= */}

          <Panel
            variant="dark"
            className="h-fit min-w-[220px] border-slate-700/80 bg-slate-950/80 p-3 backdrop-blur-md sm:p-4"
          >
            <TechnicalLabel>
              Hybrid System
            </TechnicalLabel>

            <div className="mt-3 space-y-2">
              <Readout
                label="Input"
                value={`${conversion.inputPowerKw.toFixed(
                  1,
                )} kW`}
              />

              <Readout
                label="Output"
                value={`${conversion.outputPowerKw.toFixed(
                  1,
                )} kW`}
              />

              <Readout
                label="Loss"
                value={`${conversion.lossPowerKw.toFixed(
                  1,
                )} kW`}
              />

              <Readout
                label="Efficiency"
                value={`${(
                  conversion.efficiency *
                  100
                ).toFixed(
                  0,
                )}%`}
              />

              <Readout
                label="Lab Speed"
                value={`${vehicleMotion.speedKmh.toFixed(
                  0,
                )} km/h`}
              />

              <Readout
                label="Wheel Motion"
                value={`${vehicleMotion.wheelAngularVelocity.toFixed(
                  2,
                )} rad/s`}
              />
            </div>

            <div className="mt-4 grid grid-cols-2 gap-2">
              <Button
                type="button"
                size="sm"
                variant="primary"
                onClick={
                  handleToggleRun
                }
              >
                {running
                  ? "Pause"
                  : "Run System"}
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

            {selectedComponent && (
              <button
                type="button"
                onClick={
                  handleExitFocus
                }
                className="mt-2 w-full border border-slate-700 px-2 py-2 font-[var(--font-chakra-petch)] text-[7px] font-semibold uppercase tracking-[0.12em] text-slate-400 transition-colors hover:border-slate-500 hover:text-white"
              >
                Exit Component Focus
              </button>
            )}
          </Panel>
        </div>
      }
    >
      <SimulationCanvas
        fullScreen
        resetKey={
          resetKey
        }
        cameraPosition={[
          5.4,
          2.25,
          5.3,
        ]}
        cameraTarget={[
          0,
          1.1,
          -2.13,
        ]}
        cameraFocus={
          selectedComponent
        }
        angularVelocity={
          vehicleMotion.wheelAngularVelocity
        }
        motionSpeedMs={
          vehicleMotion.roadSpeedMps
        }
        engineRunning={
          running
        }
        enginePlaybackRate={
          playbackRate
        }
        hybrid={{
          inputPowerKw:
            conversion.inputPowerKw,

          efficiency:
            conversion.efficiency,

          running,

          activeComponent:
            selectedHybridComponent,

          onSelect:
            handleSelect,

          resetKey,
        }}
      >
        <EngineMechanism
          isPlaying={
            running
          }
          playbackRate={
            playbackRate
          }
        />
      </SimulationCanvas>
    </SimulationShell>
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
    <div className="flex items-center justify-between gap-3">
      <span className="font-[var(--font-chakra-petch)] text-[8px] uppercase tracking-wide text-slate-500">
        {label}
      </span>

      <span className="font-[var(--font-jetbrains-mono)] text-[8px] text-white">
        {value}
      </span>
    </div>
  );
}