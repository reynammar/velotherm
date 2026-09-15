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

import type {
  Object3D,
} from "three";

import {
  Box3,
  Vector3,
} from "three";

import {
  BODY_INTERACTION_CONFIGS,
  type BodyInteractionConfig,
  type BodyInteractionKey,
} from "@/src/features/simulation/data/bodyInteractionConfig";

type CarBodyInteractionMarkersProps = {
  scene: Object3D;

  openStates: Record<
    BodyInteractionKey,
    boolean
  >;

  onInteract: (
    key: BodyInteractionKey,
  ) => void;
};

type BodyInteractionMarkerProps = {
  scene: Object3D;

  config: BodyInteractionConfig;

  open: boolean;

  onInteract: (
    key: BodyInteractionKey,
  ) => void;
};

function getNodes(
  scene: Object3D,
  names: string[],
): Object3D[] {
  return names
    .map(
      (name) =>
        scene.getObjectByName(
          name,
        ) ?? null,
    )
    .filter(
      (
        node,
      ): node is Object3D =>
        Boolean(node),
    );
}

function getBoundsCenter(
  nodes: Object3D[],
): Vector3 | null {
  if (nodes.length === 0) {
    return null;
  }

  const bounds = new Box3();

  for (const node of nodes) {
    bounds.expandByObject(node);
  }

  if (bounds.isEmpty()) {
    return null;
  }

  return bounds.getCenter(
    new Vector3(),
  );
}

function getMarkerWorldPosition(
  nodes: Object3D[],
  mode:
    | "node"
    | "bounds",
  verticalOffset = 0,
): Vector3 | null {
  if (nodes.length === 0) {
    return null;
  }

  if (mode === "node") {
    const position =
      new Vector3();

    nodes[0].getWorldPosition(
      position,
    );

    return position;
  }

  const center =
    getBoundsCenter(nodes);

  if (!center) {
    return null;
  }

  const bounds = new Box3();

  for (const node of nodes) {
    bounds.expandByObject(node);
  }

  const size =
    bounds.getSize(
      new Vector3(),
    );

  center.y +=
    size.y * verticalOffset;

  return center;
}

function getMarkerRadius(
  nodes: Object3D[],
): number {
  if (nodes.length === 0) {
    return 0.075;
  }

  const bounds = new Box3();

  for (const node of nodes) {
    bounds.expandByObject(node);
  }

  if (bounds.isEmpty()) {
    return 0.075;
  }

  const size =
    bounds.getSize(
      new Vector3(),
    );

  const calculated =
    size.length() * 0.06;

  return Math.min(
    Math.max(
      calculated,
      0.055,
    ),
    0.1,
  );
}

function BodyInteractionMarker({
  scene,
  config,
  open,
  onInteract,
}: BodyInteractionMarkerProps) {
  const markerRef =
    useRef<Object3D | null>(
      null,
    );

  const worldPositionRef =
    useRef(
      new Vector3(),
    );

  const localPositionRef =
    useRef(
      new Vector3(),
    );

  const [
    hovered,
    setHovered,
  ] = useState(false);

  const nodes = useMemo(
    () =>
      getNodes(
        scene,
        config.markerNodes,
      ),
    [
      scene,
      config.markerNodes,
    ],
  );

  const radius = useMemo(
    () =>
      getMarkerRadius(nodes),
    [nodes],
  );

  const verticalOffset =
    config.markerVerticalOffset ??
    0;

  useFrame(
    (state) => {
      const marker =
        markerRef.current;

      if (!marker) {
        return;
      }

      const parent =
        marker.parent;

      if (!parent) {
        return;
      }

      const worldPosition =
        getMarkerWorldPosition(
          nodes,
          config.markerMode,
          verticalOffset,
        );

      if (!worldPosition) {
        return;
      }

      worldPositionRef.current.copy(
        worldPosition,
      );

      localPositionRef.current.copy(
        worldPositionRef.current,
      );

      parent.worldToLocal(
        localPositionRef.current,
      );

      marker.position.copy(
        localPositionRef.current,
      );

      const pulse =
        hovered || open
          ? 1 +
            Math.sin(
              state.clock.getElapsedTime() *
                5,
            ) *
              0.06
          : 1;

      const scale =
        hovered
          ? 1.25
          : 1;

      marker.scale.setScalar(
        pulse * scale,
      );
    },
  );

  const handlePointerDown = (
    event: ThreeEvent<PointerEvent>,
  ) => {
    event.stopPropagation();

    onInteract(
      config.key,
    );
  };

  if (nodes.length === 0) {
    return null;
  }

  return (
    <group
      ref={markerRef}
      renderOrder={1100}
    >
      <Billboard
        follow
        lockX={false}
        lockY={false}
        lockZ={false}
      >
        <group>
          {/* ===============================================
              HIT SPHERE
          ================================================ */}

          <mesh
            onPointerDown={
              handlePointerDown
            }
            onPointerOver={(
              event,
            ) => {
              event.stopPropagation();
              setHovered(true);
            }}
            onPointerOut={(
              event,
            ) => {
              event.stopPropagation();
              setHovered(false);
            }}
            renderOrder={1100}
          >
            <sphereGeometry
              args={[
                radius * 1.8,
                16,
                12,
              ]}
            />

            <meshBasicMaterial
              transparent
              opacity={0}
              depthTest={false}
              depthWrite={false}
            />
          </mesh>

          {/* ===============================================
              OUTER RING
          ================================================ */}

          <mesh
            onPointerDown={
              handlePointerDown
            }
            onPointerOver={(
              event,
            ) => {
              event.stopPropagation();
              setHovered(true);
            }}
            onPointerOut={(
              event,
            ) => {
              event.stopPropagation();
              setHovered(false);
            }}
            renderOrder={1101}
          >
            <ringGeometry
              args={[
                radius * 0.72,
                radius,
                32,
              ]}
            />

            <meshBasicMaterial
              color={
                open || hovered
                  ? "#22d3ee"
                  : "#cbd5e1"
              }
              transparent
              opacity={
                open || hovered
                  ? 1
                  : 0.9
              }
              depthTest={false}
              depthWrite={false}
            />
          </mesh>

          {/* ===============================================
              CENTER DOT
          ================================================ */}

          <mesh
            onPointerDown={
              handlePointerDown
            }
            onPointerOver={(
              event,
            ) => {
              event.stopPropagation();
              setHovered(true);
            }}
            onPointerOut={(
              event,
            ) => {
              event.stopPropagation();
              setHovered(false);
            }}
            renderOrder={1102}
          >
            <sphereGeometry
              args={[
                radius * 0.24,
                12,
                8,
              ]}
            />

            <meshBasicMaterial
              color={
                open
                  ? "#ffffff"
                  : "#dc2626"
              }
              transparent
              opacity={1}
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
      {BODY_INTERACTION_CONFIGS.map(
        (config) => (
          <BodyInteractionMarker
            key={config.key}
            scene={scene}
            config={config}
            open={
              openStates[
                config.key
              ]
            }
            onInteract={
              onInteract
            }
          />
        ),
      )}
    </group>
  );
}