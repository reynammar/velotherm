export function calculateKineticEnergy(
  massKg: number,
  velocityMs: number,
): number {
  if (massKg < 0) {
    throw new RangeError(
      "Mass cannot be negative.",
    );
  }

  if (velocityMs < 0) {
    throw new RangeError(
      "Velocity cannot be negative.",
    );
  }

  return 0.5 * massKg * velocityMs ** 2;
}

export function joulesToKilojoules(
  energyJ: number,
): number {
  return energyJ / 1000;
}