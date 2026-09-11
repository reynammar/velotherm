const KMH_TO_MS = 1 / 3.6;

/**
 * Approximate tire radius from the current master GLB.
 *
 * This value belongs to the current asset and must be
 * revalidated if the wheel geometry is replaced.
 */
export const WHEEL_RADIUS_METERS = 0.583;

export function kmhToMs(speedKmh: number) {
  return speedKmh * KMH_TO_MS;
}

export function msToKmh(speedMs: number) {
  return speedMs * 3.6;
}

export function vehicleSpeedToWheelAngularVelocity(
  speedKmh: number,
) {
  const speedMs = kmhToMs(speedKmh);

  return speedMs / WHEEL_RADIUS_METERS;
}