export type EnergyConversionResult = {
  inputPowerKw: number;
  efficiency: number;
  outputPowerKw: number;
  lossPowerKw: number;
};

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
 * Educational conversion model.
 *
 * P_out = P_in × η
 * P_loss = P_in - P_out
 *
 * Efficiency is represented as a
 * decimal between 0 and 1.
 */
export function calculateEnergyConversion(
  inputPowerKw: number,
  efficiency: number,
): EnergyConversionResult {
  const safeInputPower =
    Math.max(
      0,
      inputPowerKw,
    );

  const safeEfficiency =
    clamp(
      efficiency,
      0,
      1,
    );

  const outputPowerKw =
    safeInputPower *
    safeEfficiency;

  const lossPowerKw =
    safeInputPower -
    outputPowerKw;

  return {
    inputPowerKw:
      safeInputPower,
    efficiency:
      safeEfficiency,
    outputPowerKw,
    lossPowerKw,
  };
}