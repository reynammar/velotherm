export const STANDARD_GRAVITY = 9.81;

export function calculatePotentialEnergy(
  massKg: number,
  gravityMs2: number,
  heightM: number,
): number {
  if (massKg < 0) {
    throw new RangeError(
      "Mass cannot be negative.",
    );
  }

  if (gravityMs2 < 0) {
    throw new RangeError(
      "Gravity cannot be negative.",
    );
  }

  if (heightM < 0) {
    throw new RangeError(
      "Height cannot be negative.",
    );
  }

  return massKg * gravityMs2 * heightM;
}

export function joulesToKilojoules(
  energyJ: number,
): number {
  return energyJ / 1000;
}