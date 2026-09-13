"use client";

import { useEffect } from "react";
import {
  useAnimations,
  useGLTF,
} from "@react-three/drei";
import { LoopRepeat } from "three";

import {
  CAR_ANIMATION_NAMES,
} from "@/src/lib/three/animationRegistry";

const MODEL_PATH =
  "/models/velotherm-master.glb";

type EngineMechanismProps = {
  isPlaying: boolean;
  playbackRate?: number;
  resetKey?: number;
};

export function EngineMechanism({
  isPlaying,
  playbackRate = 1,
  resetKey = 0,
}: EngineMechanismProps) {
  const {
    scene,
    animations,
  } = useGLTF(MODEL_PATH);

  const { actions } =
    useAnimations(
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

    return () => {
      engineAction.stop();
    };
  }, [engineAction]);

  useEffect(() => {
    if (!engineAction) {
      return;
    }

    engineAction.setEffectiveTimeScale(
      playbackRate,
    );
  }, [
    engineAction,
    playbackRate,
  ]);

  useEffect(() => {
    if (!engineAction) {
      return;
    }

    if (isPlaying) {
      engineAction
        .reset()
        .fadeIn(0.15)
        .play();

      return;
    }

    engineAction.stop();
  }, [
    engineAction,
    isPlaying,
  ]);

  useEffect(() => {
    if (!engineAction) {
      return;
    }

    engineAction.stop();
    engineAction.reset();

    if (isPlaying) {
      engineAction.play();
    }
  }, [
    engineAction,
    resetKey,
  ]);

  return null;
}

useGLTF.preload(MODEL_PATH);