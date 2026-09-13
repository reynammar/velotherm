"use client";

import { Line } from "@react-three/drei";

import { useFrame } from "@react-three/fiber";

import {
  useMemo,
  useRef,
} from "react";

import type { Group } from "three";

type PowerRotationVisualizationProps = {
  torqueNm: number;
  angularVelocityRadS: number;
  isPlaying: boolean;
};

const MIN_TORQUE_NM = 0;
const MAX_TORQUE_NM = 500;

const MIN_ANGULAR_VELOCITY = 20;
const MAX_ANGULAR_VELOCITY = 200;

const MIN_TORQUE_RADIUS = 0.28;
const MAX_TORQUE_RADIUS = 0.7;

const ROTATION_VISUAL_SCALE = 0.06;

const TORQUE_CENTER_Y = 0.45;

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

function buildArcPoints(
  radius: number,
  startAngle: number,
  endAngle: number,
  segments = 32,
): [number, number, number][] {
  const points:
    [number, number, number][] =
    [];

  for (
    let index = 0;
    index <= segments;
    index += 1
  ) {
    const progress =
      index / segments;

    const angle =
      startAngle +
      (endAngle -
        startAngle) *
        progress;

    points.push([
      Math.cos(angle) *
        radius,
      TORQUE_CENTER_Y +
        Math.sin(angle) *
          radius,
      0,
    ]);
  }

  return points;
}

function TorqueVisualization({
  torqueNm,
}: {
  torqueNm: number;
}) {
  const normalizedTorque =
    normalize(
      torqueNm,
      MIN_TORQUE_NM,
      MAX_TORQUE_NM,
    );

  const radius =
    MIN_TORQUE_RADIUS +
    normalizedTorque *
      (MAX_TORQUE_RADIUS -
        MIN_TORQUE_RADIUS);

  const arcPoints =
    useMemo(
      () =>
        buildArcPoints(
          radius,
          -Math.PI * 0.75,
          Math.PI * 0.75,
        ),
      [radius],
    );

  const arrowAngle =
    Math.PI * 0.75;

  const arrowX =
    Math.cos(
      arrowAngle,
    ) * radius;

  const arrowY =
    TORQUE_CENTER_Y +
    Math.sin(
      arrowAngle,
    ) * radius;

  return (
    <group>
      <Line
        points={arcPoints}
        color="#dc2626"
        lineWidth={3}
      />

      <group
        position={[
          arrowX,
          arrowY,
          0,
        ]}
        rotation={[
          0,
          0,
          arrowAngle +
            Math.PI / 2,
        ]}
      >
        <mesh>
          <coneGeometry
            args={[
              0.06,
              0.18,
              8,
            ]}
          />

          <meshBasicMaterial
            color="#dc2626"
          />
        </mesh>
      </group>

      <mesh
        position={[
          0,
          TORQUE_CENTER_Y,
          0,
        ]}
      >
        <sphereGeometry
          args={[
            0.07,
            12,
            12,
          ]}
        />

        <meshBasicMaterial
          color="#dc2626"
        />
      </mesh>
    </group>
  );
}

function AngularVelocityVisualization({
  angularVelocityRadS,
  isPlaying,
}: {
  angularVelocityRadS: number;
  isPlaying: boolean;
}) {
  const rotationRef =
    useRef<Group | null>(
      null,
    );

  const normalizedVelocity =
    normalize(
      angularVelocityRadS,
      MIN_ANGULAR_VELOCITY,
      MAX_ANGULAR_VELOCITY,
    );

  const radius =
    0.55;

  useFrame(
    (_, delta) => {
      if (
        !rotationRef.current ||
        !isPlaying
      ) {
        return;
      }

      rotationRef.current.rotation.z +=
        angularVelocityRadS *
        ROTATION_VISUAL_SCALE *
        delta;
    },
  );

  const points =
    useMemo(
      () =>
        buildArcPoints(
          radius,
          0,
          Math.PI * 1.65,
        ),
      [],
    );

  const markerSize =
    0.04 +
    normalizedVelocity *
      0.04;

  return (
    <group
      ref={rotationRef}
    >
      <Line
        points={points}
        color="#22d3ee"
        lineWidth={2}
        transparent
        opacity={0.85}
      />

      <mesh
        position={[
          radius,
          TORQUE_CENTER_Y,
          0,
        ]}
      >
        <sphereGeometry
          args={[
            markerSize,
            10,
            10,
          ]}
        />

        <meshBasicMaterial
          color="#22d3ee"
        />
      </mesh>
    </group>
  );
}

export function PowerRotationVisualization({
  torqueNm,
  angularVelocityRadS,
  isPlaying,
}: PowerRotationVisualizationProps) {
  return (
    <group
      position={[
        1.0,
        0,
        0,
      ]}
    >
      <TorqueVisualization
        torqueNm={torqueNm}
      />

      <AngularVelocityVisualization
        angularVelocityRadS={
          angularVelocityRadS
        }
        isPlaying={
          isPlaying
        }
      />
    </group>
  );
}