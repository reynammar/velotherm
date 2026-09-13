"use client";

import {
  useMemo,
  useRef,
} from "react";

import {
  Billboard,
  Line,
  useGLTF,
} from "@react-three/drei";

import {
  useFrame,
} from "@react-three/fiber";

import {
  CatmullRomCurve3,
  Vector3,
  type Object3D,
} from "three";

import {
  createCarNodeRegistry,
  type CarNodeRegistry,
} from "@/src/lib/three/nodeRegistry";

const MODEL_PATH =
  "/models/velotherm-master.glb";

export type VehicleLabMode =
  | "drive"
  | "regen";

export type VehicleLabStage =
  | "engine"
  | "generator"
  | "inverter"
  | "motor"
  | "wheel"
  | "battery";

type VehicleEngineeringLabVisualizationProps =
  {
    mode: VehicleLabMode;

    active: boolean;

    intensity: number;

    selectedStage:
      | VehicleLabStage
      | null;

    onSelectStage: (
      stage: VehicleLabStage,
    ) => void;
  };

type FlowPath = {
  id: string;

  start: Vector3;

  end: Vector3;

  reverse: boolean;

  index: number;
};

const STAGE_LABELS: Record<
  VehicleLabStage,
  string
> = {
  engine: "ENGINE",
  generator: "GENERATOR",
  inverter: "INVERTER",
  motor: "E-MOTOR",
  wheel: "WHEEL",
  battery: "BATTERY",
};

function getWorldPosition(
  object: Object3D,
) {
  const position =
    new Vector3();

  object.getWorldPosition(
    position,
  );

  return position;
}

function createFlowCurve(
  start: Vector3,
  end: Vector3,
  index: number,
) {
  const midpoint =
    start
      .clone()
      .lerp(
        end,
        0.5,
      );

  midpoint.y +=
    0.08 +
    index * 0.025;

  return new CatmullRomCurve3(
    [
      start,
      midpoint,
      end,
    ],
    false,
    "centripetal",
  );
}

function EnergyParticle({
  curve,
  index,
  active,
  intensity,
  reverse,
}: {
  curve: CatmullRomCurve3;

  index: number;

  active: boolean;

  intensity: number;

  reverse: boolean;
}) {
  const ref =
    useRef<Object3D | null>(
      null,
    );

  useFrame(
    (state) => {
      const object =
        ref.current;

      if (!object) {
        return;
      }

      object.visible =
        active;

      if (!active) {
        return;
      }

      const elapsed =
        state.clock.getElapsedTime();

      const speed =
        0.45 +
        intensity *
          1.7;

      const rawProgress =
        (
          elapsed *
            speed +
          index *
            0.19
        ) % 1;

      const progress =
        reverse
          ? 1 -
            rawProgress
          : rawProgress;

      object.position.copy(
        curve.getPointAt(
          progress,
        ),
      );

      const pulse =
        1 +
        Math.sin(
          elapsed * 9 +
            index,
        ) *
          0.15;

      object.scale.setScalar(
        pulse,
      );
    },
  );

  return (
    <mesh ref={ref}>
      <sphereGeometry
        args={[
          0.045,
          10,
          10,
        ]}
      />

      <meshBasicMaterial
        color={
          reverse
            ? "#f59e0b"
            : "#22d3ee"
        }
        transparent
        opacity={0.95}
        depthTest={false}
      />
    </mesh>
  );
}

function EnergyFlowPath({
  path,
  active,
  intensity,
}: {
  path: FlowPath;

  active: boolean;

  intensity: number;
}) {
  const curve =
    useMemo(
      () =>
        createFlowCurve(
          path.start,
          path.end,
          path.index,
        ),
      [
        path.end,
        path.index,
        path.start,
      ],
    );

  const points =
    useMemo(
      () =>
        curve.getPoints(
          28,
        ),
      [curve],
    );

  const color =
    path.reverse
      ? "#f59e0b"
      : "#22d3ee";

  return (
    <group>
      <Line
        points={
          points
        }
        color={
          color
        }
        lineWidth={
          active
            ? 1.4 +
              intensity *
                1
            : 0.8
        }
        transparent
        opacity={
          active
            ? 0.35 +
              intensity *
                0.45
            : 0.06
        }
      />

      <EnergyParticle
        curve={
          curve
        }
        index={
          path.index
        }
        active={
          active
        }
        intensity={
          intensity
        }
        reverse={
          path.reverse
        }
      />
    </group>
  );
}

function StageMarker({
  target,
  stage,
  selected,
  active,
  onSelect,
}: {
  target: Object3D;

  stage: VehicleLabStage;

  selected: boolean;

  active: boolean;

  onSelect: (
    stage: VehicleLabStage,
  ) => void;
}) {
  const markerRef =
    useRef<Object3D | null>(
      null,
    );

  const worldPositionRef =
    useRef(
      new Vector3(),
    );

  const localPositionRef =
    useRef(
      new Vector3(),
    );

  useFrame(
    (state) => {
      const marker =
        markerRef.current;

      if (!marker) {
        return;
      }

      const parent =
        marker.parent;

      if (!parent) {
        return;
      }

      target.getWorldPosition(
        worldPositionRef.current,
      );

      localPositionRef.current.copy(
        worldPositionRef.current,
      );

      parent.worldToLocal(
        localPositionRef.current,
      );

      marker.position.copy(
        localPositionRef.current,
      );

      const pulse =
        selected
          ? 1 +
            Math.sin(
              state.clock.getElapsedTime() *
                5,
            ) *
              0.08
          : 1;

      marker.scale.setScalar(
        pulse,
      );
    },
  );

  if (!active) {
    return null;
  }

  const handleClick = (
    event: {
      stopPropagation: () => void;
    },
  ) => {
    event.stopPropagation();

    onSelect(
      stage,
    );
  };

  return (
    <group
      ref={markerRef}
      renderOrder={1000}
    >
      <Billboard>
        <group>
          {/* Large invisible hit area */}

          <mesh
            onClick={
              handleClick
            }
            onPointerDown={(
              event,
            ) => {
              event.stopPropagation();
            }}
            renderOrder={1000}
          >
            <circleGeometry
              args={[
                0.2,
                32,
              ]}
            />

            <meshBasicMaterial
              transparent
              opacity={0}
              depthTest={false}
              depthWrite={false}
            />
          </mesh>

          {/* Visible marker */}

          <mesh
            onClick={
              handleClick
            }
            onPointerDown={(
              event,
            ) => {
              event.stopPropagation();
            }}
            renderOrder={1001}
          >
            <ringGeometry
              args={[
                0.065,
                0.1,
                32,
              ]}
            />

            <meshBasicMaterial
              color={
                selected
                  ? "#22d3ee"
                  : "#94a3b8"
              }
              transparent
              opacity={
                selected
                  ? 1
                  : 0.7
              }
              depthTest={false}
              depthWrite={false}
            />
          </mesh>
        </group>
      </Billboard>
    </group>
  );
}

export function VehicleEngineeringLabVisualization({
  mode,
  active,
  intensity,
  selectedStage,
  onSelectStage,
}: VehicleEngineeringLabVisualizationProps) {
  const {
    scene,
  } = useGLTF(
    MODEL_PATH,
  );

  const nodes =
    useMemo<
      CarNodeRegistry
    >(
      () =>
        createCarNodeRegistry(
          scene,
        ),
      [scene],
    );

  const drivePaths =
    useMemo<
      FlowPath[]
    >(
      () => [
        {
          id:
            "engine-generator",

          start:
            getWorldPosition(
              nodes.energy
                .engineOutput,
            ),

          end:
            getWorldPosition(
              nodes.energy
                .generatorInput,
            ),

          reverse:
            false,

          index: 0,
        },

        {
          id:
            "generator-inverter",

          start:
            getWorldPosition(
              nodes.energy
                .generatorOutput,
            ),

          end:
            getWorldPosition(
              nodes.energy
                .inverterInput,
            ),

          reverse:
            false,

          index: 1,
        },

        {
          id:
            "inverter-motor",

          start:
            getWorldPosition(
              nodes.energy
                .inverterOutput,
            ),

          end:
            getWorldPosition(
              nodes.energy
                .motorInput,
            ),

          reverse:
            false,

          index: 2,
        },

        {
          id:
            "motor-wheel",

          start:
            getWorldPosition(
              nodes.energy
                .motorOutput,
            ),

          end:
            getWorldPosition(
              nodes.wheels
                .frontLeftRollPivot,
            ),

          reverse:
            false,

          index: 3,
        },
      ],
      [nodes],
    );

  const regenPaths =
    useMemo<
      FlowPath[]
    >(
      () => [
        {
          id:
            "wheel-generator",

          start:
            getWorldPosition(
              nodes.wheels
                .frontLeftRollPivot,
            ),

          end:
            getWorldPosition(
              nodes.energy
                .generatorInput,
            ),

          reverse:
            true,

          index: 0,
        },

        {
          id:
            "generator-battery",

          start:
            getWorldPosition(
              nodes.energy
                .generatorOutput,
            ),

          end:
            getWorldPosition(
              nodes.energy
                .batteryInput,
            ),

          reverse:
            true,

          index: 1,
        },
      ],
      [nodes],
    );

  return (
    <group>
      {drivePaths.map(
        (path) => (
          <EnergyFlowPath
            key={
              path.id
            }
            path={
              path
            }
            active={
              mode ===
                "drive" &&
              active
            }
            intensity={
              intensity
            }
          />
        ),
      )}

      {regenPaths.map(
        (path) => (
          <EnergyFlowPath
            key={
              path.id
            }
            path={
              path
            }
            active={
              mode ===
                "regen" &&
              active
            }
            intensity={
              intensity
            }
          />
        ),
      )}

      <StageMarker
        target={
          nodes.energy
            .engineOutput
        }
        stage="engine"
        selected={
          selectedStage ===
          "engine"
        }
        active={
          mode ===
          "drive"
        }
        onSelect={
          onSelectStage
        }
      />

      <StageMarker
        target={
          nodes.hybrid
            .generator
        }
        stage="generator"
        selected={
          selectedStage ===
          "generator"
        }
        active={true}
        onSelect={
          onSelectStage
        }
      />

      <StageMarker
        target={
          nodes.hybrid
            .inverter
        }
        stage="inverter"
        selected={
          selectedStage ===
          "inverter"
        }
        active={
          mode ===
          "drive"
        }
        onSelect={
          onSelectStage
        }
      />

      <StageMarker
        target={
          nodes.hybrid
            .electricMotor
        }
        stage="motor"
        selected={
          selectedStage ===
          "motor"
        }
        active={
          mode ===
          "drive"
        }
        onSelect={
          onSelectStage
        }
      />

      <StageMarker
        target={
          nodes.wheels
            .frontLeftRollPivot
        }
        stage="wheel"
        selected={
          selectedStage ===
          "wheel"
        }
        active={
          mode ===
          "regen"
        }
        onSelect={
          onSelectStage
        }
      />

      <StageMarker
        target={
          nodes.hybrid
            .battery
        }
        stage="battery"
        selected={
          selectedStage ===
          "battery"
        }
        active={
          mode ===
          "regen"
        }
        onSelect={
          onSelectStage
        }
      />
    </group>
  );
}

export function getVehicleLabStageLabel(
  stage:
    | VehicleLabStage
    | null,
) {
  if (!stage) {
    return "VEHICLE";
  }

  return STAGE_LABELS[
    stage
  ];
}

useGLTF.preload(
  MODEL_PATH,
);