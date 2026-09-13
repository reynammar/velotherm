"use client";

import {
  useEffect,
  useMemo,
  useRef,
} from "react";

import {
  Line,
} from "@react-three/drei";

import {
  useFrame,
} from "@react-three/fiber";

import {
  CatmullRomCurve3,
  Color,
  Mesh,
  Object3D,
  Vector3,
  MeshPhysicalMaterial,
  MeshStandardMaterial,
  type Material,
} from "three";

import type {
  CarFocusComponent,
} from "@/src/features/simulation/components/CarModel";

import type {
  CarNodeRegistry,
} from "@/src/lib/three/nodeRegistry";

export type HybridComponent =
  | "generator"
  | "inverter"
  | "electricMotor"
  | "battery";

export type HybridSystemProps = {
  nodes: CarNodeRegistry;

  inputPowerKw: number;

  efficiency: number;

  running: boolean;

  activeComponent:
    | HybridComponent
    | null;

  onSelect?: (
    component: CarFocusComponent,
  ) => void;

  resetKey?: number;
};

type EnergyFlowPathProps = {
  start: Object3D;

  end: Object3D;

  index: number;

  running: boolean;

  intensity: number;

  speed: number;
};

type OriginalMaterialState = {
  emissive: Color;

  emissiveIntensity: number;
};

function getMaterials(
  material:
    | Material
    | Material[],
): Material[] {
  return Array.isArray(material)
    ? material
    : [material];
}

function setComponentVisual(
  object: Object3D,
  selected: boolean,
  running: boolean,
  pulse: number,
) {
  object.traverse(
    (child) => {
      const mesh =
        child as Mesh;

      if (!mesh.isMesh) {
        return;
      }

      const materials =
        getMaterials(
          mesh.material,
        );

      materials.forEach(
        (material) => {
          if (
            material instanceof
              MeshStandardMaterial ||
            material instanceof
              MeshPhysicalMaterial
          ) {
            if (selected) {
              material.emissive.set(
                "#22d3ee",
              );

              material.emissiveIntensity =
                0.25 +
                pulse * 0.22;
            } else if (
              running
            ) {
              material.emissive.set(
                "#0e7490",
              );

              material.emissiveIntensity =
                0.04 +
                pulse * 0.08;
            }
          }
        },
      );
    },
  );
}

function EnergyFlowPath({
  start,
  end,
  index,
  running,
  intensity,
  speed,
}: EnergyFlowPathProps) {
  /**
   * FIX:
   * Do not use setState inside useEffect.
   *
   * The hybrid components are static after the
   * GLB has loaded, so the curve can be created
   * synchronously with useMemo.
   */
  const curve =
    useMemo(() => {
      const startPosition =
        new Vector3();

      const endPosition =
        new Vector3();

      start.getWorldPosition(
        startPosition,
      );

      end.getWorldPosition(
        endPosition,
      );

      const midpoint =
        startPosition
          .clone()
          .lerp(
            endPosition,
            0.5,
          );

      midpoint.y +=
        0.12 +
        index * 0.025;

      return new CatmullRomCurve3(
        [
          startPosition,
          midpoint,
          endPosition,
        ],
        false,
        "centripetal",
      );
    }, [
      end,
      index,
      start,
    ]);

  const particleRef =
    useRef<Mesh | null>(
      null,
    );

  useFrame((state) => {
    const particle =
      particleRef.current;

    if (!particle) {
      return;
    }

    if (!running) {
      particle.visible = false;
      return;
    }

    particle.visible = true;

    const progress =
      (state.clock.getElapsedTime() *
        speed +
        index * 0.11) %
      1;

    particle.position.copy(
      curve.getPointAt(
        progress,
      ),
    );

    const pulse =
      0.045 +
      Math.sin(
        state.clock.getElapsedTime() *
          8 +
          index,
      ) *
        0.012;

    particle.scale.setScalar(
      pulse *
        (0.7 +
          intensity * 0.7),
    );
  });

  const curvePoints =
    useMemo(
      () =>
        curve.getPoints(
          24,
        ),
      [curve],
    );

  return (
    <group>
      <Line
        points={curvePoints}
        color="#22d3ee"
        lineWidth={1.4}
        transparent
        opacity={
          running
            ? 0.32 +
              intensity * 0.45
            : 0.08
        }
      />

      <mesh
        ref={particleRef}
      >
        <sphereGeometry
          args={[
            1,
            8,
            8,
          ]}
        />

        <meshBasicMaterial
          color="#f8fafc"
          transparent
          opacity={
            running
              ? 0.9
              : 0
          }
        />
      </mesh>
    </group>
  );
}

export function HybridSystem({
  nodes,
  inputPowerKw,
  efficiency,
  running,
  activeComponent,
  resetKey = 0,
}: HybridSystemProps) {
  /**
   * FIX:
   * Memoize the component array so it does not
   * become a new dependency on every render.
   */
  const components =
    useMemo(
      () => [
        {
          key:
            "generator" as const,
          node:
            nodes.hybrid
              .generator,
        },
        {
          key:
            "inverter" as const,
          node:
            nodes.hybrid
              .inverter,
        },
        {
          key:
            "electricMotor" as const,
          node:
            nodes.hybrid
              .electricMotor,
        },
        {
          key:
            "battery" as const,
          node:
            nodes.hybrid
              .battery,
        },
      ],
      [nodes],
    );

  const flowPaths =
    useMemo(
      () => [
        {
          id:
            "engine-generator",
          start:
            nodes.energy
              .engineOutput,
          end:
            nodes.energy
              .generatorInput,
          index: 0,
        },
        {
          id:
            "generator-inverter",
          start:
            nodes.energy
              .generatorOutput,
          end:
            nodes.energy
              .inverterInput,
          index: 1,
        },
        {
          id:
            "inverter-motor",
          start:
            nodes.energy
              .inverterOutput,
          end:
            nodes.energy
              .motorInput,
          index: 2,
        },
        {
          id:
            "motor-wheel-fl",
          start:
            nodes.energy
              .motorOutput,
          end:
            nodes.wheels
              .frontLeftRollPivot,
          index: 3,
        },
        {
          id:
            "motor-wheel-fr",
          start:
            nodes.energy
              .motorOutput,
          end:
            nodes.wheels
              .frontRightRollPivot,
          index: 4,
        },
        {
          id:
            "motor-wheel-rl",
          start:
            nodes.energy
              .motorOutput,
          end:
            nodes.wheels
              .rearLeftRollPivot,
          index: 5,
        },
        {
          id:
            "motor-wheel-rr",
          start:
            nodes.energy
              .motorOutput,
          end:
            nodes.wheels
              .rearRightRollPivot,
          index: 6,
        },
      ],
      [nodes],
    );

  const originalRotationsRef =
    useRef(
      new Map<
        Object3D,
        {
          x: number;
          y: number;
          z: number;
        }
      >(),
    );

  const originalMaterialsRef =
    useRef(
      new Map<
        Material,
        OriginalMaterialState
      >(),
    );

  const outputPowerKw =
    inputPowerKw *
    efficiency;

  const flowIntensity =
    Math.min(
      Math.max(
        outputPowerKw /
          100,
        0,
      ),
      1,
    );

  const animationSpeed =
    0.45 +
    flowIntensity *
      1.35;

  /**
   * Register original component rotations
   * and cable materials once the nodes exist.
   */
  useEffect(() => {
    components.forEach(
      ({
        node,
      }) => {
        if (
          !originalRotationsRef.current.has(
            node,
          )
        ) {
          originalRotationsRef.current.set(
            node,
            {
              x: node.rotation
                .x,
              y: node.rotation
                .y,
              z: node.rotation
                .z,
            },
          );
        }
      },
    );

    nodes.hybrid.busCable.traverse(
      (child) => {
        const mesh =
          child as Mesh;

        if (!mesh.isMesh) {
          return;
        }

        getMaterials(
          mesh.material,
        ).forEach(
          (material) => {
            if (
              material instanceof
                MeshStandardMaterial ||
              material instanceof
                MeshPhysicalMaterial
            ) {
              if (
                !originalMaterialsRef.current.has(
                  material,
                )
              ) {
                originalMaterialsRef.current.set(
                  material,
                  {
                    emissive:
                      material.emissive.clone(),
                    emissiveIntensity:
                      material.emissiveIntensity,
                  },
                );
              }
            }
          },
        );
      },
    );
  }, [
    components,
    nodes,
  ]);

  /**
   * Reset hybrid component transforms.
   */
  useEffect(() => {
    originalRotationsRef.current.forEach(
      (
        rotation,
        node,
      ) => {
        node.rotation.set(
          rotation.x,
          rotation.y,
          rotation.z,
        );
      },
    );
  }, [
    resetKey,
  ]);

  /**
   * Restore original state on unmount.
   */
  useEffect(() => {
    return () => {
      originalMaterialsRef.current.forEach(
        (
          state,
          material,
        ) => {
          if (
            material instanceof
              MeshStandardMaterial ||
            material instanceof
              MeshPhysicalMaterial
          ) {
            material.emissive.copy(
              state.emissive,
            );

            material.emissiveIntensity =
              state.emissiveIntensity;
          }
        },
      );

      originalRotationsRef.current.forEach(
        (
          rotation,
          node,
        ) => {
          node.rotation.set(
            rotation.x,
            rotation.y,
            rotation.z,
          );
        },
      );
    };
  }, []);

  useFrame(
    (state, delta) => {
      const time =
        state.clock.getElapsedTime();

      const pulse =
        running
          ? (Math.sin(
              time * 7,
            ) +
              1) /
            2
          : 0;

      const rotationSpeed =
        running
          ? (
              0.7 +
              flowIntensity *
                2.4
            ) *
            delta
          : 0;

      /**
       * Generator rotation.
       */
      if (running) {
        nodes.hybrid.generator.rotateY(
          rotationSpeed,
        );

        /**
         * Electric motor rotates
         * slightly faster to make the
         * conversion chain visually clear.
         */
        nodes.hybrid.electricMotor.rotateY(
          -rotationSpeed *
            1.35,
        );
      }

      /**
       * Component visual state.
       */
      components.forEach(
        ({
          key,
          node,
        }) => {
          setComponentVisual(
            node,
            activeComponent ===
              key,
            running,
            pulse,
          );
        },
      );

      /**
       * Bus cable gets a subtle active
       * visual while the system runs.
       */
      setComponentVisual(
        nodes.hybrid
          .busCable,
        false,
        running,
        pulse,
      );
    },
  );

  return (
    <group>
      {flowPaths.map(
        (path) => (
          <EnergyFlowPath
            key={path.id}
            start={
              path.start
            }
            end={
              path.end
            }
            index={
              path.index
            }
            running={
              running
            }
            intensity={
              flowIntensity
            }
            speed={
              animationSpeed
            }
          />
        ),
      )}
    </group>
  );
}