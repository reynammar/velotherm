"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import type {
  Object3D,
} from "three";

import {
  Box3,
  Group,
  MathUtils,
  Vector3,
} from "three";

import {
  BODY_INTERACTION_CONFIGS,
  type BodyInteractionKey,
  type BodyInteractionConfig,
} from "@/src/features/simulation/data/bodyInteractionConfig";

type BodyInteractionTarget = {
  key: BodyInteractionKey;
  parts: Object3D[];
  pivot: Group;
  rotationAxis: "x" | "y";
  openRotation: number;
  currentRotation: number;
  targetRotation: number;
};

type OpenStateMap = Record<
  BodyInteractionKey,
  boolean
>;

type BodyInteractionChangeHandler = (
  key: BodyInteractionKey,
  open: boolean,
) => void;

const INITIAL_OPEN_STATES: OpenStateMap = {
  doorFL: false,
  doorFR: false,
  doorRL: false,
  doorRR: false,
  hood: false,
  trunk: false,
};

function getNode(
  root: Object3D,
  name: string,
): Object3D | null {
  return root.getObjectByName(name) ?? null;
}

function getCombinedWorldBounds(
  parts: Object3D[],
): Box3 {
  const bounds = new Box3();

  for (const part of parts) {
    const partBounds =
      new Box3().setFromObject(part);

    if (partBounds.isEmpty()) {
      continue;
    }

    bounds.union(partBounds);
  }

  return bounds;
}

function getHingeWorldPosition(
  parts: Object3D[],
  hinge: BodyInteractionConfig["hinge"],
): Vector3 {
  const bounds =
    getCombinedWorldBounds(parts);

  const min = bounds.min;
  const max = bounds.max;

  const centerX =
    (min.x + max.x) * 0.5;

  const centerY =
    (min.y + max.y) * 0.5;

  if (hinge === "front") {
    return new Vector3(
      centerX,
      centerY,
      max.z,
    );
  }

  if (hinge === "rear") {
    return new Vector3(
      centerX,
      centerY,
      min.z,
    );
  }

  if (hinge === "hood") {
    return new Vector3(
      centerX,
      min.y,
      min.z,
    );
  }

  return new Vector3(
    centerX,
    max.y,
    max.z,
  );
}

function createInteractionPivot(
  root: Object3D,
  parts: Object3D[],
  config: BodyInteractionConfig,
): Group | null {
  if (parts.length === 0) {
    return null;
  }

  const parent = parts[0].parent;

  if (!parent) {
    return null;
  }

  for (const part of parts) {
    if (part.parent !== parent) {
      console.warn(
        `[VELOTHERM] Interaction parts for ${config.key} do not share the same parent.`,
      );

      return null;
    }
  }

  root.updateWorldMatrix(true, true);
  parent.updateWorldMatrix(true, true);

  const hingeWorld =
    getHingeWorldPosition(
      parts,
      config.hinge,
    );

  const pivot = new Group();

  pivot.name =
    `__VELOTHERM_INTERACTION_PIVOT_${config.key}`;

  parent.add(pivot);

  pivot.position.copy(
    parent.worldToLocal(
      hingeWorld.clone(),
    ),
  );

  pivot.updateMatrixWorld(true);

  for (const part of parts) {
    pivot.attach(part);
  }

  return pivot;
}

export function useCarBodyInteraction(
  scene: Object3D,
  onInteractionChange?: BodyInteractionChangeHandler,
) {
  const targetsRef =
    useRef<BodyInteractionTarget[]>(
      [],
    );

  const [openStates, setOpenStates] =
    useState<OpenStateMap>(
      INITIAL_OPEN_STATES,
    );

  useEffect(() => {
    const targets: BodyInteractionTarget[] =
      [];

    for (
      const config of BODY_INTERACTION_CONFIGS
    ) {
      const parts =
        config.interactionNodes
          .map((name) =>
            getNode(scene, name),
          )
          .filter(
            (
              node,
            ): node is Object3D =>
              Boolean(node),
          );

      if (
        parts.length !==
        config.interactionNodes.length
      ) {
        console.warn(
          `[VELOTHERM] Body interaction nodes missing for ${config.key}.`,
        );

        continue;
      }

      const pivot =
        createInteractionPivot(
          scene,
          parts,
          config,
        );

      if (!pivot) {
        console.warn(
          `[VELOTHERM] Failed to create interaction pivot for ${config.key}.`,
        );

        continue;
      }

      targets.push({
        key: config.key,
        parts,
        pivot,
        rotationAxis:
          config.rotationAxis,
        openRotation:
          MathUtils.degToRad(
            config.openRotation,
          ),
        currentRotation: 0,
        targetRotation: 0,
      });
    }

    targetsRef.current = targets;

    return () => {
      for (const target of targets) {
        const pivot = target.pivot;

        if (!pivot.parent) {
          continue;
        }

        pivot.rotation.set(0, 0, 0);
        pivot.updateMatrixWorld(true);

        const parent = pivot.parent;

        for (const part of target.parts) {
          parent.attach(part);
        }

        parent.remove(pivot);
      }

      targetsRef.current = [];
    };
  }, [scene]);

  useEffect(() => {
    let animationFrameId:
      | number
      | null = null;

    const animate = () => {
      for (const target of targetsRef.current) {
        target.currentRotation =
          MathUtils.damp(
            target.currentRotation,
            target.targetRotation,
            7,
            1 / 60,
          );

        if (target.rotationAxis === "x") {
          target.pivot.rotation.x =
            target.currentRotation;

          continue;
        }

        target.pivot.rotation.y =
          target.currentRotation;
      }

      animationFrameId =
        window.requestAnimationFrame(
          animate,
        );
    };

    animationFrameId =
      window.requestAnimationFrame(
        animate,
      );

    return () => {
      if (animationFrameId !== null) {
        window.cancelAnimationFrame(
          animationFrameId,
        );
      }
    };
  }, []);

  const toggleInteraction =
    useCallback(
      (
        key: BodyInteractionKey,
      ) => {
        const target =
          targetsRef.current.find(
            (item) =>
              item.key === key,
          );

        if (!target) {
          console.warn(
            `[VELOTHERM] Interaction target not found: ${key}`,
          );

          return false;
        }

        const isOpen =
          Math.abs(
            target.targetRotation,
          ) > 0.05;

        const nextOpen = !isOpen;

        target.targetRotation =
          nextOpen
            ? target.openRotation
            : 0;

        setOpenStates((current) => ({
          ...current,
          [key]: nextOpen,
        }));

        onInteractionChange?.(
          key,
          nextOpen,
        );

        return true;
      },
      [onInteractionChange],
    );

  return {
    toggleInteraction,
    openStates,
  };
}
