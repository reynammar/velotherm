"use client";

import {
  useFrame,
} from "@react-three/fiber";
import { Line } from "@react-three/drei";

import {
  useMemo,
  useRef,
} from "react";

import {
  BoxGeometry,
  type Mesh,
} from "three";

type PVProcessVisualizationProps = {
  pressureKPa: number;
  volumeM3: number;
  progress: number;
};

const PRESSURE_MIN_KPA = 0;
const PRESSURE_MAX_KPA = 600;

const VOLUME_MIN_M3 = 0.001;
const VOLUME_MAX_M3 = 0.004;

const CHAMBER_MIN_HEIGHT = 0.45;
const CHAMBER_MAX_HEIGHT = 1.25;

const CHAMBER_WIDTH = 0.9;
const CHAMBER_DEPTH = 0.75;

const PARTICLE_COUNT = 18;

const PARTICLE_POSITIONS = [
  [-0.25, 0.16, -0.18],
  [0.12, 0.21, 0.05],
  [-0.15, 0.31, 0.16],
  [0.28, 0.35, -0.08],
  [-0.32, 0.44, 0.04],
  [0.05, 0.52, -0.12],
  [0.25, 0.61, 0.15],
  [-0.18, 0.69, -0.06],
  [0.08, 0.76, 0.07],
  [-0.28, 0.84, 0.12],
  [0.23, 0.91, -0.15],
  [-0.05, 1.01, 0.02],
  [0.31, 1.08, 0.08],
  [-0.22, 1.15, -0.05],
  [0.04, 1.2, 0.16],
  [-0.12, 0.28, -0.08],
  [0.19, 0.48, 0.1],
  [-0.03, 0.91, -0.12],
] as const;

function normalize(
  value: number,
  min: number,
  max: number,
) {
  if (max === min) {
    return 0;
  }

  return Math.min(
    Math.max(
      (value - min) /
        (max - min),
      0,
    ),
    1,
  );
}

function MovingPiston({
  height,
}: {
  height: number;
}) {
  const pistonRef =
    useRef<Mesh | null>(
      null,
    );

  useFrame(({ clock }) => {
    if (!pistonRef.current) {
      return;
    }

    pistonRef.current.position.y =
      height +
      Math.sin(
        clock.getElapsedTime() *
          4,
      ) *
        0.015;
  });

  return (
    <mesh
      ref={pistonRef}
      position={[
        0,
        height,
        0,
      ]}
    >
      <boxGeometry
        args={[
          CHAMBER_WIDTH +
            0.08,
          0.08,
          CHAMBER_DEPTH +
            0.08,
        ]}
      />

      <meshStandardMaterial
        color="#94a3b8"
        metalness={0.45}
        roughness={0.42}
      />

      <mesh
        position={[
          0,
          0.06,
          0,
        ]}
      >
        <boxGeometry
          args={[
            CHAMBER_WIDTH *
              0.75,
            0.025,
            CHAMBER_DEPTH *
              0.75,
          ]}
        />

        <meshBasicMaterial
          color="#22d3ee"
          transparent
          opacity={0.8}
        />
      </mesh>
    </mesh>
  );
}

export function PVProcessVisualization({
  pressureKPa,
  volumeM3,
  progress,
}: PVProcessVisualizationProps) {
  const normalizedPressure =
    normalize(
      pressureKPa,
      PRESSURE_MIN_KPA,
      PRESSURE_MAX_KPA,
    );

  const normalizedVolume =
    normalize(
      volumeM3,
      VOLUME_MIN_M3,
      VOLUME_MAX_M3,
    );

  const chamberHeight =
    CHAMBER_MIN_HEIGHT +
    normalizedVolume *
      (CHAMBER_MAX_HEIGHT -
        CHAMBER_MIN_HEIGHT);

  const visibleParticles =
    Math.round(
      6 +
        normalizedPressure *
          (PARTICLE_COUNT - 6),
    );

  const particleColor =
    normalizedPressure >
    0.65
      ? "#ef4444"
      : "#22d3ee";

  const pistonY =
    chamberHeight - 0.08;

  const particleScale =
    0.7 +
    normalizedPressure *
      0.8;

  const particles =
    useMemo(
      () =>
        PARTICLE_POSITIONS.map(
          (
            [
              x,
              y,
              z,
            ],
            index,
          ) => ({
            id: index,
            x,
            y,
            z,
          }),
        ),
      [],
    );

  const chamberGeometry =
    useMemo(
      () =>
        new BoxGeometry(
          CHAMBER_WIDTH,
          chamberHeight,
          CHAMBER_DEPTH,
        ),
      [chamberHeight],
    );

  return (
    <group
      position={[
        1.4,
        0.15,
        0,
      ]}
    >
      {/* CHAMBER */}

      <lineSegments
        geometry={
          new BoxGeometry(
            CHAMBER_WIDTH,
            chamberHeight,
            CHAMBER_DEPTH,
          )
        }
      >
        <lineBasicMaterial
          color="#67e8f9"
          transparent
          opacity={0.75}
        />
      </lineSegments>

      <mesh
        position={[
          0,
          chamberHeight /
            2,
          0,
        ]}
        geometry={
          chamberGeometry
        }
      >
        <meshPhysicalMaterial
          color="#0891b2"
          transparent
          opacity={
            0.08 +
            normalizedPressure *
              0.2
          }
          roughness={0.2}
          metalness={0.05}
          depthWrite={false}
        />
      </mesh>

      {/* GAS PARTICLES */}

      {particles
        .slice(
          0,
          visibleParticles,
        )
        .map(
          (particle) => {
            const particleY =
              Math.min(
                particle.y *
                  chamberHeight /
                  1.2,
                chamberHeight -
                  0.08,
              );

            return (
              <mesh
                key={
                  particle.id
                }
                position={[
                  particle.x,
                  particleY,
                  particle.z,
                ]}
                scale={
                  particleScale
                }
              >
                <sphereGeometry
                  args={[
                    0.035,
                    8,
                    8,
                  ]}
                />

                <meshBasicMaterial
                  color={
                    particleColor
                  }
                  transparent
                  opacity={0.8}
                />
              </mesh>
            );
          },
        )}

      {/* PISTON */}

      <MovingPiston
        height={
          pistonY
        }
      />

      {/* PRESSURE VECTORS */}

      <group
        position={[
          0,
          chamberHeight *
            0.45,
          CHAMBER_DEPTH / 2 +
            0.08,
        ]}
      >
        {[...Array(3)].map(
          (_, index) => {
            const offset =
              (index - 1) *
              0.22;

            return (
              <group
                key={
                  `pressure-${index}`
                }
                position={[
                  offset,
                  0,
                  0,
                ]}
              >
                <mesh
                  position={[
                    0,
                    0,
                    -0.07,
                  ]}
                  rotation={[
                    Math.PI / 2,
                    0,
                    0,
                  ]}
                >
                  <cylinderGeometry
                    args={[
                      0.016,
                      0.016,
                      0.14,
                      8,
                    ]}
                  />

                  <meshBasicMaterial
                    color={
                      particleColor
                    }
                    transparent
                    opacity={0.85}
                  />
                </mesh>

                <mesh
                  position={[
                    0,
                    0,
                    -0.15,
                  ]}
                  rotation={[
                    Math.PI / 2,
                    0,
                    0,
                  ]}
                >
                  <coneGeometry
                    args={[
                      0.05,
                      0.1,
                      8,
                    ]}
                  />

                  <meshBasicMaterial
                    color={
                      particleColor
                    }
                  />
                </mesh>
              </group>
            );
          },
        )}
      </group>

      {/* DISPLACEMENT GUIDE */}

      <Line
        points={[
          [
            -(CHAMBER_WIDTH / 2) -
              0.28,
            0,
            0,
          ],
          [
            -(CHAMBER_WIDTH / 2) -
              0.28,
            chamberHeight,
            0,
          ],
        ]}
        color="#22d3ee"
        lineWidth={2}
        dashed
        dashSize={0.06}
        gapSize={0.06}
      />

      <mesh
        position={[
          -(CHAMBER_WIDTH / 2) -
            0.28,
          0,
          0,
        ]}
      >
        <sphereGeometry
          args={[
            0.035,
            8,
            8,
          ]}
        />

        <meshBasicMaterial
          color="#22d3ee"
        />
      </mesh>

      <mesh
        position={[
          -(CHAMBER_WIDTH / 2) -
            0.28,
          chamberHeight,
          0,
        ]}
      >
        <sphereGeometry
          args={[
            0.035,
            8,
            8,
          ]}
        />

        <meshBasicMaterial
          color="#22d3ee"
        />
      </mesh>
    </group>
  );
}