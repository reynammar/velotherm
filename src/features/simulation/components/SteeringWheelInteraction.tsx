"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  Billboard,
} from "@react-three/drei";

import {
  useFrame,
  useThree,
} from "@react-three/fiber";

import type {
  ThreeEvent,
} from "@react-three/fiber";

import {
  Box3,
  MathUtils,
  Quaternion,
  Vector3,
  type Group,
  type Object3D,
} from "three";

const STEERING_WHEEL_NODES = [
  "car_steeringwheel",
  "AR_SteeringWheel_Hub",
  "AR_SteeringWheel_Spoke_1",
  "AR_SteeringWheel_Spoke_2",
  "AR_SteeringWheel_Spoke_3",
] as const;

const MAX_STEERING_ROTATION = MathUtils.degToRad(540);
const STEERING_DIRECTION = 1;
const STEERING_AXIS = new Vector3(1, 0, 0);

type SteeringWheelInteractionProps = {
  scene: Object3D;
};

type OriginalLocalTransform = {
  node: Object3D;
  position: Vector3;
  quaternion: Quaternion;
  scale: Vector3;
};

function getRequiredNodes(scene: Object3D): Object3D[] {
  return STEERING_WHEEL_NODES
    .map((name) => scene.getObjectByName(name))
    .filter((node): node is Object3D => Boolean(node));
}

function getCombinedBounds(nodes: Object3D[]): Box3 {
  const bounds = new Box3();

  for (const node of nodes) {
    bounds.expandByObject(node);
  }

  return bounds;
}

function getInteractionRadius(nodes: Object3D[]): number {
  if (nodes.length === 0) {
    return 0.18;
  }

  const bounds = getCombinedBounds(nodes);

  if (bounds.isEmpty()) {
    return 0.18;
  }

  const size = bounds.getSize(new Vector3());

  return Math.min(
    Math.max(size.length() * 0.28, 0.18),
    0.48,
  );
}

function normalizeAngle(angle: number): number {
  if (angle > Math.PI) {
    return angle - Math.PI * 2;
  }

  if (angle < -Math.PI) {
    return angle + Math.PI * 2;
  }

  return angle;
}

export function SteeringWheelInteraction({
  scene,
}: SteeringWheelInteractionProps) {
  const { camera, gl } = useThree();

  const [hovered, setHovered] = useState(false);

  const nodes = useMemo(
    () => getRequiredNodes(scene),
    [scene],
  );

  const wheelNode = useMemo(
    () => scene.getObjectByName("car_steeringwheel"),
    [scene],
  );

  const interactionRadius = useMemo(
    () => getInteractionRadius(nodes),
    [nodes],
  );

  const markerGroupRef = useRef<Group | null>(null);
  const nodeParentRef = useRef<Object3D | null>(null);
  const originalTransformsRef = useRef<OriginalLocalTransform[]>([]);

  const centerLocalRef = useRef(new Vector3());
  const centerWorldRef = useRef(new Vector3());
  const markerWorldRef = useRef(new Vector3());
  const projectedCenterRef = useRef({ x: 0, y: 0 });
  const steeringAxisLocalRef = useRef(new Vector3(1, 0, 0));

  const targetRotationRef = useRef(0);
  const currentRotationRef = useRef(0);
  const draggingRef = useRef(false);
  const lastPointerAngleRef = useRef<number | null>(null);
  const readyRef = useRef(false);

  useEffect(() => {
    readyRef.current = false;

    if (nodes.length !== STEERING_WHEEL_NODES.length) {
      console.warn(
        "[VELOTHERM] Steering wheel interaction nodes are incomplete.",
      );
      return;
    }

    if (!wheelNode) {
      console.warn(
        "[VELOTHERM] Steering wheel node not found.",
      );
      return;
    }

    const parent = wheelNode.parent;

    if (!parent || nodes.some((node) => node.parent !== parent)) {
      console.warn(
        "[VELOTHERM] Steering wheel components must share the same GLB parent.",
      );
      return;
    }

    scene.updateWorldMatrix(true, true);

    const bounds = getCombinedBounds(nodes);

    if (bounds.isEmpty()) {
      console.warn(
        "[VELOTHERM] Steering wheel bounds could not be calculated.",
      );
      return;
    }

    const centerWorld = bounds.getCenter(new Vector3());
    const centerLocal = parent.worldToLocal(centerWorld.clone());

    const axisLocal = STEERING_AXIS
      .clone()
      .applyQuaternion(wheelNode.quaternion)
      .normalize();

    originalTransformsRef.current = nodes.map((node) => ({
      node,
      position: node.position.clone(),
      quaternion: node.quaternion.clone(),
      scale: node.scale.clone(),
    }));

    nodeParentRef.current = parent;
    centerLocalRef.current.copy(centerLocal);
    centerWorldRef.current.copy(centerWorld);
    steeringAxisLocalRef.current.copy(axisLocal);

    targetRotationRef.current = 0;
    currentRotationRef.current = 0;
    lastPointerAngleRef.current = null;
    readyRef.current = true;

    return () => {
      for (const transform of originalTransformsRef.current) {
        transform.node.position.copy(transform.position);
        transform.node.quaternion.copy(transform.quaternion);
        transform.node.scale.copy(transform.scale);
      }

      originalTransformsRef.current = [];
      nodeParentRef.current = null;
      readyRef.current = false;
      draggingRef.current = false;
      lastPointerAngleRef.current = null;
      document.body.style.cursor = "";
    };
  }, [nodes, scene, wheelNode]);

  useFrame((_, delta) => {
    if (!readyRef.current) {
      return;
    }

    const parent = nodeParentRef.current;
    const transforms = originalTransformsRef.current;

    if (!parent || transforms.length === 0) {
      return;
    }

    currentRotationRef.current = MathUtils.damp(
      currentRotationRef.current,
      targetRotationRef.current,
      12,
      delta,
    );

    const deltaQuaternion = new Quaternion().setFromAxisAngle(
      steeringAxisLocalRef.current,
      currentRotationRef.current,
    );

    const centerLocal = centerLocalRef.current;

    for (const transform of transforms) {
      transform.node.position
        .copy(transform.position)
        .sub(centerLocal)
        .applyQuaternion(deltaQuaternion)
        .add(centerLocal);

      transform.node.quaternion
        .copy(deltaQuaternion)
        .multiply(transform.quaternion);

      transform.node.scale.copy(transform.scale);
    }

    scene.updateWorldMatrix(true, true);
    parent.updateWorldMatrix(true, false);

    centerWorldRef.current
      .copy(centerLocal)
      .applyMatrix4(parent.matrixWorld);

    const projectedCenter = centerWorldRef.current
      .clone()
      .project(camera);

    const rect = gl.domElement.getBoundingClientRect();

    projectedCenterRef.current.x =
      rect.left + ((projectedCenter.x + 1) / 2) * rect.width;

    projectedCenterRef.current.y =
      rect.top + ((-projectedCenter.y + 1) / 2) * rect.height;

    const markerGroup = markerGroupRef.current;
    const markerParent = markerGroup?.parent;

    if (markerGroup && markerParent) {
      markerParent.updateWorldMatrix(true, false);

      markerWorldRef.current
        .copy(centerLocal)
        .add(new Vector3(0, interactionRadius * 1.15, 0))
        .applyMatrix4(parent.matrixWorld);

      markerParent.worldToLocal(markerWorldRef.current);
      markerGroup.position.copy(markerWorldRef.current);
    }
  });

  const getPointerAngle = useCallback((clientX: number, clientY: number) => {
    return Math.atan2(
      clientY - projectedCenterRef.current.y,
      clientX - projectedCenterRef.current.x,
    );
  }, []);

  const handleWindowPointerMove = useCallback(
    (event: PointerEvent) => {
      if (!draggingRef.current) {
        return;
      }

      const previousAngle = lastPointerAngleRef.current;

      if (previousAngle === null) {
        lastPointerAngleRef.current = getPointerAngle(
          event.clientX,
          event.clientY,
        );
        return;
      }

      const currentAngle = getPointerAngle(
        event.clientX,
        event.clientY,
      );

      const deltaAngle = normalizeAngle(
        currentAngle - previousAngle,
      );

      lastPointerAngleRef.current = currentAngle;

      targetRotationRef.current = MathUtils.clamp(
        targetRotationRef.current +
          deltaAngle * STEERING_DIRECTION,
        -MAX_STEERING_ROTATION,
        MAX_STEERING_ROTATION,
      );
    },
    [getPointerAngle],
  );

  const handleWindowPointerUp = useCallback(() => {
    draggingRef.current = false;
    lastPointerAngleRef.current = null;
    document.body.style.cursor = hovered ? "grab" : "";
  }, [hovered]);

  useEffect(() => {
    window.addEventListener("pointermove", handleWindowPointerMove);
    window.addEventListener("pointerup", handleWindowPointerUp);
    window.addEventListener("pointercancel", handleWindowPointerUp);

    return () => {
      window.removeEventListener("pointermove", handleWindowPointerMove);
      window.removeEventListener("pointerup", handleWindowPointerUp);
      window.removeEventListener("pointercancel", handleWindowPointerUp);
      document.body.style.cursor = "";
    };
  }, [handleWindowPointerMove, handleWindowPointerUp]);

  const handlePointerDown = (event: ThreeEvent<PointerEvent>) => {
    event.stopPropagation();

    if (!readyRef.current) {
      return;
    }

    lastPointerAngleRef.current = getPointerAngle(
      event.nativeEvent.clientX,
      event.nativeEvent.clientY,
    );

    draggingRef.current = true;
    document.body.style.cursor = "grabbing";
  };

  const handlePointerOver = (event: ThreeEvent<PointerEvent>) => {
    event.stopPropagation();
    setHovered(true);

    if (!draggingRef.current) {
      document.body.style.cursor = "grab";
    }
  };

  const handlePointerOut = (event: ThreeEvent<PointerEvent>) => {
    event.stopPropagation();
    setHovered(false);

    if (!draggingRef.current) {
      document.body.style.cursor = "";
    }
  };

  return (
    <group ref={markerGroupRef} renderOrder={1200}>
      <Billboard
        follow
        lockX={false}
        lockY={false}
        lockZ={false}
      >
        <group>
          <mesh
            onPointerDown={handlePointerDown}
            onPointerOver={handlePointerOver}
            onPointerOut={handlePointerOut}
            renderOrder={1200}
          >
            <circleGeometry args={[interactionRadius * 0.55, 32]} />
            <meshBasicMaterial
              transparent
              opacity={0}
              depthTest={false}
              depthWrite={false}
            />
          </mesh>

          <mesh renderOrder={1201}>
            <ringGeometry
              args={[
                interactionRadius * 0.08,
                interactionRadius * 0.095,
                24,
              ]}
            />
            <meshBasicMaterial
              color={hovered ? "#22d3ee" : "#94a3b8"}
              transparent
              opacity={hovered ? 0.85 : 0.35}
              depthTest={false}
              depthWrite={false}
            />
          </mesh>
        </group>
      </Billboard>
    </group>
  );
}