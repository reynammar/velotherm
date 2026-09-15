export type BodyInteractionKey =
  | "doorFL"
  | "doorFR"
  | "doorRL"
  | "doorRR"
  | "hood"
  | "trunk";

export type BodyInteractionMarkerMode =
  | "node"
  | "bounds";

export type BodyInteractionConfig = {
  key: BodyInteractionKey;

  interactionNodes: string[];

  markerNodes: string[];

  markerMode: BodyInteractionMarkerMode;

  markerVerticalOffset?: number;

  rotationAxis: "x" | "y";

  openRotation: number;

  hinge:
    | "front"
    | "rear"
    | "hood"
    | "trunk";
};

export const BODY_INTERACTION_CONFIGS: BodyInteractionConfig[] =
  [
    {
      key: "doorFL",

      interactionNodes: [
        "car_door_FL",
      ],

      markerNodes: [
        "car_door_FL",
      ],

      markerMode: "bounds",

      markerVerticalOffset: 0,

      rotationAxis: "y",

      openRotation: -55,

      hinge: "front",
    },

    {
      key: "doorFR",

      interactionNodes: [
        "car_door_FR",
      ],

      markerNodes: [
        "car_door_FR",
      ],

      markerMode: "bounds",

      markerVerticalOffset: 0,

      rotationAxis: "y",

      openRotation: 55,

      hinge: "front",
    },

    {
      key: "doorRL",

      interactionNodes: [
        "car_door_RL",
      ],

      markerNodes: [
        "car_door_RL",
      ],

      markerMode: "bounds",

      markerVerticalOffset: 0,

      rotationAxis: "y",

      openRotation: -55,

      hinge: "front",
    },

    {
      key: "doorRR",

      interactionNodes: [
        "car_door_RR",
      ],

      markerNodes: [
        "car_door_RR",
      ],

      markerMode: "bounds",

      markerVerticalOffset: 0,

      rotationAxis: "y",

      openRotation: 55,

      hinge: "front",
    },

    {
      key: "hood",

      interactionNodes: [
        "car_hood",
        "car_hood_MIRRORED",
      ],

      markerNodes: [
        "car_hood",
        "car_hood_MIRRORED",
      ],

      markerMode: "bounds",

      markerVerticalOffset: 0,

      rotationAxis: "x",

      openRotation: -55,

      hinge: "hood",
    },

    {
      key: "trunk",

      interactionNodes: [
        "car_trunk",
        "car_trunk_MIRRORED",
        "car_trunkglass_MIRRORED",
      ],

      markerNodes: [
        "car_trunk",
      ],

      markerMode: "bounds",

      markerVerticalOffset: -0.18,

      rotationAxis: "x",

      openRotation: 55,

      hinge: "trunk",
    },
  ];