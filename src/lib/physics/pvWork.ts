export type PVPoint = {
  pressureKPa: number;
  volumeM3: number;
};

export function calculatePVWork(
  p1KPa: number,
  p2KPa: number,
  v1M3: number,
  v2M3: number,
): number {
  if (
    p1KPa < 0 ||
    p2KPa < 0
  ) {
    throw new RangeError(
      "Pressure cannot be negative.",
    );
  }

  if (
    v1M3 < 0 ||
    v2M3 < 0
  ) {
    throw new RangeError(
      "Volume cannot be negative.",
    );
  }

  /**
   * For a linear P-V process:
   *
   * W = ∫ P dV
   *   = average pressure × ΔV
   *
   * kPa × m³ = kJ
   */
  const averagePressureKPa =
    (p1KPa + p2KPa) / 2;

  const deltaVolumeM3 =
    v2M3 - v1M3;

  return (
    averagePressureKPa *
    deltaVolumeM3
  );
}

export function calculatePVPath(
  p1KPa: number,
  p2KPa: number,
  v1M3: number,
  v2M3: number,
  segments = 32,
): PVPoint[] {
  const points: PVPoint[] = [];

  const safeSegments = Math.max(
    Math.floor(segments),
    2,
  );

  for (
    let index = 0;
    index <= safeSegments;
    index += 1
  ) {
    const t =
      index / safeSegments;

    points.push({
      pressureKPa:
        p1KPa +
        (p2KPa - p1KPa) * t,

      volumeM3:
        v1M3 +
        (v2M3 - v1M3) * t,
    });
  }

  return points;
}

export function joulesToKilojoules(
  energyJ: number,
): number {
  return energyJ / 1000;
}