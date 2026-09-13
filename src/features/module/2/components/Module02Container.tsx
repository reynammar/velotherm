"use client";

import { useState } from "react";

import { SimulationSceneNavigator } from "@/src/features/simulation/components/SimulationSceneNavigator";

import { Scene03PistonWork } from "../scenes/Scene03PistonWork";
import { Scene04PVWork } from "../scenes/Scene04PVWork";
import { Scene05PowerRotation } from "../scenes/Scene05PowerRotation";
import { Scene06HeatInternalEnergy } from "../scenes/Scene06HeatInternalEnergy";
import { Scene07FirstLaw } from "../scenes/Scene07FirstLaw";

const SCENES = [
  {
    id: "piston-work",
    label: "03 · Piston Work",
  },
  {
    id: "pv-work",
    label: "04 · P–V Work",
  },
  {
    id: "power-rotation",
    label: "05 · Power",
  },
  {
    id: "heat-internal-energy",
    label: "06 · Heat & Energy",
  },
  {
    id: "first-law",
    label: "07 · First Law",
  },
];

type SceneId =
  | "piston-work"
  | "pv-work"
  | "power-rotation"
  | "heat-internal-energy"
  | "first-law";

export function Module02Container() {
  const [
    activeScene,
    setActiveScene,
  ] = useState<SceneId>(
    "piston-work",
  );

  return (
    <div className="relative">
      {activeScene ===
        "piston-work" && (
        <Scene03PistonWork />
      )}

      {activeScene ===
        "pv-work" && (
        <Scene04PVWork />
      )}

      {activeScene ===
        "power-rotation" && (
        <Scene05PowerRotation />
      )}

      {activeScene ===
        "heat-internal-energy" && (
        <Scene06HeatInternalEnergy />
      )}

      {activeScene ===
        "first-law" && (
        <Scene07FirstLaw />
      )}

      <SimulationSceneNavigator
        scenes={SCENES}
        activeScene={
          activeScene
        }
        onChange={(sceneId) =>
          setActiveScene(
            sceneId as SceneId,
          )
        }
      />
    </div>
  );
}