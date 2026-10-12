"use client";

import { Suspense, useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, Lightformer } from "@react-three/drei";
import { Bloom, EffectComposer, Vignette } from "@react-three/postprocessing";
import type { BloomEffect } from "postprocessing";
import { Color, Fog, PerspectiveCamera, Vector3 } from "three";
import { lerp, range } from "@/components/three/math";
import { ROOM_KEYS, SPACE_KEYS, sampleTrack } from "@/components/telecom/camera-path";
import { MOMENTS, telecomScroll } from "@/components/telecom/telecom-state";
import { RoomWorld } from "@/components/telecom/worlds/RoomWorld";
import { FiberTunnel } from "@/components/telecom/worlds/FiberTunnel";
import { SpaceBackdrop } from "@/components/telecom/worlds/SpaceBackdrop";
import { BuildWorld, DeliverWorld, IdeaWorld } from "@/components/telecom/worlds/ChapterWorlds";

const ROOM_BG = new Color("#dcdfe3");
const SPACE_BG = new Color("#020306");

/** Drives the camera along the master path and swaps atmosphere per world. */
const Director = ({ mobile }: { mobile: boolean }) => {
  const camera = useThree((s) => s.camera) as PerspectiveCamera;
  const scene = useThree((s) => s.scene);
  const position = useMemo(() => new Vector3(), []);
  const look = useMemo(() => new Vector3(), []);
  const fog = useMemo(() => new Fog(ROOM_BG.clone(), 8, 70), []);
  const background = useMemo(() => ROOM_BG.clone(), []);
  const pointer = useRef({ x: 0, y: 0 });
  const pointerTarget = useThree((s) => s.pointer);

  useFrame((_, delta) => {
    const p = telecomScroll.progress;
    const inRoom = p < MOMENTS.handover;
    const fov = sampleTrack(inRoom ? ROOM_KEYS : SPACE_KEYS, p, position, look);

    // Subtle parallax from the pointer (disabled near the fibre end face).
    const parallax = inRoom ? 1 - range(p, 0.11, 0.14) : range(p, 0.27, 0.3);
    const strength = telecomScroll.reducedMotion || mobile ? 0 : parallax;
    pointer.current.x = lerp(pointer.current.x, pointerTarget.x, 1 - Math.exp(-3 * delta));
    pointer.current.y = lerp(pointer.current.y, pointerTarget.y, 1 - Math.exp(-3 * delta));
    position.x += pointer.current.x * 0.6 * strength * (inRoom ? 0.3 : 1);
    position.y += pointer.current.y * 0.4 * strength * (inRoom ? 0.3 : 1);

    // Portrait screens: pull lateral offsets toward the centre line.
    if (mobile) {
      position.x *= 0.6;
      look.x *= 0.6;
      // Lift the final Ø above the stacked CTA on tall screens.
      look.y -= range(p, 0.93, 1) * 7;
    }

    camera.position.copy(position);
    camera.lookAt(look);

    // Speed feel: widen the lens with scroll velocity inside the fibre.
    const tunnel = !inRoom && p < MOMENTS.tunnelEnd ? 1 : 0;
    const kick = telecomScroll.reducedMotion ? 0 : Math.min(10, Math.abs(telecomScroll.velocity) * 30) * tunnel;
    const targetFov = (fov + kick) * (mobile ? 1.25 : 1);
    const near = inRoom ? (p > 0.13 ? 0.0006 : 0.02) : 0.1;
    const far = inRoom ? 90 : 1800;
    if (
      Math.abs(camera.fov - targetFov) > 0.01 ||
      camera.near !== near ||
      camera.far !== far
    ) {
      camera.fov = targetFov;
      camera.near = near;
      camera.far = far;
      camera.updateProjectionMatrix();
    }

    // Atmosphere.
    if (inRoom) {
      background.copy(ROOM_BG);
      fog.color.copy(ROOM_BG);
      fog.near = 8;
      fog.far = 70;
    } else {
      background.copy(SPACE_BG);
      fog.color.copy(SPACE_BG);
      fog.near = 60;
      fog.far = 420;
    }
    scene.background = background;
    scene.fog = fog;
  });

  return null;
};

/** Bloom tuned per world: restrained in the bright hall, rich in space. */
const Effects = ({ mobile }: { mobile: boolean }) => {
  const bloomRef = useRef<BloomEffect>(null);

  useFrame(() => {
    const bloom = bloomRef.current;
    if (!bloom) return;
    const p = telecomScroll.progress;
    const inRoom = p < MOMENTS.handover;
    const approach = range(p, 0.12, MOMENTS.handover);
    bloom.intensity = inRoom ? 0.4 + approach * 0.5 : 1.25;
    bloom.luminanceMaterial.threshold = inRoom ? 0.95 : 0.32;
  });

  return (
    <EffectComposer multisampling={mobile ? 0 : 4}>
      <Bloom ref={bloomRef} mipmapBlur intensity={1} luminanceThreshold={0.6} luminanceSmoothing={0.25} radius={0.75} />
      <Vignette eskil={false} offset={0.25} darkness={0.55} />
    </EffectComposer>
  );
};

const Lights = () => (
  <>
    <ambientLight intensity={0.55} />
    <hemisphereLight args={["#ffffff", "#c9cdd2", 0.9]} />
    <directionalLight
      position={[5, 12, -6]}
      intensity={1.6}
      castShadow
      shadow-mapSize={[2048, 2048]}
      shadow-camera-left={-12}
      shadow-camera-right={12}
      shadow-camera-top={30}
      shadow-camera-bottom={-30}
      shadow-camera-near={1}
      shadow-camera-far={40}
      shadow-bias={-0.0004}
    >
      <object3D attach="target" position={[0, 0, -16]} />
    </directionalLight>
    <pointLight position={[0, 20, -700]} intensity={600} distance={300} color="#5fe3ff" />
  </>
);

export default function TelecomCanvas({ mobile }: { mobile: boolean }) {
  return (
    <Canvas
      shadows="percentage"
      dpr={mobile ? [1, 1.5] : [1, 1.75]}
      gl={{ antialias: false, powerPreference: "high-performance", stencil: false }}
      camera={{ fov: 42, near: 0.02, far: 90, position: [0, 2.35, 9] }}
    >
      <Director mobile={mobile} />
      <Lights />
      <Environment resolution={128} frames={1}>
        <Lightformer form="rect" intensity={2.5} position={[0, 6, 0]} rotation-x={Math.PI / 2} scale={[12, 40, 1]} />
        <Lightformer form="rect" intensity={1} color="#9feaff" position={[-8, 2, -4]} rotation-y={Math.PI / 2} scale={[20, 3, 1]} />
        <Lightformer form="rect" intensity={0.8} position={[8, 2, 4]} rotation-y={-Math.PI / 2} scale={[20, 3, 1]} />
      </Environment>
      <Suspense fallback={null}>
        <RoomWorld />
        <FiberTunnel streakCount={mobile ? 350 : 700} />
        <SpaceBackdrop starCount={mobile ? 1600 : 3200} nodeCount={mobile ? 240 : 420} />
        <IdeaWorld />
        <BuildWorld />
        <DeliverWorld />
      </Suspense>
      <Effects mobile={mobile} />
    </Canvas>
  );
}
