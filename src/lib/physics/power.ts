export function calculateRotationalWork(
  torqueNm: number,
  angleRad: number,
): number {
  return torqueNm * angleRad;
}

export function calculateRotationalPower(
  torqueNm: number,
  angularVelocityRadS: number,
): number {
  return (
    torqueNm *
    angularVelocityRadS
  );
}

export function radiansToRevolutions(
  angleRad: number,
): number {
  return (
    angleRad /
    (2 * Math.PI)
  );
}

export function radiansPerSecondToRpm(
  angularVelocityRadS: number,
): number {
  return (
    angularVelocityRadS *
    (60 / (2 * Math.PI))
  );
}

export function wattsToKilowatts(
  powerW: number,
): number {
  return powerW / 1000;
}

export function clamp(
  value: number,
  min: number,
  max: number,
): number {
  return Math.min(
    Math.max(value, min),
    max,
  );
}