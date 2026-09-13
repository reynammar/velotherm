"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ComponentRef,
  type ReactNode,
  type RefObject,
} from "react";

import {
  OrbitControls,
} from "@react-three/drei";

import {
  Canvas,
  useFrame,
  useThree,
} from "@react-three/fiber";

import {
  Box3,
  Quaternion,
  Vector3,
  type GridHelper,
  type Object3D,
} from "three";

import {
  CarModel,
} from "@/src/features/simulation/components/CarModel";

import {
  WheelSystem,
} from "@/src/features/simulation/components/WheelSystem";

import {
  enginePlaybackRateToWheelAngularVelocity,
} from "@/src/features/simulation/utils/engineWheelCoupling";

import type {
  CarNodeRegistry,
} from "@/src/lib/three/nodeRegistry";

const FLOOR_Y = 0;

const VISUAL_TRAVEL_SCALE = 0.12;

type CameraFocus =
  | "engine"
  | null;

type ControlsRef = RefObject<
  ComponentRef<
    typeof OrbitControls
  > | null
>;

type CameraFocusControllerProps = {
  active: boolean;
  focusObject?: Object3D;
  controlsRef: ControlsRef;
};

type WorldAnchorProps = {
  target: Object3D;
  children: ReactNode;
};

type SimulationCanvasProps = {
  angularVelocity?: number;

  steeringAngle?: number;

  resetKey?: number;

  motionSpeedMs?: number;

  carPosition?: [
    number,
    number,
    number,
  ];

  carRotation?: [
    number,
    number,
    number,
  ];

  cameraPosition?: [
    number,
    number,
    number,
  ];

  cameraTarget?: [
    number,
    number,
    number,
  ];

  showFloor?: boolean;

  cameraFocus?: CameraFocus;

  fullScreen?: boolean;

  engineOverlay?: ReactNode;

  engineRunning?: boolean;

  enginePlaybackRate?: number;

  children?: ReactNode;
};

type SimulationFloorProps = {
  motionSpeedMs: number;
};

function SimulationFloor({
  motionSpeedMs,
}: SimulationFloorProps) {
  const gridRef =
    useRef<GridHelper | null>(
      null,
    );

  useFrame((_, delta) => {
    if (!gridRef.current) {
      return;
    }

    const movement =
      motionSpeedMs *
      VISUAL_TRAVEL_SCALE *
      delta;

    const nextPosition =
      gridRef.current.position.z -
      movement;

    gridRef.current.position.z =
      ((nextPosition % 1) + 1) % 1;
  });

  return (
    <group>
      <mesh
        rotation={[
          -Math.PI / 2,
          0,
          0,
        ]}
        position={[
          0,
          FLOOR_Y - 0.01,
          0,
        ]}
      >
        <planeGeometry
          args={[30, 30]}
        />

        <meshStandardMaterial
          color="#0b1120"
          roughness={1}
        />
      </mesh>

      <gridHelper
        ref={gridRef}
        args={[
          30,
          30,
          "#475569",
          "#1e293b",
        ]}
        position={[
          0,
          FLOOR_Y,
          0,
        ]}
      />
    </group>
  );
}

function WorldAnchor({
  target,
  children,
}: WorldAnchorProps) {
  const groupRef =
    useRef<Object3D | null>(
      null,
    );

  const worldPositionRef =
    useRef(new Vector3());

  const worldQuaternionRef =
    useRef(new Quaternion());

  useFrame(() => {
    const group =
      groupRef.current;

    if (!group) {
      return;
    }

    target.getWorldPosition(
      worldPositionRef.current,
    );

    target.getWorldQuaternion(
      worldQuaternionRef.current,
    );

    group.position.copy(
      worldPositionRef.current,
    );
    
    group.quaternion.copy(
      worldQuaternionRef.current,
    );
    
  });

  return (
    <group ref={groupRef}>
      {children}
    </group>
  );
}

function CameraFocusController({
  active,
  focusObject,
  controlsRef,
}: CameraFocusControllerProps) {
  const { camera } =
    useThree();

  const previousActiveRef =
    useRef(active);

  const startCameraRef =
    useRef(new Vector3());

  const endCameraRef =
    useRef(new Vector3());

  const startTargetRef =
    useRef(new Vector3());

  const endTargetRef =
    useRef(new Vector3());

  const restoreCameraRef =
    useRef(new Vector3());

  const restoreTargetRef =
    useRef(new Vector3());

  const transitionStartRef =
    useRef<number | null>(null);

  const transitioningRef =
    useRef(false);

  useEffect(() => {
    const controls =
      controlsRef.current;

    if (!controls) {
      return;
    }

    if (
      !previousActiveRef.current &&
      !active
    ) {
      return;
    }

    if (
      !previousActiveRef.current &&
      active
    ) {
      if (!focusObject) {
        return;
      }

      startCameraRef.current.copy(
        camera.position,
      );

      startTargetRef.current.copy(
        controls.target,
      );

      restoreCameraRef.current.copy(
        camera.position,
      );

      restoreTargetRef.current.copy(
        controls.target,
      );

      const bounds =
        new Box3().setFromObject(
          focusObject,
        );

      if (bounds.isEmpty()) {
        return;
      }

      const center =
        bounds.getCenter(
          new Vector3(),
        );

      const size =
        bounds.getSize(
          new Vector3(),
        );

      const distance =
        Math.max(
          size.length() * 2.4,
          3.2,
        );

      const direction =
        camera.position
          .clone()
          .sub(center);

      if (
        direction.lengthSq() <
        0.01
      ) {
        direction.set(
          1,
          0.35,
          1,
        );
      }

      direction.normalize();

      endCameraRef.current
        .copy(center)
        .addScaledVector(
          direction,
          distance,
        );

      endCameraRef.current.y +=
        Math.max(
          size.y * 0.3,
          0.5,
        );

      endTargetRef.current.copy(
        center,
      );

      controls.enabled = false;

      transitionStartRef.current =
        performance.now();

      transitioningRef.current =
        true;
    }

    if (
      previousActiveRef.current &&
      !active
    ) {
      startCameraRef.current.copy(
        camera.position,
      );

      startTargetRef.current.copy(
        controls.target,
      );

      endCameraRef.current.copy(
        restoreCameraRef.current,
      );

      endTargetRef.current.copy(
        restoreTargetRef.current,
      );

      controls.enabled = false;

      transitionStartRef.current =
        performance.now();

      transitioningRef.current =
        true;
    }

    previousActiveRef.current =
      active;
  }, [
    active,
    camera,
    controlsRef,
    focusObject,
  ]);

  useFrame(() => {
    const controls =
      controlsRef.current;

    const startTime =
      transitionStartRef.current;

    if (
      !controls ||
      !transitioningRef.current ||
      startTime === null
    ) {
      return;
    }

    const elapsed =
      performance.now() -
      startTime;

    const duration = 850;

    const progress =
      Math.min(
        elapsed / duration,
        1,
      );

    const smoothProgress =
      1 -
      (1 -
        progress) ** 3;

    camera.position.lerpVectors(
      startCameraRef.current,
      endCameraRef.current,
      smoothProgress,
    );

    controls.target.lerpVectors(
      startTargetRef.current,
      endTargetRef.current,
      smoothProgress,
    );

    controls.update();

    if (progress >= 1) {
      transitioningRef.current =
        false;

      transitionStartRef.current =
        null;

      controls.enabled = true;
    }
  });

  return null;
}

export function SimulationCanvas({
  angularVelocity = 0,
  steeringAngle = 0,
  resetKey = 0,

  motionSpeedMs = 0,

  carPosition = [
    0,
    0,
    0,
  ],

  carRotation = [
    0,
    0,
    0,
  ],

  cameraPosition = [
    4.8,
    2.2,
    4.3,
  ],

  cameraTarget = [
    0,
    1.15,
    -2.13,
  ],

  showFloor = true,

  cameraFocus = null,

  fullScreen = false,

  engineOverlay,

  engineRunning = false,

  enginePlaybackRate = 1,

  children,
}: SimulationCanvasProps) {
  const [
    carNodes,
    setCarNodes,
  ] =
    useState<CarNodeRegistry | null>(
      null,
    );

  const controlsRef =
    useRef<
      ComponentRef<
        typeof OrbitControls
      > | null
    >(null);

  const handleNodesReady =
    useCallback(
      (
        nodes: CarNodeRegistry,
      ) => {
        setCarNodes(nodes);
      },
      [],
    );

  const focusObject =
    cameraFocus ===
    "engine"
      ? carNodes?.engine
          .mechanism
      : undefined;

  const engineWheelVelocity =
    engineRunning
      ? enginePlaybackRateToWheelAngularVelocity(
          enginePlaybackRate,
        )
      : 0;

  /**
   * Explicit angularVelocity
   * takes priority.
   *
   * This keeps vehicle-specific
   * scenes such as Kinetic Energy
   * compatible with their existing
   * wheel control.
   */
  const finalWheelAngularVelocity =
    angularVelocity !== 0
      ? angularVelocity
      : engineWheelVelocity;

  const viewportClass =
    fullScreen
      ? "h-full w-full"
      : "h-[420px] w-full sm:h-[500px] lg:h-[560px]";

  return (
    <div
      className={`${viewportClass} bg-[var(--color-brand-charcoal)]`}
    >
      <Canvas
        camera={{
          position:
            cameraPosition,
          fov: 42,
        }}
        dpr={[1, 2]}
      >
        <color
          attach="background"
          args={["#0f172a"]}
        />

        <ambientLight
          intensity={1.2}
        />

        <directionalLight
          position={[
            5,
            8,
            5,
          ]}
          intensity={2}
        />

        {showFloor && (
          <SimulationFloor
            motionSpeedMs={
              motionSpeedMs
            }
          />
        )}

        <group
          position={
            carPosition
          }
          rotation={
            carRotation
          }
        >
          <CarModel
            onNodesReady={
              handleNodesReady
            }
            engineFocus={
              cameraFocus ===
              "engine"
            }
          />

          {carNodes && (
            <WheelSystem
              nodes={
                carNodes.wheels
              }
              angularVelocity={
                finalWheelAngularVelocity
              }
              steeringAngle={
                steeringAngle
              }
              resetKey={
                resetKey
              }
            />
          )}
        </group>

        {focusObject &&
          cameraFocus ===
            "engine" &&
          engineOverlay && (
            <WorldAnchor
              target={
                focusObject
              }
            >
              {engineOverlay}
            </WorldAnchor>
          )}

        {children}

        <OrbitControls
          ref={controlsRef}
          target={
            cameraTarget
          }
          enableDamping
          dampingFactor={0.08}
          minDistance={3.5}
          maxDistance={14}
          minPolarAngle={
            Math.PI * 0.35
          }
          maxPolarAngle={
            Math.PI * 0.6
          }
        />

        <CameraFocusController
          active={
            cameraFocus ===
            "engine"
          }
          focusObject={
            focusObject
          }
          controlsRef={
            controlsRef
          }
        />
      </Canvas>
    </div>
  );
}