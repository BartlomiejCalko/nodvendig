"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import {
  AdditiveBlending,
  BackSide,
  BufferAttribute,
  BufferGeometry,
  CatmullRomCurve3,
  Group,
  ShaderMaterial,
  TubeGeometry,
  Vector3,
} from "three";
import { createSignalMaterial } from "@/components/three/signal-material";
import { createRandom, range } from "@/components/three/math";
import { MOMENTS, telecomScroll, WORLD } from "@/components/telecom/telecom-state";

const RADIUS = 2.2;
const LENGTH = WORLD.tunnelLength;

/** Core/cladding boundary seen from inside the core. */
const createWallMaterial = () =>
  new ShaderMaterial({
    side: BackSide,
    transparent: true,
    depthWrite: false,
    toneMapped: false,
    uniforms: {
      uTime: { value: 0 },
      uOpacity: { value: 1 },
      uLength: { value: LENGTH },
    },
    vertexShader: /* glsl */ `
      varying vec2 vUv;
      varying float vZ;
      void main() {
        vUv = uv;
        vZ = position.y;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: /* glsl */ `
      uniform float uTime;
      uniform float uOpacity;
      uniform float uLength;
      varying vec2 vUv;
      varying float vZ;

      // 1.0 on integer values of x, fading to 0.0 within width.
      float line(float x, float width) {
        float d = abs(fract(x) - 0.5);
        return smoothstep(0.5 - width, 0.5, d);
      }

      void main() {
        float around = vUv.x * 48.0;
        float along = vZ;
        float lon = line(around, 0.03) * 0.35;
        float rings = line(along / 6.0 + uTime * 0.6, 0.02) * 0.55;
        float bands = smoothstep(0.85, 1.0, sin(along * 0.08 - uTime * 2.0) * 0.5 + 0.5) * 0.25;
        vec3 glass = mix(vec3(0.01, 0.03, 0.06), vec3(0.03, 0.12, 0.2), bands);
        vec3 color = glass + vec3(0.35, 0.85, 1.0) * (lon + rings);
        float mouth = smoothstep(uLength * 0.5 - 10.0, uLength * 0.5, abs(vZ));
        gl_FragColor = vec4(color * (1.0 + mouth * 2.0), uOpacity);
      }
    `,
  });

/** Light streaks rushing past — the feeling of travelling at c. */
const createStreaks = (count: number) => {
  const random = createRandom(11);
  const positions = new Float32Array(count * 2 * 3);
  const offsets = new Float32Array(count * 2);
  const tails = new Float32Array(count * 2);
  for (let i = 0; i < count; i += 1) {
    const angle = random() * Math.PI * 2;
    const radius = Math.sqrt(random()) * RADIUS * 0.92;
    const x = Math.cos(angle) * radius;
    const y = Math.sin(angle) * radius;
    const z = -random() * LENGTH;
    const length = 1.5 + random() * 6;
    positions.set([x, y, z, x, y, z - length], i * 6);
    offsets[i * 2] = offsets[i * 2 + 1] = random();
    tails[i * 2] = 0;
    tails[i * 2 + 1] = 1;
  }
  const geometry = new BufferGeometry();
  geometry.setAttribute("position", new BufferAttribute(positions, 3));
  geometry.setAttribute("aOffset", new BufferAttribute(offsets, 1));
  geometry.setAttribute("aTail", new BufferAttribute(tails, 1));

  const material = new ShaderMaterial({
    transparent: true,
    depthWrite: false,
    blending: AdditiveBlending,
    toneMapped: false,
    uniforms: {
      uTime: { value: 0 },
      uLength: { value: LENGTH },
      uOpacity: { value: 1 },
      uStretch: { value: 1 },
    },
    vertexShader: /* glsl */ `
      attribute float aOffset;
      attribute float aTail;
      uniform float uTime;
      uniform float uLength;
      uniform float uStretch;
      varying float vTail;
      void main() {
        vec3 p = position;
        p.z = -mod(-(p.z) - uTime * (14.0 + aOffset * 22.0), uLength);
        p.z -= aTail * (uStretch - 1.0) * 4.0;
        vTail = aTail;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
      }
    `,
    fragmentShader: /* glsl */ `
      uniform float uOpacity;
      varying float vTail;
      void main() {
        vec3 color = mix(vec3(2.6, 2.8, 3.0), vec3(0.2, 0.9, 1.4), vTail);
        gl_FragColor = vec4(color, (1.0 - vTail) * uOpacity);
      }
    `,
  });

  return { geometry, material };
};

/** Light rays bouncing between core walls (total internal reflection). */
const createRays = () => {
  const random = createRandom(5);
  return [0, 1, 2, 3].map((index) => {
    const points: Vector3[] = [];
    const angle = random() * Math.PI * 2;
    const step = 14 + random() * 10;
    let side = 1;
    for (let z = 0; z > -LENGTH; z -= step) {
      const r = RADIUS * 0.94 * side;
      points.push(new Vector3(Math.cos(angle) * r, Math.sin(angle) * r, z));
      side *= -1;
    }
    const curve = new CatmullRomCurve3(points, false, "catmullrom", 0.02);
    const material = createSignalMaterial({
      intensity: 1.6,
      pulseSpacing: 0.04,
      pulseSpeed: 0.02,
    });
    material.uniforms.uDraw.value = 1;
    material.uniforms.uPulse.value = 1;
    material.uniforms.uOffset.value = index * 0.25;
    return {
      geometry: new TubeGeometry(curve, points.length * 12, 0.012, 4, false),
      material,
    };
  });
};

/** The tunnel mouth: the core flares open into the Telecom universe. */
const createMouthMaterial = () =>
  new ShaderMaterial({
    side: BackSide,
    transparent: true,
    depthWrite: false,
    blending: AdditiveBlending,
    toneMapped: false,
    uniforms: { uOpacity: { value: 1 }, uTime: { value: 0 } },
    vertexShader: /* glsl */ `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: /* glsl */ `
      uniform float uOpacity;
      uniform float uTime;
      varying vec2 vUv;
      void main() {
        float lines = smoothstep(0.92, 1.0, abs(sin(vUv.x * 3.14159 * 64.0)));
        float fade = (1.0 - vUv.y);
        vec3 color = vec3(0.35, 0.85, 1.0) * (0.2 + lines * 1.4) * fade;
        gl_FragColor = vec4(color, uOpacity * fade);
      }
    `,
  });

export const FiberTunnel = ({ streakCount = 700 }: { streakCount?: number }) => {
  const groupRef = useRef<Group>(null);
  const wall = useMemo(() => createWallMaterial(), []);
  const streaks = useMemo(() => createStreaks(streakCount), [streakCount]);
  const rays = useMemo(() => createRays(), []);
  const mouth = useMemo(() => createMouthMaterial(), []);

  useFrame(({ clock }) => {
    const p = telecomScroll.progress;
    const visible = p > MOMENTS.handover - 0.002 && p < MOMENTS.tunnelEnd + 0.04;
    if (groupRef.current) groupRef.current.visible = visible;
    if (!visible) return;

    const t = clock.elapsedTime;
    const speed = Math.min(3, 1 + Math.abs(telecomScroll.velocity) * 2.5);
    const fadeOut = 1 - range(p, MOMENTS.tunnelEnd - 0.01, MOMENTS.tunnelEnd + 0.03);

    wall.uniforms.uTime.value = t;
    wall.uniforms.uOpacity.value = fadeOut;
    streaks.material.uniforms.uTime.value = t;
    streaks.material.uniforms.uStretch.value = speed;
    streaks.material.uniforms.uOpacity.value = fadeOut;
    rays.forEach(({ material }) => {
      material.uniforms.uTime.value = t;
      material.uniforms.uOpacity.value = fadeOut;
    });
    mouth.uniforms.uOpacity.value = fadeOut;
  });

  return (
    <group ref={groupRef}>
      {/* Cylinder is Y-aligned; rotate so it runs along -Z from 0 to -LENGTH. */}
      <mesh rotation-x={Math.PI / 2} position-z={-LENGTH / 2} material={wall}>
        <cylinderGeometry args={[RADIUS, RADIUS, LENGTH, 64, 1, true]} />
      </mesh>
      <lineSegments geometry={streaks.geometry} material={streaks.material} frustumCulled={false} />
      {rays.map(({ geometry, material }, i) => (
        <mesh key={i} geometry={geometry} material={material} />
      ))}
      <mesh rotation-x={-Math.PI / 2} position-z={-LENGTH - 6} material={mouth}>
        <cylinderGeometry args={[60, RADIUS, 12, 64, 1, true]} />
      </mesh>
    </group>
  );
};
