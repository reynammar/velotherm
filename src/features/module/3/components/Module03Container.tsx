"use client";

import {
  useState,
} from "react";

import {
  SimulationSceneNavigator,
} from "@/src/features/simulation/components/SimulationSceneNavigator";

import {
  Scene08EngineEnergyConversion,
} from "../scenes/Scene08EngineEnergyConversion";

import {
  Scene09InternalEngineARView,
} from "../scenes/Scene09InternalEngineARView";

import {
  Scene10VehicleEngineeringLab,
} from "../scenes/Scene10VehicleEngineeringLab";

const SCENES = [
  {
    id:
      "engine-energy-conversion",
    label:
      "08 · Engine Energy Conversion",
  },
  {
    id:
      "internal-engine-ar",
    label:
      "09 · Cycles & Efficiency",
  },
  {
    id:
      "vehicle-engineering-lab",
    label:
      "10 · Vehicle Engineering Lab",
  },
];

type SceneId =
  | "engine-energy-conversion"
  | "internal-engine-ar"
  | "vehicle-engineering-lab";

export function Module03Container() {
  const [
    activeScene,
    setActiveScene,
  ] =
    useState<SceneId>(
      "engine-energy-conversion",
    );

  return (
    <div className="relative">
      {activeScene ===
        "engine-energy-conversion" && (
        <Scene08EngineEnergyConversion />
      )}

      {activeScene ===
        "internal-engine-ar" && (
        <Scene09InternalEngineARView />
      )}

      {activeScene ===
        "vehicle-engineering-lab" && (
        <Scene10VehicleEngineeringLab />
      )}

      <SimulationSceneNavigator
        scenes={
          SCENES
        }
        activeScene={
          activeScene
        }
        onChange={(
          sceneId,
        ) =>
          setActiveScene(
            sceneId as SceneId,
          )
        }
      />
    </div>
  );
}