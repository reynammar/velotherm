"use client";

import {
  useState,
} from "react";

import {
  SimulationSceneNavigator,
} from "@/src/features/simulation/components/SimulationSceneNavigator";

import {
  Scene01KineticEnergy,
} from "../scenes/Scene01KineticEnergy";

import {
  Scene02PotentialEnergy,
} from "../scenes/Scene02PotentialEnergy";

import {
  Scene03PistonXRay,
} from "../scenes/Scene03PistonXRay";

const SCENES = [
  {
    id: "kinetic-energy",
    label: "01 · Kinetic Energy",
  },
  {
    id: "potential-energy",
    label: "02 · Potential Energy",
  },
  {
    id: "piston-xray",
    label: "03 · Piston X-Ray",
  },
];

type SceneId =
  | "kinetic-energy"
  | "potential-energy"
  | "piston-xray";

export function Module01Container() {
  const [activeScene, setActiveScene] = useState<SceneId>(
    "kinetic-energy",
  );

  return (
    <div className="relative">
      {activeScene === "kinetic-energy" && (
        <Scene01KineticEnergy />
      )}

      {activeScene === "potential-energy" && (
        <Scene02PotentialEnergy />
      )}

      {activeScene === "piston-xray" && (
        <Scene03PistonXRay />
      )}

      <SimulationSceneNavigator
        scenes={SCENES}
        activeScene={activeScene}
        onChange={(sceneId) => {
          setActiveScene(sceneId as SceneId);
        }}
      />
    </div>
  );
}