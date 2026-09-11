"use client";

import {
  useCallback,
  useRef,
  useState,
  type ReactNode,
} from "react";

import { OrbitControls } from "@react-three/drei";
import {
  Canvas,
  useFrame,
} from "@react-three/fiber";

import {
  type GridHelper,
} from "three";

import { CarModel } from "@/src/features/simulation/components/CarModel";

import { WheelSystem } from "@/src/features/simulation/components/WheelSystem";

import type { CarNodeRegistry } from "@/src/lib/three/nodeRegistry";

const FLOOR_Y = 0;

/**
 * Visual-only scaling factor.
 *
 * This does not change the physical velocity.
 * It only controls how fast the floor grid appears
 * to move during the educational simulation.
 */
const VISUAL_TRAVEL_SCALE = 0.12;

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

    /**
     * Wrap the grid every 1 world unit so
     * the pattern can move continuously
     * without leaving the scene.
     */
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
  children,
}: SimulationCanvasProps) {
  const [
    carNodes,
    setCarNodes,
  ] =
    useState<CarNodeRegistry | null>(
      null,
    );

  const handleNodesReady =
    useCallback(
      (
        nodes: CarNodeRegistry,
      ) => {
        setCarNodes(nodes);
      },
      [],
    );

  return (
    <div className="h-[420px] w-full bg-[var(--color-brand-charcoal)] sm:h-[500px] lg:h-[560px]">
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
          position={[5, 8, 5]}
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
          />

          {carNodes && (
            <WheelSystem
              nodes={
                carNodes.wheels
              }
              angularVelocity={
                angularVelocity
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

        {children}

        <OrbitControls
          target={
            cameraTarget
          }
          enableDamping
          dampingFactor={0.08}
          minDistance={3.5}
          maxDistance={12}
          minPolarAngle={
            Math.PI * 0.35
          }
          maxPolarAngle={
            Math.PI * 0.6
          }
        />
      </Canvas>
    </div>
  );
}