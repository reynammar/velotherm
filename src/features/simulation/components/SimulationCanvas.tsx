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
  type CarFocusComponent,
} from "@/src/features/simulation/components/CarModel";

import {
  HybridSystem,
  type HybridSystemProps,
} from "@/src/features/simulation/components/HybridSystem";

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

export type CameraFocus =
  | CarFocusComponent
  | null;

type ControlsRef = RefObject<
  ComponentRef<
    typeof OrbitControls
  > | null
>;

type CameraFocusControllerProps = {
  active: boolean;

  focusObject?:
    | Object3D
    | undefined;

  controlsRef: ControlsRef;

  focusVerticalOffset: number;

  focusDistanceMultiplier: number;

  focusMinimumDistance: number;

  focusCameraOffset: [
    number,
    number,
    number,
  ];
};

type WorldAnchorProps = {
  target: Object3D;

  children: ReactNode;
};

export type SimulationCanvasProps = {
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

  /**
   * Completely hides the car model.
   *
   * Keep this false unless a scene explicitly
   * needs the vehicle removed from the visual.
   */
  showCarModel?: boolean;

  /**
   * Applies the existing engine-focus material
   * treatment while keeping the complete car
   * model visible.
   *
   * The vehicle body becomes transparent while
   * focused/internal components remain visible.
   */
  transparentCar?: boolean;

  cameraFocus?: CameraFocus;

  focusVerticalOffset?: number;

  focusDistanceMultiplier?: number;

  focusMinimumDistance?: number;

  focusCameraOffset?: [
    number,
    number,
    number,
  ];

  minDistance?: number;

  maxDistance?: number;

  fullScreen?: boolean;

  engineOverlay?: ReactNode;

  engineRunning?: boolean;

  enginePlaybackRate?: number;

  hybrid?: Omit<
    HybridSystemProps,
    "nodes"
  >;

  onNodeSelect?: (
    component: CarFocusComponent,
  ) => void;

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
      ((nextPosition % 1) + 1) %
      1;
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
          args={[
            30,
            30,
          ]}
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
    useRef(
      new Vector3(),
    );

  const worldQuaternionRef =
    useRef(
      new Quaternion(),
    );

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
  focusVerticalOffset,
  focusDistanceMultiplier,
  focusMinimumDistance,
  focusCameraOffset,
}: CameraFocusControllerProps) {
  const { camera } =
    useThree();

  const previousActiveRef =
    useRef(active);

  const previousFocusObjectRef =
    useRef<
      Object3D | undefined
    >(focusObject);

  const startCameraRef =
    useRef(
      new Vector3(),
    );

  const endCameraRef =
    useRef(
      new Vector3(),
    );

  const startTargetRef =
    useRef(
      new Vector3(),
    );

  const endTargetRef =
    useRef(
      new Vector3(),
    );

  const restoreCameraRef =
    useRef(
      new Vector3(),
    );

  const restoreTargetRef =
    useRef(
      new Vector3(),
    );

  const transitionStartRef =
    useRef<number | null>(
      null,
    );

  const transitioningRef =
    useRef(false);

  useEffect(() => {
    const controls =
      controlsRef.current;

    if (!controls) {
      return;
    }

    const focusChanged =
      previousFocusObjectRef.current !==
      focusObject;

    const enteringFocus =
      !previousActiveRef.current &&
      active;

    const leavingFocus =
      previousActiveRef.current &&
      !active;

    if (
      active &&
      focusObject &&
      (enteringFocus ||
        focusChanged)
    ) {
      startCameraRef.current.copy(
        camera.position,
      );

      startTargetRef.current.copy(
        controls.target,
      );

      if (enteringFocus) {
        restoreCameraRef.current.copy(
          camera.position,
        );

        restoreTargetRef.current.copy(
          controls.target,
        );
      }

      const bounds =
        new Box3().setFromObject(
          focusObject,
        );

      if (
        bounds.isEmpty()
      ) {
        previousActiveRef.current =
          active;

        previousFocusObjectRef.current =
          focusObject;

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

      const calculatedDistance =
        size.length() *
        focusDistanceMultiplier;

      const distance =
        Math.max(
          calculatedDistance,
          focusMinimumDistance,
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
          0.85,
          0.3,
          1,
        );
      }

      direction.normalize();

      endCameraRef.current
        .copy(center)
        .addScaledVector(
          direction,
          distance,
        )
        .add(
          new Vector3(
            focusCameraOffset[0],
            focusCameraOffset[1],
            focusCameraOffset[2],
          ),
        );

      endTargetRef.current.copy(
        center,
      );

      endTargetRef.current.y +=
        focusVerticalOffset;

      controls.enabled =
        false;

      transitionStartRef.current =
        performance.now();

      transitioningRef.current =
        true;
    }

    if (
      leavingFocus
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

      controls.enabled =
        false;

      transitionStartRef.current =
        performance.now();

      transitioningRef.current =
        true;
    }

    previousActiveRef.current =
      active;

    previousFocusObjectRef.current =
      focusObject;
  }, [
    active,
    camera,
    controlsRef,
    focusCameraOffset,
    focusDistanceMultiplier,
    focusMinimumDistance,
    focusObject,
    focusVerticalOffset,
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

    const duration =
      700;

    const progress =
      Math.min(
        elapsed /
          duration,
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

    if (
      progress >=
      1
    ) {
      transitioningRef.current =
        false;

      transitionStartRef.current =
        null;

      controls.enabled =
        true;
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
    6.2,
    2.45,
    6.5,
  ],

  cameraTarget = [
    0,
    1.15,
    -1.15,
  ],

  showFloor = true,

  showCarModel = true,

  transparentCar = false,

  cameraFocus = null,

  focusVerticalOffset = 0,

  focusDistanceMultiplier = 2.4,

  focusMinimumDistance = 2.5,

  focusCameraOffset = [
    0,
    0,
    0,
  ],

  minDistance = 3.5,

  maxDistance = 14,

  fullScreen = false,

  engineOverlay,

  engineRunning = false,

  enginePlaybackRate = 1,

  hybrid,

  onNodeSelect,

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
        setCarNodes(
          nodes,
        );
      },
      [],
    );

  const focusObject =
    getFocusObject(
      carNodes,
      cameraFocus,
    );

  const engineWheelVelocity =
    engineRunning
      ? enginePlaybackRateToWheelAngularVelocity(
          enginePlaybackRate,
        )
      : 0;

  const finalWheelAngularVelocity =
    angularVelocity !== 0
      ? angularVelocity
      : engineWheelVelocity;

  const viewportClass =
    fullScreen
      ? "h-full w-full"
      : "h-[420px] w-full sm:h-[500px] lg:h-[560px]";

  /**
   * Engine focus can be activated
   * independently from camera focus.
   *
   * This is what allows Scene 10 to show
   * a ghosted vehicle while keeping the
   * normal vehicle camera framing.
   */
  const shouldTransparentCar =
    transparentCar ||
    cameraFocus ===
      "engine";

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
        dpr={[
          1,
          2,
        ]}
      >
        <color
          attach="background"
          args={[
            "#0f172a",
          ]}
        />

        <ambientLight
          intensity={
            1.2
          }
        />

        <directionalLight
          position={[
            5,
            8,
            5,
          ]}
          intensity={
            2
          }
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
          {/* =================================================
              CAR MODEL

              The model stays mounted so node registry
              and all GLB references remain available.
          ================================================= */}

          <group
            visible={
              showCarModel
            }
          >
            <CarModel
              onNodesReady={
                handleNodesReady
              }
              engineFocus={
                shouldTransparentCar
              }
              focusComponent={
                cameraFocus
              }
              onNodeSelect={
                onNodeSelect
              }
            />
          </group>

          {/* =================================================
              WHEEL SYSTEM
          ================================================= */}

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

        {/* ===================================================
            HYBRID SYSTEM
        =================================================== */}

        {carNodes &&
          hybrid && (
            <HybridSystem
              nodes={
                carNodes
              }
              inputPowerKw={
                hybrid.inputPowerKw
              }
              efficiency={
                hybrid.efficiency
              }
              running={
                hybrid.running
              }
              activeComponent={
                hybrid.activeComponent
              }
              onSelect={
                hybrid.onSelect
              }
              resetKey={
                resetKey
              }
            />
          )}

        {/* ===================================================
            ENGINE OVERLAY
        =================================================== */}

        {focusObject &&
          cameraFocus &&
          engineOverlay && (
            <WorldAnchor
              target={
                focusObject
              }
            >
              {
                engineOverlay
              }
            </WorldAnchor>
          )}

        {children}

        {/* ===================================================
            ORBIT CONTROLS
        =================================================== */}

        <OrbitControls
          ref={
            controlsRef
          }
          target={
            cameraTarget
          }
          enableDamping
          dampingFactor={
            0.045
          }
          rotateSpeed={
            0.82
          }
          zoomSpeed={
            0.95
          }
          enablePan={
            false
          }
          minDistance={
            minDistance
          }
          maxDistance={
            maxDistance
          }
          minPolarAngle={
            Math.PI *
            0.28
          }
          maxPolarAngle={
            Math.PI *
            0.63
          }
        />

        {/* ===================================================
            CAMERA FOCUS
        =================================================== */}

        <CameraFocusController
          active={
            cameraFocus !==
            null
          }
          focusObject={
            focusObject
          }
          controlsRef={
            controlsRef
          }
          focusVerticalOffset={
            focusVerticalOffset
          }
          focusDistanceMultiplier={
            focusDistanceMultiplier
          }
          focusMinimumDistance={
            focusMinimumDistance
          }
          focusCameraOffset={
            focusCameraOffset
          }
        />
      </Canvas>
    </div>
  );
}

function getFocusObject(
  nodes:
    | CarNodeRegistry
    | null,
  focus:
    | CameraFocus
    | null,
) {
  if (
    !nodes ||
    !focus
  ) {
    return undefined;
  }

  /**
   * Internal engine components use the
   * complete engine mechanism as camera
   * focus object.
   *
   * The selected component highlight is
   * handled independently by CarModel.
   */
  if (
    focus ===
      "crankshaft" ||
    focus ===
      "piston1" ||
    focus ===
      "rod1" ||
    focus ===
      "piston2" ||
    focus ===
      "rod2" ||
    focus ===
      "piston3" ||
    focus ===
      "rod3" ||
    focus ===
      "piston4" ||
    focus ===
      "rod4"
  ) {
    return nodes
      .engine
      .mechanism;
  }

  switch (
    focus
  ) {
    case "engine":
      return nodes
        .engine
        .mechanism;

    case "generator":
      return nodes
        .hybrid
        .generator;

    case "inverter":
      return nodes
        .hybrid
        .inverter;

    case "electricMotor":
      return nodes
        .hybrid
        .electricMotor;

    case "battery":
      return nodes
        .hybrid
        .battery;

    default:
      return undefined;
  }
}