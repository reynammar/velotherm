"use client";

import {
  useMemo,
  useRef,
  useState,
} from "react";

import {
  Billboard,
} from "@react-three/drei";

import {
  useFrame,
} from "@react-three/fiber";

import type {
  ThreeEvent,
} from "@react-three/fiber";

import {
  Vector3,
  type Group,
  type Mesh,
  type Object3D,
} from "three";

import {
  CAR_NODE_NAMES,
} from "@/src/lib/three/nodeRegistry";

import {
  emitSimulationInformation,
} from "@/src/features/simulation/utils/simulationHotspotEvents";

type EngineInformationId =
  | "piston1"
  | "crankshaft"
  | "generator"
  | "battery";

type EngineInformationDefinition = {
  id: EngineInformationId;
  nodeName: string;
  title: string;
  description: string;
  topicId: string;
};

type EngineInformationTarget = {
  id: EngineInformationId;
  target: Object3D;
  title: string;
  description: string;
  topicId: string;
};

type EngineInformationMarkerProps = {
  definition: EngineInformationTarget;
  active: boolean;
  onSelect: (
    definition: EngineInformationTarget,
  ) => void;
};

const INFORMATION_DEFINITIONS: EngineInformationDefinition[] = [
  {
    id: "piston1",
    nodeName: CAR_NODE_NAMES.engine.piston1,
    title: "Piston · Boundary Work",
    description:
      "Piston movement changes the system boundary and transfers energy through pressure-volume work.",
    topicId: "boundary-work",
  },
  {
    id: "crankshaft",
    nodeName: CAR_NODE_NAMES.engine.crankshaft,
    title: "Crankshaft · Rotational Power",
    description:
      "The crankshaft converts reciprocating piston motion into rotation, connecting torque and angular velocity with power.",
    topicId: "rotational-power",
  },
  {
    id: "generator",
    nodeName: CAR_NODE_NAMES.hybrid.generator,
    title: "Generator · Energy Conversion",
    description:
      "The generator converts mechanical input from the engine into electrical energy for the hybrid system.",
    topicId: "energy-conversion",
  },
  {
    id: "battery",
    nodeName: CAR_NODE_NAMES.hybrid.battery,
    title: "Battery · Energy Storage",
    description:
      "The battery stores electrical energy that can later be supplied to the vehicle's electric drive system.",
    topicId: "battery-energy",
  },
];

function EngineInformationMarker({
  definition,
  active,
  onSelect,
}: EngineInformationMarkerProps) {
  const markerRef = useRef<Group | null>(null);

  const worldPositionRef = useRef(
    new Vector3(),
  );

  const localPositionRef = useRef(
    new Vector3(),
  );

  useFrame(() => {
    const marker = markerRef.current;

    if (!marker?.parent) {
      return;
    }

    definition.target.getWorldPosition(
      worldPositionRef.current,
    );

    localPositionRef.current.copy(
      worldPositionRef.current,
    );

    marker.parent.worldToLocal(
      localPositionRef.current,
    );

    marker.position.copy(
      localPositionRef.current,
    );

    marker.position.x += 0.12;
    marker.position.y += 0.09;
  });

  const handleSelect = (
    event: ThreeEvent<MouseEvent>,
  ) => {
    event.stopPropagation();
    onSelect(definition);
  };

  const handlePointerDown = (
    event: ThreeEvent<PointerEvent>,
  ) => {
    event.stopPropagation();
  };

  const handlePointerOver = (
    event: ThreeEvent<PointerEvent>,
  ) => {
    event.stopPropagation();
    document.body.style.cursor = "pointer";
  };

  const handlePointerOut = (
    event: ThreeEvent<PointerEvent>,
  ) => {
    event.stopPropagation();
    document.body.style.cursor = "";
  };

  return (
    <group
      ref={markerRef}
      renderOrder={1300}
    >
      <Billboard
        follow
        lockX={false}
        lockY={false}
        lockZ={false}
      >
        <group>
          <mesh
            onClick={handleSelect}
            onPointerDown={handlePointerDown}
            onPointerOver={handlePointerOver}
            onPointerOut={handlePointerOut}
            renderOrder={1300}
          >
            <circleGeometry
              args={[0.085, 24]}
            />

            <meshBasicMaterial
              transparent
              opacity={0}
              depthTest={false}
              depthWrite={false}
            />
          </mesh>

          <mesh
            onClick={handleSelect}
            onPointerDown={handlePointerDown}
            onPointerOver={handlePointerOver}
            onPointerOut={handlePointerOut}
            renderOrder={1301}
          >
            <ringGeometry
              args={[0.035, 0.052, 28]}
            />

            <meshBasicMaterial
              color={
                active
                  ? "#fca5a5"
                  : "#ef4444"
              }
              transparent
              opacity={0.98}
              depthTest={false}
              depthWrite={false}
            />
          </mesh>

          <mesh
            onClick={handleSelect}
            onPointerDown={handlePointerDown}
            onPointerOver={handlePointerOver}
            onPointerOut={handlePointerOut}
            renderOrder={1302}
          >
            <circleGeometry
              args={[0.016, 16]}
            />

            <meshBasicMaterial
              color="#fee2e2"
              depthTest={false}
              depthWrite={false}
            />
          </mesh>
        </group>
      </Billboard>
    </group>
  );
}

export function EngineInformationMarkers({
  scene,
}: {
  scene: Object3D;
}) {
  const [
    activeId,
    setActiveId,
  ] = useState<EngineInformationId | null>(
    null,
  );

  const markerGroupRef =
    useRef<Group | null>(null);

  const bodyMeshes = useMemo(() => {
    const body = scene.getObjectByName(
      "car_body",
    );

    const meshes: Mesh[] = [];

    body?.traverse((object) => {
      const mesh = object as Mesh;

      if (mesh.isMesh) {
        meshes.push(mesh);
      }
    });

    return meshes;
  }, [scene]);

  const targets = useMemo(() => {
    const resolvedTargets: EngineInformationTarget[] = [];

    for (const definition of INFORMATION_DEFINITIONS) {
      const target = scene.getObjectByName(
        definition.nodeName,
      );

      if (!target) {
        continue;
      }

      resolvedTargets.push({
        id: definition.id,
        target,
        title: definition.title,
        description: definition.description,
        topicId: definition.topicId,
      });
    }

    return resolvedTargets;
  }, [scene]);

  useFrame(() => {
    const markerGroup = markerGroupRef.current;

    if (!markerGroup) {
      return;
    }

    const isXRayActive = bodyMeshes.some(
      (mesh) => {
        const materials = Array.isArray(
          mesh.material,
        )
          ? mesh.material
          : [mesh.material];

        return materials.some(
          (material) =>
            material.transparent &&
            material.opacity <= 0.1 &&
            material.depthWrite === false,
        );
      },
    );

    markerGroup.visible = isXRayActive;
  });

  const handleSelect = (
    definition: EngineInformationTarget,
  ) => {
    setActiveId(definition.id);

    emitSimulationInformation({
      topicId: definition.topicId,
      title: definition.title,
      description: definition.description,
    });
  };

  if (targets.length === 0) {
    return null;
  }

  return (
    <group
      ref={markerGroupRef}
      visible={false}
    >
      {targets.map((definition) => (
        <EngineInformationMarker
          key={definition.id}
          definition={definition}
          active={
            activeId === definition.id
          }
          onSelect={handleSelect}
        />
      ))}
    </group>
  );
}