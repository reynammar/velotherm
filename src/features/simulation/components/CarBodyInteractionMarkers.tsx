"use client";

import {
  useMemo,
  useRef,
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
  Box3,
  DoubleSide,
  Matrix4,
  Vector3,
  type Group,
  type Mesh,
  type Object3D,
} from "three";

import {
  BODY_INTERACTION_CONFIGS,
  type BodyInteractionConfig,
  type BodyInteractionKey,
} from "@/src/features/simulation/data/bodyInteractionConfig";

import {
  EngineInformationMarkers,
} from "./EngineInformationMarkers";

type CarBodyInteractionMarkersProps = {
  scene: Object3D;
  openStates: Record<BodyInteractionKey, boolean>;
  onInteract: (key: BodyInteractionKey) => void;
};

type BodyInteractionHitAreaProps = {
  scene: Object3D;
  config: BodyInteractionConfig;
  isOpen: boolean;
  onInteract: (key: BodyInteractionKey) => void;
};

const HIT_AREA_PADDING = 0.075;
const MIN_HIT_AREA_SIZE = 0.12;
const MARKER_RING_INNER_RADIUS = 0.038;
const MARKER_RING_OUTER_RADIUS = 0.052;
const MARKER_CENTER_RADIUS = 0.018;

function getInteractionNodes(
  scene: Object3D,
  config: BodyInteractionConfig,
): Object3D[] {
  return config.interactionNodes
    .map((name) => scene.getObjectByName(name) ?? null)
    .filter(
      (node): node is Object3D => Boolean(node),
    );
}

function BodyInteractionHitArea({
  scene,
  config,
  isOpen,
  onInteract,
}: BodyInteractionHitAreaProps) {
  const groupRef = useRef<Group | null>(null);
  const hitAreaRef = useRef<Mesh | null>(null);

  const inverseParentMatrixRef = useRef(new Matrix4());
  const worldBoundsRef = useRef(new Box3());
  const localBoundsRef = useRef(new Box3());
  const centerRef = useRef(new Vector3());
  const sizeRef = useRef(new Vector3());
  const cornerRef = useRef(new Vector3());

  const nodes = useMemo(
    () => getInteractionNodes(scene, config),
    [scene, config],
  );

  useFrame(() => {
    const group = groupRef.current;
    const hitArea = hitAreaRef.current;

    if (!group || !hitArea || nodes.length === 0) {
      return;
    }

    const parent = group.parent;

    if (!parent) {
      return;
    }

    scene.updateWorldMatrix(true, true);
    parent.updateWorldMatrix(true, false);

    const worldBounds = worldBoundsRef.current;
    worldBounds.makeEmpty();

    for (const node of nodes) {
      worldBounds.expandByObject(node);
    }

    if (worldBounds.isEmpty()) {
      return;
    }

    inverseParentMatrixRef.current
      .copy(parent.matrixWorld)
      .invert();

    const localBounds = localBoundsRef.current;
    localBounds.makeEmpty();

    const min = worldBounds.min;
    const max = worldBounds.max;

    const corners: Array<[number, number, number]> = [
      [min.x, min.y, min.z],
      [min.x, min.y, max.z],
      [min.x, max.y, min.z],
      [min.x, max.y, max.z],
      [max.x, min.y, min.z],
      [max.x, min.y, max.z],
      [max.x, max.y, min.z],
      [max.x, max.y, max.z],
    ];

    for (const [x, y, z] of corners) {
      cornerRef.current
        .set(x, y, z)
        .applyMatrix4(inverseParentMatrixRef.current);

      localBounds.expandByPoint(cornerRef.current);
    }

    localBounds.getCenter(centerRef.current);
    localBounds.getSize(sizeRef.current);

    group.position.copy(centerRef.current);

    hitArea.scale.set(
      Math.max(
        sizeRef.current.x + HIT_AREA_PADDING,
        MIN_HIT_AREA_SIZE,
      ),
      Math.max(
        sizeRef.current.y + HIT_AREA_PADDING,
        MIN_HIT_AREA_SIZE,
      ),
      Math.max(
        sizeRef.current.z + HIT_AREA_PADDING,
        MIN_HIT_AREA_SIZE,
      ),
    );
  });

  const handlePointerDown = (
    event: ThreeEvent<PointerEvent>,
  ) => {
    event.stopPropagation();
    onInteract(config.key);
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

  if (nodes.length === 0) {
    return null;
  }

  return (
    <group ref={groupRef}>
      <mesh
        ref={hitAreaRef}
        onPointerDown={handlePointerDown}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
      >
        <boxGeometry args={[1, 1, 1]} />

        <meshBasicMaterial
          transparent
          opacity={0}
          colorWrite={false}
          depthWrite={false}
          side={DoubleSide}
        />
      </mesh>

      <Billboard
        follow
        lockX={false}
        lockY={false}
        lockZ={false}
      >
        <group renderOrder={1100}>
          <mesh
            onPointerDown={handlePointerDown}
            onPointerOver={handlePointerOver}
            onPointerOut={handlePointerOut}
            renderOrder={1100}
          >
            <circleGeometry args={[0.09, 24]} />
            <meshBasicMaterial
              transparent
              opacity={0}
              depthTest={false}
              depthWrite={false}
            />
          </mesh>

          <mesh
            onPointerDown={handlePointerDown}
            onPointerOver={handlePointerOver}
            onPointerOut={handlePointerOut}
            renderOrder={1101}
          >
            <ringGeometry
              args={[
                MARKER_RING_INNER_RADIUS,
                MARKER_RING_OUTER_RADIUS,
                28,
              ]}
            />
            <meshBasicMaterial
              color={isOpen ? "#93c5fd" : "#3b82f6"}
              transparent
              opacity={0.98}
              depthTest={false}
              depthWrite={false}
            />
          </mesh>

          <mesh
            onPointerDown={handlePointerDown}
            onPointerOver={handlePointerOver}
            onPointerOut={handlePointerOut}
            renderOrder={1102}
          >
            <circleGeometry args={[MARKER_CENTER_RADIUS, 16]} />
            <meshBasicMaterial
              color="#dbeafe"
              depthTest={false}
              depthWrite={false}
            />
          </mesh>
        </group>
      </Billboard>
    </group>
  );
}

export function CarBodyInteractionMarkers({
  scene,
  openStates,
  onInteract,
}: CarBodyInteractionMarkersProps) {
  return (
    <group>
      {BODY_INTERACTION_CONFIGS.map((config) => (
        <BodyInteractionHitArea
          key={config.key}
          scene={scene}
          config={config}
          isOpen={openStates[config.key]}
          onInteract={onInteract}
        />
      ))}

      <EngineInformationMarkers scene={scene} />
    </group>
  );
}