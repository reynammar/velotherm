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
  type Object3D,
} from "three";

const STEERING_WHEEL_NODES = [
  "car_steeringwheel",
  "AR_SteeringWheel_Hub",
  "AR_SteeringWheel_Spoke_1",
  "AR_SteeringWheel_Spoke_2",
  "AR_SteeringWheel_Spoke_3",
] as const;

const MAX_STEERING_ROTATION =
  MathUtils.degToRad(540);

const STEERING_DIRECTION = 1;

/**
 * Verified manually for the final GLB.
 *
 * X axis = steering axle.
 */
const STEERING_AXIS = new Vector3(
  1,
  0,
  0,
);

type SteeringWheelInteractionProps = {
  scene: Object3D;
};

type OriginalWorldTransform = {
  node: Object3D;
  position: Vector3;
  quaternion: Quaternion;
  scale: Vector3;
};

function getRequiredNodes(
  scene: Object3D,
): Object3D[] {
  return STEERING_WHEEL_NODES
    .map(
      (name) =>
        scene.getObjectByName(
          name,
        ),
    )
    .filter(
      (
        node,
      ): node is Object3D =>
        Boolean(node),
    );
}

function getCombinedBounds(
  nodes: Object3D[],
): Box3 {
  const bounds =
    new Box3();

  for (
    const node of nodes
  ) {
    bounds.expandByObject(
      node,
    );
  }

  return bounds;
}

function getWorldCenter(
  nodes: Object3D[],
): Vector3 | null {
  if (
    nodes.length === 0
  ) {
    return null;
  }

  const bounds =
    getCombinedBounds(
      nodes,
    );

  if (
    bounds.isEmpty()
  ) {
    return null;
  }

  return bounds.getCenter(
    new Vector3(),
  );
}

function getInteractionRadius(
  nodes: Object3D[],
): number {
  if (
    nodes.length === 0
  ) {
    return 0.18;
  }

  const bounds =
    getCombinedBounds(
      nodes,
    );

  if (
    bounds.isEmpty()
  ) {
    return 0.18;
  }

  const size =
    bounds.getSize(
      new Vector3(),
    );

  return Math.min(
    Math.max(
      size.length() * 0.28,
      0.18,
    ),
    0.48,
  );
}

function getWorldTransform(
  node: Object3D,
): OriginalWorldTransform {
  const position =
    new Vector3();

  const quaternion =
    new Quaternion();

  const scale =
    new Vector3();

  node.getWorldPosition(
    position,
  );

  node.getWorldQuaternion(
    quaternion,
  );

  node.getWorldScale(
    scale,
  );

  return {
    node,
    position,
    quaternion,
    scale,
  };
}

function applyWorldTransform(
  transform: OriginalWorldTransform,
  position: Vector3,
  quaternion: Quaternion,
) {
  const node =
    transform.node;

  const parent =
    node.parent;

  if (!parent) {
    return;
  }

  const parentWorldQuaternion =
    new Quaternion();

  const parentWorldPosition =
    new Vector3();

  const parentWorldScale =
    new Vector3();

  parent.getWorldQuaternion(
    parentWorldQuaternion,
  );

  parent.getWorldPosition(
    parentWorldPosition,
  );

  parent.getWorldScale(
    parentWorldScale,
  );

  const inverseParentQuaternion =
    parentWorldQuaternion
      .clone()
      .invert();

  const localPosition =
    position
      .clone()
      .sub(
        parentWorldPosition,
      );

  localPosition.applyQuaternion(
    inverseParentQuaternion,
  );

  localPosition.divide(
    parentWorldScale,
  );

  const localQuaternion =
    inverseParentQuaternion
      .clone()
      .multiply(
        quaternion,
      );

  node.position.copy(
    localPosition,
  );

  node.quaternion.copy(
    localQuaternion,
  );

  node.scale.copy(
    transform.scale,
  );
}

function normalizeAngle(
  angle: number,
): number {
  if (
    angle > Math.PI
  ) {
    return (
      angle -
      Math.PI * 2
    );
  }

  if (
    angle < -Math.PI
  ) {
    return (
      angle +
      Math.PI * 2
    );
  }

  return angle;
}

export function SteeringWheelInteraction({
  scene,
}: SteeringWheelInteractionProps) {
  const { camera, gl } =
    useThree();

  const [
    hovered,
    setHovered,
  ] = useState(false);

  const nodes = useMemo(
    () =>
      getRequiredNodes(
        scene,
      ),
    [scene],
  );

  const wheelNode =
    useMemo(
      () =>
        scene.getObjectByName(
          "car_steeringwheel",
        ),
      [scene],
    );

  const center = useMemo(
    () =>
      getWorldCenter(
        nodes,
      ),
    [nodes],
  );

  const interactionRadius =
    useMemo(
      () =>
        getInteractionRadius(
          nodes,
        ),
      [nodes],
    );

  /**
   * Marker is placed above the
   * steering wheel center.
   */
  const markerPosition =
    useMemo(
      () => {
        if (!center) {
          return null;
        }

        return center
          .clone()
          .add(
            new Vector3(
              0,
              interactionRadius *
                1.15,
              0,
            ),
          );
      },
      [
        center,
        interactionRadius,
      ],
    );

  const originalTransformsRef =
    useRef<
      OriginalWorldTransform[]
    >([]);

  const centerRef =
    useRef(
      new Vector3(),
    );

  const screenCenterRef =
    useRef({
      x: 0,
      y: 0,
    });

  const steeringAxisRef =
    useRef(
      new Vector3(),
    );

  const targetRotationRef =
    useRef(0);

  const currentRotationRef =
    useRef(0);

  const draggingRef =
    useRef(false);

  const lastPointerAngleRef =
    useRef<number | null>(
      null,
    );

  const readyRef =
    useRef(false);

  useEffect(() => {
    if (
      nodes.length !==
      STEERING_WHEEL_NODES.length
    ) {
      console.warn(
        "[VELOTHERM] Steering wheel interaction nodes are incomplete.",
      );

      readyRef.current =
        false;

      return;
    }

    if (!wheelNode) {
      console.warn(
        "[VELOTHERM] Steering wheel node not found.",
      );

      readyRef.current =
        false;

      return;
    }

    const parent =
      wheelNode.parent;

    if (!parent) {
      console.warn(
        "[VELOTHERM] Steering wheel parent not found.",
      );

      readyRef.current =
        false;

      return;
    }

    const differentParent =
      nodes.some(
        (node) =>
          node.parent !==
          parent,
      );

    if (
      differentParent
    ) {
      console.warn(
        "[VELOTHERM] Steering wheel nodes do not share the same parent.",
      );

      readyRef.current =
        false;

      return;
    }

    const nextTransforms =
      nodes.map(
        getWorldTransform,
      );

    const bounds =
      getCombinedBounds(
        nodes,
      );

    if (
      bounds.isEmpty()
    ) {
      readyRef.current =
        false;

      return;
    }

    const worldCenter =
      bounds.getCenter(
        new Vector3(),
      );

    const wheelWorldQuaternion =
      new Quaternion();

    wheelNode.getWorldQuaternion(
      wheelWorldQuaternion,
    );

    const steeringAxis =
      STEERING_AXIS
        .clone()
        .applyQuaternion(
          wheelWorldQuaternion,
        )
        .normalize();

    originalTransformsRef.current =
      nextTransforms;

    centerRef.current.copy(
      worldCenter,
    );

    steeringAxisRef.current.copy(
      steeringAxis,
    );

    targetRotationRef.current =
      0;

    currentRotationRef.current =
      0;

    lastPointerAngleRef.current =
      null;

    readyRef.current =
      true;

    return () => {
      for (
        const transform of
          originalTransformsRef.current
      ) {
        applyWorldTransform(
          transform,
          transform.position,
          transform.quaternion,
        );
      }

      originalTransformsRef.current =
        [];

      readyRef.current =
        false;
    };
  }, [
    nodes,
    wheelNode,
  ]);

  useFrame(() => {
    if (
      !readyRef.current
    ) {
      return;
    }

    const transforms =
      originalTransformsRef.current;

    if (
      transforms.length ===
      0
    ) {
      return;
    }

    /**
     * Project the actual steering
     * wheel center into screen space.
     */
    const projectedCenter =
      centerRef.current
        .clone()
        .project(camera);

    const canvas =
      gl.domElement;

    const rect =
      canvas.getBoundingClientRect();

    screenCenterRef.current.x =
      rect.left +
      ((projectedCenter.x + 1) /
        2) *
        rect.width;

    screenCenterRef.current.y =
      rect.top +
      ((-projectedCenter.y + 1) /
        2) *
        rect.height;

    currentRotationRef.current =
      MathUtils.damp(
        currentRotationRef.current,
        targetRotationRef.current,
        12,
        1 / 60,
      );

    const deltaQuaternion =
      new Quaternion().setFromAxisAngle(
        steeringAxisRef.current,
        currentRotationRef.current,
      );

    for (
      const transform of
        transforms
    ) {
      const relativePosition =
        transform.position
          .clone()
          .sub(
            centerRef.current,
          );

      relativePosition.applyQuaternion(
        deltaQuaternion,
      );

      const nextPosition =
        centerRef.current
          .clone()
          .add(
            relativePosition,
          );

      const nextQuaternion =
        deltaQuaternion
          .clone()
          .multiply(
            transform.quaternion,
          );

      applyWorldTransform(
        transform,
        nextPosition,
        nextQuaternion,
      );
    }
  });

  const getPointerAngle =
    useCallback(
      (
        clientX: number,
        clientY: number,
      ) => {
        const centerX =
          screenCenterRef.current.x;

        const centerY =
          screenCenterRef.current.y;

        return Math.atan2(
          clientY - centerY,
          clientX - centerX,
        );
      },
      [],
    );

  const handleWindowPointerMove =
    useCallback(
      (
        event: PointerEvent,
      ) => {
        if (
          !draggingRef.current
        ) {
          return;
        }

        const previousAngle =
          lastPointerAngleRef.current;

        if (
          previousAngle === null
        ) {
          lastPointerAngleRef.current =
            getPointerAngle(
              event.clientX,
              event.clientY,
            );

          return;
        }

        const currentAngle =
          getPointerAngle(
            event.clientX,
            event.clientY,
          );

        const deltaAngle =
          normalizeAngle(
            currentAngle -
              previousAngle,
          );

        lastPointerAngleRef.current =
          currentAngle;

        targetRotationRef.current =
          MathUtils.clamp(
            targetRotationRef.current +
              deltaAngle *
                STEERING_DIRECTION,
            -MAX_STEERING_ROTATION,
            MAX_STEERING_ROTATION,
          );
      },
      [
        getPointerAngle,
      ],
    );

  const handleWindowPointerUp =
    useCallback(() => {
      draggingRef.current =
        false;

      lastPointerAngleRef.current =
        null;

      document.body.style.cursor =
        hovered
          ? "grab"
          : "";
    }, [hovered]);

  useEffect(() => {
    window.addEventListener(
      "pointermove",
      handleWindowPointerMove,
    );

    window.addEventListener(
      "pointerup",
      handleWindowPointerUp,
    );

    window.addEventListener(
      "pointercancel",
      handleWindowPointerUp,
    );

    return () => {
      window.removeEventListener(
        "pointermove",
        handleWindowPointerMove,
      );

      window.removeEventListener(
        "pointerup",
        handleWindowPointerUp,
      );

      window.removeEventListener(
        "pointercancel",
        handleWindowPointerUp,
      );

      document.body.style.cursor =
        "";
    };
  }, [
    handleWindowPointerMove,
    handleWindowPointerUp,
  ]);

  const handlePointerDown =
    (
      event: ThreeEvent<PointerEvent>,
    ) => {
      event.stopPropagation();

      if (
        !readyRef.current
      ) {
        return;
      }

      lastPointerAngleRef.current =
        getPointerAngle(
          event.nativeEvent.clientX,
          event.nativeEvent.clientY,
        );

      draggingRef.current =
        true;

      document.body.style.cursor =
        "grabbing";
    };

  const handlePointerOver =
    (
      event: ThreeEvent<PointerEvent>,
    ) => {
      event.stopPropagation();

      setHovered(true);

      if (
        !draggingRef.current
      ) {
        document.body.style.cursor =
          "grab";
      }
    };

  const handlePointerOut =
    (
      event: ThreeEvent<PointerEvent>,
    ) => {
      event.stopPropagation();

      setHovered(false);

      if (
        !draggingRef.current
      ) {
        document.body.style.cursor =
          "";
      }
    };

  if (
    !center ||
    !markerPosition
  ) {
    return null;
  }

  return (
    <group
      position={markerPosition}
      renderOrder={1200}
    >
      <Billboard
        follow
        lockX={false}
        lockY={false}
        lockZ={false}
      >
        <group>
          <mesh
            onPointerDown={
              handlePointerDown
            }
            onPointerOver={
              handlePointerOver
            }
            onPointerOut={
              handlePointerOut
            }
            renderOrder={1200}
          >
            <circleGeometry
              args={[
                interactionRadius *
                  0.55,
                32,
              ]}
            />

            <meshBasicMaterial
              transparent
              opacity={0}
              depthTest={false}
              depthWrite={false}
            />
          </mesh>

          <mesh
            renderOrder={1201}
          >
            <ringGeometry
              args={[
                interactionRadius *
                  0.08,
                interactionRadius *
                  0.095,
                24,
              ]}
            />

            <meshBasicMaterial
              color={
                hovered
                  ? "#22d3ee"
                  : "#94a3b8"
              }
              transparent
              opacity={
                hovered
                  ? 0.85
                  : 0.35
              }
              depthTest={false}
              depthWrite={false}
            />
          </mesh>
        </group>
      </Billboard>
    </group>
  );
}