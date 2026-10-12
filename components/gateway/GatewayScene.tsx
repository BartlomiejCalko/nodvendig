"use client";

import { useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Bloom, EffectComposer, Vignette } from "@react-three/postprocessing";
import {
  AdditiveBlending,
  BoxGeometry,
  BufferAttribute,
  BufferGeometry,
  CanvasTexture,
  Color,
  DoubleSide,
  InstancedMesh,
  LineSegments,
  Matrix4,
  MeshBasicMaterial,
  MeshStandardMaterial,
  Object3D,
  PerspectiveCamera,
  ShaderMaterial,
  SRGBColorSpace,
  TubeGeometry,
  Vector3,
} from "three";
import { mergeGeometries } from "three/examples/jsm/utils/BufferGeometryUtils.js";
import { createSignalMaterial } from "@/components/three/signal-material";
import { createTextTexture } from "@/components/three/text-texture";
import { useFontsReady } from "@/components/three/use-fonts-ready";
import {
  clamp01,
  damp,
  easeInCubic,
  easeOutExpo,
  lerp,
} from "@/components/three/math";
import { gatewayState } from "@/components/gateway/gateway-state";
import {
  buildCableRuns,
  buildPlanBuffers,
  buildWallFrame,
  HALL,
  labels,
  RACK,
  racks,
  traySegments,
} from "@/components/gateway/plan";

const BACKGROUND = "#06080b";

/* -------------------------------------------------------------------------- */
/* Floor grid                                                                 */
/* -------------------------------------------------------------------------- */

const FloorGrid = () => {
  const material = useMemo(
    () =>
      new ShaderMaterial({
        transparent: true,
        depthWrite: false,
        uniforms: { uOpacity: { value: 0 } },
        vertexShader: /* glsl */ `
          varying vec2 vWorld;
          void main() {
            vec4 world = modelMatrix * vec4(position, 1.0);
            vWorld = world.xz;
            gl_Position = projectionMatrix * viewMatrix * world;
          }
        `,
        fragmentShader: /* glsl */ `
          uniform float uOpacity;
          varying vec2 vWorld;
          float gridLine(vec2 p, float size) {
            vec2 g = abs(fract(p / size - 0.5) - 0.5) / fwidth(p / size);
            return 1.0 - min(min(g.x, g.y), 1.0);
          }
          void main() {
            float minor = gridLine(vWorld, 1.2) * 0.07;
            float major = gridLine(vWorld, 6.0) * 0.16;
            float fade = 1.0 - smoothstep(30.0, 70.0, length(vWorld));
            float a = max(minor, major) * fade * uOpacity;
            gl_FragColor = vec4(vec3(0.55, 0.65, 0.75), a);
          }
        `,
      }),
    [],
  );

  useFrame(() => {
    material.uniforms.uOpacity.value = gatewayState.grid;
  });

  return (
    <mesh rotation-x={-Math.PI / 2} material={material}>
      <planeGeometry args={[220, 220]} />
    </mesh>
  );
};

/* -------------------------------------------------------------------------- */
/* CAD plan lines (progressively drawn)                                       */
/* -------------------------------------------------------------------------- */

const PlanLines = () => {
  const { geometry, material } = useMemo(() => {
    const buffers = buildPlanBuffers();
    const geometry = new BufferGeometry();
    geometry.setAttribute("position", new BufferAttribute(buffers.position, 3));
    geometry.setAttribute("color", new BufferAttribute(buffers.color, 3));
    geometry.setAttribute("aStart", new BufferAttribute(buffers.start, 1));
    geometry.setAttribute("aDuration", new BufferAttribute(buffers.duration, 1));
    geometry.setAttribute("aEnd", new BufferAttribute(buffers.end, 1));
    geometry.setAttribute("aLayer", new BufferAttribute(buffers.layer, 1));

    const material = new ShaderMaterial({
      transparent: true,
      depthWrite: false,
      toneMapped: false,
      uniforms: {
        uDraw: { value: 0 },
        uFade: { value: 0 },
        uWarm: { value: 0 },
        uCool: { value: 0 },
      },
      vertexShader: /* glsl */ `
        attribute vec3 color;
        attribute float aStart;
        attribute float aDuration;
        attribute float aEnd;
        attribute float aLayer;
        uniform float uDraw;
        varying vec3 vColor;
        varying float vEnd;
        varying float vLocal;
        varying float vLayer;
        void main() {
          vColor = color;
          vEnd = aEnd;
          vLayer = aLayer;
          vLocal = clamp((uDraw - aStart) / aDuration, 0.0, 1.0);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: /* glsl */ `
        uniform float uFade;
        uniform float uWarm;
        uniform float uCool;
        varying vec3 vColor;
        varying float vEnd;
        varying float vLocal;
        varying float vLayer;
        void main() {
          if (vLocal <= 0.0 || vEnd > vLocal) discard;
          float head = (1.0 - step(1.0, vLocal)) * smoothstep(vLocal - 0.12, vLocal, vEnd);
          vec3 color = mix(vColor, vec3(1.0), head * 0.8) * (1.0 + head * 1.5);
          float structural = step(0.5, vLayer) * step(vLayer, 2.5);
          color = mix(color, vec3(1.0, 0.42, 0.28) * 1.6, uWarm * structural);
          float fade = mix(1.0, 0.28, uFade);
          fade *= mix(1.0, 0.35, uCool * structural);
          gl_FragColor = vec4(color, fade);
        }
      `,
    });

    return { geometry, material };
  }, []);

  useFrame((_, delta) => {
    const u = material.uniforms;
    u.uDraw.value = gatewayState.draw;
    u.uFade.value = gatewayState.planFade;
    u.uWarm.value = damp(u.uWarm.value, gatewayState.hover === "construction" ? 1 : 0, 6, delta);
    u.uCool.value = damp(u.uCool.value, gatewayState.hover === "telecom" ? 1 : 0, 6, delta);
  });

  return <lineSegments geometry={geometry} material={material} />;
};

/* -------------------------------------------------------------------------- */
/* Plan labels                                                                */
/* -------------------------------------------------------------------------- */

const PlanLabels = () => {
  const ready = useFontsReady();
  const items = useMemo(() => {
    if (!ready) return [];
    return labels.map((label) => ({
      label,
      ...createTextTexture(label.text, {
        fontSize: 96,
        mono: label.mono,
        color: label.color ?? "#ffffff",
        fontWeight: label.mono ? 500 : 600,
        letterSpacing: label.mono ? 0.04 : 0.02,
      }),
    }));
  }, [ready]);

  const materials = useRef<Array<{ opacity: number } | null>>([]);

  useEffect(
    () => () => items.forEach((item) => item.texture.dispose()),
    [items],
  );

  useFrame(() => {
    const opacity = gatewayState.labels * lerp(1, 0.35, gatewayState.planFade);
    materials.current.forEach((m) => {
      if (m) m.opacity = opacity;
    });
  });

  return (
    <group>
      {items.map(({ label, texture, aspect }, i) => (
        <mesh
          key={`${label.text}-${i}`}
          position={[label.x, 0.03, label.z]}
          rotation={[-Math.PI / 2, 0, label.rotation ?? 0]}
        >
          <planeGeometry args={[label.size * aspect * 0.77, label.size * 0.77]} />
          <meshBasicMaterial
            ref={(m) => {
              materials.current[i] = m;
            }}
            map={texture}
            transparent
            opacity={0}
            depthWrite={false}
            toneMapped={false}
          />
        </mesh>
      ))}
    </group>
  );
};

/* -------------------------------------------------------------------------- */
/* Wall frame — the plan rises into 3D                                        */
/* -------------------------------------------------------------------------- */

const WallFrame = () => {
  const groupRef = useRef<LineSegments>(null);
  const { geometry, material } = useMemo(() => {
    const geometry = new BufferGeometry();
    geometry.setAttribute("position", new BufferAttribute(buildWallFrame(), 3));
    const material = new ShaderMaterial({
      transparent: true,
      depthWrite: false,
      toneMapped: false,
      uniforms: {
        uOpacity: { value: 0 },
        uColor: { value: new Color("#cfd8e0") },
        uHeight: { value: HALL.height },
      },
      vertexShader: /* glsl */ `
        varying float vY;
        void main() {
          vY = position.y;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: /* glsl */ `
        uniform float uOpacity;
        uniform vec3 uColor;
        uniform float uHeight;
        varying float vY;
        void main() {
          float t = vY / uHeight;
          gl_FragColor = vec4(uColor * (0.7 + t * 0.6), uOpacity * (0.35 + t * 0.65));
        }
      `,
    });
    return { geometry, material };
  }, []);

  const warm = useMemo(() => new Color("#ff6747").multiplyScalar(2.2), []);
  const cool = useMemo(() => new Color("#cfd8e0"), []);
  const mix = useRef(0);

  useFrame((_, delta) => {
    const extrude = easeOutExpo(gatewayState.extrude);
    if (groupRef.current) {
      groupRef.current.scale.y = Math.max(0.0001, extrude);
      groupRef.current.visible = extrude > 0.001;
    }
    mix.current = damp(mix.current, gatewayState.hover === "construction" ? 1 : 0, 6, delta);
    const dim = gatewayState.hover === "telecom" ? 0.45 : 1;
    material.uniforms.uOpacity.value = damp(
      material.uniforms.uOpacity.value,
      clamp01(gatewayState.extrude * 1.5) * 0.55 * dim * (1 + mix.current),
      8,
      delta,
    );
    material.uniforms.uColor.value.copy(cool).lerp(warm, mix.current);
  });

  return <lineSegments ref={groupRef} geometry={geometry} material={material} />;
};

/* -------------------------------------------------------------------------- */
/* Racks — dropped in at the speed of light                                   */
/* -------------------------------------------------------------------------- */

const createRackTextures = () => {
  const w = 64;
  const h = 256;
  const base = document.createElement("canvas");
  const glow = document.createElement("canvas");
  base.width = glow.width = w;
  base.height = glow.height = h;
  const b = base.getContext("2d")!;
  const g = glow.getContext("2d")!;

  b.fillStyle = "#1a1e24";
  b.fillRect(0, 0, w, h);
  b.fillStyle = "#0d1014";
  for (let y = 10; y < h - 10; y += 4) {
    for (let x = 8; x < w - 8; x += 4) {
      b.fillRect(x, y, 2, 2);
    }
  }
  b.strokeStyle = "#2c323a";
  b.lineWidth = 3;
  b.strokeRect(2, 2, w - 4, h - 4);

  g.fillStyle = "#000";
  g.fillRect(0, 0, w, h);
  for (let y = 18; y < h - 16; y += 11) {
    const on = Math.random() > 0.25;
    g.fillStyle = on ? (Math.random() > 0.85 ? "#ffb35c" : "#5fe3ff") : "#000";
    g.fillRect(10, y, 3, 2);
    if (Math.random() > 0.5) {
      g.fillStyle = "#5fe3ff";
      g.fillRect(16, y, 2, 2);
    }
  }

  const map = new CanvasTexture(base);
  const emissiveMap = new CanvasTexture(glow);
  map.colorSpace = SRGBColorSpace;
  emissiveMap.colorSpace = SRGBColorSpace;
  return { map, emissiveMap };
};

const Racks = () => {
  const rackRef = useRef<InstancedMesh>(null);
  const streakRef = useRef<InstancedMesh>(null);
  const settled = useRef(false);

  const { geometry, materials, streakGeometry, streakMaterial } = useMemo(() => {
    const { map, emissiveMap } = createRackTextures();
    const side = new MeshStandardMaterial({ color: "#1b1f25", metalness: 0.6, roughness: 0.45 });
    const top = new MeshStandardMaterial({ color: "#242a31", metalness: 0.5, roughness: 0.5 });
    const front = new MeshStandardMaterial({
      map,
      emissiveMap,
      emissive: new Color("#ffffff"),
      emissiveIntensity: 2.2,
      metalness: 0.4,
      roughness: 0.5,
    });
    const back = new MeshStandardMaterial({ map, metalness: 0.4, roughness: 0.6 });
    const geometry = new BoxGeometry(RACK.width * 0.96, RACK.height, RACK.depth);
    geometry.translate(0, RACK.height / 2, 0);

    const streakGeometry = new BoxGeometry(0.05, 1, 0.05);
    streakGeometry.translate(0, 0.5, 0);
    // Additive, so a black instance colour means "invisible".
    const streakMaterial = new MeshBasicMaterial({
      color: "#ffffff",
      toneMapped: false,
      transparent: true,
      blending: AdditiveBlending,
      depthWrite: false,
    });

    return {
      geometry,
      // BoxGeometry face order: +x, -x, +y, -y, +z, -z
      materials: [side, side, top, top, front, back],
      streakGeometry,
      streakMaterial,
    };
  }, []);

  const dummy = useMemo(() => new Object3D(), []);
  const color = useMemo(() => new Color(), []);
  const hidden = useMemo(() => new Matrix4().makeScale(0, 0, 0), []);

  useEffect(() => {
    const mesh = rackRef.current;
    const streaks = streakRef.current;
    if (!mesh || !streaks) return;
    racks.forEach((_, i) => {
      mesh.setMatrixAt(i, hidden);
      streaks.setMatrixAt(i, hidden);
      streaks.setColorAt(i, color.setRGB(0, 0, 0));
    });
    mesh.instanceMatrix.needsUpdate = true;
  }, [color, hidden]);

  useFrame((_, delta) => {
    const mesh = rackRef.current;
    const streaks = streakRef.current;
    if (!mesh || !streaks) return;

    const front = materials[4];
    const ledTarget =
      gatewayState.hover === "construction" ? 0.6 : gatewayState.hover === "telecom" ? 3.4 : 2.2;
    front.emissiveIntensity = damp(front.emissiveIntensity, ledTarget, 6, delta);

    const progress = gatewayState.racks;
    if (settled.current && progress >= 1) return;

    const span = 0.07;
    racks.forEach((rack, i) => {
      const start = rack.delay * (1 - span - 0.06);
      const local = clamp01((progress - start) / span);
      const after = clamp01((progress - start - span) / 0.06);

      if (local <= 0) {
        mesh.setMatrixAt(i, hidden);
        streaks.setMatrixAt(i, hidden);
        return;
      }

      const height = (1 - easeInCubic(local)) * 34;
      dummy.position.set(rack.x, height, rack.z);
      dummy.rotation.set(0, rack.facing === 1 ? 0 : Math.PI, 0);
      dummy.scale.set(1, 1, 1);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);

      const intensity = local < 1 ? 1 : 1 - after;
      if (intensity <= 0.001) {
        streaks.setMatrixAt(i, hidden);
      } else {
        const trail = local < 1 ? 14 : 14 * (1 - after);
        dummy.position.set(rack.x, height + RACK.height, rack.z);
        dummy.rotation.set(0, 0, 0);
        dummy.scale.set(1, Math.max(0.01, trail), 1);
        dummy.updateMatrix();
        streaks.setMatrixAt(i, dummy.matrix);
        streaks.setColorAt(i, color.setRGB(1.2 * intensity, 3.2 * intensity, 4 * intensity));
      }
    });

    mesh.instanceMatrix.needsUpdate = true;
    streaks.instanceMatrix.needsUpdate = true;
    if (streaks.instanceColor) streaks.instanceColor.needsUpdate = true;
    settled.current = progress >= 1;
  });

  return (
    <>
      <instancedMesh
        ref={rackRef}
        args={[geometry, materials, racks.length]}
        frustumCulled={false}
      />
      <instancedMesh
        ref={streakRef}
        args={[streakGeometry, streakMaterial, racks.length]}
        frustumCulled={false}
      />
    </>
  );
};

/* -------------------------------------------------------------------------- */
/* Cable trays                                                                */
/* -------------------------------------------------------------------------- */

const Trays = () => {
  const ref = useRef<InstancedMesh>(null);
  const settled = useRef(false);
  const { geometry, material } = useMemo(() => {
    const parts: BufferGeometry[] = [];
    const railA = new BoxGeometry(1, 0.1, 0.03);
    railA.translate(0, 0.05, 0.3);
    const railB = railA.clone();
    railB.translate(0, 0, -0.6);
    parts.push(railA, railB);
    for (let i = 0; i < 5; i += 1) {
      const rung = new BoxGeometry(0.03, 0.02, 0.6);
      rung.translate(-0.5 + 0.1 + i * 0.2, 0.01, 0);
      parts.push(rung);
    }
    const geometry = mergeGeometries(parts)!;
    const material = new MeshStandardMaterial({
      color: "#8f99a4",
      metalness: 0.75,
      roughness: 0.35,
      emissive: new Color("#ffd166"),
      emissiveIntensity: 0,
    });
    return { geometry, material };
  }, []);

  const dummy = useMemo(() => new Object3D(), []);
  const hidden = useMemo(() => new Matrix4().makeScale(0, 0, 0), []);

  useFrame((_, delta) => {
    const mesh = ref.current;
    if (!mesh) return;
    material.emissiveIntensity = damp(
      material.emissiveIntensity,
      gatewayState.hover === "construction" ? 0.5 : 0,
      6,
      delta,
    );
    const progress = gatewayState.trays;
    if (settled.current && progress >= 1) return;

    traySegments.forEach((segment, i) => {
      const local = clamp01((progress - segment.delay * 0.75) / 0.18);
      if (local <= 0) {
        mesh.setMatrixAt(i, hidden);
        return;
      }
      const e = easeOutExpo(local);
      dummy.position.set(segment.x, segment.y + (1 - e) * 3, segment.z);
      dummy.rotation.set(0, segment.rotation, 0);
      dummy.scale.set(segment.length * e, 1, 1);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
    });
    mesh.instanceMatrix.needsUpdate = true;
    settled.current = progress >= 1;
  });

  return (
    <instancedMesh
      ref={ref}
      args={[geometry, material, traySegments.length]}
      frustumCulled={false}
    />
  );
};

/* -------------------------------------------------------------------------- */
/* Fibre runs with light pulses                                               */
/* -------------------------------------------------------------------------- */

const Cables = () => {
  const cables = useMemo(
    () =>
      buildCableRuns().map((run) => {
        const material = createSignalMaterial({ pulseSpacing: 0.14, pulseSpeed: 0.32 });
        material.uniforms.uOffset.value = run.offset;
        return {
          ...run,
          geometry: new TubeGeometry(run.curve, 260, 0.028, 5, false),
          material,
        };
      }),
    [],
  );
  const boost = useRef(1);

  useFrame(({ clock }, delta) => {
    const hover = gatewayState.hover;
    boost.current = damp(
      boost.current,
      hover === "telecom" ? 2.2 : hover === "construction" ? 0.3 : 1,
      6,
      delta,
    );
    cables.forEach(({ material, delay }) => {
      const u = material.uniforms;
      u.uTime.value = clock.elapsedTime * (hover === "telecom" ? 1.8 : 1);
      u.uDraw.value = clamp01((gatewayState.cables - delay * 0.55) / 0.42);
      u.uPulse.value = gatewayState.pulses;
      u.uIntensity.value = 2.2 * boost.current;
    });
  });

  return (
    <group>
      {cables.map(({ geometry, material }, i) => (
        <mesh key={i} geometry={geometry} material={material} frustumCulled={false} />
      ))}
    </group>
  );
};

/* -------------------------------------------------------------------------- */
/* Solid floor slab                                                            */
/* -------------------------------------------------------------------------- */

const Slab = () => {
  const ref = useRef<MeshStandardMaterial>(null);
  useFrame(() => {
    if (ref.current) ref.current.opacity = clamp01(gatewayState.extrude) * 0.9;
  });
  return (
    <mesh rotation-x={-Math.PI / 2} position-y={-0.01}>
      <planeGeometry args={[HALL.width, HALL.depth]} />
      <meshStandardMaterial
        ref={ref}
        color="#0d1116"
        metalness={0.2}
        roughness={0.85}
        transparent
        opacity={0}
        side={DoubleSide}
        depthWrite={false}
      />
    </mesh>
  );
};

/* -------------------------------------------------------------------------- */
/* Camera                                                                     */
/* -------------------------------------------------------------------------- */

type Pose = {
  target: [number, number, number];
  /** Radius 0 means "fit the whole plan in view". */
  radius: number;
  polar: number;
  azimuth: number;
  fov: number;
};

const POSES: Pose[] = [
  { target: [0, 0, 0], radius: 0, polar: 0.002, azimuth: 0, fov: 24 },
  { target: [0, 0, 0], radius: 66, polar: 0.92, azimuth: -0.62, fov: 34 },
  { target: [-3, 0.5, 0], radius: 44, polar: 1.06, azimuth: -0.22, fov: 40 },
  { target: [13, 1.6, 0], radius: 27, polar: 1.15, azimuth: 0.55, fov: 44 },
  { target: [1, -2.6, 4.5], radius: 66, polar: 0.98, azimuth: -0.42, fov: 32 },
];

const EXIT_POSES: Record<"construction" | "telecom", Pose> = {
  construction: { target: [0, 0, 0], radius: 0, polar: 0.002, azimuth: 0, fov: 30 },
  telecom: { target: [22.4, 2.2, 0], radius: 1.2, polar: 1.3, azimuth: 1.2, fov: 70 },
};

const CameraRig = () => {
  const camera = useThree((s) => s.camera) as PerspectiveCamera;
  const size = useThree((s) => s.size);
  const target = useMemo(() => new Vector3(), []);
  const position = useMemo(() => new Vector3(), []);
  const pose = useMemo<Pose>(() => ({ ...POSES[0] }), []);

  useFrame(({ clock }) => {
    const aspect = size.width / Math.max(1, size.height);
    const portrait = aspect < 1;
    const fit = Math.max(
      40 / (2 * Math.tan((POSES[0].fov * Math.PI) / 360)),
      64 / (2 * Math.tan((POSES[0].fov * Math.PI) / 360) * aspect),
    );
    const mobileScale = portrait ? 1 + (1 - aspect) * 1.6 : 1;

    const value = Math.min(POSES.length - 1, Math.max(0, gatewayState.camera));
    const index = Math.min(POSES.length - 2, Math.floor(value));
    const t = value - index;
    const a = POSES[index];
    const b = POSES[index + 1];
    const radiusA = index === 0 ? fit : a.radius * mobileScale;
    const radiusB = b.radius * mobileScale;

    pose.radius = lerp(radiusA, radiusB, t);
    pose.polar = lerp(a.polar, b.polar, t);
    pose.azimuth = lerp(a.azimuth, b.azimuth, t);
    pose.fov = lerp(a.fov, b.fov, t);
    pose.target = [
      lerp(a.target[0], b.target[0], t),
      lerp(a.target[1], b.target[1], t),
      lerp(a.target[2], b.target[2], t),
    ];

    // Gentle idle orbit once the hero composition is reached.
    pose.azimuth += Math.sin(clock.elapsedTime * 0.07) * 0.22 * gatewayState.outro;
    // Slow push during the drawing so the plan never feels static.
    if (index === 0) pose.radius *= lerp(1.04, 1, clamp01(gatewayState.draw));

    if (gatewayState.exitTo && gatewayState.exit > 0) {
      const exitPose = EXIT_POSES[gatewayState.exitTo];
      const e = gatewayState.exit;
      pose.radius = lerp(pose.radius, exitPose.radius || fit, e);
      pose.polar = lerp(pose.polar, exitPose.polar, e);
      pose.azimuth = lerp(pose.azimuth, exitPose.azimuth, e);
      pose.fov = lerp(pose.fov, exitPose.fov, e);
      pose.target = [
        lerp(pose.target[0], exitPose.target[0], e),
        lerp(pose.target[1], exitPose.target[1], e),
        lerp(pose.target[2], exitPose.target[2], e),
      ];
    }

    target.set(...pose.target);
    position.setFromSphericalCoords(pose.radius, pose.polar, pose.azimuth).add(target);
    camera.position.copy(position);
    camera.lookAt(target);
    if (Math.abs(camera.fov - pose.fov) > 0.001) {
      camera.fov = pose.fov;
      camera.updateProjectionMatrix();
    }
  });

  return null;
};

/* -------------------------------------------------------------------------- */
/* Canvas                                                                     */
/* -------------------------------------------------------------------------- */

const Lights = () => (
  <>
    <ambientLight intensity={0.35} />
    <hemisphereLight args={["#bcd7ff", "#0a0c10", 0.6]} />
    <directionalLight position={[-20, 40, 25]} intensity={1.6} color="#eaf2ff" />
    <directionalLight position={[30, 18, -20]} intensity={0.8} color="#5fe3ff" />
  </>
);

export default function GatewayScene() {
  return (
    <Canvas
      dpr={[1, 1.75]}
      gl={{ antialias: true, powerPreference: "high-performance" }}
      camera={{ fov: 24, near: 0.05, far: 600, position: [0, 90, 0.2] }}
      onCreated={({ scene }) => {
        scene.background = new Color(BACKGROUND);
      }}
    >
      <fog attach="fog" args={[BACKGROUND, 90, 220]} />
      <Lights />
      <CameraRig />
      <FloorGrid />
      <Slab />
      <PlanLines />
      <PlanLabels />
      <WallFrame />
      <Racks />
      <Trays />
      <Cables />
      <EffectComposer multisampling={0}>
        <Bloom
          mipmapBlur
          intensity={1.15}
          luminanceThreshold={0.62}
          luminanceSmoothing={0.2}
          radius={0.72}
        />
        <Vignette eskil={false} offset={0.22} darkness={0.75} />
      </EffectComposer>
    </Canvas>
  );
}

