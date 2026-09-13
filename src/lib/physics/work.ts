export function calculateWork(
  forceN: number,
  displacementM: number,
): number {
  if (forceN < 0) {
    throw new RangeError(
      "Force cannot be negative.",
    );
  }

  if (displacementM < 0) {
    throw new RangeError(
      "Displacement cannot be negative.",
    );
  }

  return forceN * displacementM;
}

export function joulesToKilojoules(
  energyJ: number,
): number {
  return energyJ / 1000;
}