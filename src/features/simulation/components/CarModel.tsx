"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
} from "react";

import {
  Billboard,
  useGLTF,
} from "@react-three/drei";

import {
  useFrame,
} from "@react-three/fiber";

import type {
  ThreeEvent,
} from "@react-three/fiber";

import {
  Box3,
  MeshPhysicalMaterial,
  MeshStandardMaterial,
  Vector3,
  type Material,
  type Mesh,
  type Object3D,
} from "three";

import {
  createCarNodeRegistry,
  type CarNodeRegistry,
} from "@/src/lib/three/nodeRegistry";

import {
  CAR_MODEL_PATH,
} from "@/src/lib/three/modelConfig";

import {
  useCarBodyInteraction,
} from "@/src/features/simulation/hooks/useCarBodyInteraction";

import type {
  BodyInteractionKey,
} from "@/src/features/simulation/data/bodyInteractionConfig";

import {
  CarBodyInteractionMarkers,
} from "./CarBodyInteractionMarkers";

import {
  SteeringWheelInteraction,
} from "./SteeringWheelInteraction";

export type CarFocusComponent =
  | "engine"
  | "crankshaft"
  | "piston1"
  | "rod1"
  | "piston2"
  | "rod2"
  | "piston3"
  | "rod3"
  | "piston4"
  | "rod4"
  | "generator"
  | "inverter"
  | "electricMotor"
  | "battery";

type EngineInternalComponent =
  | "crankshaft"
  | "piston1"
  | "rod1"
  | "piston2"
  | "rod2"
  | "piston3"
  | "rod3"
  | "piston4"
  | "rod4";

type OriginalMaterialMap =
  Map<
    Mesh,
    Material | Material[]
  >;

type FocusMaterialMap =
  Map<
    Mesh,
    Material | Material[]
  >;

type OriginalRaycastMap =
  Map<
    Mesh,
    Mesh["raycast"]
  >;

type VisualRole =
  | "selected"
  | "related"
  | "focus";

type EngineInteractionMarkerProps = {
  target: Object3D;

  component:
    EngineInternalComponent;

  selected: boolean;

  onSelect: (
    component: CarFocusComponent,
  ) => void;
};

const ENGINE_MARKERS: Array<{
  component: EngineInternalComponent;

  label: string;
}> = [
  {
    component: "piston1",
    label: "Piston 01",
  },
  {
    component: "rod1",
    label: "Rod 01",
  },
  {
    component: "piston2",
    label: "Piston 02",
  },
  {
    component: "rod2",
    label: "Rod 02",
  },
  {
    component: "piston3",
    label: "Piston 03",
  },
  {
    component: "rod3",
    label: "Rod 03",
  },
  {
    component: "piston4",
    label: "Piston 04",
  },
  {
    component: "rod4",
    label: "Rod 04",
  },
  {
    component: "crankshaft",
    label: "Crankshaft",
  },
];

function cloneMaterial(
  material: Material,
): Material {
  return material.clone();
}

function cloneMeshMaterials(
  material:
    | Material
    | Material[],
): Material | Material[] {
  if (
    Array.isArray(material)
  ) {
    return material.map(
      cloneMaterial,
    );
  }

  return cloneMaterial(
    material,
  );
}

function getMaterials(
  material:
    | Material
    | Material[],
): Material[] {
  return Array.isArray(material)
    ? material
    : [material];
}

function setFocusMaterial(
  material: Material,
  role: VisualRole,
) {
  if (
    material instanceof
      MeshStandardMaterial ||
    material instanceof
      MeshPhysicalMaterial
  ) {
    material.transparent = false;
    material.opacity = 1;
    material.depthWrite = true;

    if (
      role ===
      "selected"
    ) {
      material.emissive.set(
        "#22d3ee",
      );

      material.emissiveIntensity =
        0.55;

      return;
    }

    if (
      role ===
      "related"
    ) {
      material.emissive.set(
        "#06b6d4",
      );

      material.emissiveIntensity =
        0.18;

      return;
    }

    material.emissive.set(
      "#dc2626",
    );

    material.emissiveIntensity =
      0.08;
  }
}

function setBodyMaterial(
  material: Material,
) {
  material.transparent = true;
  material.opacity = 0.08;
  material.depthWrite = false;
}

function collectHierarchy(
  root: Object3D,
) {
  const objects =
    new Set<Object3D>();

  root.traverse(
    (object) => {
      objects.add(
        object,
      );
    },
  );

  return objects;
}

function isEngineInternalComponent(
  component:
    | CarFocusComponent
    | null
    | undefined,
): component is EngineInternalComponent {
  return (
    component ===
      "crankshaft" ||
    component ===
      "piston1" ||
    component ===
      "rod1" ||
    component ===
      "piston2" ||
    component ===
      "rod2" ||
    component ===
      "piston3" ||
    component ===
      "rod3" ||
    component ===
      "piston4" ||
    component ===
      "rod4"
  );
}

function getSelectedNode(
  nodes: CarNodeRegistry,
  component:
    | CarFocusComponent
    | null,
): Object3D | null {
  if (!component) {
    return null;
  }

  switch (component) {
    case "crankshaft":
      return nodes.engine
        .crankshaft;

    case "piston1":
      return nodes.engine
        .piston1;

    case "rod1":
      return nodes.engine
        .rod1;

    case "piston2":
      return nodes.engine
        .piston2;

    case "rod2":
      return nodes.engine
        .rod2;

    case "piston3":
      return nodes.engine
        .piston3;

    case "rod3":
      return nodes.engine
        .rod3;

    case "piston4":
      return nodes.engine
        .piston4;

    case "rod4":
      return nodes.engine
        .rod4;

    case "generator":
      return nodes.hybrid
        .generator;

    case "inverter":
      return nodes.hybrid
        .inverter;

    case "electricMotor":
      return nodes.hybrid
        .electricMotor;

    case "battery":
      return nodes.hybrid
        .battery;

    case "engine":
      return nodes.engine
        .mechanism;

    default:
      return null;
  }
}

function getRelatedEngineNodes(
  nodes: CarNodeRegistry,
  component:
    | CarFocusComponent
    | null,
) {
  const related =
    new Set<Object3D>();

  if (
    component ===
    "crankshaft"
  ) {
    related.add(
      nodes.engine
        .crankshaft,
    );

    related.add(
      nodes.engine.piston1,
    );

    related.add(
      nodes.engine.rod1,
    );

    related.add(
      nodes.engine.piston2,
    );

    related.add(
      nodes.engine.rod2,
    );

    related.add(
      nodes.engine.piston3,
    );

    related.add(
      nodes.engine.rod3,
    );

    related.add(
      nodes.engine.piston4,
    );

    related.add(
      nodes.engine.rod4,
    );

    return related;
  }

  if (
    component ===
      "piston1" ||
    component ===
      "rod1"
  ) {
    related.add(
      nodes.engine
        .piston1,
    );

    related.add(
      nodes.engine
        .rod1,
    );

    related.add(
      nodes.engine
        .crankshaft,
    );

    return related;
  }

  if (
    component ===
      "piston2" ||
    component ===
      "rod2"
  ) {
    related.add(
      nodes.engine
        .piston2,
    );

    related.add(
      nodes.engine
        .rod2,
    );

    related.add(
      nodes.engine
        .crankshaft,
    );

    return related;
  }

  if (
    component ===
      "piston3" ||
    component ===
      "rod3"
  ) {
    related.add(
      nodes.engine
        .piston3,
    );

    related.add(
      nodes.engine
        .rod3,
    );

    related.add(
      nodes.engine
        .crankshaft,
    );

    return related;
  }

  if (
    component ===
      "piston4" ||
    component ===
      "rod4"
  ) {
    related.add(
      nodes.engine
        .piston4,
    );

    related.add(
      nodes.engine
        .rod4,
    );

    related.add(
      nodes.engine
        .crankshaft,
    );

    return related;
  }

  return related;
}

function resolveFocusRoot(
  nodes: CarNodeRegistry,
  component:
    | CarFocusComponent
    | null,
) {
  if (!component) {
    return null;
  }

  if (
    isEngineInternalComponent(
      component,
    )
  ) {
    return nodes.engine
      .mechanism;
  }

  switch (component) {
    case "engine":
      return nodes.engine
        .mechanism;

    case "generator":
      return nodes.hybrid
        .generator;

    case "inverter":
      return nodes.hybrid
        .inverter;

    case "electricMotor":
      return nodes.hybrid
        .electricMotor;

    case "battery":
      return nodes.hybrid
        .battery;

    default:
      return null;
  }
}

function resolveClickedComponent(
  object: Object3D,
  nodes: CarNodeRegistry,
): CarFocusComponent | null {
  let current:
    | Object3D
    | null = object;

  while (current) {
    if (
      current ===
      nodes.engine
        .crankshaft
    ) {
      return "crankshaft";
    }

    if (
      current ===
      nodes.engine.piston1
    ) {
      return "piston1";
    }

    if (
      current ===
      nodes.engine.rod1
    ) {
      return "rod1";
    }

    if (
      current ===
      nodes.engine.piston2
    ) {
      return "piston2";
    }

    if (
      current ===
      nodes.engine.rod2
    ) {
      return "rod2";
    }

    if (
      current ===
      nodes.engine.piston3
    ) {
      return "piston3";
    }

    if (
      current ===
      nodes.engine.rod3
    ) {
      return "rod3";
    }

    if (
      current ===
      nodes.engine.piston4
    ) {
      return "piston4";
    }

    if (
      current ===
      nodes.engine.rod4
    ) {
      return "rod4";
    }

    if (
      current ===
      nodes.engine.mechanism
    ) {
      return "engine";
    }

    if (
      current ===
      nodes.hybrid.generator
    ) {
      return "generator";
    }

    if (
      current ===
      nodes.hybrid.inverter
    ) {
      return "inverter";
    }

    if (
      current ===
      nodes.hybrid.electricMotor
    ) {
      return "electricMotor";
    }

    if (
      current ===
      nodes.hybrid.battery
    ) {
      return "battery";
    }

    current =
      current.parent;
  }

  return null;
}

function applyFocus(
  scene: Object3D,
  focusRoot: Object3D,
  focusComponent:
    | CarFocusComponent
    | null,
  nodes: CarNodeRegistry,
  originalMaterials: OriginalMaterialMap,
  focusMaterials: FocusMaterialMap,
) {
  const focusObjects =
    collectHierarchy(
      focusRoot,
    );

  const selectedRoot =
    getSelectedNode(
      nodes,
      focusComponent,
    );

  const selectedObjects =
    selectedRoot
      ? collectHierarchy(
          selectedRoot,
        )
      : new Set<Object3D>();

  const relatedRoots =
    getRelatedEngineNodes(
      nodes,
      focusComponent,
    );

  const relatedObjects =
    new Set<Object3D>();

  relatedRoots.forEach(
    (root) => {
      collectHierarchy(
        root,
      ).forEach(
        (object) => {
          relatedObjects.add(
            object,
          );
        },
      );
    },
  );

  scene.traverse(
    (object) => {
      const mesh =
        object as Mesh;

      if (!mesh.isMesh) {
        return;
      }

      if (
        !originalMaterials.has(
          mesh,
        )
      ) {
        originalMaterials.set(
          mesh,
          mesh.material,
        );
      }

      let role:
        | VisualRole
        | null = null;

      if (
        selectedObjects.has(
          mesh,
        )
      ) {
        role = "selected";
      } else if (
        relatedObjects.has(
          mesh,
        )
      ) {
        role = "related";
      } else if (
        focusObjects.has(
          mesh,
        )
      ) {
        role = "focus";
      }

      const focusMaterial =
        cloneMeshMaterials(
          mesh.material,
        );

      getMaterials(
        focusMaterial,
      ).forEach(
        (material) => {
          if (role) {
            setFocusMaterial(
              material,
              role,
            );
          } else {
            setBodyMaterial(
              material,
            );
          }
        },
      );

      mesh.material =
        focusMaterial;

      focusMaterials.set(
        mesh,
        focusMaterial,
      );
    },
  );
}

function restoreOriginalMaterials(
  originalMaterials: OriginalMaterialMap,
) {
  originalMaterials.forEach(
    (
      material,
      mesh,
    ) => {
      mesh.material =
        material;
    },
  );
}

function disposeFocusMaterials(
  focusMaterials: FocusMaterialMap,
) {
  const disposedMaterials =
    new Set<Material>();

  focusMaterials.forEach(
    (material) => {
      getMaterials(
        material,
      ).forEach(
        (
          currentMaterial,
        ) => {
          if (
            disposedMaterials.has(
              currentMaterial,
            )
          ) {
            return;
          }

          disposedMaterials.add(
            currentMaterial,
          );

          currentMaterial.dispose();
        },
      );
    },
  );

  focusMaterials.clear();
}

function updateEngineRaycastState(
  scene: Object3D,
  engineRoot: Object3D,
  enabled: boolean,
  originalRaycasts: OriginalRaycastMap,
) {
  const engineObjects =
    collectHierarchy(
      engineRoot,
    );

  scene.traverse(
    (object) => {
      const mesh =
        object as Mesh;

      if (!mesh.isMesh) {
        return;
      }

      if (
        !originalRaycasts.has(
          mesh,
        )
      ) {
        originalRaycasts.set(
          mesh,
          mesh.raycast,
        );
      }

      if (enabled) {
        if (
          engineObjects.has(
            mesh,
          )
        ) {
          const original =
            originalRaycasts.get(
              mesh,
            );

          if (original) {
            mesh.raycast =
              original;
          }

          return;
        }

        mesh.raycast =
          () => {};

        return;
      }

      const original =
        originalRaycasts.get(
          mesh,
        );

      if (original) {
        mesh.raycast =
          original;
      }
    },
  );
}

function getMarkerRadius(
  target: Object3D,
) {
  const bounds =
    new Box3().setFromObject(
      target,
    );

  if (
    bounds.isEmpty()
  ) {
    return 0.075;
  }

  const size =
    bounds.getSize(
      new Vector3(),
    );

  const calculated =
    size.length() * 0.2;

  return Math.min(
    Math.max(
      calculated,
      0.06,
    ),
    0.12,
  );
}

function EngineInteractionMarker({
  target,
  component,
  selected,
  onSelect,
}: EngineInteractionMarkerProps) {
  const markerRef =
    useRef<Object3D | null>(
      null,
    );

  const worldPositionRef =
    useRef(
      new Vector3(),
    );

  const localPositionRef =
    useRef(
      new Vector3(),
    );

  const radius =
    useMemo(
      () =>
        getMarkerRadius(
          target,
        ),
      [target],
    );

  const hitRadius =
    Math.max(
      radius * 2.4,
      0.16,
    );

  useFrame(
    (state) => {
      const marker =
        markerRef.current;

      if (!marker) {
        return;
      }

      const parent =
        marker.parent;

      if (!parent) {
        return;
      }

      target.getWorldPosition(
        worldPositionRef.current,
      );

      localPositionRef.current.copy(
        worldPositionRef.current,
      );

      parent.worldToLocal(
        localPositionRef.current,
      );

      marker.position.copy(
        localPositionRef.current,
      );

      const pulse =
        selected
          ? 1 +
            Math.sin(
              state.clock.getElapsedTime() *
                5,
            ) *
              0.08
          : 1;

      marker.scale.setScalar(
        pulse,
      );
    },
  );

  const handleClick = (
    event: ThreeEvent<MouseEvent>,
  ) => {
    event.stopPropagation();

    onSelect(
      component,
    );
  };

  return (
    <group
      ref={markerRef}
      renderOrder={1000}
    >
      <Billboard
        follow
        lockX={false}
        lockY={false}
        lockZ={false}
      >
        <group>
          <mesh
            onClick={
              handleClick
            }
            onPointerDown={(
              event,
            ) => {
              event.stopPropagation();
            }}
            renderOrder={1000}
          >
            <circleGeometry
              args={[
                hitRadius,
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
            onClick={
              handleClick
            }
            onPointerDown={(
              event,
            ) => {
              event.stopPropagation();
            }}
            renderOrder={1001}
          >
            <ringGeometry
              args={[
                radius * 0.62,
                radius,
                32,
              ]}
            />

            <meshBasicMaterial
              color={
                selected
                  ? "#22d3ee"
                  : "#94a3b8"
              }
              transparent
              opacity={
                selected
                  ? 0.98
                  : 0.78
              }
              depthTest={false}
              depthWrite={false}
            />
          </mesh>

          <mesh
            onClick={
              handleClick
            }
            onPointerDown={(
              event,
            ) => {
              event.stopPropagation();
            }}
            renderOrder={1002}
          >
            <circleGeometry
              args={[
                radius * 0.18,
                16,
              ]}
            />

            <meshBasicMaterial
              color={
                selected
                  ? "#ffffff"
                  : "#cbd5e1"
              }
              transparent
              opacity={
                selected
                  ? 1
                  : 0.78
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

type EngineInteractionMarkersProps = {
  nodes: CarNodeRegistry;

  visible: boolean;

  selectedComponent:
    | CarFocusComponent
    | null;

  onSelect: (
    component: CarFocusComponent,
  ) => void;
};

function EngineInteractionMarkers({
  nodes,
  visible,
  selectedComponent,
  onSelect,
}: EngineInteractionMarkersProps) {
  if (!visible) {
    return null;
  }

  return (
    <group>
      {ENGINE_MARKERS.map(
        ({
          component,
        }) => {
          const target =
            nodes.engine[
              component
            ];

          return (
            <EngineInteractionMarker
              key={
                component
              }
              target={
                target
              }
              component={
                component
              }
              selected={
                selectedComponent ===
                component
              }
              onSelect={
                onSelect
              }
            />
          );
        },
      )}
    </group>
  );
}

type DoorInteractionKey = Extract<
  BodyInteractionKey,
  "doorFL" | "doorFR" | "doorRL" | "doorRR"
>;

export type DoorCameraPose = {
  door: DoorInteractionKey;

  position: [
    number,
    number,
    number,
  ];

  target: [
    number,
    number,
    number,
  ];
};

const DOOR_NODE_NAMES: Record<
  DoorInteractionKey,
  string
> = {
  doorFL: "car_door_FL",
  doorFR: "car_door_FR",
  doorRL: "car_door_RL",
  doorRR: "car_door_RR",
};

function createDoorCameraPose(
  scene: Object3D,
  door: DoorInteractionKey,
): DoorCameraPose | null {
  const body =
    scene.getObjectByName(
      "car_body",
    );

  const doorNode =
    scene.getObjectByName(
      DOOR_NODE_NAMES[door],
    );

  if (!body || !doorNode) {
    console.warn(
      `[VELOTHERM] Door camera nodes missing for ${door}.`,
    );

    return null;
  }

  scene.updateWorldMatrix(
    true,
    true,
  );

  const bodyBounds =
    new Box3().setFromObject(
      body,
    );

  const doorBounds =
    new Box3().setFromObject(
      doorNode,
    );

  if (
    bodyBounds.isEmpty() ||
    doorBounds.isEmpty()
  ) {
    console.warn(
      `[VELOTHERM] Failed to calculate door camera bounds for ${door}.`,
    );

    return null;
  }

  const bodyCenter =
    bodyBounds.getCenter(
      new Vector3(),
    );

  const bodySize =
    bodyBounds.getSize(
      new Vector3(),
    );

  const doorCenter =
    doorBounds.getCenter(
      new Vector3(),
    );

  const sideSign =
    doorCenter.x >=
    bodyCenter.x
      ? 1
      : -1;

  const outwardSign =
    sideSign;

  const cabinHeight =
    bodyBounds.min.y +
    bodySize.y * 0.56;

  const cameraDepth =
    Math.max(
      bodySize.x * 0.22,
      0.6,
    );

  const cameraZ =
    doorCenter.z +
    (bodyCenter.z -
      doorCenter.z) *
      0.04;

  const targetZ =
    doorCenter.z +
    (bodyCenter.z -
      doorCenter.z) *
      0.68;

  const position =
    new Vector3(
      doorCenter.x +
        outwardSign *
          cameraDepth,
      cabinHeight,
      cameraZ,
    );

  const target =
    new Vector3(
      bodyCenter.x -
        outwardSign *
          bodySize.x *
          0.04,
      bodyBounds.min.y +
        bodySize.y * 0.48,
      targetZ,
    );

  return {
    door,

    position: [
      position.x,
      position.y,
      position.z,
    ],

    target: [
      target.x,
      target.y,
      target.z,
    ],
  };
}

export type CarModelProps = {
  onNodesReady?: (
    nodes: CarNodeRegistry,
  ) => void;

  onNodeSelect?: (
    component: CarFocusComponent,
  ) => void;

  onDoorCameraChange?: (
    pose: DoorCameraPose | null,
  ) => void;

  engineFocus?: boolean;

  focusComponent?:
    | CarFocusComponent
    | null;
};

export function CarModel({
  onNodesReady,
  onNodeSelect,
  onDoorCameraChange,
  engineFocus = false,
  focusComponent = null,
}: CarModelProps) {
  const {
    scene,
    animations,
  } = useGLTF(
    CAR_MODEL_PATH,
  );

  const nodes = useMemo(
    () =>
      createCarNodeRegistry(
        scene,
      ),
    [scene],
  );

  const activeDoorRef =
    useRef<DoorInteractionKey | null>(
      null,
    );

  const handleBodyInteractionChange =
    useCallback(
      (
        key: BodyInteractionKey,
        open: boolean,
      ) => {
        const isDoor =
          key === "doorFL" ||
          key === "doorFR" ||
          key === "doorRL" ||
          key === "doorRR";

        if (!isDoor) {
          return;
        }

        if (!open) {
          if (
            activeDoorRef.current ===
            key
          ) {
            activeDoorRef.current = null;
            onDoorCameraChange?.(
              null,
            );
          }

          return;
        }

        activeDoorRef.current = key;

        const pose =
          createDoorCameraPose(
            scene,
            key,
          );

        onDoorCameraChange?.(
          pose,
        );
      },
      [
        onDoorCameraChange,
        scene,
      ],
    );

  const {
    toggleInteraction,
    openStates,
  } =
    useCarBodyInteraction(
      scene,
      handleBodyInteractionChange,
    );

  const originalMaterialsRef =
    useRef<OriginalMaterialMap>(
      new Map(),
    );

  const focusMaterialsRef =
    useRef<FocusMaterialMap>(
      new Map(),
    );

  const originalRaycastsRef =
    useRef<OriginalRaycastMap>(
      new Map(),
    );

  const handleNodeClick =
    useCallback(
      (
        event: ThreeEvent<MouseEvent>,
      ) => {
        event.stopPropagation();

        const component =
          resolveClickedComponent(
            event.object,
            nodes,
          );

        if (!component) {
          return;
        }

        onNodeSelect?.(
          component,
        );
      },
      [
        nodes,
        onNodeSelect,
      ],
    );

  const handleMarkerSelect =
    useCallback(
      (
        component: CarFocusComponent,
      ) => {
        onNodeSelect?.(
          component,
        );
      },
      [onNodeSelect],
    );

  useEffect(() => {
    console.log(
      "[VELOTHERM] Car model loaded",
    );

    console.log(
      "[VELOTHERM] Model path:",
      CAR_MODEL_PATH,
    );

    console.log(
      "[VELOTHERM] Animations:",
      animations.map(
        (clip) => clip.name,
      ),
    );

    console.log(
      "[VELOTHERM] Node registry:",
      nodes,
    );

    onNodesReady?.(
      nodes,
    );
  }, [
    animations,
    nodes,
    onNodesReady,
  ]);

  useEffect(() => {
    const originalMaterials =
      originalMaterialsRef.current;

    const focusMaterials =
      focusMaterialsRef.current;

    disposeFocusMaterials(
      focusMaterials,
    );

    const activeFocus =
      focusComponent ??
      (engineFocus
        ? "engine"
        : null);

    if (activeFocus) {
      const focusRoot =
        resolveFocusRoot(
          nodes,
          activeFocus,
        );

      if (focusRoot) {
        applyFocus(
          scene,
          focusRoot,
          activeFocus,
          nodes,
          originalMaterials,
          focusMaterials,
        );
      }
    } else {
      restoreOriginalMaterials(
        originalMaterials,
      );
    }

    return () => {
      disposeFocusMaterials(
        focusMaterials,
      );

      restoreOriginalMaterials(
        originalMaterials,
      );
    };
  }, [
    engineFocus,
    focusComponent,
    nodes,
    scene,
  ]);

  useEffect(() => {
    const internalFocusActive =
      engineFocus ||
      isEngineInternalComponent(
        focusComponent,
      );

    updateEngineRaycastState(
      scene,
      nodes.engine
        .mechanism,
      internalFocusActive,
      originalRaycastsRef.current,
    );

    return () => {
      updateEngineRaycastState(
        scene,
        nodes.engine
          .mechanism,
        false,
        originalRaycastsRef.current,
      );
    };
  }, [
    engineFocus,
    focusComponent,
    nodes,
    scene,
  ]);

  const showEngineMarkers =
    engineFocus ||
    isEngineInternalComponent(
      focusComponent,
    );

  return (
    <>
      <primitive
        object={scene}
        dispose={null}
        onClick={
          handleNodeClick
        }
      />

      <CarBodyInteractionMarkers
        scene={
          scene
        }
        openStates={
          openStates
        }
        onInteract={
          toggleInteraction
        }
      />

      <SteeringWheelInteraction
        scene={
          scene
        }
      />

      <EngineInteractionMarkers
        nodes={nodes}
        visible={
          showEngineMarkers
        }
        selectedComponent={
          focusComponent
        }
        onSelect={
          handleMarkerSelect
        }
      />
    </>
  );
}

useGLTF.preload(
  CAR_MODEL_PATH,
);