"use client";

import { useEffect } from "react";

import {
  Line,
  useAnimations,
  useGLTF,
} from "@react-three/drei";

import {
  useFrame,
} from "@react-three/fiber";

import type {
  Object3D,
} from "three";

import {
  LoopRepeat,
  Vector3,
} from "three";

import {
  CAR_ANIMATION_NAMES,
} from "@/src/lib/three/animationRegistry";

import {
  CAR_NODE_NAMES,
} from "@/src/lib/three/nodeRegistry";

import {
  CAR_MODEL_PATH,
} from "@/src/lib/three/modelConfig";

import type {
  CarFocusComponent,
} from "@/src/features/simulation/components/CarModel";

type EngineMechanismProps = {
  isPlaying: boolean;

  playbackRate?: number;

  resetKey?: number;

  cycleProgress?:
    | number
    | null;

  startProgress?: number;

  showTrace?: boolean;

  selectedComponent?:
    | CarFocusComponent
    | null;
};

const ENGINE_COMPONENTS = [
  "piston1",
  "rod1",
  "piston2",
  "rod2",
  "piston3",
  "rod3",
  "piston4",
  "rod4",
  "crankshaft",
] as const;

type EngineComponent =
  (typeof ENGINE_COMPONENTS)[number];

const ENGINE_NODE_MAP: Record<
  EngineComponent,
  string
> = {
  piston1:
    CAR_NODE_NAMES.engine
      .piston1,

  rod1:
    CAR_NODE_NAMES.engine
      .rod1,

  piston2:
    CAR_NODE_NAMES.engine
      .piston2,

  rod2:
    CAR_NODE_NAMES.engine
      .rod2,

  piston3:
    CAR_NODE_NAMES.engine
      .piston3,

  rod3:
    CAR_NODE_NAMES.engine
      .rod3,

  piston4:
    CAR_NODE_NAMES.engine
      .piston4,

  rod4:
    CAR_NODE_NAMES.engine
      .rod4,

  crankshaft:
    CAR_NODE_NAMES.engine
      .crankshaft,
};

function getEngineComponent(
  component:
    | CarFocusComponent
    | null
    | undefined,
): EngineComponent | null {
  if (!component) {
    return null;
  }

  if (
    ENGINE_COMPONENTS.includes(
      component as EngineComponent,
    )
  ) {
    return component as EngineComponent;
  }

  return null;
}

function getTraceComponents(
  selected:
    | EngineComponent
    | null,
): EngineComponent[] {
  if (!selected) {
    return [];
  }

  if (
    selected ===
    "crankshaft"
  ) {
    return [
      "piston1",
      "rod1",
      "piston2",
      "rod2",
      "piston3",
      "rod3",
      "piston4",
      "rod4",
      "crankshaft",
    ];
  }

  const pistonNumber =
    selected.replace(
      "piston",
      "",
    ) ||
    selected.replace(
      "rod",
      "",
    );

  if (
    ["1", "2", "3", "4"].includes(
      pistonNumber,
    )
  ) {
    return [
      `piston${pistonNumber}` as EngineComponent,
      `rod${pistonNumber}` as EngineComponent,
      "crankshaft",
    ];
  }

  return [];
}

type EngineTraceProps = {
  scene: Object3D;

  selectedComponent?:
    | CarFocusComponent
    | null;

  visible: boolean;
};

function EngineTrace({
  scene,
  selectedComponent,
  visible,
}: EngineTraceProps) {
  if (!visible) {
    return null;
  }

  const selected =
    getEngineComponent(
      selectedComponent,
    );

  const trace =
    getTraceComponents(
      selected,
    );

  if (trace.length === 0) {
    return null;
  }

  const getWorldPosition = (
    component: EngineComponent,
  ) => {
    const node =
      scene.getObjectByName(
        ENGINE_NODE_MAP[
          component
        ],
      );

    if (!node) {
      return null;
    }

    const position =
      new Vector3();

    node.getWorldPosition(
      position,
    );

    return position;
  };

  if (
    selected ===
    "crankshaft"
  ) {
    return (
      <group>
        {[
          "1",
          "2",
          "3",
          "4",
        ].map((number) => {
          const piston =
            getWorldPosition(
              `piston${number}` as EngineComponent,
            );

          const rod =
            getWorldPosition(
              `rod${number}` as EngineComponent,
            );

          const crankshaft =
            getWorldPosition(
              "crankshaft",
            );

          if (
            !piston ||
            !rod ||
            !crankshaft
          ) {
            return null;
          }

          return (
            <Line
              key={number}
              points={[
                piston,
                rod,
                crankshaft,
              ]}
              color="#22d3ee"
              lineWidth={1.4}
              transparent
              opacity={0.7}
            />
          );
        })}
      </group>
    );
  }

  const piston =
    getWorldPosition(
      trace[0],
    );

  const rod =
    getWorldPosition(
      trace[1],
    );

  const crankshaft =
    getWorldPosition(
      trace[2],
    );

  if (
    !piston ||
    !rod ||
    !crankshaft
  ) {
    return null;
  }

  return (
    <group>
      <Line
        points={[
          piston,
          rod,
          crankshaft,
        ]}
        color="#22d3ee"
        lineWidth={2}
        transparent
        opacity={0.85}
      />

      <mesh
        position={piston}
      >
        <sphereGeometry
          args={[
            0.055,
            10,
            10,
          ]}
        />

        <meshBasicMaterial
          color="#22d3ee"
        />
      </mesh>

      <mesh
        position={
          crankshaft
        }
      >
        <sphereGeometry
          args={[
            0.065,
            10,
            10,
          ]}
        />

        <meshBasicMaterial
          color="#f8fafc"
        />
      </mesh>
    </group>
  );
}

export function EngineMechanism({
  isPlaying,
  playbackRate = 1,
  resetKey = 0,
  cycleProgress = null,
  showTrace = false,
  selectedComponent = null,
}: EngineMechanismProps) {
  const {
    scene,
    animations,
  } = useGLTF(
    CAR_MODEL_PATH,
  );

  const {
    actions,
    mixer,
  } = useAnimations(
    animations,
    scene,
  );

  const engineAction =
    actions[
      CAR_ANIMATION_NAMES
        .engineFourStroke
    ];

  useEffect(() => {
    if (!engineAction) {
      console.error(
        `[VELOTHERM] Engine animation not found: ${CAR_ANIMATION_NAMES.engineFourStroke}`,
      );

      return;
    }

    engineAction.setLoop(
      LoopRepeat,
      Infinity,
    );

    engineAction.setEffectiveWeight(
      1,
    );

    engineAction.stop();

    engineAction.reset();

    engineAction.setEffectiveTimeScale(
      0,
    );

    return () => {
      engineAction.stop();

      engineAction.setEffectiveTimeScale(
        0,
      );
    };
  }, [
    engineAction,
  ]);

  useEffect(() => {
    if (
      !engineAction ||
      !isPlaying
    ) {
      return;
    }

    engineAction.setEffectiveTimeScale(
      playbackRate,
    );
  }, [
    engineAction,
    isPlaying,
    playbackRate,
  ]);

  useEffect(() => {
    if (!engineAction) {
      return;
    }

    if (isPlaying) {
      engineAction.setEffectiveTimeScale(
        playbackRate,
      );

      engineAction
        .fadeIn(0.15)
        .play();

      return;
    }

    engineAction.setEffectiveTimeScale(
      0,
    );
  }, [
    engineAction,
    isPlaying,
    playbackRate,
  ]);

  useEffect(() => {
    if (
      !engineAction ||
      !mixer ||
      isPlaying ||
      cycleProgress === null ||
      cycleProgress ===
        undefined
    ) {
      return;
    }

    const duration =
      engineAction
        .getClip()
        .duration;

    const safeProgress =
      Math.min(
        Math.max(
          cycleProgress,
          0,
        ),
        0.999999,
      );

    engineAction
      .reset()
      .play();

    mixer.setTime(
      duration *
        safeProgress,
    );

    engineAction.setEffectiveTimeScale(
      0,
    );
  }, [
    cycleProgress,
    engineAction,
    isPlaying,
    mixer,
  ]);

  useEffect(() => {
    if (!engineAction) {
      return;
    }

    engineAction.stop();

    engineAction.reset();

    if (isPlaying) {
      engineAction.setEffectiveTimeScale(
        playbackRate,
      );

      engineAction.play();

      return;
    }

    engineAction.setEffectiveTimeScale(
      0,
    );
  }, [
    engineAction,
    isPlaying,
    playbackRate,
    resetKey,
  ]);

  useFrame(() => {});

  return (
    <EngineTrace
      scene={scene}
      selectedComponent={
        selectedComponent
      }
      visible={
        showTrace &&
        !isPlaying
      }
    />
  );
}

useGLTF.preload(
  CAR_MODEL_PATH,
);