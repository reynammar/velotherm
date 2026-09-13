export type VehicleMotionState = {
  speedKmh: number;
  speedMps: number;
  wheelAngularVelocity: number;
  roadSpeedMps: number;
  intensity: number;
};

const MIN_OUTPUT_POWER_KW = 0;
const MAX_OUTPUT_POWER_KW = 120;

const MAX_VISUAL_SPEED_KMH = 100;

const MIN_WHEEL_ANGULAR_VELOCITY = 0;
const MAX_WHEEL_ANGULAR_VELOCITY = 12;

function clamp(
  value: number,
  min: number,
  max: number,
) {
  return Math.min(
    Math.max(value, min),
    max,
  );
}

/**
 * Converts hybrid output power into a
 * visual vehicle motion state.
 *
 * IMPORTANT:
 * This is an educational visualization mapping,
 * not a full vehicle dynamics calculation.
 */
export function calculateVehicleMotion(
  outputPowerKw: number,
  running: boolean,
): VehicleMotionState {
  if (!running) {
    return {
      speedKmh: 0,
      speedMps: 0,
      wheelAngularVelocity: 0,
      roadSpeedMps: 0,
      intensity: 0,
    };
  }

  const safeOutputPower =
    Math.max(
      outputPowerKw,
      0,
    );

  const intensity =
    clamp(
      (safeOutputPower -
        MIN_OUTPUT_POWER_KW) /
        (MAX_OUTPUT_POWER_KW -
          MIN_OUTPUT_POWER_KW),
      0,
      1,
    );

  /**
   * Non-linear visual response.
   *
   * Small power changes remain visible at
   * lower speeds while high output still has
   * enough room to feel significantly faster.
   */
  const response =
    Math.pow(
      intensity,
      0.82,
    );

  const speedKmh =
    response *
    MAX_VISUAL_SPEED_KMH;

  const speedMps =
    speedKmh / 3.6;

  const wheelAngularVelocity =
    intensity *
    MAX_WHEEL_ANGULAR_VELOCITY;

  return {
    speedKmh,
    speedMps,
    wheelAngularVelocity,
    roadSpeedMps: speedMps,
    intensity,
  };
}