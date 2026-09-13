"use client";

import { Line } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";

import {
  useRef,
  type RefObject,
} from "react";

import type { Mesh } from "three";

type PistonWorkVisualizationProps = {
  forceN: number;
  displacementM: number;
  isPlaying: boolean;
};

const MIN_FORCE = 0;
const MAX_FORCE = 5000;

const MIN_DISPLACEMENT = 0;
const MAX_DISPLACEMENT = 0.5;

/**
 * Visual-only values.
 *
 * These values do not modify the actual GLB piston.
 */
const FORCE_ARROW_MIN = 0.25;
const FORCE_ARROW_MAX = 0.95;

const DISPLACEMENT_MIN_LENGTH = 0.35;
const DISPLACEMENT_MAX_LENGTH = 1.25;

/**
 * Horizontal layout.
 *
 * Force vector:
 *   right side
 *
 * Displacement guide:
 *   left side
 *
 * Reference:
 *   center
 */
const FORCE_X = 0.55;
const DISPLACEMENT_X = -0.7;
const STROKE_X = 0.25;

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

function MovingMarker({
  markerRef,
  displacementLength,
  isPlaying,
}: {
  markerRef: RefObject<Mesh | null>;
  displacementLength: number;
  isPlaying: boolean;
}) {
  useFrame(({ clock }) => {
    const marker =
      markerRef.current;

    if (!marker) {
      return;
    }

    if (!isPlaying) {
      marker.visible = false;
      return;
    }

    marker.visible = true;

    const time =
      clock.getElapsedTime();

    const progress =
      (Math.sin(
        time * 6,
      ) +
        1) /
      2;

    marker.position.y =
      displacementLength *
      progress;

    marker.scale.setScalar(
      0.9 +
        Math.sin(
          time * 12,
        ) *
          0.08,
    );
  });

  return null;
}

export function PistonWorkVisualization({
  forceN,
  displacementM,
  isPlaying,
}: PistonWorkVisualizationProps) {
  const markerRef =
    useRef<Mesh | null>(
      null,
    );

  const normalizedForce =
    normalize(
      forceN,
      MIN_FORCE,
      MAX_FORCE,
    );

  const normalizedDisplacement =
    normalize(
      displacementM,
      MIN_DISPLACEMENT,
      MAX_DISPLACEMENT,
    );

  const forceArrowLength =
    FORCE_ARROW_MIN +
    normalizedForce *
      (FORCE_ARROW_MAX -
        FORCE_ARROW_MIN);

  const displacementLength =
    DISPLACEMENT_MIN_LENGTH +
    normalizedDisplacement *
      (DISPLACEMENT_MAX_LENGTH -
        DISPLACEMENT_MIN_LENGTH);

  return (
    <group
      position={[
        1.5,
        0.15,
        0,
      ]}
    >
      {/* =================================
          FORCE VECTOR
      ================================= */}

      <Line
        points={[
          [
            FORCE_X,
            forceArrowLength,
            0,
          ],
          [
            FORCE_X,
            0,
            0,
          ],
        ]}
        color="#dc2626"
        lineWidth={3}
      />

      <Line
        points={[
          [
            FORCE_X - 0.08,
            0.14,
            0,
          ],
          [
            FORCE_X,
            0,
            0,
          ],
          [
            FORCE_X + 0.08,
            0.14,
            0,
          ],
        ]}
        color="#dc2626"
        lineWidth={2}
      />

      {/* =================================
          DISPLACEMENT GUIDE
      ================================= */}

      <Line
        points={[
          [
            DISPLACEMENT_X,
            0,
            0,
          ],
          [
            DISPLACEMENT_X,
            displacementLength,
            0,
          ],
        ]}
        color="#22d3ee"
        lineWidth={2}
        dashed
        dashSize={0.08}
        gapSize={0.06}
      />

      <Line
        points={[
          [
            DISPLACEMENT_X - 0.13,
            0,
            0,
          ],
          [
            DISPLACEMENT_X + 0.13,
            0,
            0,
          ],
        ]}
        color="#22d3ee"
        lineWidth={2}
      />

      <Line
        points={[
          [
            DISPLACEMENT_X - 0.13,
            displacementLength,
            0,
          ],
          [
            DISPLACEMENT_X + 0.13,
            displacementLength,
            0,
          ],
        ]}
        color="#22d3ee"
        lineWidth={2}
      />

      {/* =================================
          CENTER STROKE REFERENCE
      ================================= */}

      <Line
        points={[
          [
            STROKE_X,
            0,
            0,
          ],
          [
            STROKE_X,
            displacementLength,
            0,
          ],
        ]}
        color="#94a3b8"
        lineWidth={1}
        transparent
        opacity={0.4}
        dashed
        dashSize={0.05}
        gapSize={0.05}
      />

      <Line
        points={[
          [
            STROKE_X - 0.14,
            0,
            0,
          ],
          [
            STROKE_X + 0.14,
            0,
            0,
          ],
        ]}
        color="#94a3b8"
        lineWidth={1}
        transparent
        opacity={0.5}
      />

      <Line
        points={[
          [
            STROKE_X - 0.14,
            displacementLength,
            0,
          ],
          [
            STROKE_X + 0.14,
            displacementLength,
            0,
          ],
        ]}
        color="#94a3b8"
        lineWidth={1}
        transparent
        opacity={0.5}
      />

      {/* =================================
          MOVING DISPLACEMENT MARKER
      ================================= */}

      <mesh
        ref={markerRef}
        position={[
          STROKE_X,
          0,
          0,
        ]}
      >
        <sphereGeometry
          args={[
            0.055,
            12,
            12,
          ]}
        />

        <meshBasicMaterial
          color="#22d3ee"
          transparent
          opacity={0.95}
        />
      </mesh>

      <MovingMarker
        markerRef={
          markerRef
        }
        displacementLength={
          displacementLength
        }
        isPlaying={
          isPlaying
        }
      />
    </group>
  );
}