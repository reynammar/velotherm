export type DriveLabResult = {
  inputPowerKw: number;
  usefulPowerKw: number;
  lossPowerKw: number;
  efficiency: number;
};

export type RegenLabResult = {
  kineticEnergyKJ: number;
  recoveredEnergyKJ: number;
  lossEnergyKJ: number;
  recoveryEfficiency: number;
};

function clamp(
  value: number,
  min: number,
  max: number,
) {
  return Math.min(
    Math.max(
      value,
      min,
    ),
    max,
  );
}

/**
 * Forward energy conversion.
 *
 * P_useful = P_input × η
 *
 * The result is intentionally kept as a
 * power-flow calculation so Scene 10 can
 * visualize energy movement through the
 * vehicle architecture without inventing
 * fuel-density assumptions.
 */
export function calculateDriveLab(
  inputPowerKw: number,
  efficiency: number,
): DriveLabResult {
  const safeInput =
    Math.max(
      inputPowerKw,
      0,
    );

  const safeEfficiency =
    clamp(
      efficiency,
      0,
      1,
    );

  const usefulPowerKw =
    safeInput *
    safeEfficiency;

  const lossPowerKw =
    Math.max(
      safeInput -
        usefulPowerKw,
      0,
    );

  return {
    inputPowerKw:
      safeInput,

    usefulPowerKw,

    lossPowerKw,

    efficiency:
      safeEfficiency,
  };
}

/**
 * Kinetic energy:
 *
 * E = 1/2 m v²
 *
 * Speed is supplied in km/h and internally
 * converted to m/s.
 */
export function calculateKineticEnergyKJ(
  massKg: number,
  speedKmh: number,
) {
  const safeMass =
    Math.max(
      massKg,
      1,
    );

  const safeSpeed =
    Math.max(
      speedKmh,
      0,
    );

  const speedMps =
    safeSpeed / 3.6;

  return (
    (0.5 *
      safeMass *
      speedMps *
      speedMps) /
    1000
  );
}

/**
 * Regenerative braking.
 *
 * Recovered energy:
 *
 * E_recovered =
 * kinetic energy × recovery efficiency
 */
export function calculateRegenLab(
  massKg: number,
  speedKmh: number,
  recoveryEfficiency: number,
): RegenLabResult {
  const kineticEnergyKJ =
    calculateKineticEnergyKJ(
      massKg,
      speedKmh,
    );

  const safeEfficiency =
    clamp(
      recoveryEfficiency,
      0,
      1,
    );

  const recoveredEnergyKJ =
    kineticEnergyKJ *
    safeEfficiency;

  const lossEnergyKJ =
    Math.max(
      kineticEnergyKJ -
        recoveredEnergyKJ,
      0,
    );

  return {
    kineticEnergyKJ,

    recoveredEnergyKJ,

    lossEnergyKJ,

    recoveryEfficiency:
      safeEfficiency,
  };
}

/**
 * Smooth braking profile.
 */
export function calculateBrakingSpeedKmh(
  initialSpeedKmh: number,
  progress: number,
) {
  const safeProgress =
    clamp(
      progress,
      0,
      1,
    );

  const decay =
    Math.pow(
      1 -
        safeProgress,
      0.82,
    );

  return (
    Math.max(
      initialSpeedKmh,
      0,
    ) *
    decay
  );
}

/**
 * Visual mapping from drive power to
 * vehicle speed.
 *
 * This is a laboratory visualization
 * mapping, not a complete vehicle dynamics
 * simulation.
 */
export function calculateDriveVisualSpeed(
  usefulPowerKw: number,
  massKg: number,
) {
  const safePower =
    Math.max(
      usefulPowerKw,
      0,
    );

  const safeMass =
    Math.max(
      massKg,
      1,
    );

  const normalizedPower =
    safePower /
    safeMass;

  return clamp(
    normalizedPower *
      220,
    0,
    120,
  );
}

export function calculateWheelAngularVelocityFromKmh(
  speedKmh: number,
) {
  /**
   * Visualization scale only.
   * The existing WheelSystem expects
   * angular velocity in rad/s.
   */
  return (
    Math.max(
      speedKmh,
      0,
    ) *
    0.12
  );
}

export function calculateRoadSpeedMps(
  speedKmh: number,
) {
  return Math.max(
    speedKmh,
    0,
  ) / 3.6;
}