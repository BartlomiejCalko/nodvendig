"use client";

import { useEffect, useMemo, useRef } from "react";
import { useFrame, useLoader } from "@react-three/fiber";
import {
  AdditiveBlending,
  CanvasTexture,
  Color,
  EdgesGeometry,
  Group,
  IcosahedronGeometry,
  LineBasicMaterial,
  MeshBasicMaterial,
  MeshStandardMaterial,
  OctahedronGeometry,
  BoxGeometry,
  SRGBColorSpace,
} from "three";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader.js";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry.js";
import { createRandom, easeOutExpo, range } from "@/components/three/math";
import { useFontsReady } from "@/components/three/use-fonts-ready";
import { createPanelTexture, PANEL_ASPECT, type PanelKind } from "@/components/telecom/panel-textures";
import { telecomScroll } from "@/components/telecom/telecom-state";
import { FONT_URL } from "@/components/telecom/worlds/WordGate";

type Vec3 = [number, number, number];

/** Fade in/out factor for a progress window with soft edges. */
export const windowFade = (p: number, [start, end]: readonly [number, number], soft = 0.02) =>
  Math.min(range(p, start, start + soft), 1 - range(p, end - soft, end));

/* -------------------------------------------------------------------------- */
/* Floating technical panel                                                   */
/* -------------------------------------------------------------------------- */

type FloatingPanelProps = {
  kind: PanelKind;
  position: Vec3;
  rotation?: Vec3;
  width?: number;
  visible: readonly [number, number];
  seed?: number;
};

export const FloatingPanel = ({
  kind,
  position,
  rotation = [0, 0, 0],
  width = 14,
  visible,
  seed = 1,
}: FloatingPanelProps) => {
  const ready = useFontsReady();
  const groupRef = useRef<Group>(null);
  const texture = useMemo(() => (ready ? createPanelTexture(kind) : null), [kind, ready]);
  const material = useMemo(
    () =>
      new MeshBasicMaterial({
        transparent: true,
        opacity: 0,
        toneMapped: false,
        depthWrite: false,
        color: new Color(1.25, 1.25, 1.25),
      }),
    [],
  );
  const frame = useMemo(
    () => new LineBasicMaterial({ color: new Color(0.6, 1.6, 2), transparent: true, opacity: 0, toneMapped: false }),
    [],
  );
  const height = width / PANEL_ASPECT;
  const edges = useMemo(() => new EdgesGeometry(new BoxGeometry(width, height, 0.0001)), [width, height]);

  useEffect(() => {
    material.map = texture;
    material.needsUpdate = true;
    return () => texture?.dispose();
  }, [material, texture]);

  useFrame(({ clock }) => {
    const fade = windowFade(telecomScroll.progress, visible, 0.025);
    const group = groupRef.current;
    if (!group) return;
    group.visible = fade > 0.001 && texture !== null;
    if (!group.visible) return;
    const t = clock.elapsedTime + seed * 10;
    group.position.set(
      position[0],
      position[1] + Math.sin(t * 0.5) * 0.25 + (1 - easeOutExpo(fade)) * -2,
      position[2],
    );
    group.rotation.set(rotation[0] + Math.sin(t * 0.3) * 0.02, rotation[1] + Math.sin(t * 0.25) * 0.03, rotation[2]);
    material.opacity = fade * 0.95;
    frame.opacity = fade;
  });

  return (
    <group ref={groupRef} position={position}>
      <mesh material={material}>
        <planeGeometry args={[width, height]} />
      </mesh>
      <lineSegments geometry={edges} material={frame} />
    </group>
  );
};

/* -------------------------------------------------------------------------- */
/* Wireframe idea fragments                                                   */
/* -------------------------------------------------------------------------- */

export const WireFragments = ({
  center,
  count = 26,
  spread = [40, 22, 120] as Vec3,
  visible,
  seed = 3,
}: {
  center: Vec3;
  count?: number;
  spread?: Vec3;
  visible: readonly [number, number];
  seed?: number;
}) => {
  const groupRef = useRef<Group>(null);
  const items = useMemo(() => {
    const random = createRandom(seed);
    const geometries = [
      new EdgesGeometry(new IcosahedronGeometry(1, 0)),
      new EdgesGeometry(new OctahedronGeometry(1, 0)),
      new EdgesGeometry(new BoxGeometry(1.4, 1.4, 1.4)),
    ];
    return Array.from({ length: count }, () => {
      let x = 0;
      let y = 0;
      do {
        x = (random() - 0.5) * spread[0];
        y = (random() - 0.5) * spread[1];
      } while (Math.abs(x) < 4 && Math.abs(y) < 3);
      return {
        geometry: geometries[Math.floor(random() * geometries.length)],
        position: [center[0] + x, center[1] + y, center[2] - random() * spread[2]] as Vec3,
        scale: 0.4 + random() * 1.4,
        speed: (random() - 0.5) * 0.6,
      };
    });
  }, [center, count, spread, seed]);
  const material = useMemo(
    () => new LineBasicMaterial({ color: new Color(0.55, 1.1, 1.4), transparent: true, opacity: 0, toneMapped: false }),
    [],
  );
  const refs = useRef<Array<Group | null>>([]);

  useFrame(({ clock }) => {
    const fade = windowFade(telecomScroll.progress, visible, 0.03);
    if (groupRef.current) groupRef.current.visible = fade > 0.001;
    material.opacity = fade * 0.7;
    const t = clock.elapsedTime;
    items.forEach((item, i) => {
      const g = refs.current[i];
      if (!g) return;
      g.rotation.set(t * item.speed, t * item.speed * 0.7, 0);
    });
  });

  return (
    <group ref={groupRef}>
      {items.map((item, i) => (
        <group
          key={i}
          ref={(g) => {
            refs.current[i] = g;
          }}
          position={item.position}
          scale={item.scale}
        >
          <lineSegments geometry={item.geometry} material={material} />
        </group>
      ))}
    </group>
  );
};

/* -------------------------------------------------------------------------- */
/* Framework monolith                                                         */
/* -------------------------------------------------------------------------- */

const createMonolithTexture = (index: string, title: string, fonts: { sans: string; mono: string }) => {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 1280;
  const ctx = canvas.getContext("2d")!;
  const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
  gradient.addColorStop(0, "rgba(20,40,52,0.95)");
  gradient.addColorStop(1, "rgba(4,8,12,0.95)");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "rgba(160,235,255,0.95)";
  ctx.font = `600 260px ${fonts.sans}`;
  ctx.textBaseline = "top";
  ctx.fillText(index, 36, 40);
  ctx.fillStyle = "rgba(225,240,248,0.9)";
  ctx.font = `500 52px ${fonts.sans}`;
  // Wrap the title to the monolith face width.
  const lines: string[] = [];
  title.split(" ").forEach((word) => {
    const last = lines[lines.length - 1];
    if (last && ctx.measureText(`${last} ${word}`).width < 432) lines[lines.length - 1] = `${last} ${word}`;
    else lines.push(word);
  });
  lines.forEach((line, i) => ctx.fillText(line, 40, 1100 - (lines.length - 1 - i) * 64));
  ctx.strokeStyle = "rgba(160,235,255,0.35)";
  ctx.lineWidth = 2;
  for (let y = 360; y < 900; y += 36) {
    ctx.beginPath();
    ctx.moveTo(40, y);
    ctx.lineTo(472, y);
    ctx.stroke();
  }
  const texture = new CanvasTexture(canvas);
  texture.colorSpace = SRGBColorSpace;
  return texture;
};

export const Monolith = ({
  index,
  title,
  position,
  rotation = [0, 0, 0],
  visible,
}: {
  index: string;
  title: string;
  position: Vec3;
  rotation?: Vec3;
  visible: readonly [number, number];
}) => {
  const ready = useFontsReady();
  const groupRef = useRef<Group>(null);
  const size: Vec3 = [5.2, 13, 0.9];
  const face = useMemo(() => {
    if (!ready) return null;
    const style = getComputedStyle(document.documentElement);
    return createMonolithTexture(index, title, {
      sans: style.getPropertyValue("--font-geist-sans").trim() || "sans-serif",
      mono: style.getPropertyValue("--font-geist-mono").trim() || "monospace",
    });
  }, [index, title, ready]);
  const body = useMemo(
    () => new MeshStandardMaterial({ color: "#0a0e13", metalness: 0.9, roughness: 0.25 }),
    [],
  );
  const faceMaterial = useMemo(
    () => new MeshBasicMaterial({ transparent: true, toneMapped: false, color: new Color(1.3, 1.3, 1.3) }),
    [],
  );
  const edgeMaterial = useMemo(
    () => new LineBasicMaterial({ color: new Color(0.7, 1.9, 2.4), transparent: true, toneMapped: false }),
    [],
  );
  const edges = useMemo(() => new EdgesGeometry(new BoxGeometry(...size)), []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    faceMaterial.map = face;
    faceMaterial.needsUpdate = true;
    return () => face?.dispose();
  }, [face, faceMaterial]);

  useFrame(() => {
    const fade = windowFade(telecomScroll.progress, visible, 0.03);
    const group = groupRef.current;
    if (!group) return;
    group.visible = fade > 0.001;
    const e = easeOutExpo(fade);
    group.position.set(position[0], position[1] - (1 - e) * 8, position[2]);
    group.scale.set(1, 0.2 + e * 0.8, 1);
    faceMaterial.opacity = fade;
    edgeMaterial.opacity = fade;
  });

  return (
    <group ref={groupRef} position={position} rotation={rotation}>
      <mesh material={body}>
        <boxGeometry args={size} />
      </mesh>
      <mesh material={faceMaterial} position-z={size[2] / 2 + 0.01}>
        <planeGeometry args={[size[0] * 0.94, size[1] * 0.94]} />
      </mesh>
      <lineSegments geometry={edges} material={edgeMaterial} />
    </group>
  );
};

/* -------------------------------------------------------------------------- */
/* Monumental numbers                                                         */
/* -------------------------------------------------------------------------- */

export const MonumentText = ({
  text,
  position,
  rotation = [0, 0, 0],
  size = 6,
  visible,
}: {
  text: string;
  position: Vec3;
  rotation?: Vec3;
  size?: number;
  visible: readonly [number, number];
}) => {
  const font = useLoader(FontLoader, FONT_URL);
  const groupRef = useRef<Group>(null);
  const { geometry, edges } = useMemo(() => {
    const geometry = new TextGeometry(text, {
      font,
      size,
      depth: size * 0.25,
      curveSegments: 8,
      bevelEnabled: true,
      bevelThickness: size * 0.015,
      bevelSize: size * 0.01,
      bevelSegments: 2,
    });
    geometry.center();
    return { geometry, edges: new EdgesGeometry(geometry, 25) };
  }, [font, text, size]);

  const body = useMemo(
    () =>
      new MeshStandardMaterial({
        color: "#0b1117",
        metalness: 0.8,
        roughness: 0.3,
        emissive: new Color("#5fe3ff"),
        emissiveIntensity: 0.15,
      }),
    [],
  );
  const glow = useMemo(
    () => new LineBasicMaterial({ color: new Color(1.2, 2.6, 3.2), transparent: true, toneMapped: false, blending: AdditiveBlending }),
    [],
  );

  useFrame(({ clock }) => {
    const fade = windowFade(telecomScroll.progress, visible, 0.03);
    const group = groupRef.current;
    if (!group) return;
    group.visible = fade > 0.001;
    const e = easeOutExpo(fade);
    group.position.set(position[0], position[1], position[2] - (1 - e) * 30);
    glow.opacity = fade;
    body.emissiveIntensity = 0.15 + Math.sin(clock.elapsedTime * 2) * 0.05;
  });

  return (
    <group ref={groupRef} position={position} rotation={rotation}>
      <mesh geometry={geometry} material={body} />
      <lineSegments geometry={edges} material={glow} />
    </group>
  );
};
