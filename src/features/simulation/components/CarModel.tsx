"use client";

import {
  useEffect,
  useMemo,
  useRef,
} from "react";

import { useGLTF } from "@react-three/drei";

import {
  MeshPhysicalMaterial,
  MeshStandardMaterial,
  type Material,
  type Mesh,
  type Object3D,
} from "three";

import {
  createCarNodeRegistry,
  type CarNodeRegistry,
} from "@/src/lib/three/nodeRegistry";

const MODEL_PATH =
  "/models/velotherm-master.glb";

type CarModelProps = {
  onNodesReady?: (
    nodes: CarNodeRegistry,
  ) => void;

  engineFocus?: boolean;
};

type OriginalMaterialsMap =
  Map<Mesh, Material | Material[]>;

type FocusMaterialsMap =
  Map<Mesh, Material | Material[]>;

function cloneMaterial(
  material: Material,
): Material {
  return material.clone();
}

function cloneMeshMaterials(
  material: Material | Material[],
): Material | Material[] {
  if (Array.isArray(material)) {
    return material.map(
      cloneMaterial,
    );
  }

  return cloneMaterial(
    material,
  );
}

function getMaterials(
  material: Material | Material[],
): Material[] {
  return Array.isArray(material)
    ? material
    : [material];
}

function setEngineMaterial(
  material: Material,
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

    material.emissive.set(
      "#dc2626",
    );

    material.emissiveIntensity =
      0.22;
  }
}

function setBodyMaterial(
  material: Material,
) {
  material.transparent = true;
  material.opacity = 0.16;
  material.depthWrite = false;
}

function applyEngineFocus(
  scene: Object3D,
  engineRoot: Object3D,
  originalMaterials: OriginalMaterialsMap,
  focusMaterials: FocusMaterialsMap,
) {
  const engineObjects =
    new Set<Object3D>();

  engineRoot.traverse((object) => {
    engineObjects.add(object);
  });

  scene.traverse((object) => {
    const mesh =
      object as Mesh;

    if (!mesh.isMesh) {
      return;
    }

    if (
      !originalMaterials.has(mesh)
    ) {
      originalMaterials.set(
        mesh,
        mesh.material,
      );
    }

    const focused =
      engineObjects.has(mesh);

    const focusMaterial =
      cloneMeshMaterials(
        mesh.material,
      );

    const materials =
      getMaterials(
        focusMaterial,
      );

    materials.forEach(
      (material) => {
        if (focused) {
          setEngineMaterial(
            material,
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
  });
}

function restoreOriginalMaterials(
  originalMaterials: OriginalMaterialsMap,
) {
  originalMaterials.forEach(
    (material, mesh) => {
      mesh.material = material;
    },
  );
}

function disposeFocusMaterials(
  focusMaterials: FocusMaterialsMap,
) {
  const disposedMaterials =
    new Set<Material>();

  focusMaterials.forEach(
    (material) => {
      const materials =
        getMaterials(
          material,
        );

      materials.forEach(
        (currentMaterial) => {
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

export function CarModel({
  onNodesReady,
  engineFocus = false,
}: CarModelProps) {
  const {
    scene,
    animations,
  } = useGLTF(MODEL_PATH);

  const nodes = useMemo(
    () =>
      createCarNodeRegistry(
        scene,
      ),
    [scene],
  );

  const originalMaterialsRef =
    useRef<OriginalMaterialsMap>(
      new Map(),
    );

  const focusMaterialsRef =
    useRef<FocusMaterialsMap>(
      new Map(),
    );

  useEffect(() => {
    console.log(
      "[VELOTHERM] Car model loaded",
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

    onNodesReady?.(nodes);
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

    if (engineFocus) {
      applyEngineFocus(
        scene,
        nodes.engine.mechanism,
        originalMaterials,
        focusMaterials,
      );
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
    nodes,
    scene,
  ]);

  return (
    <primitive
      object={scene}
      dispose={null}
    />
  );
}

useGLTF.preload(MODEL_PATH);