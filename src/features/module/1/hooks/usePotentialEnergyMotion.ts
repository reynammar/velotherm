"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

const DEFAULT_GRAVITY = 9.81;

/**
 * The slope angle is used only for the motion model.
 *
 * The car acceleration along an ideal frictionless slope is:
 *
 * a = g sin(theta)
 *
 * Mass does not appear in this equation.
 */
const DEFAULT_SLOPE_ANGLE_DEG = 25;

const UI_UPDATE_INTERVAL_MS = 33;

type UsePotentialEnergyMotionProps = {
  initialHeightM: number;
  gravityMs2?: number;
  slopeAngleDeg?: number;
};

type MotionSnapshot = {
  heightM: number;
  speedMs: number;
  progress: number;
};

function calculateSnapshot(
  elapsedSeconds: number,
  initialHeightM: number,
  gravityMs2: number,
  slopeAngleDeg: number,
): MotionSnapshot {
  const slopeAngleRad =
    (slopeAngleDeg * Math.PI) /
    180;

  const slopeAcceleration =
    gravityMs2 *
    Math.sin(slopeAngleRad);

  const verticalDrop =
    0.5 *
    gravityMs2 *
    Math.sin(slopeAngleRad) **
      2 *
    elapsedSeconds ** 2;

  const clampedDrop = Math.min(
    Math.max(verticalDrop, 0),
    initialHeightM,
  );

  const currentHeightM =
    Math.max(
      initialHeightM -
        clampedDrop,
      0,
    );

  const speedMs = Math.sqrt(
    2 *
      gravityMs2 *
      clampedDrop,
  );

  const progress =
    initialHeightM > 0
      ? clampedDrop /
        initialHeightM
      : 1;

  return {
    heightM: currentHeightM,
    speedMs: Number.isFinite(
      speedMs,
    )
      ? speedMs
      : 0,
    progress: Math.min(
      Math.max(progress, 0),
      1,
    ),
  };
}

export function usePotentialEnergyMotion({
  initialHeightM,
  gravityMs2 = DEFAULT_GRAVITY,
  slopeAngleDeg = DEFAULT_SLOPE_ANGLE_DEG,
}: UsePotentialEnergyMotionProps) {
  const [currentHeightM, setCurrentHeightM] =
    useState(initialHeightM);

  const [currentSpeedMs, setCurrentSpeedMs] =
    useState(0);

  const [progress, setProgress] =
    useState(0);

  const [isRunning, setIsRunning] =
    useState(false);

  const [isFinished, setIsFinished] =
    useState(false);

  const initialHeightRef =
    useRef(initialHeightM);

  const elapsedTimeRef =
    useRef(0);

  const lastTimestampRef =
    useRef<number | null>(null);

  const lastUiUpdateRef =
    useRef(0);

  const resetMotion = useCallback(
    (nextHeightM = initialHeightM) => {
      initialHeightRef.current =
        Math.max(nextHeightM, 0);

      elapsedTimeRef.current = 0;

      lastTimestampRef.current =
        null;

      lastUiUpdateRef.current = 0;

      setCurrentHeightM(
        Math.max(nextHeightM, 0),
      );

      setCurrentSpeedMs(0);

      setProgress(0);

      setIsRunning(false);

      setIsFinished(false);
    },
    [initialHeightM],
  );

  const play = useCallback(() => {
    if (initialHeightRef.current <= 0) {
      return;
    }

    if (isFinished) {
      return;
    }

    setIsRunning(true);
  }, [isFinished]);

  const pause = useCallback(() => {
    setIsRunning(false);
    lastTimestampRef.current =
      null;
  }, []);

  useEffect(() => {
    if (!isRunning) {
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

      elapsedTimeRef.current +=
        deltaTime;

      const snapshot =
        calculateSnapshot(
          elapsedTimeRef.current,
          initialHeightRef.current,
          gravityMs2,
          slopeAngleDeg,
        );

      const shouldUpdateUI =
        timestamp -
          lastUiUpdateRef.current >=
        UI_UPDATE_INTERVAL_MS;

      const reachedBottom =
        snapshot.progress >= 1 ||
        snapshot.heightM <= 0;

      if (
        shouldUpdateUI ||
        reachedBottom
      ) {
        lastUiUpdateRef.current =
          timestamp;

        setCurrentHeightM(
          snapshot.heightM,
        );

        setCurrentSpeedMs(
          snapshot.speedMs,
        );

        setProgress(
          snapshot.progress,
        );
      }

      if (reachedBottom) {
        setCurrentHeightM(0);

        setProgress(1);

        setIsRunning(false);

        setIsFinished(true);

        lastTimestampRef.current =
          null;

        return;
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
    gravityMs2,
    isRunning,
    slopeAngleDeg,
  ]);

  const slopeAngleRad =
    (slopeAngleDeg * Math.PI) /
    180;

  const slopeAccelerationMs2 =
    gravityMs2 *
    Math.sin(slopeAngleRad);

  return {
    currentHeightM,
    currentSpeedMs,
    progress,
    isRunning,
    isFinished,
    slopeAccelerationMs2,
    play,
    pause,
    resetMotion,
  };
}