"use client";

import { useState } from "react";

import { SimulationSceneNavigator } from "@/src/features/simulation/components/SimulationSceneNavigator";

import { Scene01KineticEnergy } from "../scenes/Scene01KineticEnergy";
import { Scene02PotentialEnergy } from "../scenes/Scene02PotentialEnergy";

const SCENES = [
  {
    id: "kinetic-energy",
    label: "01 · Kinetic Energy",
  },
  {
    id: "potential-energy",
    label: "02 · Potential Energy",
  },
];

type SceneId =
  | "kinetic-energy"
  | "potential-energy";

export function Module01Container() {
  const [
    activeScene,
    setActiveScene,
  ] = useState<SceneId>(
    "kinetic-energy",
  );

  return (
    <div className="relative">
      {activeScene ===
        "kinetic-energy" && (
        <Scene01KineticEnergy />
      )}

      {activeScene ===
        "potential-energy" && (
        <Scene02PotentialEnergy />
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