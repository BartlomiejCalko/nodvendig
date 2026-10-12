"use client";

import { useLayoutEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import {
  AdditiveBlending,
  BoxGeometry,
  CatmullRomCurve3,
  Color,
  Group,
  InstancedMesh,
  Matrix4,
  MeshBasicMaterial,
  MeshStandardMaterial,
  Object3D,
  TubeGeometry,
  Vector3,
} from "three";
import { createSignalMaterial } from "@/components/three/signal-material";
import { clamp01, createRandom, easeInCubic, easeOutExpo, range } from "@/components/three/math";
import { MOMENTS, telecomScroll, WORLD } from "@/components/telecom/telecom-state";
import { WordGate } from "@/components/telecom/worlds/WordGate";
import {
  FloatingPanel,
  Monolith,
  MonumentText,
  WireFragments,
  windowFade,
} from "@/components/telecom/worlds/chapter-kit";
import type { PanelKind } from "@/components/telecom/panel-textures";

const { idea, build, deliver } = WORLD;

/** Yaw that turns an object at `from` to face a camera at `to`. */
const facing = (from: [number, number], to: [number, number]) =>
  Math.atan2(to[0] - from[0], to[1] - from[1]);

/* -------------------------------------------------------------------------- */
/* IDEA                                                                       */
/* -------------------------------------------------------------------------- */

export const IdeaWorld = () => (
  <group>
    <WordGate word="IDEA" position={[0, 2, idea]} part={MOMENTS.ideaPart} visible={[0.262, 0.372]} />
    <FloatingPanel
      kind="topology"
      position={[6.5, 2.2, idea - 82]}
      rotation={[0, facing([6.5, idea - 82], [-2.5, idea - 52]), 0]}
      visible={[0.35, 0.425]}
    />
    <FloatingPanel
      kind="route"
      position={[-6.5, 0.4, idea - 118]}
      rotation={[0, facing([-6.5, idea - 118], [2.5, idea - 88]), 0]}
      visible={[0.395, 0.47]}
      seed={2}
    />
    <FloatingPanel
      kind="rack"
      position={[4.5, 3.4, idea - 158]}
      rotation={[0, facing([4.5, idea - 158], [-1, idea - 124]), 0]}
      visible={[0.44, 0.515]}
      seed={3}
    />
    <FloatingPanel
      kind="spec"
      position={[-12, 6, idea - 150]}
      rotation={[0, facing([-12, idea - 150], [0, idea - 110]), 0]}
      width={11}
      visible={[0.44, 0.515]}
      seed={4}
    />
    <FloatingPanel
      kind="ports"
      position={[-16, -5.5, idea - 112]}
      rotation={[0, facing([-16, idea - 112], [2.5, idea - 88]), 0]}
      width={10}
      visible={[0.4, 0.47]}
      seed={5}
    />
    <WireFragments center={[0, 1, idea - 30]} spread={[46, 26, 150]} visible={[0.33, 0.515]} />
  </group>
);

/* -------------------------------------------------------------------------- */
/* BUILD — assembly line                                                      */
/* -------------------------------------------------------------------------- */

const RIG = {
  x: -17,
  y: -6,
  z: build - 192,
  count: 14,
  scale: 2.3,
  start: 0.64,
  racksEnd: 0.7,
  traysEnd: 0.715,
  cablesEnd: 0.735,
};

const AssemblyRig = () => {
  const groupRef = useRef<Group>(null);
  const rackRef = useRef<InstancedMesh>(null);
  const streakRef = useRef<InstancedMesh>(null);
  const trayRef = useRef<InstancedMesh>(null);

  const { rackGeometry, rackMaterials, streakGeometry, streakMaterial, trayGeometry, trayMaterial } = useMemo(() => {
    const rackGeometry = new BoxGeometry(0.58, 2.2, 1.2);
    rackGeometry.translate(0, 1.1, 0);
    const side = new MeshStandardMaterial({ color: "#151a20", metalness: 0.75, roughness: 0.35 });
    const front = new MeshStandardMaterial({
      color: "#11161c",
      metalness: 0.6,
      roughness: 0.4,
      emissive: new Color("#5fe3ff"),
      emissiveIntensity: 0.25,
    });
    const streakGeometry = new BoxGeometry(0.03, 1, 0.03);
    streakGeometry.translate(0, 0.5, 0);
    const streakMaterial = new MeshBasicMaterial({
      color: "#ffffff",
      transparent: true,
      blending: AdditiveBlending,
      depthWrite: false,
      toneMapped: false,
    });
    const trayGeometry = new BoxGeometry(0.62, 0.08, 1);
    const trayMaterial = new MeshStandardMaterial({ color: "#7d8893", metalness: 0.8, roughness: 0.3 });
    return {
      rackGeometry,
      rackMaterials: [side, side, side, side, side, front],
      streakGeometry,
      streakMaterial,
      trayGeometry,
      trayMaterial,
    };
  }, []);

  const cables = useMemo(() => {
    const random = createRandom(9);
    return Array.from({ length: 6 }, (_, i) => {
      const rack = Math.floor(random() * RIG.count);
      const z = -rack * 0.62;
      const lane = (i - 2.5) * 0.06;
      const curve = new CatmullRomCurve3(
        [
          new Vector3(lane, 2.2, z),
          new Vector3(lane, 2.9, z + 0.2),
          new Vector3(lane, 3.05, z + 1.2),
          new Vector3(lane, 3.05, 1.6),
          new Vector3(lane * 2, 6, 3),
          new Vector3(lane * 8 + 4, 22, 10),
        ],
        false,
        "centripetal",
      );
      const material = createSignalMaterial({ intensity: 2.6, pulseSpacing: 0.12, pulseSpeed: 0.25 });
      material.uniforms.uOffset.value = random();
      return { geometry: new TubeGeometry(curve, 160, 0.025, 5, false), material, delay: i / 6 };
    });
  }, []);

  const dummy = useMemo(() => new Object3D(), []);
  const color = useMemo(() => new Color(), []);
  const hidden = useMemo(() => new Matrix4().makeScale(0, 0, 0), []);

  useLayoutEffect(() => {
    for (let i = 0; i < RIG.count; i += 1) {
      rackRef.current?.setMatrixAt(i, hidden);
      streakRef.current?.setMatrixAt(i, hidden);
      streakRef.current?.setColorAt(i, color.setRGB(0, 0, 0));
      trayRef.current?.setMatrixAt(i, hidden);
    }
  }, [color, hidden]);

  useFrame(({ clock }) => {
    const p = telecomScroll.progress;
    const fade = windowFade(p, [0.6, 0.76], 0.02);
    const group = groupRef.current;
    if (!group) return;
    group.visible = fade > 0.001;
    if (!group.visible) return;

    const racks = range(p, RIG.start, RIG.racksEnd);
    const trays = range(p, RIG.racksEnd - 0.01, RIG.traysEnd);
    const wires = range(p, RIG.traysEnd - 0.005, RIG.cablesEnd);

    const rackMesh = rackRef.current;
    const streakMesh = streakRef.current;
    const trayMesh = trayRef.current;
    if (!rackMesh || !streakMesh || !trayMesh) return;

    for (let i = 0; i < RIG.count; i += 1) {
      const start = (i / RIG.count) * 0.82;
      const local = clamp01((racks - start) / 0.12);
      const after = clamp01((racks - start - 0.12) / 0.1);
      const z = -i * 0.62;
      if (local <= 0) {
        rackMesh.setMatrixAt(i, hidden);
        streakMesh.setMatrixAt(i, hidden);
      } else {
        const height = (1 - easeInCubic(local)) * 40;
        dummy.position.set(0, height, z);
        dummy.rotation.set(0, Math.PI / 2, 0);
        dummy.scale.set(1, 1, 1);
        dummy.updateMatrix();
        rackMesh.setMatrixAt(i, dummy.matrix);
        const intensity = local < 1 ? 1 : 1 - after;
        if (intensity <= 0.001) {
          streakMesh.setMatrixAt(i, hidden);
        } else {
          dummy.position.set(0, height + 2.2, z);
          dummy.rotation.set(0, 0, 0);
          dummy.scale.set(1, 18 * (local < 1 ? 1 : 1 - after) + 0.01, 1);
          dummy.updateMatrix();
          streakMesh.setMatrixAt(i, dummy.matrix);
          streakMesh.setColorAt(i, color.setRGB(1.4 * intensity, 3.4 * intensity, 4.2 * intensity));
        }
      }

      const trayLocal = clamp01((trays - (1 - i / RIG.count) * 0.7) / 0.3);
      if (trayLocal <= 0) {
        trayMesh.setMatrixAt(i, hidden);
      } else {
        const e = easeOutExpo(trayLocal);
        dummy.position.set(0, 3 + (1 - e) * 2, z);
        dummy.rotation.set(0, 0, 0);
        dummy.scale.set(1, 1, 0.64 * e);
        dummy.updateMatrix();
        trayMesh.setMatrixAt(i, dummy.matrix);
      }
    }
    rackMesh.instanceMatrix.needsUpdate = true;
    streakMesh.instanceMatrix.needsUpdate = true;
    trayMesh.instanceMatrix.needsUpdate = true;
    if (streakMesh.instanceColor) streakMesh.instanceColor.needsUpdate = true;

    cables.forEach(({ material, delay }) => {
      material.uniforms.uTime.value = clock.elapsedTime;
      material.uniforms.uDraw.value = clamp01((wires - delay * 0.4) / 0.6);
      material.uniforms.uPulse.value = wires;
    });
    (rackMaterials[5] as MeshStandardMaterial).emissiveIntensity = 0.25 + wires * 0.9;
  });

  return (
    <group ref={groupRef} position={[RIG.x, RIG.y, RIG.z]} scale={RIG.scale} rotation-y={0.5}>
      <instancedMesh ref={rackRef} args={[rackGeometry, rackMaterials, RIG.count]} frustumCulled={false} />
      <instancedMesh ref={streakRef} args={[streakGeometry, streakMaterial, RIG.count]} frustumCulled={false} />
      <instancedMesh ref={trayRef} args={[trayGeometry, trayMaterial, RIG.count]} frustumCulled={false} />
      {cables.map(({ geometry, material }, i) => (
        <mesh key={i} geometry={geometry} material={material} frustumCulled={false} />
      ))}
    </group>
  );
};

const GALLERY: Array<{ kind: PanelKind; angle: number; z: number }> = [
  { kind: "otdr", angle: 0.5, z: build - 40 },
  { kind: "splice", angle: 2.6, z: build - 60 },
  { kind: "ports", angle: 4.2, z: build - 84 },
  { kind: "topology", angle: 5.6, z: build - 104 },
  { kind: "route", angle: 1.4, z: build - 126 },
  { kind: "rack", angle: 3.6, z: build - 148 },
];

export const BuildWorld = () => (
  <group>
    <WordGate word="BUILD" position={[0, 2, build]} part={MOMENTS.buildPart} visible={[0.49, 0.58]} />
    <Monolith
      index="01"
      title="Design & route"
      position={[7.5, 1, build - 72]}
      rotation={[0, facing([7.5, build - 72], [-2.5, build - 46]), 0]}
      visible={[0.565, 0.635]}
    />
    <Monolith
      index="02"
      title="Install & terminate"
      position={[-7.5, 0.6, build - 116]}
      rotation={[0, facing([-7.5, build - 116], [2.5, build - 92]), 0]}
      visible={[0.61, 0.68]}
    />
    <Monolith
      index="03"
      title="Test & certify"
      position={[0.5, 10, build - 164]}
      rotation={[-0.45, 0, 0]}
      visible={[0.655, 0.73]}
    />
    {GALLERY.map(({ kind, angle, z }, i) => (
      <FloatingPanel
        key={kind + z}
        kind={kind}
        width={9}
        position={[Math.cos(angle) * 20, Math.sin(angle) * 11, z]}
        rotation={[0, -Math.cos(angle) * 0.5, 0]}
        visible={[0.555 + i * 0.012, 0.7 + i * 0.006]}
        seed={10 + i}
      />
    ))}
    <AssemblyRig />
  </group>
);

/* -------------------------------------------------------------------------- */
/* DELIVER                                                                    */
/* -------------------------------------------------------------------------- */

const STANDARDS = ["EN 50600", "ISO/IEC 11801", "TIA-942", "EN 50174"];

const OutwardCards = () => {
  const groupRef = useRef<Group>(null);
  const cards = useMemo(() => {
    const random = createRandom(31);
    const kinds: PanelKind[] = ["otdr", "ports", "spec", "splice", "topology", "rack", "route", "otdr"];
    return kinds.map((kind, i) => {
      const angle = (i / kinds.length) * Math.PI * 2 + random() * 0.4;
      return { kind, angle, z: deliver - 30 - random() * 50, speed: 0.6 + random() * 0.6 };
    });
  }, []);
  const refs = useRef<Array<Group | null>>([]);

  useFrame(() => {
    const p = telecomScroll.progress;
    const burst = easeOutExpo(range(p, 0.79, 0.9));
    if (groupRef.current) groupRef.current.visible = p > 0.785 && p < 0.92;
    cards.forEach((card, i) => {
      const g = refs.current[i];
      if (!g) return;
      const radius = 6 + burst * 26 * card.speed;
      g.position.set(Math.cos(card.angle) * radius, 2 + Math.sin(card.angle) * radius * 0.6, card.z - burst * 20);
    });
  });

  return (
    <group ref={groupRef}>
      {cards.map((card, i) => (
        <group
          key={i}
          ref={(g) => {
            refs.current[i] = g;
          }}
        >
          <FloatingPanel
            kind={card.kind}
            width={6}
            position={[0, 0, 0]}
            rotation={[0, -Math.cos(card.angle) * 0.6, 0]}
            visible={[0.785, 0.92]}
            seed={20 + i}
          />
        </group>
      ))}
    </group>
  );
};

export const DeliverWorld = () => (
  <group>
    <WordGate word="DELIVER" position={[0, 2, deliver]} part={MOMENTS.deliverPart} visible={[0.725, 0.81]} size={11} />
    <MonumentText
      text="100%"
      size={6.5}
      position={[8.5, 2, deliver - 64]}
      rotation={[0, facing([8.5, deliver - 64], [-3, deliver - 42]), 0]}
      visible={[0.795, 0.86]}
    />
    <MonumentText
      text="400G"
      size={6.5}
      position={[-8.5, 3, deliver - 102]}
      rotation={[0, facing([-8.5, deliver - 102], [3, deliver - 80]), 0]}
      visible={[0.83, 0.89]}
    />
    {STANDARDS.map((text, i) => (
      <MonumentText
        key={text}
        text={text}
        size={1.6}
        position={[4.5, 3.4 - i * 2.4, deliver - 140 - i * 0.6]}
        rotation={[0, facing([4, deliver - 140], [0, deliver - 118]), 0]}
        visible={[0.86, 0.915]}
      />
    ))}
    <OutwardCards />
  </group>
);
