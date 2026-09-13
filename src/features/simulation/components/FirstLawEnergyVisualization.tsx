"use client";

import { Line } from "@react-three/drei";

import { useFrame } from "@react-three/fiber";

import {
  useMemo,
  useRef,
} from "react";

import type {
  Mesh,
} from "three";

type FirstLawEnergyVisualizationProps = {
  heatInputKJ: number;
  workOutputKJ: number;
  deltaEnergyKJ: number;
  isPlaying: boolean;
};

const MIN_ENERGY = 0;

const MAX_HEAT_INPUT = 100;

const MAX_WORK_OUTPUT = 100;

const MIN_FLOW_LENGTH = 0.35;

const MAX_FLOW_LENGTH = 1.25;

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

function FlowParticles({
  direction,
  length,
  color,
  intensity,
  isPlaying,
}: {
  direction:
    | "in"
    | "out";

  length: number;

  color: string;

  intensity: number;

  isPlaying: boolean;
}) {
  const particleRefs =
    useRef<
      Array<Mesh | null>
    >([]);

  const particleCount =
    Math.max(
      4,
      Math.round(
        4 +
          intensity * 8,
      ),
    );

  const particlePositions =
    useMemo(
      () =>
        Array.from(
          {
            length:
              particleCount,
          },
        ).map(
          (_, index) =>
            index /
            particleCount,
        ),
      [particleCount],
    );

  useFrame(
    ({
      clock,
    }) => {
      const time =
        clock.getElapsedTime();

      particleRefs.current.forEach(
        (
          particle,
          index,
        ) => {
          if (!particle) {
            return;
          }

          if (!isPlaying) {
            particle.visible =
              false;

            return;
          }

          particle.visible = true;

          const offset =
            particlePositions[
              index
            ] ?? 0;

          const progress =
            (
              time *
                (0.28 +
                  intensity *
                    0.9) +
              offset
            ) % 1;

          const position =
            direction ===
            "in"
              ? 1 - progress
              : progress;

          particle.position.y =
            position *
              length -
            length / 2;

          particle.scale.setScalar(
            0.7 +
              Math.sin(
                time * 7 +
                  index,
              ) *
                0.15,
          );
        },
      );
    },
  );

  return (
    <group
      rotation={[
        0,
        0,
        direction ===
        "in"
          ? Math.PI
          : 0,
      ]}
    >
      <Line
        points={[
          [
            0,
            -length / 2,
            0,
          ],
          [
            0,
            length / 2,
            0,
          ],
        ]}
        color={color}
        lineWidth={2}
        transparent
        opacity={0.5}
      />

      {particlePositions.map(
        (
          _,
          index,
        ) => (
          <mesh
            key={
              `${direction}-${index}`
            }
            ref={(mesh) => {
              particleRefs.current[
                index
              ] = mesh;
            }}
            position={[
              0,
              -length / 2,
              0,
            ]}
          >
            <sphereGeometry
              args={[
                0.045,
                8,
                8,
              ]}
            />

            <meshBasicMaterial
              color={color}
              transparent
              opacity={0.9}
            />
          </mesh>
        ),
      )}
    </group>
  );
}

function EnergyCore({
  deltaEnergyKJ,
  isPlaying,
}: {
  deltaEnergyKJ: number;
  isPlaying: boolean;
}) {
  const coreRef =
    useRef<Mesh | null>(
      null,
    );

  const normalizedBalance =
    normalize(
      Math.abs(
        deltaEnergyKJ,
      ),
      MIN_ENERGY,
      MAX_HEAT_INPUT,
    );

  const positive =
    deltaEnergyKJ > 0;

  useFrame(
    ({
      clock,
    }) => {
      if (!coreRef.current) {
        return;
      }

      const time =
        clock.getElapsedTime();

      const pulse =
        1 +
        Math.sin(
          time * 5,
        ) *
          0.06;

      const activity =
        isPlaying
          ? 1 +
            normalizedBalance *
              0.08
          : 1;

      coreRef.current.scale.set(
        pulse * activity,
        pulse * activity,
        pulse * activity,
      );

      coreRef.current.rotation.y +=
        0.008;
    },
  );

  return (
    <mesh
      ref={coreRef}
      position={[
        0,
        0.25,
        0,
      ]}
    >
      <sphereGeometry
        args={[
          0.18,
          16,
          16,
        ]}
      />

      <meshBasicMaterial
        color={
          positive
            ? "#22d3ee"
            : deltaEnergyKJ <
                0
              ? "#f59e0b"
              : "#94a3b8"
        }
        transparent
        opacity={0.85}
      />
    </mesh>
  );
}

export function FirstLawEnergyVisualization({
  heatInputKJ,
  workOutputKJ,
  deltaEnergyKJ,
  isPlaying,
}: FirstLawEnergyVisualizationProps) {
  const heatNorm =
    normalize(
      heatInputKJ,
      0,
      MAX_HEAT_INPUT,
    );

  const workNorm =
    normalize(
      workOutputKJ,
      0,
      MAX_WORK_OUTPUT,
    );

  const heatLength =
    MIN_FLOW_LENGTH +
    heatNorm *
      (MAX_FLOW_LENGTH -
        MIN_FLOW_LENGTH);

  const workLength =
    MIN_FLOW_LENGTH +
    workNorm *
      (MAX_FLOW_LENGTH -
        MIN_FLOW_LENGTH);

  return (
    <group
      position={[
        0,
        0.15,
        0,
      ]}
    >
      {/* =================================
          ENERGY CORE
      ================================= */}

      <EnergyCore
        deltaEnergyKJ={
          deltaEnergyKJ
        }
        isPlaying={
          isPlaying
        }
      />

      {/* =================================
          HEAT INPUT
      ================================= */}

      <group
        position={[
          -0.75,
          0.25,
          0,
        ]}
      >
        <FlowParticles
          direction="in"
          length={heatLength}
          color="#ef4444"
          intensity={
            heatNorm
          }
          isPlaying={
            isPlaying
          }
        />
      </group>

      {/* =================================
          WORK OUTPUT
      ================================= */}

      <group
        position={[
          0.75,
          0.25,
          0,
        ]}
      >
        <FlowParticles
          direction="out"
          length={workLength}
          color="#22d3ee"
          intensity={
            workNorm
          }
          isPlaying={
            isPlaying
          }
        />
      </group>

      {/* =================================
          BALANCE INDICATOR
      ================================= */}

      <group
        position={[
          0,
          0.25,
          0,
        ]}
      >
        <Line
          points={[
            [
              -0.3,
              0,
              0,
            ],
            [
              0.3,
              0,
              0,
            ],
          ]}
          color="#94a3b8"
          lineWidth={1}
          transparent
          opacity={0.5}
          dashed
          dashSize={0.04}
          gapSize={0.04}
        />
      </group>
    </group>
  );
}