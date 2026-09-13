const MIN_ENGINE_PLAYBACK_RATE = 0.5;
const MAX_ENGINE_PLAYBACK_RATE = 2;

const MIN_WHEEL_ANGULAR_VELOCITY =
  2.5;

const MAX_WHEEL_ANGULAR_VELOCITY =
  12;

export function enginePlaybackRateToWheelAngularVelocity(
  playbackRate: number,
): number {
  const normalized =
    Math.min(
      Math.max(
        (playbackRate -
          MIN_ENGINE_PLAYBACK_RATE) /
          (MAX_ENGINE_PLAYBACK_RATE -
            MIN_ENGINE_PLAYBACK_RATE),
        0,
      ),
      1,
    );

  return (
    MIN_WHEEL_ANGULAR_VELOCITY +
    normalized *
      (MAX_WHEEL_ANGULAR_VELOCITY -
        MIN_WHEEL_ANGULAR_VELOCITY)
  );
}