"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import {
  AdditiveBlending,
  BufferAttribute,
  BufferGeometry,
  CanvasTexture,
  Color,
  Group,
  MeshBasicMaterial,
  ShaderMaterial,
} from "three";
import { createRandom, easeInOutCubic, range } from "@/components/three/math";
import { MOMENTS, telecomScroll, WORLD } from "@/components/telecom/telecom-state";

const CORE_Y = 3;
const RING_RADIUS = 13;

/* -------------------------------------------------------------------------- */
/* Stars                                                                      */
/* -------------------------------------------------------------------------- */

const createStars = (count: number) => {
  const random = createRandom(21);
  const positions = new Float32Array(count * 3);
  const seeds = new Float32Array(count);
  for (let i = 0; i < count; i += 1) {
    let x = 0;
    let y = 0;
    do {
      x = (random() - 0.5) * 900;
      y = (random() - 0.5) * 560;
    } while (Math.abs(x) < 30 && Math.abs(y) < 20);
    positions.set([x, y, 120 - random() * 1500], i * 3);
    seeds[i] = random();
  }
  const geometry = new BufferGeometry();
  geometry.setAttribute("position", new BufferAttribute(positions, 3));
  geometry.setAttribute("aSeed", new BufferAttribute(seeds, 1));
  const material = new ShaderMaterial({
    transparent: true,
    depthWrite: false,
    blending: AdditiveBlending,
    toneMapped: false,
    uniforms: { uTime: { value: 0 }, uOpacity: { value: 0 }, uPixelRatio: { value: 1 } },
    vertexShader: /* glsl */ `
      attribute float aSeed;
      uniform float uTime;
      uniform float uPixelRatio;
      varying float vTwinkle;
      void main() {
        vec4 mv = modelViewMatrix * vec4(position, 1.0);
        vTwinkle = 0.55 + 0.45 * sin(uTime * (0.6 + aSeed * 2.0) + aSeed * 40.0);
        gl_PointSize = (1.0 + aSeed * 2.2) * uPixelRatio;
        gl_Position = projectionMatrix * mv;
      }
    `,
    fragmentShader: /* glsl */ `
      uniform float uOpacity;
      varying float vTwinkle;
      void main() {
        float d = length(gl_PointCoord - 0.5);
        float a = smoothstep(0.5, 0.0, d);
        gl_FragColor = vec4(vec3(0.85, 0.93, 1.0) * 1.4, a * vTwinkle * uOpacity);
      }
    `,
  });
  return { geometry, material };
};

/* -------------------------------------------------------------------------- */
/* Network constellation that converges into the Ø                            */
/* -------------------------------------------------------------------------- */

type Network = {
  nodes: { geometry: BufferGeometry; material: ShaderMaterial };
  edges: { geometry: BufferGeometry; material: ShaderMaterial };
  pulses: { geometry: BufferGeometry; material: ShaderMaterial };
};

const createNetwork = (count: number): Network => {
  const random = createRandom(77);
  const points: Array<[number, number, number]> = [];
  while (points.length < count) {
    const x = (random() - 0.5) * 150;
    const y = (random() - 0.5) * 80;
    if (Math.abs(x) < 9 && Math.abs(y) < 7) continue;
    const z = -230 - random() * 860;
    points.push([x, y, z]);
  }

  // Ø targets: most nodes join the ring, the rest form the slash.
  const targets = points.map((_, i) => {
    if (i % 6 === 0) {
      const t = (i / count) * 2 - 1;
      const s = t * RING_RADIUS * 1.25;
      return [s * 0.7071, CORE_Y + s * 0.7071, WORLD.core] as const;
    }
    const angle = i * 2.39996;
    return [
      Math.cos(angle) * RING_RADIUS,
      CORE_Y + Math.sin(angle) * RING_RADIUS,
      WORLD.core,
    ] as const;
  });

  const delays = points.map(() => random());

  // Nodes.
  const nodeGeometry = new BufferGeometry();
  nodeGeometry.setAttribute("position", new BufferAttribute(new Float32Array(points.flat()), 3));
  nodeGeometry.setAttribute("aTarget", new BufferAttribute(new Float32Array(targets.flatMap((t) => [...t])), 3));
  nodeGeometry.setAttribute("aDelay", new BufferAttribute(new Float32Array(delays), 1));

  const convergeChunk = /* glsl */ `
    float local = clamp((uConverge - aDelay * 0.35) / 0.65, 0.0, 1.0);
    local = local * local * (3.0 - 2.0 * local);
    vec3 p = mix(position, aTarget, local);
  `;

  const nodeMaterial = new ShaderMaterial({
    transparent: true,
    depthWrite: false,
    blending: AdditiveBlending,
    toneMapped: false,
    uniforms: {
      uTime: { value: 0 },
      uConverge: { value: 0 },
      uOpacity: { value: 0 },
      uPixelRatio: { value: 1 },
    },
    vertexShader: /* glsl */ `
      attribute vec3 aTarget;
      attribute float aDelay;
      uniform float uTime;
      uniform float uConverge;
      uniform float uPixelRatio;
      varying float vGlow;
      void main() {
        ${convergeChunk}
        vec4 mv = modelViewMatrix * vec4(p, 1.0);
        vGlow = 0.6 + 0.4 * sin(uTime * 1.5 + aDelay * 30.0);
        gl_PointSize = (4.0 + local * 3.0) * uPixelRatio * (120.0 / -mv.z);
        gl_PointSize = clamp(gl_PointSize, 1.5, 22.0);
        gl_Position = projectionMatrix * mv;
      }
    `,
    fragmentShader: /* glsl */ `
      uniform float uOpacity;
      varying float vGlow;
      void main() {
        float d = length(gl_PointCoord - 0.5);
        float core = smoothstep(0.5, 0.0, d);
        float a = core * core;
        gl_FragColor = vec4(vec3(0.6, 1.6, 2.0) * vGlow * 1.6, a * uOpacity);
      }
    `,
  });

  // Edges to the two nearest neighbours.
  const edgePairs: Array<[number, number]> = [];
  points.forEach((a, i) => {
    const nearest = points
      .map((b, j) => ({ j, d: (a[0] - b[0]) ** 2 + (a[1] - b[1]) ** 2 + (a[2] - b[2]) ** 2 }))
      .filter(({ j }) => j !== i)
      .sort((x, y) => x.d - y.d)
      .slice(0, 2);
    nearest.forEach(({ j }) => {
      if (!edgePairs.some(([p, q]) => (p === j && q === i) || (p === i && q === j))) {
        edgePairs.push([i, j]);
      }
    });
  });

  const edgePositions = new Float32Array(edgePairs.length * 6);
  const edgeTargets = new Float32Array(edgePairs.length * 6);
  const edgeDelays = new Float32Array(edgePairs.length * 2);
  edgePairs.forEach(([i, j], k) => {
    edgePositions.set([...points[i], ...points[j]], k * 6);
    edgeTargets.set([...targets[i], ...targets[j]], k * 6);
    edgeDelays[k * 2] = delays[i];
    edgeDelays[k * 2 + 1] = delays[j];
  });
  const edgeGeometry = new BufferGeometry();
  edgeGeometry.setAttribute("position", new BufferAttribute(edgePositions, 3));
  edgeGeometry.setAttribute("aTarget", new BufferAttribute(edgeTargets, 3));
  edgeGeometry.setAttribute("aDelay", new BufferAttribute(edgeDelays, 1));
  const edgeMaterial = new ShaderMaterial({
    transparent: true,
    depthWrite: false,
    blending: AdditiveBlending,
    toneMapped: false,
    uniforms: { uConverge: { value: 0 }, uOpacity: { value: 0 } },
    vertexShader: /* glsl */ `
      attribute vec3 aTarget;
      attribute float aDelay;
      uniform float uConverge;
      varying float vFade;
      void main() {
        ${convergeChunk}
        vFade = 1.0 - smoothstep(0.2, 0.7, uConverge);
        gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
      }
    `,
    fragmentShader: /* glsl */ `
      uniform float uOpacity;
      varying float vFade;
      void main() {
        gl_FragColor = vec4(vec3(0.35, 0.8, 1.0), 0.22 * uOpacity * vFade);
      }
    `,
  });

  // Pulses travelling along edges.
  const pulseCount = edgePairs.length;
  const pulseStart = new Float32Array(pulseCount * 3);
  const pulseEnd = new Float32Array(pulseCount * 3);
  const pulseSeed = new Float32Array(pulseCount);
  edgePairs.forEach(([i, j], k) => {
    const forward = random() > 0.5;
    pulseStart.set(points[forward ? i : j], k * 3);
    pulseEnd.set(points[forward ? j : i], k * 3);
    pulseSeed[k] = random();
  });
  const pulseGeometry = new BufferGeometry();
  pulseGeometry.setAttribute("position", new BufferAttribute(pulseStart, 3));
  pulseGeometry.setAttribute("aEnd", new BufferAttribute(pulseEnd, 3));
  pulseGeometry.setAttribute("aSeed", new BufferAttribute(pulseSeed, 1));
  const pulseMaterial = new ShaderMaterial({
    transparent: true,
    depthWrite: false,
    blending: AdditiveBlending,
    toneMapped: false,
    uniforms: {
      uTime: { value: 0 },
      uOpacity: { value: 0 },
      uSpeed: { value: 1 },
      uPixelRatio: { value: 1 },
    },
    vertexShader: /* glsl */ `
      attribute vec3 aEnd;
      attribute float aSeed;
      uniform float uTime;
      uniform float uSpeed;
      uniform float uPixelRatio;
      varying float vFade;
      void main() {
        float t = fract(uTime * (0.08 + aSeed * 0.14) * uSpeed + aSeed);
        vec3 p = mix(position, aEnd, t);
        vFade = sin(t * 3.14159);
        vec4 mv = modelViewMatrix * vec4(p, 1.0);
        gl_PointSize = clamp(6.0 * uPixelRatio * (110.0 / -mv.z), 1.0, 14.0);
        gl_Position = projectionMatrix * mv;
      }
    `,
    fragmentShader: /* glsl */ `
      uniform float uOpacity;
      varying float vFade;
      void main() {
        float d = length(gl_PointCoord - 0.5);
        float a = smoothstep(0.5, 0.0, d);
        gl_FragColor = vec4(vec3(2.5, 2.8, 3.0), a * a * vFade * uOpacity);
      }
    `,
  });

  return {
    nodes: { geometry: nodeGeometry, material: nodeMaterial },
    edges: { geometry: edgeGeometry, material: edgeMaterial },
    pulses: { geometry: pulseGeometry, material: pulseMaterial },
  };
};

/* -------------------------------------------------------------------------- */
/* The Ø — final convergence mark                                             */
/* -------------------------------------------------------------------------- */

const CoreMark = () => {
  const groupRef = useRef<Group>(null);
  const material = useMemo(
    () =>
      new MeshBasicMaterial({
        color: new Color(1, 1, 1),
        transparent: true,
        opacity: 0,
        toneMapped: false,
        depthWrite: false,
      }),
    [],
  );
  const halo = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = canvas.height = 256;
    const ctx = canvas.getContext("2d")!;
    const gradient = ctx.createRadialGradient(128, 128, 0, 128, 128, 128);
    gradient.addColorStop(0, "rgba(95,227,255,0.55)");
    gradient.addColorStop(0.4, "rgba(95,227,255,0.12)");
    gradient.addColorStop(1, "rgba(95,227,255,0)");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 256, 256);
    return new MeshBasicMaterial({
      map: new CanvasTexture(canvas),
      transparent: true,
      opacity: 0,
      blending: AdditiveBlending,
      depthWrite: false,
      toneMapped: false,
    });
  }, []);

  useFrame(({ clock }) => {
    const p = telecomScroll.progress;
    const reveal = easeInOutCubic(range(p, MOMENTS.converge[0] + 0.03, MOMENTS.converge[1]));
    material.opacity = reveal;
    material.color.setRGB(0.6 + reveal * 1.6, 1.6 + reveal * 1.2, 2 + reveal);
    halo.opacity = reveal * (0.45 + Math.sin(clock.elapsedTime * 1.4) * 0.1);
    if (groupRef.current) {
      groupRef.current.visible = reveal > 0.001;
      groupRef.current.rotation.z = (1 - reveal) * 0.6;
      groupRef.current.scale.setScalar(0.85 + reveal * 0.15);
    }
  });

  return (
    <group ref={groupRef} position={[0, CORE_Y, WORLD.core]}>
      <mesh material={material}>
        <torusGeometry args={[RING_RADIUS, 0.22, 16, 200]} />
      </mesh>
      <mesh material={material} rotation-z={-Math.PI / 4}>
        <boxGeometry args={[0.44, RING_RADIUS * 2.55, 0.44]} />
      </mesh>
      <mesh material={halo} position-z={-2}>
        <planeGeometry args={[RING_RADIUS * 5, RING_RADIUS * 5]} />
      </mesh>
    </group>
  );
};

/* -------------------------------------------------------------------------- */

export const SpaceBackdrop = ({
  starCount = 3200,
  nodeCount = 420,
}: {
  starCount?: number;
  nodeCount?: number;
}) => {
  const groupRef = useRef<Group>(null);
  const stars = useMemo(() => createStars(starCount), [starCount]);
  const network = useMemo(() => createNetwork(nodeCount), [nodeCount]);

  useFrame(({ clock, gl }) => {
    const p = telecomScroll.progress;
    const visible = p > MOMENTS.handover - 0.002;
    if (groupRef.current) groupRef.current.visible = visible;
    if (!visible) return;

    const t = clock.elapsedTime;
    const dpr = gl.getPixelRatio();
    const appear = range(p, MOMENTS.tunnelEnd - 0.02, MOMENTS.tunnelEnd + 0.03);
    const converge = easeInOutCubic(range(p, MOMENTS.converge[0], MOMENTS.converge[1]));
    const energy = 1 + range(p, 0.74, 0.88) * 1.4;

    stars.material.uniforms.uTime.value = t;
    stars.material.uniforms.uOpacity.value = appear;
    stars.material.uniforms.uPixelRatio.value = dpr;

    const { nodes, edges, pulses } = network;
    nodes.material.uniforms.uTime.value = t;
    nodes.material.uniforms.uConverge.value = converge;
    nodes.material.uniforms.uOpacity.value = appear;
    nodes.material.uniforms.uPixelRatio.value = dpr;
    edges.material.uniforms.uConverge.value = converge;
    edges.material.uniforms.uOpacity.value = appear;
    pulses.material.uniforms.uTime.value = t;
    pulses.material.uniforms.uSpeed.value = energy;
    pulses.material.uniforms.uOpacity.value = appear * (1 - converge);
    pulses.material.uniforms.uPixelRatio.value = dpr;
  });

  return (
    <group ref={groupRef}>
      <points geometry={stars.geometry} material={stars.material} frustumCulled={false} />
      <lineSegments geometry={network.edges.geometry} material={network.edges.material} frustumCulled={false} />
      <points geometry={network.pulses.geometry} material={network.pulses.material} frustumCulled={false} />
      <points geometry={network.nodes.geometry} material={network.nodes.material} frustumCulled={false} />
      <CoreMark />
    </group>
  );
};
