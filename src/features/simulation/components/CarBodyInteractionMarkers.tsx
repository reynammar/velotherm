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
  type Object3D,
} from "three";

import {
  BODY_INTERACTION_CONFIGS,
  type BodyInteractionConfig,
  type BodyInteractionKey,
} from "@/src/features/simulation/data/bodyInteractionConfig";

type CarBodyInteractionMarkersProps = {
  scene: Object3D;
  openStates: Record<BodyInteractionKey, boolean>;
  onInteract: (
    key: BodyInteractionKey,
  ) => void;
};

type BodyInteractionMarkerProps = {
  scene: Object3D;
  config: BodyInteractionConfig;
  isOpen: boolean;
  onInteract: (
    key: BodyInteractionKey,
  ) => void;
};

const MARKER_SURFACE_OFFSET = 0.055;
const MARKER_HIT_RADIUS = 0.09;
const MARKER_RING_INNER_RADIUS = 0.038;
const MARKER_RING_OUTER_RADIUS = 0.052;
const MARKER_CENTER_RADIUS = 0.018;

const DIRECTION_EPSILON = 0.00001;

function getInteractionNodes(
  scene: Object3D,
  config: BodyInteractionConfig,
): Object3D[] {
  return config.interactionNodes
    .map(
      (name) =>
        scene.getObjectByName(name) ?? null,
    )
    .filter(
      (node): node is Object3D =>
        Boolean(node),
    );
}

function getSurfaceDistance(
  direction: Vector3,
  halfSize: Vector3,
): number {
  const distances = [
    Math.abs(direction.x) > DIRECTION_EPSILON
      ? halfSize.x / Math.abs(direction.x)
      : Infinity,

    Math.abs(direction.y) > DIRECTION_EPSILON
      ? halfSize.y / Math.abs(direction.y)
      : Infinity,

    Math.abs(direction.z) > DIRECTION_EPSILON
      ? halfSize.z / Math.abs(direction.z)
      : Infinity,
  ];

  return Math.min(...distances);
}

function BodyInteractionMarker({
  scene,
  config,
  isOpen,
  onInteract,
}: BodyInteractionMarkerProps) {
  const groupRef =
    useRef<Group | null>(null);

  const worldBoundsRef =
    useRef(new Box3());

  const localSizeRef =
    useRef(new Vector3());

  const centerRef =
    useRef(new Vector3());

  const directionRef =
    useRef(new Vector3());

  const cameraPositionRef =
    useRef(new Vector3());

  const markerWorldPositionRef =
    useRef(new Vector3());

  const markerLocalPositionRef =
    useRef(new Vector3());

  const inverseParentMatrixRef =
    useRef(new Matrix4());

  const nodes = useMemo(
    () =>
      getInteractionNodes(
        scene,
        config,
      ),
    [scene, config],
  );

  useFrame(({ camera }) => {
    const group = groupRef.current;

    if (
      !group ||
      nodes.length === 0
    ) {
      return;
    }

    const parent = group.parent;

    if (!parent) {
      return;
    }

    scene.updateWorldMatrix(
      true,
      true,
    );

    parent.updateWorldMatrix(
      true,
      false,
    );

    const worldBounds =
      worldBoundsRef.current;

    worldBounds.makeEmpty();

    for (const node of nodes) {
      worldBounds.expandByObject(node);
    }

    if (worldBounds.isEmpty()) {
      return;
    }

    worldBounds.getCenter(
      centerRef.current,
    );

    worldBounds.getSize(
      localSizeRef.current,
    );

    const halfSize = localSizeRef.current.multiplyScalar(0.5);

    camera.getWorldPosition(
      cameraPositionRef.current,
    );

    directionRef.current.subVectors(
      cameraPositionRef.current,
      centerRef.current,
    );

    if (
      directionRef.current.lengthSq() <
      DIRECTION_EPSILON
    ) {
      directionRef.current.set(
        0,
        0,
        1,
      );
    }

    directionRef.current.normalize();

    const surfaceDistance =
      getSurfaceDistance(
        directionRef.current,
        halfSize,
      );

    if (!Number.isFinite(surfaceDistance)) {
      return;
    }

    /*
     * Move the marker from the center of the component
     * toward the camera until it reaches the outer surface.
     *
     * This keeps the marker in front of the component mesh,
     * preventing the CarModel click handler from intercepting
     * the marker click.
     */

    markerWorldPositionRef.current
      .copy(centerRef.current)
      .addScaledVector(
        directionRef.current,
        surfaceDistance + MARKER_SURFACE_OFFSET,
      );

    markerWorldPositionRef.current.y +=
      config.markerVerticalOffset ?? 0;

    /*
     * Convert world coordinates into the marker parent's
     * local coordinate system.
     */

    inverseParentMatrixRef.current
      .copy(parent.matrixWorld)
      .invert();

    markerLocalPositionRef.current.copy(
      markerWorldPositionRef.current,
    );

    markerLocalPositionRef.current.applyMatrix4(
      inverseParentMatrixRef.current,
    );

    group.position.copy(
      markerLocalPositionRef.current,
    );
  });

  const handleClick = (
    event: ThreeEvent<MouseEvent>,
  ) => {
    event.stopPropagation();

    onInteract(config.key);
  };

  const handlePointerOver = (
    event: ThreeEvent<PointerEvent>,
  ) => {
    event.stopPropagation();

    document.body.style.cursor =
      "pointer";
  };

  const handlePointerOut = (
    event: ThreeEvent<PointerEvent>,
  ) => {
    event.stopPropagation();

    document.body.style.cursor =
      "";
  };

  if (nodes.length === 0) {
    return null;
  }

  return (
    <group ref={groupRef}>
      <Billboard
        follow
        lockX={false}
        lockY={false}
        lockZ={false}
      >
        <group renderOrder={1100}>
          {/* ===============================================
              INTERACTION HIT AREA

              This small invisible circle is the only
              enlarged click target around the blue dot.
              It does not cover the door, hood, or trunk.
          =============================================== */}

          <mesh
            onClick={handleClick}
            onPointerOver={handlePointerOver}
            onPointerOut={handlePointerOut}
            renderOrder={1100}
          >
            <circleGeometry
              args={[
                MARKER_HIT_RADIUS,
                32,
              ]}
            />

            <meshBasicMaterial
              transparent
              opacity={0}
              colorWrite={false}
              depthTest={false}
              depthWrite={false}
              side={DoubleSide}
            />
          </mesh>

          {/* ===============================================
              BLUE INTERACTION RING

              The visible ring also receives clicks.
          =============================================== */}

          <mesh
            onClick={handleClick}
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
              color={
                isOpen
                  ? "#93c5fd"
                  : "#3b82f6"
              }
              transparent
              opacity={0.98}
              depthTest={false}
              depthWrite={false}
              side={DoubleSide}
            />
          </mesh>

          {/* ===============================================
              BLUE INTERACTION CENTER

              The center receives clicks as well.
          =============================================== */}

          <mesh
            onClick={handleClick}
            onPointerOver={handlePointerOver}
            onPointerOut={handlePointerOut}
            renderOrder={1102}
          >
            <circleGeometry
              args={[
                MARKER_CENTER_RADIUS,
                16,
              ]}
            />

            <meshBasicMaterial
              color="#dbeafe"
              depthTest={false}
              depthWrite={false}
              side={DoubleSide}
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
      {BODY_INTERACTION_CONFIGS.map(
        (config) => (
          <BodyInteractionMarker
            key={config.key}
            scene={scene}
            config={config}
            isOpen={
              openStates[config.key]
            }
            onInteract={onInteract}
          />
        ),
      )}
    </group>
  );
}