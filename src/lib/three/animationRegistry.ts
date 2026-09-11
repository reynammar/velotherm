export const CAR_ANIMATION_NAMES = {
  engineFourStroke: "Engine_4Stroke_720",
  wheelRollValidation: "Wheel_Roll_Validation",
  frontSteeringValidation: "Front_Steering_Validation",
} as const;

export type CarAnimationName =
  (typeof CAR_ANIMATION_NAMES)[keyof typeof CAR_ANIMATION_NAMES];