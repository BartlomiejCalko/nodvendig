"use client";

import { useMemo, useRef } from "react";
import { useFrame, useLoader } from "@react-three/fiber";
import {
  EdgesGeometry,
  Group,
  LineBasicMaterial,
  MeshStandardMaterial,
  type BufferGeometry,
} from "three";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader.js";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry.js";
import { easeInOutCubic, range } from "@/components/three/math";
import { telecomScroll } from "@/components/telecom/telecom-state";

export const FONT_URL = "/fonts/geist-bold.typeface.json";

type Letter = {
  geometry: BufferGeometry;
  edges: EdgesGeometry;
  x: number;
  width: number;
};

const useLetters = (word: string, size: number, depth: number) => {
  const font = useLoader(FontLoader, FONT_URL);

  return useMemo(() => {
    const tracking = size * 0.06;
    const letters: Letter[] = [];
    let cursor = 0;
    for (const char of word) {
      const geometry = new TextGeometry(char, {
        font,
        size,
        depth,
        curveSegments: 10,
        bevelEnabled: true,
        bevelThickness: size * 0.012,
        bevelSize: size * 0.008,
        bevelSegments: 2,
      });
      geometry.computeBoundingBox();
      const box = geometry.boundingBox!;
      const width = box.max.x - box.min.x;
      geometry.translate(-box.min.x - width / 2, -(box.max.y + box.min.y) / 2, -depth / 2);
      letters.push({ geometry, edges: new EdgesGeometry(geometry, 25), x: cursor + width / 2, width });
      cursor += width + tracking;
    }
    const total = cursor - tracking;
    letters.forEach((letter) => {
      letter.x -= total / 2;
    });
    return letters;
  }, [font, word, size, depth]);
};

type WordGateProps = {
  word: string;
  position: [number, number, number];
  /** Scroll progress range during which the letters part like a gate. */
  part: readonly [number, number];
  /** Scroll progress range during which the word is visible at all. */
  visible: readonly [number, number];
  size?: number;
};

/**
 * Giant architectural chapter word. As the camera reaches it, the letters
 * split apart and rotate outward so the camera travels through the word.
 */
export const WordGate = ({ word, position, part, visible, size = 13 }: WordGateProps) => {
  const letters = useLetters(word, size, size * 0.32);
  const groupRef = useRef<Group>(null);
  const letterRefs = useRef<Array<Group | null>>([]);

  const body = useMemo(
    () =>
      new MeshStandardMaterial({
        color: "#0b0f15",
        metalness: 0.85,
        roughness: 0.28,
        emissive: "#0a1a24",
        emissiveIntensity: 0.6,
      }),
    [],
  );
  const edge = useMemo(
    () =>
      new LineBasicMaterial({
        color: "#9feaff",
        transparent: true,
        opacity: 0.85,
        toneMapped: false,
      }),
    [],
  );

  useFrame(({ clock }) => {
    const p = telecomScroll.progress;
    const shown = p > visible[0] && p < visible[1];
    if (groupRef.current) groupRef.current.visible = shown;
    if (!shown) return;

    const fadeIn = range(p, visible[0], visible[0] + 0.02);
    const split = easeInOutCubic(range(p, part[0], part[1]));
    const shimmer = 0.7 + Math.sin(clock.elapsedTime * 1.3) * 0.15;
    edge.opacity = fadeIn * shimmer;
    edge.color.setRGB(0.62 * (1 + split), 0.92 * (1 + split), 1.0 * (1 + split));

    letters.forEach((letter, i) => {
      const group = letterRefs.current[i];
      if (!group) return;
      const side = letter.x === 0 ? (i % 2 === 0 ? -1 : 1) : Math.sign(letter.x);
      const spread = split * (size * 2.4 + Math.abs(letter.x) * 0.9);
      group.position.set(letter.x + side * spread, split * (i % 2 === 0 ? 1 : -1) * size * 0.25, split * size * 0.6);
      group.rotation.set(0, side * split * 0.9, side * split * 0.12);
    });
  });

  return (
    <group ref={groupRef} position={position}>
      {letters.map((letter, i) => (
        <group
          key={`${letter.x}-${i}`}
          ref={(g) => {
            letterRefs.current[i] = g;
          }}
          position={[letter.x, 0, 0]}
        >
          <mesh geometry={letter.geometry} material={body} />
          <lineSegments geometry={letter.edges} material={edge} />
        </group>
      ))}
    </group>
  );
};
