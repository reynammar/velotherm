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

import type {
  CarFocusComponent,
} from "@/src/features/simulation/components/CarModel";

const MODEL_PATH =
  "/models/velotherm-master.glb";

type EngineMechanismProps = {
  isPlaying: boolean;

  playbackRate?: number;

  resetKey?: number;

  /**
   * Normalized animation position:
   * 0 → 1
   *
   * Used only when the engine is paused
   * so the user can manually scrub the
   * authored engine animation.
   */
  cycleProgress?:
    | number
    | null;

  /**
   * Kept for compatibility with the current
   * Scene 09 implementation.
   *
   * The current animation controller no longer
   * needs to use this value directly.
   */
  startProgress?: number;

  /**
   * Draws relationship lines between:
   *
   * piston → rod → crankshaft
   */
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

  /**
   * Crankshaft selected:
   *
   * show all piston → rod → crankshaft
   * relationships.
   */
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
  } = useGLTF(MODEL_PATH);

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

  /**
   * INITIALIZE ENGINE ACTION
   */
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

    /**
     * Start from the beginning,
     * but remain paused until
     * the user runs the engine.
     */
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

  /**
   * PLAYBACK RATE
   *
   * Only update the action speed while
   * the engine is actually running.
   *
   * When paused, timeScale remains 0.
   */
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

  /**
   * PLAY / PAUSE
   *
   * IMPORTANT:
   *
   * We intentionally do NOT use:
   *
   * engineAction.paused = ...
   *
   * because AnimationAction is returned
   * from a React hook and direct mutation
   * violates React's immutability rule.
   *
   * Instead:
   *
   * play  → timeScale > 0
   * pause → timeScale = 0
   *
   * This keeps the current animation position.
   */
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

    /**
     * Pause in-place.
     *
     * Do NOT stop().
     * stop() would reset the animation.
     */
    engineAction.setEffectiveTimeScale(
      0,
    );
  }, [
    engineAction,
    isPlaying,
    playbackRate,
  ]);

  /**
   * MANUAL SCRUB
   *
   * Runs only while paused.
   *
   * Instead of:
   *
   * engineAction.time = ...
   *
   * we use AnimationMixer.setTime().
   */
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

    /**
     * Make sure the action is active
     * before moving the mixer timeline.
     */
    engineAction
      .reset()
      .play();

    mixer.setTime(
      duration *
        safeProgress,
    );

    /**
     * Freeze exactly at the scrubbed
     * position.
     */
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
  MODEL_PATH,
);