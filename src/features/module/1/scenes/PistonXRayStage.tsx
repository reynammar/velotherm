"use client";

import {
  Suspense,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ComponentRef,
  type RefObject,
} from "react";

import {
  Billboard,
  OrbitControls,
  useGLTF,
} from "@react-three/drei";

import {
  Canvas,
  useFrame,
  useThree,
} from "@react-three/fiber";

import type {
  ThreeEvent,
} from "@react-three/fiber";

import {
  Box3,
  type Group,
  type Material,
  type Mesh,
  Vector3,
} from "three";

import {
  EngineMechanism,
} from "@/src/features/simulation/components/EngineMechanism";

import {
  CAR_MODEL_PATH,
} from "@/src/lib/three/modelConfig";

import {
  CAR_NODE_NAMES,
} from "@/src/lib/three/nodeRegistry";

export type PistonXRayHotspotId =
  | "heat-input"
  | "boundary-work"
  | "system-boundary"
  | "internal-energy";

type HotspotDefinition = {
  id: PistonXRayHotspotId;
};

type PistonXRayStageProps = {
  isPlaying: boolean;
  resetKey: number;
  selectedHotspot: PistonXRayHotspotId | null;
  onHotspotSelect: (
    hotspot: PistonXRayHotspotId,
  ) => void;
};

type HotspotMarkerProps = {
  definition: HotspotDefinition;
  markerRef: (
    node: Group | null,
  ) => void;
  active: boolean;
  onSelect: (
    hotspot: PistonXRayHotspotId,
  ) => void;
};

type CameraControlsRef = RefObject<
  ComponentRef<typeof OrbitControls> | null
>;

const HOTSPOTS: HotspotDefinition[] = [
  { id: "heat-input" },
  { id: "boundary-work" },
  { id: "system-boundary" },
  { id: "internal-energy" },
];

const PARTICLE_COUNT = 22;

const PARTICLE_PHASES = Array.from(
  { length: PARTICLE_COUNT },
  (_, index) => index / PARTICLE_COUNT,
);

const CYLINDER_NODE_NAME =
  "AR_ENGINE_CYLINDER_1";

const PISTON_HEAD_NODE_NAME =
  "AR_ENGINE_CYLINDER_1_PISTON_HEAD_Solid1_1";

function HotspotMarker({
  definition,
  markerRef,
  active,
  onSelect,
}: HotspotMarkerProps) {
  const [hovered, setHovered] = useState(false);

  const handleClick = (
    event: ThreeEvent<MouseEvent>,
  ) => {
    event.stopPropagation();
    onSelect(definition.id);
  };

  const handlePointerOver = (
    event: ThreeEvent<PointerEvent>,
  ) => {
    event.stopPropagation();
    setHovered(true);
    document.body.style.cursor = "pointer";
  };

  const handlePointerOut = (
    event: ThreeEvent<PointerEvent>,
  ) => {
    event.stopPropagation();
    setHovered(false);
    document.body.style.cursor = "";
  };

  return (
    <group ref={markerRef} renderOrder={1200}>
      <Billboard
        follow
        lockX={false}
        lockY={false}
        lockZ={false}
      >
        <group>
          <mesh
            onClick={handleClick}
            onPointerOver={handlePointerOver}
            onPointerOut={handlePointerOut}
            renderOrder={1200}
          >
            <sphereGeometry args={[0.105, 16, 12]} />

            <meshBasicMaterial
              transparent
              opacity={0}
              depthTest={false}
              depthWrite={false}
            />
          </mesh>

          <mesh
            onClick={handleClick}
            onPointerOver={handlePointerOver}
            onPointerOut={handlePointerOut}
            scale={hovered || active ? 1.2 : 1}
            renderOrder={1201}
          >
            <ringGeometry args={[0.044, 0.064, 28]} />

            <meshBasicMaterial
              color={
                hovered || active
                  ? "#fca5a5"
                  : "#ef4444"
              }
              transparent
              opacity={0.98}
              depthTest={false}
              depthWrite={false}
            />
          </mesh>

          <mesh
            onClick={handleClick}
            onPointerOver={handlePointerOver}
            onPointerOut={handlePointerOut}
            renderOrder={1202}
          >
            <sphereGeometry args={[0.022, 12, 10]} />

            <meshBasicMaterial
              color="#ef4444"
              depthTest={false}
              depthWrite={false}
            />
          </mesh>
        </group>
      </Billboard>
    </group>
  );
}

function XRayCarModel() {
  const { scene } = useGLTF(CAR_MODEL_PATH);

  useEffect(() => {
    const engineRoot = scene.getObjectByName(
      CAR_NODE_NAMES.engine.mechanism,
    );

    if (!engineRoot) {
      console.error(
        `[VELOTHERM] Engine node not found: ${CAR_NODE_NAMES.engine.mechanism}`,
      );
      return;
    }

    const engineMeshes = new Set<Mesh>();

    engineRoot.traverse((object) => {
      const mesh = object as Mesh;

      if (mesh.isMesh) {
        engineMeshes.add(mesh);
      }
    });

    const originalMaterials = new Map<
      Mesh,
      Material | Material[]
    >();

    const xRayMaterials = new Set<Material>();

    scene.traverse((object) => {
      const mesh = object as Mesh;

      if (!mesh.isMesh || engineMeshes.has(mesh)) {
        return;
      }

      originalMaterials.set(
        mesh,
        mesh.material,
      );

      const clonedMaterial = Array.isArray(mesh.material)
        ? mesh.material.map((material) => material.clone())
        : mesh.material.clone();

      const materials = Array.isArray(clonedMaterial)
        ? clonedMaterial
        : [clonedMaterial];

      materials.forEach((material) => {
        material.transparent = true;
        material.opacity = 0.08;
        material.depthWrite = false;
        xRayMaterials.add(material);
      });

      mesh.material = clonedMaterial;
    });

    scene.updateMatrixWorld(true);

    return () => {
      originalMaterials.forEach((material, mesh) => {
        mesh.material = material;
      });

      xRayMaterials.forEach((material) => {
        material.dispose();
      });

      originalMaterials.clear();
      xRayMaterials.clear();
    };
  }, [scene]);

  return (
    <primitive
      object={scene}
      dispose={null}
    />
  );
}

function PistonXRayVisualization({
  isPlaying,
  selectedHotspot,
  onHotspotSelect,
}: {
  isPlaying: boolean;
  selectedHotspot: PistonXRayHotspotId | null;
  onHotspotSelect: (
    hotspot: PistonXRayHotspotId,
  ) => void;
}) {
  const { scene } = useGLTF(CAR_MODEL_PATH);

  const overlayRef = useRef<Group | null>(null);
  const particleFieldRef = useRef<Group | null>(null);
  const particleRefs = useRef<Array<Mesh | null>>([]);

  const markerRefs = useRef<
    Record<PistonXRayHotspotId, Group | null>
  >({
    "heat-input": null,
    "boundary-work": null,
    "system-boundary": null,
    "internal-energy": null,
  });

  const nodes = useMemo(
    () => ({
      cylinder: scene.getObjectByName(
        CYLINDER_NODE_NAME,
      ),
      pistonHead: scene.getObjectByName(
        PISTON_HEAD_NODE_NAME,
      ),
      piston: scene.getObjectByName(
        CAR_NODE_NAMES.engine.piston1,
      ),
    }),
    [scene],
  );

  useFrame(({ clock }) => {
    const overlay = overlayRef.current;
    const cylinder = nodes.cylinder;
    const pistonHead = nodes.pistonHead ?? nodes.piston;
    const particleField = particleFieldRef.current;

    if (!overlay || !cylinder || !pistonHead) {
      return;
    }

    scene.updateMatrixWorld(true);

    const cylinderBounds = new Box3().setFromObject(cylinder);
    const pistonHeadBounds = new Box3().setFromObject(pistonHead);

    if (
      cylinderBounds.isEmpty() ||
      pistonHeadBounds.isEmpty()
    ) {
      return;
    }

    const cylinderPosition = cylinderBounds.getCenter(
      new Vector3(),
    );

    const pistonHeadPosition = pistonHeadBounds.getCenter(
      new Vector3(),
    );

    const hotspotPositions: Record<
      PistonXRayHotspotId,
      Vector3
    > = {
      "heat-input": new Vector3(
        cylinderPosition.x,
        cylinderBounds.min.y - 0.035,
        cylinderPosition.z + 0.075,
      ),

      "boundary-work": new Vector3(
        pistonHeadPosition.x,
        pistonHeadPosition.y,
        pistonHeadPosition.z + 0.065,
      ),

      "system-boundary": new Vector3(
        cylinderBounds.max.x + 0.035,
        cylinderPosition.y,
        cylinderPosition.z + 0.065,
      ),

      "internal-energy": new Vector3(
        cylinderPosition.x,
        cylinderPosition.y + 0.08,
        cylinderPosition.z + 0.055,
      ),
    };

    Object.entries(hotspotPositions).forEach(
      ([id, position]) => {
        const marker = markerRefs.current[
          id as PistonXRayHotspotId
        ];

        if (!marker) {
          return;
        }

        marker.position.copy(
          overlay.worldToLocal(position.clone()),
        );
      },
    );

    if (particleField) {
      const particleOrigin = new Vector3(
        cylinderPosition.x,
        cylinderPosition.y,
        cylinderPosition.z + 0.045,
      );

      particleField.position.copy(
        overlay.worldToLocal(particleOrigin),
      );
    }

    particleRefs.current.forEach((particle, index) => {
      if (!particle) {
        return;
      }

      particle.visible = isPlaying;

      if (!isPlaying) {
        return;
      }

      const phase = (
        clock.elapsedTime * 0.34 +
        (PARTICLE_PHASES[index] ?? 0)
      ) % 1;

      const angle =
        clock.elapsedTime * 1.7 +
        index * 2.399963;

      const radialOffset =
        0.014 +
        (index % 4) * 0.005;

      particle.position.set(
        Math.cos(angle) * radialOffset,
        -0.045 + phase * 0.17,
        Math.sin(angle) * radialOffset,
      );

      particle.scale.setScalar(
        0.72 +
        (Math.sin(clock.elapsedTime * 6 + index) + 1) * 0.16,
      );
    });
  });

  const setMarkerRef = (
    id: PistonXRayHotspotId,
  ) => (node: Group | null) => {
    markerRefs.current[id] = node;
  };

  return (
    <group ref={overlayRef}>
      {HOTSPOTS.map((hotspot) => (
        <HotspotMarker
          key={hotspot.id}
          definition={hotspot}
          markerRef={setMarkerRef(hotspot.id)}
          active={selectedHotspot === hotspot.id}
          onSelect={onHotspotSelect}
        />
      ))}

      <group ref={particleFieldRef}>
        {PARTICLE_PHASES.map((phase, index) => (
          <mesh
            key={`heat-particle-${index}`}
            ref={(mesh) => {
              particleRefs.current[index] = mesh;
            }}
            position={[
              0,
              -0.045 + phase * 0.17,
              0,
            ]}
            visible={false}
          >
            <sphereGeometry args={[0.014, 8, 8]} />

            <meshBasicMaterial
              color={
                index % 3 === 0
                  ? "#fbbf24"
                  : "#ef4444"
              }
              transparent
              opacity={0.9}
              depthTest={false}
              depthWrite={false}
            />
          </mesh>
        ))}
      </group>
    </group>
  );
}

function PistonXRayCameraFocus({
  controlsRef,
}: {
  controlsRef: CameraControlsRef;
}) {
  const { scene } = useGLTF(CAR_MODEL_PATH);
  const { camera, clock } = useThree();

  const startCamera = useRef(new Vector3());
  const endCamera = useRef(new Vector3());
  const startTarget = useRef(new Vector3());
  const endTarget = useRef(new Vector3());

  const transitionStart = useRef<number | null>(null);
  const transitioning = useRef(false);

  useEffect(() => {
    const controls = controlsRef.current;

    const engineRoot = scene.getObjectByName(
      CAR_NODE_NAMES.engine.mechanism,
    );

    if (!controls || !engineRoot) {
      return;
    }

    scene.updateMatrixWorld(true);

    const bounds = new Box3().setFromObject(engineRoot);

    if (bounds.isEmpty()) {
      return;
    }

    const center = bounds.getCenter(new Vector3());
    const size = bounds.getSize(new Vector3());

    const direction = camera.position.clone().sub(center);

    if (direction.lengthSq() < 0.001) {
      direction.set(1, 0.3, 1);
    }

    direction.normalize();

    const focusDistance = Math.max(
      size.length() * 2.8,
      2.25,
    );

    startCamera.current.copy(camera.position);
    startTarget.current.copy(controls.target);

    endCamera.current
      .copy(center)
      .addScaledVector(direction, focusDistance);

    endCamera.current.y += size.y * 0.1;

    endTarget.current.copy(center);
    endTarget.current.y += size.y * 0.04;

    controls.enabled = false;

    transitionStart.current = clock.elapsedTime;
    transitioning.current = true;
  }, [
    camera,
    clock,
    controlsRef,
    scene,
  ]);

  useFrame(() => {
    const controls = controlsRef.current;
    const startTime = transitionStart.current;

    if (
      !controls ||
      !transitioning.current ||
      startTime === null
    ) {
      return;
    }

    const progress = Math.min(
      (clock.elapsedTime - startTime) / 1.35,
      1,
    );

    const easedProgress =
      1 - Math.pow(1 - progress, 3);

    camera.position.lerpVectors(
      startCamera.current,
      endCamera.current,
      easedProgress,
    );

    controls.target.lerpVectors(
      startTarget.current,
      endTarget.current,
      easedProgress,
    );

    controls.update();

    if (progress >= 1) {
      transitioning.current = false;
      transitionStart.current = null;
      controls.enabled = true;
      controls.update();
    }
  });

  return null;
}

export function PistonXRayStage({
  isPlaying,
  resetKey,
  selectedHotspot,
  onHotspotSelect,
}: PistonXRayStageProps) {
  const controlsRef = useRef<
    ComponentRef<typeof OrbitControls> | null
  >(null);

  return (
    <div className="h-full w-full">
      <Canvas
        camera={{
          position: [5.4, 3.1, 6.5],
          fov: 40,
        }}
        dpr={[1, 1.75]}
        gl={{
          antialias: true,
          powerPreference: "high-performance",
        }}
      >
        <color
          attach="background"
          args={["#0f172a"]}
        />

        <ambientLight intensity={1.15} />

        <directionalLight
          position={[5, 8, 5]}
          intensity={2.15}
        />

        <pointLight
          position={[-0.2, 1.2, 0.7]}
          color="#f97316"
          intensity={0.65}
          distance={2.2}
        />

        <mesh
          rotation={[-Math.PI / 2, 0, 0]}
          position={[0, -0.015, 0]}
        >
          <planeGeometry args={[28, 28]} />
          <meshStandardMaterial
            color="#0b1120"
            roughness={1}
          />
        </mesh>

        <gridHelper
          args={[28, 28, "#334155", "#1e293b"]}
          position={[0, 0.005, 0]}
        />

        <Suspense fallback={null}>
          <XRayCarModel />

          <EngineMechanism
            isPlaying={isPlaying}
            playbackRate={1}
            resetKey={resetKey}
          />

          <PistonXRayVisualization
            isPlaying={isPlaying}
            selectedHotspot={selectedHotspot}
            onHotspotSelect={onHotspotSelect}
          />

          <PistonXRayCameraFocus
            controlsRef={controlsRef}
          />
        </Suspense>

        <OrbitControls
          ref={controlsRef}
          target={[0.35, 1.14, 0.14]}
          enableDamping
          dampingFactor={0.045}
          rotateSpeed={0.82}
          zoomSpeed={0.9}
          enablePan={false}
          minDistance={1.35}
          maxDistance={7}
          minPolarAngle={Math.PI * 0.2}
          maxPolarAngle={Math.PI * 0.68}
        />
      </Canvas>
    </div>
  );
}

useGLTF.preload(CAR_MODEL_PATH);