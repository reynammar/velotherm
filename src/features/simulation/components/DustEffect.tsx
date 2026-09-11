"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { MathUtils, type Mesh } from "three";

type DustEffectProps = {
  speedKmh: number;
  position?: [number, number, number];
  maxSpeedKmh?: number;
};

type DustParticle = {
  x: number;
  y: number;
  z: number;
  scale: number;
};

const DUST_PARTICLES: DustParticle[] = [
  {
    x: -0.60,
    y: 0.08,
    z: -0.10,
    scale: 0.06,
  },
  {
    x: -0.20,
    y: 0.14,
    z: -0.30,
    scale: 0.08,
  },
  {
    x: 0.20,
    y: 0.06,
    z: -0.50,
    scale: 0.05,
  },
  {
    x: 0.60,
    y: 0.12,
    z: -0.20,
    scale: 0.07,
  },
  {
    x: -0.45,
    y: 0.18,
    z: -0.70,
    scale: 0.05,
  },
  {
    x: -0.05,
    y: 0.11,
    z: -0.90,
    scale: 0.09,
  },
  {
    x: 0.35,
    y: 0.20,
    z: -0.80,
    scale: 0.06,
  },
  {
    x: 0.70,
    y: 0.09,
    z: -1.00,
    scale: 0.05,
  },
  {
    x: -0.70,
    y: 0.07,
    z: -1.20,
    scale: 0.08,
  },
  {
    x: -0.30,
    y: 0.16,
    z: -1.35,
    scale: 0.05,
  },
  {
    x: 0.10,
    y: 0.10,
    z: -1.15,
    scale: 0.07,
  },
  {
    x: 0.50,
    y: 0.22,
    z: -1.30,
    scale: 0.06,
  },
  {
    x: -0.55,
    y: 0.12,
    z: -1.55,
    scale: 0.05,
  },
  {
    x: -0.10,
    y: 0.24,
    z: -1.70,
    scale: 0.08,
  },
  {
    x: 0.30,
    y: 0.14,
    z: -1.55,
    scale: 0.06,
  },
  {
    x: 0.65,
    y: 0.10,
    z: -1.80,
    scale: 0.05,
  },
];

export function DustEffect({
  speedKmh,
  position = [0, 0.15, -5.2],
  maxSpeedKmh = 120,
}: DustEffectProps) {
  const particleRefs = useRef<
    Array<Mesh | null>
  >([]);

  useFrame((_, delta) => {
    const intensity = MathUtils.clamp(
      speedKmh / maxSpeedKmh,
      0,
      1,
    );

    if (intensity <= 0) {
      return;
    }

    particleRefs.current.forEach(
      (particle, index) => {
        if (!particle) {
          return;
        }

        const config = DUST_PARTICLES[index];

        const movement =
          (0.35 + intensity * 1.4) *
          delta;

        particle.position.z -= movement;

        particle.position.y +=
          delta *
          (0.05 + intensity * 0.1);

        particle.scale.setScalar(
          config.scale *
            (0.8 + intensity * 1.2),
        );

        if (
          particle.position.z <
          -2.5
        ) {
          particle.position.z =
            config.z;

          particle.position.y =
            config.y;
        }
      },
    );
  });

  if (speedKmh <= 0) {
    return null;
  }

  return (
    <group position={position}>
      {DUST_PARTICLES.map(
        (particle, index) => (
          <mesh
            key={`dust-${index}`}
            ref={(node) => {
              particleRefs.current[index] =
                node;
            }}
            position={[
              particle.x,
              particle.y,
              particle.z,
            ]}
            scale={particle.scale}
          >
            <sphereGeometry
              args={[1, 8, 8]}
            />

            <meshBasicMaterial
              color="#94a3b8"
              transparent
              opacity={0.18}
              depthWrite={false}
            />
          </mesh>
        ),
      )}
    </group>
  );
}