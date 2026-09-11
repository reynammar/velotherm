"use client";

import { useEffect, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { MathUtils, type Object3D } from "three";

type WheelNodes = {
  frontLeftSteeringPivot: Object3D;
  frontLeftRollPivot: Object3D;

  frontRightSteeringPivot: Object3D;
  frontRightRollPivot: Object3D;

  rearLeftRollPivot: Object3D;
  rearRightRollPivot: Object3D;
};

type WheelSystemProps = {
  nodes: WheelNodes;

  /**
   * Wheel angular velocity in radians per second.
   */
  angularVelocity?: number;

  /**
   * Front wheel steering angle in degrees.
   */
  steeringAngle?: number;

  /**
   * Incrementing this value resets the wheel state.
   */
  resetKey?: number;
};

type InitialRotation = {
  frontLeftSteeringY: number;
  frontRightSteeringY: number;

  frontLeftRollX: number;
  frontRightRollX: number;
  rearLeftRollX: number;
  rearRightRollX: number;
};

function getInitialRotation(
  nodes: WheelNodes,
): InitialRotation {
  return {
    frontLeftSteeringY:
      nodes.frontLeftSteeringPivot.rotation.y,

    frontRightSteeringY:
      nodes.frontRightSteeringPivot.rotation.y,

    frontLeftRollX:
      nodes.frontLeftRollPivot.rotation.x,

    frontRightRollX:
      nodes.frontRightRollPivot.rotation.x,

    rearLeftRollX:
      nodes.rearLeftRollPivot.rotation.x,

    rearRightRollX:
      nodes.rearRightRollPivot.rotation.x,
  };
}

function resetWheelTransforms(
  nodes: WheelNodes,
  initialRotation: InitialRotation,
) {
  nodes.frontLeftSteeringPivot.rotation.y =
    initialRotation.frontLeftSteeringY;

  nodes.frontRightSteeringPivot.rotation.y =
    initialRotation.frontRightSteeringY;

  nodes.frontLeftRollPivot.rotation.x =
    initialRotation.frontLeftRollX;

  nodes.frontRightRollPivot.rotation.x =
    initialRotation.frontRightRollX;

  nodes.rearLeftRollPivot.rotation.x =
    initialRotation.rearLeftRollX;

  nodes.rearRightRollPivot.rotation.x =
    initialRotation.rearRightRollX;
}

export function WheelSystem({
  nodes,
  angularVelocity = 0,
  steeringAngle = 0,
  resetKey = 0,
}: WheelSystemProps) {
  const nodesRef = useRef<WheelNodes | null>(null);

  const initialRotationRef =
    useRef<InitialRotation | null>(null);

  const rollRotationRef = useRef(0);

  useEffect(() => {
    const initialRotation =
      getInitialRotation(nodes);

    nodesRef.current = nodes;

    initialRotationRef.current =
      initialRotation;

    rollRotationRef.current = 0;

    resetWheelTransforms(
      nodes,
      initialRotation,
    );
  }, [nodes, resetKey]);

  useFrame((_, delta) => {
    const currentNodes = nodesRef.current;
    const initialRotation =
      initialRotationRef.current;

    if (!currentNodes || !initialRotation) {
      return;
    }

    rollRotationRef.current +=
      angularVelocity * delta;

    const steeringRotation =
      MathUtils.degToRad(
        MathUtils.clamp(
          steeringAngle,
          -20,
          20,
        ),
      );

    currentNodes.frontLeftSteeringPivot.rotation.y =
      initialRotation.frontLeftSteeringY +
      steeringRotation;

    currentNodes.frontRightSteeringPivot.rotation.y =
      initialRotation.frontRightSteeringY +
      steeringRotation;

    currentNodes.frontLeftRollPivot.rotation.x =
      initialRotation.frontLeftRollX +
      rollRotationRef.current;

    currentNodes.frontRightRollPivot.rotation.x =
      initialRotation.frontRightRollX +
      rollRotationRef.current;

    currentNodes.rearLeftRollPivot.rotation.x =
      initialRotation.rearLeftRollX +
      rollRotationRef.current;

    currentNodes.rearRightRollPivot.rotation.x =
      initialRotation.rearRightRollX +
      rollRotationRef.current;
  });

  return null;
}