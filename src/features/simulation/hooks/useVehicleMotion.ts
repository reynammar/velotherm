"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

const REFERENCE_MASS_KG = 1200;

const REFERENCE_ACCELERATION_MS2 = 8;

const UI_UPDATE_INTERVAL_MS = 33;

export function calculateVisualAcceleration(
  massKg: number,
): number {
  if (massKg <= 0) {
    return 0;
  }

  return (
    REFERENCE_ACCELERATION_MS2 *
    (REFERENCE_MASS_KG / massKg)
  );
}

type UseVehicleMotionProps = {
  targetSpeedMs: number;
  massKg: number;
  isPlaying: boolean;
};

export function useVehicleMotion({
  targetSpeedMs,
  massKg,
  isPlaying,
}: UseVehicleMotionProps) {
  const [currentSpeedMs, setCurrentSpeedMs] =
    useState(0);

  const currentSpeedRef =
    useRef(0);

  const lastTimestampRef =
    useRef<number | null>(null);

  const lastUiUpdateRef =
    useRef(0);

  const resetMotion = useCallback(() => {
    currentSpeedRef.current = 0;
    lastTimestampRef.current = null;
    lastUiUpdateRef.current = 0;

    setCurrentSpeedMs(0);
  }, []);

  useEffect(() => {
    if (!isPlaying) {
      lastTimestampRef.current = null;

      return;
    }

    let animationFrameId = 0;

    const updateMotion = (
      timestamp: number,
    ) => {
      if (
        lastTimestampRef.current ===
        null
      ) {
        lastTimestampRef.current =
          timestamp;
      }

      const deltaTime = Math.min(
        (timestamp -
          lastTimestampRef.current) /
          1000,
        0.05,
      );

      lastTimestampRef.current =
        timestamp;

      const currentSpeed =
        currentSpeedRef.current;

      const targetSpeed = Math.max(
        targetSpeedMs,
        0,
      );

      const acceleration =
        calculateVisualAcceleration(
          massKg,
        );

      let nextSpeed =
        currentSpeed;

      if (currentSpeed < targetSpeed) {
        nextSpeed = Math.min(
          currentSpeed +
            acceleration *
              deltaTime,
          targetSpeed,
        );
      }

      if (currentSpeed > targetSpeed) {
        nextSpeed = Math.max(
          currentSpeed -
            acceleration *
              deltaTime,
          targetSpeed,
        );
      }

      currentSpeedRef.current =
        nextSpeed;

      const shouldUpdateUI =
        timestamp -
          lastUiUpdateRef.current >=
        UI_UPDATE_INTERVAL_MS;

      const reachedTarget =
        Math.abs(
          nextSpeed -
            targetSpeed,
        ) < 0.001;

      if (
        shouldUpdateUI ||
        reachedTarget
      ) {
        lastUiUpdateRef.current =
          timestamp;

        setCurrentSpeedMs(
          nextSpeed,
        );
      }

      animationFrameId =
        requestAnimationFrame(
          updateMotion,
        );
    };

    animationFrameId =
      requestAnimationFrame(
        updateMotion,
      );

    return () => {
      cancelAnimationFrame(
        animationFrameId,
      );

      lastTimestampRef.current =
        null;
    };
  }, [
    isPlaying,
    massKg,
    targetSpeedMs,
  ]);

  return {
    currentSpeedMs,

    accelerationMs2:
      calculateVisualAcceleration(
        massKg,
      ),

    resetMotion,
  };
}