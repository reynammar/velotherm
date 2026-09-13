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
  SimulationCanvas,
} from "@/src/features/simulation/components/SimulationCanvas";

import {
  VehicleEngineeringLabVisualization,
  type VehicleLabMode,
  type VehicleLabStage,
  getVehicleLabStageLabel,
} from "@/src/features/simulation/components/VehicleEngineeringLabVisualization";

import {
  SimulationShell,
} from "@/src/features/simulation/components/SimulationShell";

import type {
  CarFocusComponent,
} from "@/src/features/simulation/components/CarModel";

import {
  calculateVehicleMotion,
} from "@/src/lib/physics/vehicleMotion";

import {
  calculateDriveLab,
  calculateDriveVisualSpeed,
  calculateKineticEnergyKJ,
  calculateRegenLab,
  calculateBrakingSpeedKmh,
  calculateWheelAngularVelocityFromKmh,
  calculateRoadSpeedMps,
} from "@/src/lib/physics/vehicleEngineeringLab";

const DEFAULT_INPUT_POWER_KW =
  70;

const DEFAULT_EFFICIENCY =
  0.82;

const DEFAULT_MASS_KG =
  1200;

const DEFAULT_INITIAL_SPEED_KMH =
  80;

const DEFAULT_RECOVERY_EFFICIENCY =
  0.78;

const BRAKE_DURATION_MS =
  3600;

const MIN_SPEED_KMH =
  20;

const MAX_SPEED_KMH =
  120;

type LabStageInfo = {
  title: string;

  description: string;
};

function getStageInfo(
  stage:
    | VehicleLabStage
    | null,
  mode: VehicleLabMode,
): LabStageInfo {
  if (
    mode ===
    "regen"
  ) {
    switch (stage) {
      case "wheel":
        return {
          title:
            "Wheel",
          description:
            "The moving wheel represents the vehicle's kinetic energy before regenerative braking.",
        };

      case "generator":
        return {
          title:
            "Generator",
          description:
            "During braking, the generator receives energy from the rotating drivetrain.",
        };

      case "battery":
        return {
          title:
            "Battery",
          description:
            "Recovered electrical energy is represented as stored energy in the hybrid battery.",
        };

      default:
        return {
          title:
            getVehicleLabStageLabel(
              stage,
            ),
          description:
            "Select a highlighted component to inspect its role in the vehicle energy system.",
        };
    }
  }

  switch (stage) {
    case "engine":
      return {
        title:
          "Engine",
        description:
          "The engine provides the initial energy input for the forward hybrid energy path.",
      };

    case "generator":
      return {
        title:
          "Generator",
        description:
          "Mechanical energy enters the generator and becomes part of the electrical energy path.",
      };

    case "inverter":
      return {
        title:
          "Inverter",
        description:
          "The inverter represents electrical energy transfer toward the electric motor.",
      };

    case "motor":
      return {
        title:
          "E-Motor",
        description:
          "The electric motor converts electrical input into useful mechanical output.",
      };

    default:
      return {
        title:
          getVehicleLabStageLabel(
            stage,
          ),
        description:
          "Select a highlighted component to inspect its role in the vehicle energy system.",
      };
  }
}

export function Scene10VehicleEngineeringLab() {
  const [
    mode,
    setMode,
  ] =
    useState<VehicleLabMode>(
      "drive",
    );

  const [
    inputPowerKw,
    setInputPowerKw,
  ] =
    useState(
      DEFAULT_INPUT_POWER_KW,
    );

  const [
    efficiency,
    setEfficiency,
  ] =
    useState(
      DEFAULT_EFFICIENCY,
    );

  const [
    massKg,
    setMassKg,
  ] =
    useState(
      DEFAULT_MASS_KG,
    );

  const [
    initialSpeedKmh,
    setInitialSpeedKmh,
  ] =
    useState(
      DEFAULT_INITIAL_SPEED_KMH,
    );

  const [
    recoveryEfficiency,
    setRecoveryEfficiency,
  ] =
    useState(
      DEFAULT_RECOVERY_EFFICIENCY,
    );

  const [
    isDriving,
    setIsDriving,
  ] =
    useState(false);

  const [
    isBraking,
    setIsBraking,
  ] =
    useState(false);

  const [
    brakeProgress,
    setBrakeProgress,
  ] =
    useState(0);

  const [
    batteryStoredKJ,
    setBatteryStoredKJ,
  ] =
    useState(0);

  const [
    selectedStage,
    setSelectedStage,
  ] =
    useState<
      VehicleLabStage | null
    >(
      "motor",
    );

  const [
    cameraFocus,
    setCameraFocus,
  ] =
    useState<
      CarFocusComponent | null
    >(
      null,
    );

  const [
    resetKey,
    setResetKey,
  ] =
    useState(0);

  const driveResult =
    useMemo(
      () =>
        calculateDriveLab(
          inputPowerKw,
          efficiency,
        ),
      [
        efficiency,
        inputPowerKw,
      ],
    );

  const regenResult =
    useMemo(
      () =>
        calculateRegenLab(
          massKg,
          initialSpeedKmh,
          recoveryEfficiency,
        ),
      [
        initialSpeedKmh,
        massKg,
        recoveryEfficiency,
      ],
    );

  const driveVisualSpeed =
    calculateDriveVisualSpeed(
      driveResult.usefulPowerKw,
      massKg,
    );

  const vehicleMotion =
    useMemo(
      () =>
        calculateVehicleMotion(
          driveResult.usefulPowerKw,
          isDriving,
        ),
      [
        driveResult.usefulPowerKw,
        isDriving,
      ],
    );

  const brakingSpeed =
    calculateBrakingSpeedKmh(
      initialSpeedKmh,
      brakeProgress,
    );

  const activeRegenKineticEnergy =
    calculateKineticEnergyKJ(
      massKg,
      brakingSpeed,
    );

  const recoveredDuringBrake =
    regenResult.recoveredEnergyKJ *
    brakeProgress;

  const activeSpeedKmh =
    mode ===
    "drive"
      ? isDriving
        ? driveVisualSpeed
        : 0
      : brakingSpeed;

  const wheelAngularVelocity =
    mode ===
    "drive"
      ? vehicleMotion.wheelAngularVelocity
      : calculateWheelAngularVelocityFromKmh(
          activeSpeedKmh,
        );

  const roadSpeedMps =
    mode ===
    "drive"
      ? isDriving
        ? vehicleMotion.roadSpeedMps
        : 0
      : calculateRoadSpeedMps(
          activeSpeedKmh,
        );

  const enginePlaybackRate =
    mode ===
      "drive" &&
    isDriving
      ? 0.65 +
        Math.min(
          driveVisualSpeed /
            120,
          1,
        ) *
          1.35
      : 0;

  const flowIntensity =
    mode ===
    "drive"
      ? Math.min(
          driveResult
            .usefulPowerKw /
            Math.max(
              driveResult
                .inputPowerKw,
              1,
            ),
          1,
        )
      : isBraking
        ? Math.min(
            0.25 +
              brakeProgress *
                0.75,
            1,
          )
        : 0;

  /*
   * =========================================================
   * REGENERATIVE BRAKING
   * =========================================================
   */

  useEffect(() => {
    if (
      !isBraking
    ) {
      return;
    }

    let animationFrameId =
      0;

    const startTimestamp =
      performance.now();

    const animate = (
      timestamp: number,
    ) => {
      const elapsed =
        timestamp -
        startTimestamp;

      const progress =
        Math.min(
          elapsed /
            BRAKE_DURATION_MS,
          1,
        );

      setBrakeProgress(
        progress,
      );

      if (
        progress >=
        1
      ) {
        setIsBraking(
          false,
        );

        setBatteryStoredKJ(
          (current) =>
            current +
            regenResult.recoveredEnergyKJ,
        );

        return;
      }

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
  }, [
    isBraking,
    regenResult.recoveredEnergyKJ,
  ]);

  /*
   * =========================================================
   * STAGE INTERACTION
   * =========================================================
   */

  const handleStageSelect =
    (
      stage: VehicleLabStage,
    ) => {
      setSelectedStage(
        stage,
      );

      setCameraFocus(
        getCameraFocusForStage(
          stage,
        ),
      );
    };

  const handleModelSelect =
    (
      component: CarFocusComponent,
    ) => {
      switch (component) {
        case "engine":
          setSelectedStage(
            "engine",
          );

          setCameraFocus(
            "engine",
          );

          return;

        case "generator":
          setSelectedStage(
            "generator",
          );

          setCameraFocus(
            "generator",
          );

          return;

        case "inverter":
          setSelectedStage(
            "inverter",
          );

          setCameraFocus(
            "inverter",
          );

          return;

        case "electricMotor":
          setSelectedStage(
            "motor",
          );

          setCameraFocus(
            "electricMotor",
          );

          return;

        case "battery":
          setSelectedStage(
            "battery",
          );

          setCameraFocus(
            "battery",
          );

          return;

        default:
          return;
      }
    };

  const handleModeChange =
    (
      nextMode: VehicleLabMode,
    ) => {
      setMode(
        nextMode,
      );

      setIsDriving(
        false,
      );

      setIsBraking(
        false,
      );

      setBrakeProgress(
        0,
      );

      setSelectedStage(
        nextMode ===
          "drive"
          ? "motor"
          : "wheel",
      );

      setCameraFocus(
        null,
      );
    };

  const handleDrive =
    () => {
      setMode(
        "drive",
      );

      setIsBraking(
        false,
      );

      setBrakeProgress(
        0,
      );

      setIsDriving(
        (current) =>
          !current,
      );

      setSelectedStage(
        "motor",
      );
    };

  const handleBrake =
    () => {
      setMode(
        "regen",
      );

      setIsDriving(
        false,
      );

      if (
        brakeProgress >=
        1
      ) {
        setBrakeProgress(
          0,
        );
      }

      setSelectedStage(
        "wheel",
      );

      setCameraFocus(
        null,
      );

      setIsBraking(
        (current) =>
          !current,
      );
    };

  const handleReset =
    () => {
      setMode(
        "drive",
      );

      setInputPowerKw(
        DEFAULT_INPUT_POWER_KW,
      );

      setEfficiency(
        DEFAULT_EFFICIENCY,
      );

      setMassKg(
        DEFAULT_MASS_KG,
      );

      setInitialSpeedKmh(
        DEFAULT_INITIAL_SPEED_KMH,
      );

      setRecoveryEfficiency(
        DEFAULT_RECOVERY_EFFICIENCY,
      );

      setIsDriving(
        false,
      );

      setIsBraking(
        false,
      );

      setBrakeProgress(
        0,
      );

      setBatteryStoredKJ(
        0,
      );

      setSelectedStage(
        "motor",
      );

      setCameraFocus(
        null,
      );

      setResetKey(
        (current) =>
          current + 1,
      );
    };

  const stageInfo =
    getStageInfo(
      selectedStage,
      mode,
    );

  return (
    <SimulationShell
      moduleLabel="Module 03"
      sceneNumber="10"
      sceneLabel="Vehicle Engineering Lab"
      topRight={
        <div
          className="border border-slate-700/80 bg-slate-950/75 px-3 py-2 backdrop-blur-sm sm:px-4"
          style={{
            clipPath:
              "var(--clip-chamfer-sm)",
          }}
        >
          <div className="flex items-center gap-3 sm:gap-4">
            <div>
              <span className="block font-[var(--font-chakra-petch)] text-[7px] uppercase tracking-[0.14em] text-slate-500 sm:text-[8px]">
                Mode
              </span>

              <span
                className={[
                  "font-[var(--font-oswald)] text-lg font-semibold sm:text-xl",
                  mode ===
                    "regen"
                    ? "text-amber-400"
                    : "text-cyan-300",
                ].join(
                  " ",
                )}
              >
                {mode ===
                "regen"
                  ? "REGEN"
                  : "DRIVE"}
              </span>
            </div>

            <span className="h-7 w-px bg-slate-700" />

            <div>
              <span className="block font-[var(--font-chakra-petch)] text-[7px] uppercase tracking-[0.14em] text-slate-500 sm:text-[8px]">
                Vehicle
              </span>

              <span className="font-[var(--font-jetbrains-mono)] text-[8px] text-white">
                {activeSpeedKmh.toFixed(
                  0,
                )}{" "}
                km/h
              </span>
            </div>

            <span className="hidden h-7 w-px bg-slate-700 sm:block" />

            <div className="hidden sm:block">
              <span className="block font-[var(--font-chakra-petch)] text-[7px] uppercase tracking-[0.14em] text-slate-500">
                Battery
              </span>

              <span className="font-[var(--font-jetbrains-mono)] text-[8px] text-white">
                {batteryStoredKJ.toFixed(
                  1,
                )}{" "}
                kJ
              </span>
            </div>
          </div>
        </div>
      }
      bottomContent={
        <div className="grid w-full items-end gap-2 lg:grid-cols-[1.05fr_1.55fr_0.9fr]">
          {/* =================================================
              VEHICLE RESPONSE
          ================================================= */}

          <Panel
            variant="dark"
            className="h-fit min-w-0 overflow-hidden border-slate-700/80 bg-slate-950/80 p-3 backdrop-blur-md sm:p-3.5"
          >
            <div className="flex items-center justify-between gap-3">
              <TechnicalLabel accent="cyan">
                Vehicle Response
              </TechnicalLabel>

              <span className="font-[var(--font-jetbrains-mono)] text-[6px] uppercase text-slate-600">
                LIVE
              </span>
            </div>

            <div className="mt-2 flex items-end gap-2">
              <span className="font-[var(--font-oswald)] text-3xl font-semibold leading-none text-white">
                {activeSpeedKmh.toFixed(
                  0,
                )}
              </span>

              <span className="mb-0.5 font-[var(--font-jetbrains-mono)] text-[8px] text-slate-500">
                km/h
              </span>
            </div>

            <div className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2">
              <Readout
                label="Wheel"
                value={`${wheelAngularVelocity.toFixed(
                  2,
                )} rad/s`}
              />

              <Readout
                label="Road"
                value={`${roadSpeedMps.toFixed(
                  2,
                )} m/s`}
              />

              {mode ===
              "drive" ? (
                <>
                  <Readout
                    label="Useful"
                    value={`${driveResult.usefulPowerKw.toFixed(
                      1,
                    )} kW`}
                  />

                  <Readout
                    label="Loss"
                    value={`${driveResult.lossPowerKw.toFixed(
                      1,
                    )} kW`}
                  />
                </>
              ) : (
                <>
                  <Readout
                    label="Recovered"
                    value={`${recoveredDuringBrake.toFixed(
                      1,
                    )} kJ`}
                  />

                  <Readout
                    label="KE"
                    value={`${activeRegenKineticEnergy.toFixed(
                      1,
                    )} kJ`}
                  />
                </>
              )}
            </div>

            <div className="mt-3 border-t border-slate-800 pt-2.5">
              <span className="block font-[var(--font-chakra-petch)] text-[7px] uppercase tracking-[0.12em] text-slate-600">
                Selected Stage
              </span>

              <span className="mt-1 block truncate font-[var(--font-oswald)] text-lg font-semibold text-white">
                {
                  stageInfo.title
                }
              </span>

              <p className="mt-1 font-[var(--font-jetbrains-mono)] text-[7px] leading-relaxed text-slate-500">
                {
                  stageInfo.description
                }
              </p>
            </div>
          </Panel>

          {/* =================================================
              EXPERIMENT
          ================================================= */}

          <Panel
            variant="dark"
            className="h-fit min-w-0 overflow-hidden border-slate-700/80 bg-slate-950/80 p-3 backdrop-blur-md sm:p-3.5"
          >
            <div className="flex items-center justify-between gap-3">
              <TechnicalLabel>
                Engineering Experiment
              </TechnicalLabel>

              <div className="flex gap-1.5">
                <ModeButton
                  active={
                    mode ===
                    "drive"
                  }
                  label="Drive"
                  onClick={() =>
                    handleModeChange(
                      "drive",
                    )
                  }
                />

                <ModeButton
                  active={
                    mode ===
                    "regen"
                  }
                  label="Regen"
                  onClick={() =>
                    handleModeChange(
                      "regen",
                    )
                  }
                />
              </div>
            </div>

            {mode ===
            "drive" ? (
              <>
                <RangeControl
                  label="Energy Input"
                  value={
                    inputPowerKw
                  }
                  display={`${inputPowerKw} kW`}
                  min={30}
                  max={120}
                  step={5}
                  onChange={
                    setInputPowerKw
                  }
                />

                <RangeControl
                  label="Vehicle Mass"
                  value={
                    massKg
                  }
                  display={`${massKg} kg`}
                  min={800}
                  max={2200}
                  step={100}
                  onChange={
                    setMassKg
                  }
                />

                <RangeControl
                  label="Efficiency"
                  value={
                    efficiency
                  }
                  display={`${(
                    efficiency *
                    100
                  ).toFixed(
                    0,
                  )}%`}
                  min={0.5}
                  max={0.95}
                  step={0.01}
                  onChange={
                    setEfficiency
                  }
                />

                <div className="mt-3 grid grid-cols-2 gap-2">
                  <Button
                    type="button"
                    size="sm"
                    variant="primary"
                    onClick={
                      handleDrive
                    }
                  >
                    {isDriving
                      ? "Stop Drive"
                      : "Run Vehicle"}
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
              </>
            ) : (
              <>
                <RangeControl
                  label="Initial Speed"
                  value={
                    initialSpeedKmh
                  }
                  display={`${initialSpeedKmh} km/h`}
                  min={
                    MIN_SPEED_KMH
                  }
                  max={
                    MAX_SPEED_KMH
                  }
                  step={5}
                  onChange={
                    setInitialSpeedKmh
                  }
                />

                <RangeControl
                  label="Vehicle Mass"
                  value={
                    massKg
                  }
                  display={`${massKg} kg`}
                  min={800}
                  max={2200}
                  step={100}
                  onChange={
                    setMassKg
                  }
                />

                <RangeControl
                  label="Recovery Efficiency"
                  value={
                    recoveryEfficiency
                  }
                  display={`${(
                    recoveryEfficiency *
                    100
                  ).toFixed(
                    0,
                  )}%`}
                  min={0.5}
                  max={0.95}
                  step={0.01}
                  onChange={
                    setRecoveryEfficiency
                  }
                />

                <div className="mt-3 grid grid-cols-2 gap-2">
                  <Button
                    type="button"
                    size="sm"
                    variant="primary"
                    onClick={
                      handleBrake
                    }
                  >
                    {isBraking
                      ? "Braking…"
                      : brakeProgress >=
                          1
                        ? "Brake Again"
                        : "Brake & Recover"}
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
              </>
            )}

            <div className="mt-3 border-t border-slate-800 pt-2.5">
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-cyan-400" />

                  <span className="font-[var(--font-jetbrains-mono)] text-[6px] uppercase text-slate-500">
                    Forward
                  </span>
                </span>

                <span className="flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />

                  <span className="font-[var(--font-jetbrains-mono)] text-[6px] uppercase text-slate-500">
                    Recovery
                  </span>
                </span>

                <span className="ml-auto font-[var(--font-jetbrains-mono)] text-[6px] uppercase text-slate-600">
                  GHOST VIEW
                </span>
              </div>
            </div>
          </Panel>

          {/* =================================================
              ENERGY MAP
          ================================================= */}

          <Panel
            variant="dark"
            className="h-fit min-w-[210px] max-w-full overflow-hidden border-slate-700/80 bg-slate-950/80 p-3 backdrop-blur-md sm:p-3.5"
          >
            <TechnicalLabel>
              Energy Map
            </TechnicalLabel>

            <div className="mt-3 space-y-1.5">
              {getEnergyMap(
                mode,
              ).map(
                (
                  item,
                  index,
                ) => {
                  const active =
                    isEnergyMapActive(
                      mode,
                      index,
                      isDriving,
                      isBraking,
                      brakeProgress,
                    );

                  return (
                    <div
                      key={
                        item
                      }
                      className={[
                        "flex min-w-0 items-center gap-2 border px-2 py-1.5 transition-colors",
                        active
                          ? mode ===
                            "regen"
                            ? "border-amber-500/50 bg-amber-500/10"
                            : "border-cyan-500/50 bg-cyan-500/10"
                          : "border-slate-800 bg-slate-950/50",
                      ].join(
                        " ",
                      )}
                    >
                      <span
                        className={[
                          "h-1.5 w-1.5 shrink-0 rounded-full",
                          active
                            ? mode ===
                              "regen"
                              ? "bg-amber-400"
                              : "bg-cyan-400"
                            : "bg-slate-700",
                        ].join(
                          " ",
                        )}
                      />

                      <span className="min-w-0 truncate font-[var(--font-jetbrains-mono)] text-[7px] text-slate-300">
                        {
                          item
                        }
                      </span>
                    </div>
                  );
                },
              )}
            </div>

            {mode ===
              "regen" &&
              batteryStoredKJ >
                0 && (
                <div className="mt-3 border-t border-slate-800 pt-2.5">
                  <span className="block font-[var(--font-chakra-petch)] text-[7px] uppercase tracking-[0.12em] text-slate-500">
                    Battery Storage
                  </span>

                  <span className="mt-1 block font-[var(--font-oswald)] text-2xl font-semibold text-amber-300">
                    {batteryStoredKJ.toFixed(
                      1,
                    )}{" "}
                    <span className="text-[9px] text-slate-500">
                      kJ
                    </span>
                  </span>
                </div>
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

        /**
         * IMPORTANT:
         *
         * The car remains visible.
         * Its body uses the existing focus
         * transparency treatment so the
         * internal architecture remains visible.
         */
        showCarModel={
          true
        }

        transparentCar={
          true
        }

        cameraFocus={
          cameraFocus
        }

        focusVerticalOffset={
          0.62
        }

        focusDistanceMultiplier={
          2.15
        }

        focusMinimumDistance={
          2.65
        }

        focusCameraOffset={[
          0,
          0.05,
          -0.15,
        ]}

        minDistance={
          2
        }

        maxDistance={
          14
        }

        cameraPosition={[
          6.2,
          2.45,
          6.5,
        ]}

        cameraTarget={[
          0,
          1.15,
          -1.15,
        ]}

        angularVelocity={
          wheelAngularVelocity
        }

        motionSpeedMs={
          roadSpeedMps
        }

        engineRunning={
          false
        }

        enginePlaybackRate={
          enginePlaybackRate
        }

        onNodeSelect={
          handleModelSelect
        }
      >
        <VehicleEngineeringLabVisualization
          mode={
            mode
          }
          active={
            mode ===
              "drive"
              ? isDriving
              : isBraking
          }
          intensity={
            flowIntensity
          }
          selectedStage={
            selectedStage
          }
          onSelectStage={
            handleStageSelect
          }
        />
      </SimulationCanvas>
    </SimulationShell>
  );
}

function getCameraFocusForStage(
  stage: VehicleLabStage,
): CarFocusComponent | null {
  switch (stage) {
    case "engine":
      return "engine";

    case "generator":
      return "generator";

    case "inverter":
      return "inverter";

    case "motor":
      return "electricMotor";

    case "battery":
      return "battery";

    case "wheel":
      return null;

    default:
      return null;
  }
}

function Readout({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="min-w-0">
      <span className="block truncate font-[var(--font-chakra-petch)] text-[6px] uppercase tracking-wide text-slate-600">
        {
          label
        }
      </span>

      <span className="mt-0.5 block truncate font-[var(--font-jetbrains-mono)] text-[8px] text-white">
        {
          value
        }
      </span>
    </div>
  );
}

function RangeControl({
  label,
  value,
  display,
  min,
  max,
  step,
  onChange,
}: {
  label: string;
  value: number;
  display: string;
  min: number;
  max: number;
  step: number;
  onChange: (
    value: number,
  ) => void;
}) {
  return (
    <div className="mt-2.5">
      <div className="flex items-center justify-between gap-3">
        <span className="min-w-0 truncate font-[var(--font-chakra-petch)] text-[8px] uppercase tracking-wide text-slate-400">
          {
            label
          }
        </span>

        <span className="shrink-0 font-[var(--font-jetbrains-mono)] text-[8px] text-white">
          {
            display
          }
        </span>
      </div>

      <input
        type="range"
        min={
          min
        }
        max={
          max
        }
        step={
          step
        }
        value={
          value
        }
        onChange={(
          event,
        ) =>
          onChange(
            Number(
              event.target
                .value,
            ),
          )
        }
        className="mt-1.5 w-full accent-[var(--color-brand-red)]"
      />
    </div>
  );
}

function ModeButton({
  active,
  label,
  onClick,
}: {
  active: boolean;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={
        onClick
      }
      className={[
        "border px-2 py-1 font-[var(--font-jetbrains-mono)] text-[6px] font-semibold uppercase whitespace-nowrap",
        active
          ? "border-cyan-400 bg-cyan-500/10 text-cyan-300"
          : "border-slate-700 bg-slate-950/60 text-slate-500 hover:border-slate-500 hover:text-white",
      ].join(
        " ",
      )}
    >
      {
        label
      }
    </button>
  );
}

function getEnergyMap(
  mode: VehicleLabMode,
) {
  if (
    mode ===
    "regen"
  ) {
    return [
      "WHEEL · KINETIC ENERGY",
      "GENERATOR · ELECTRICAL CONVERSION",
      "BATTERY · RECOVERED ENERGY",
    ];
  }

  return [
    "ENGINE · ENERGY INPUT",
    "GENERATOR · CONVERSION",
    "INVERTER · ELECTRICAL TRANSFER",
    "E-MOTOR · USEFUL OUTPUT",
    "WHEEL · VEHICLE MOTION",
  ];
}

function isEnergyMapActive(
  mode: VehicleLabMode,
  index: number,
  isDriving: boolean,
  isBraking: boolean,
  brakeProgress: number,
) {
  if (
    mode ===
    "drive"
  ) {
    return isDriving;
  }

  if (!isBraking) {
    return index ===
      0;
  }

  if (
    index ===
    0
  ) {
    return true;
  }

  if (
    index ===
    1
  ) {
    return (
      brakeProgress >=
      0.2
    );
  }

  return (
    brakeProgress >=
    0.65
  );
}