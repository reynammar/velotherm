"use client";

import { useEffect, useMemo } from "react";
import { useGLTF } from "@react-three/drei";

import {
  createCarNodeRegistry,
  type CarNodeRegistry,
} from "@/src/lib/three/nodeRegistry";

const MODEL_PATH = "/models/velotherm-master.glb";

type CarModelProps = {
  onNodesReady?: (nodes: CarNodeRegistry) => void;
};

export function CarModel({
  onNodesReady,
}: CarModelProps) {
  const { scene, animations } = useGLTF(MODEL_PATH);

  const nodes = useMemo(
    () => createCarNodeRegistry(scene),
    [scene],
  );

  useEffect(() => {
    console.log("[VELOTHERM] Car model loaded");

    console.log(
      "[VELOTHERM] Animations:",
      animations.map((clip) => clip.name),
    );

    console.log(
      "[VELOTHERM] Node registry:",
      nodes,
    );

    onNodesReady?.(nodes);
  }, [animations, nodes, onNodesReady]);

  return (
    <primitive
      object={scene}
      dispose={null}
    />
  );
}

useGLTF.preload(MODEL_PATH);