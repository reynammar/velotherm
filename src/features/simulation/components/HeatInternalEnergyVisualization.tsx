"use client";

import { Line } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";

import {
  useMemo,
  useRef,
} from "react";

import type {
  MeshBasicMaterial,
  Group,
  Mesh,
} from "three";

type HeatTransferMode =
  | "microscopic"
  | "conduction"
  | "convection"
  | "radiation";

type HeatInternalEnergyVisualizationProps = {
  temperatureK: number;
  heatRateKW: number;
  mode: HeatTransferMode;
  isPlaying: boolean;
};

const MIN_TEMPERATURE_K = 300;
const MAX_TEMPERATURE_K = 1200;

const MAX_HEAT_RATE_KW = 10;

const PARTICLE_COUNT = 30;

const PARTICLE_POSITIONS = [
  [-0.48, 0.22, -0.25],
  [-0.31, 0.34, 0.08],
  [-0.13, 0.18, 0.24],
  [0.08, 0.29, -0.2],
  [0.29, 0.41, 0.11],
  [0.47, 0.19, -0.08],

  [-0.41, 0.55, 0.16],
  [-0.21, 0.64, -0.18],
  [0.02, 0.53, 0.19],
  [0.24, 0.71, -0.12],
  [0.43, 0.58, 0.2],

  [-0.34, 0.78, -0.24],
  [-0.09, 0.87, 0.06],
  [0.16, 0.81, 0.23],
  [0.39, 0.93, -0.1],

  [-0.48, 1.04, 0.09],
  [-0.27, 1.12, -0.18],
  [-0.03, 1.03, 0.18],
  [0.21, 1.18, -0.05],
  [0.44, 1.08, 0.14],

  [-0.36, 1.3, 0.2],
  [-0.12, 1.36, -0.16],
  [0.14, 1.42, 0.07],
  [0.37, 1.34, -0.2],

  [-0.43, 1.51, -0.05],
  [-0.2, 1.57, 0.18],
  [0.05, 1.55, -0.12],
  [0.29, 1.62, 0.09],
  [0.47, 1.49, -0.18],
  [0.01, 1.7, 0.16],
] as const;

function normalize(
  value: number,
  min: number,
  max: number,
): number {
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

function getThermalColor(
  temperatureNorm: number,
): string {
  if (
    temperatureNorm >=
    0.68
  ) {
    return "#ef4444";
  }

  if (
    temperatureNorm >=
    0.38
  ) {
    return "#f59e0b";
  }

  return "#22d3ee";
}

function MicroscopicParticles({
  temperatureNorm,
  isPlaying,
}: {
  temperatureNorm: number;
  isPlaying: boolean;
}) {
  const groupRef =
    useRef<Group | null>(
      null,
    );

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

  const speed =
    0.7 +
    temperatureNorm * 4.5;

  const particleScale =
    0.7 +
    temperatureNorm * 0.65;

  const particleColor =
    getThermalColor(
      temperatureNorm,
    );

  useFrame(
    ({
      clock,
    }) => {
      if (
        !groupRef.current ||
        !isPlaying
      ) {
        return;
      }

      const time =
        clock.getElapsedTime();

      groupRef.current.rotation.x =
        Math.sin(
          time * speed * 0.2,
        ) * 0.04;

      groupRef.current.rotation.y =
        Math.cos(
          time * speed * 0.16,
        ) * 0.04;
    },
  );

  return (
    <group ref={groupRef}>
      {particles.map(
        (particle) => (
          <mesh
            key={
              particle.id
            }
            position={[
              particle.x,
              particle.y,
              particle.z,
            ]}
            scale={
              particleScale
            }
          >
            <sphereGeometry
              args={[
                0.028,
                8,
                8,
              ]}
            />

            <meshBasicMaterial
              color={
                particleColor
              }
              transparent
              opacity={
                0.42 +
                temperatureNorm *
                  0.48
              }
            />
          </mesh>
        ),
      )}
    </group>
  );
}

function ConductionEffect({
  heatRateNorm,
  isPlaying,
}: {
  heatRateNorm: number;
  isPlaying: boolean;
}) {
  const pulseRefs =
    useRef<
      Array<Mesh | null>
    >([]);

  const pulseCount =
    Math.max(
      3,
      Math.round(
        3 +
          heatRateNorm * 4,
      ),
    );

  useFrame(
    ({
      clock,
    }) => {
      if (!isPlaying) {
        pulseRefs.current.forEach(
          (mesh) => {
            if (mesh) {
              mesh.visible =
                false;
            }
          },
        );

        return;
      }

      const time =
        clock.getElapsedTime();

      pulseRefs.current.forEach(
        (
          mesh,
          index,
        ) => {
          if (!mesh) {
            return;
          }

          mesh.visible = true;

          const offset =
            index /
            Math.max(
              pulseCount,
              1,
            );

          const progress =
            (
              time *
                (0.5 +
                  heatRateNorm *
                    1.5) +
              offset
            ) % 1;

          mesh.position.x =
            -0.65 +
            progress *
              1.3;

          mesh.position.y =
            0.48 +
            Math.sin(
              time * 3 +
                index,
            ) *
              0.025;

          mesh.scale.setScalar(
            0.8 +
              Math.sin(
                time * 8 +
                  index,
              ) *
                0.15,
          );
        },
      );
    },
  );

  return (
    <group>
      <Line
        points={[
          [
            -0.72,
            0.48,
            0,
          ],
          [
            0.72,
            0.48,
            0,
          ],
        ]}
        color="#ef4444"
        lineWidth={2}
        transparent
        opacity={0.55}
      />

      {Array.from({
        length:
          pulseCount,
      }).map(
        (_, index) => (
          <mesh
            key={
              `conduction-${index}`
            }
            ref={(mesh) => {
              pulseRefs.current[
                index
              ] = mesh;
            }}
            position={[
              -0.65,
              0.48,
              0,
            ]}
          >
            <sphereGeometry
              args={[
                0.05,
                10,
                10,
              ]}
            />

            <meshBasicMaterial
              color="#ef4444"
              transparent
              opacity={0.9}
            />
          </mesh>
        ),
      )}
    </group>
  );
}

function ConvectionEffect({
  heatRateNorm,
  isPlaying,
}: {
  heatRateNorm: number;
  isPlaying: boolean;
}) {
  const particleRefs =
    useRef<
      Array<Mesh | null>
    >([]);

  const particleCount =
    Math.max(
      5,
      Math.round(
        5 +
          heatRateNorm * 7,
      ),
    );

  useFrame(
    ({
      clock,
    }) => {
      const time =
        clock.getElapsedTime();

      particleRefs.current.forEach(
        (
          mesh,
          index,
        ) => {
          if (!mesh) {
            return;
          }

          if (!isPlaying) {
            mesh.visible =
              false;

            return;
          }

          mesh.visible = true;

          const progress =
            (
              time *
                (0.18 +
                  heatRateNorm *
                    0.5) +
              index /
                particleCount
            ) % 1;

          mesh.position.y =
            progress * 1.45;

          mesh.position.x =
            Math.sin(
              time * 2 +
                index,
            ) *
            0.16;

          mesh.position.z =
            Math.cos(
              time * 1.7 +
                index,
            ) *
            0.1;
        },
      );
    },
  );

  return (
    <group
      position={[
        0,
        0.28,
        0,
      ]}
    >
      {Array.from({
        length:
          particleCount,
      }).map(
        (_, index) => (
          <mesh
            key={
              `convection-${index}`
            }
            ref={(mesh) => {
              particleRefs.current[
                index
              ] = mesh;
            }}
            position={[
              0,
              0,
              0,
            ]}
          >
            <sphereGeometry
              args={[
                0.042,
                8,
                8,
              ]}
            />

            <meshBasicMaterial
              color="#f59e0b"
              transparent
              opacity={0.82}
            />
          </mesh>
        ),
      )}
    </group>
  );
}

function RadiationEffect({
  heatRateNorm,
  isPlaying,
}: {
  heatRateNorm: number;
  isPlaying: boolean;
}) {
  const ringMeshRefs =
    useRef<
      Array<Mesh | null>
    >([]);

  const ringMaterialRefs =
    useRef<
      Array<MeshBasicMaterial | null>
    >([]);

  useFrame(
    ({
      clock,
    }) => {
      const time =
        clock.getElapsedTime();

      ringMeshRefs.current.forEach(
        (
          ring,
          index,
        ) => {
          if (!ring) {
            return;
          }

          const material =
            ringMaterialRefs
              .current[
              index
            ];

          if (!material) {
            return;
          }

          if (!isPlaying) {
            ring.visible =
              false;

            return;
          }

          ring.visible = true;

          const phase =
            (
              time *
                (0.25 +
                  heatRateNorm *
                    0.75) +
              index * 0.25
            ) % 1;

          const scale =
            0.35 +
            phase * 1.05;

          ring.scale.setScalar(
            scale,
          );

          material.opacity =
            Math.max(
              0,
              0.8 -
                phase *
                  0.75,
            );
        },
      );
    },
  );

  return (
    <group
      position={[
        0,
        0.75,
        0,
      ]}
    >
      {[0, 1, 2].map(
        (index) => (
          <mesh
            key={
              `radiation-${index}`
            }
            ref={(mesh) => {
              ringMeshRefs.current[
                index
              ] = mesh;
            }}
            rotation={[
              Math.PI / 2,
              0,
              0,
            ]}
          >
            <torusGeometry
              args={[
                0.48,
                0.012,
                8,
                48,
              ]}
            />

            <meshBasicMaterial
              ref={(material) => {
                ringMaterialRefs.current[
                  index
                ] = material;
              }}
              color="#ef4444"
              transparent
              opacity={0.7}
            />
          </mesh>
        ),
      )}
    </group>
  );
}

export function HeatInternalEnergyVisualization({
  temperatureK,
  heatRateKW,
  mode,
  isPlaying,
}: HeatInternalEnergyVisualizationProps) {
  const temperatureNorm =
    normalize(
      temperatureK,
      MIN_TEMPERATURE_K,
      MAX_TEMPERATURE_K,
    );

  const heatRateNorm =
    normalize(
      heatRateKW,
      0,
      MAX_HEAT_RATE_KW,
    );

  const thermalColor =
    getThermalColor(
      temperatureNorm,
    );

  return (
    <group
      position={[
        0,
        0.1,
        0,
      ]}
    >
      {/* =================================
          THERMAL FIELD
      ================================= */}

      <mesh
        scale={[
          1.05 +
            heatRateNorm *
              0.15,
          1.15 +
            temperatureNorm *
              0.25,
          0.9 +
            heatRateNorm *
              0.15,
        ]}
      >
        <sphereGeometry
          args={[
            0.95,
            24,
            16,
          ]}
        />

        <meshBasicMaterial
          color={
            thermalColor
          }
          transparent
          opacity={
            0.045 +
            temperatureNorm *
              0.08
          }
          depthWrite={false}
        />
      </mesh>

      {/* =================================
          MICROSCOPIC VIEW
      ================================= */}

      {mode ===
        "microscopic" && (
        <MicroscopicParticles
          temperatureNorm={
            temperatureNorm
          }
          isPlaying={
            isPlaying
          }
        />
      )}

      {/* =================================
          CONDUCTION
      ================================= */}

      {mode ===
        "conduction" && (
        <ConductionEffect
          heatRateNorm={
            heatRateNorm
          }
          isPlaying={
            isPlaying
          }
        />
      )}

      {/* =================================
          CONVECTION
      ================================= */}

      {mode ===
        "convection" && (
        <ConvectionEffect
          heatRateNorm={
            heatRateNorm
          }
          isPlaying={
            isPlaying
          }
        />
      )}

      {/* =================================
          RADIATION
      ================================= */}

      {mode ===
        "radiation" && (
        <RadiationEffect
          heatRateNorm={
            heatRateNorm
          }
          isPlaying={
            isPlaying
          }
        />
      )}
    </group>
  );
}