"use client";

import { useLayoutEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import {
  AdditiveBlending,
  BoxGeometry,
  CanvasTexture,
  CatmullRomCurve3,
  Color,
  Group,
  InstancedMesh,
  MeshBasicMaterial,
  MeshStandardMaterial,
  Object3D,
  RepeatWrapping,
  SRGBColorSpace,
  TubeGeometry,
  Vector3,
} from "three";
import { mergeGeometries } from "three/examples/jsm/utils/BufferGeometryUtils.js";
import { createSignalMaterial } from "@/components/three/signal-material";
import { range } from "@/components/three/math";
import { MOMENTS, telecomScroll } from "@/components/telecom/telecom-state";

const RACK = { width: 0.6, height: 2.2, depth: 1.2 };
const ROWS = [
  { x: -1.5, facing: Math.PI / 2 },
  { x: 1.5, facing: -Math.PI / 2 },
  { x: -4.5, facing: -Math.PI / 2 },
  { x: 4.5, facing: Math.PI / 2 },
];
const ROW_START = 3;
const ROW_END = -30;
const HERO_Z = -34;
const HERO_FRONT = HERO_Z + RACK.depth / 2;
export const FIBER_END = new Vector3(0, 1.35, -31.6);

/* -------------------------------------------------------------------------- */
/* Textures                                                                   */
/* -------------------------------------------------------------------------- */

const createFloorTexture = () => {
  const size = 256;
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = size * 2;
  const ctx = canvas.getContext("2d")!;
  for (let ty = 0; ty < 2; ty += 1) {
    for (let tx = 0; tx < 2; tx += 1) {
      const x = tx * size;
      const y = ty * size;
      ctx.fillStyle = "#e7e9ec";
      ctx.fillRect(x, y, size, size);
      if ((tx + ty) % 2 === 0) {
        ctx.fillStyle = "#d9dce0";
        for (let py = 24; py < size - 24; py += 12) {
          for (let px = 24; px < size - 24; px += 12) {
            ctx.beginPath();
            ctx.arc(x + px, y + py, 2.6, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      }
      ctx.strokeStyle = "#c9cdd2";
      ctx.lineWidth = 3;
      ctx.strokeRect(x + 1.5, y + 1.5, size - 3, size - 3);
    }
  }
  const texture = new CanvasTexture(canvas);
  texture.colorSpace = SRGBColorSpace;
  texture.wrapS = texture.wrapT = RepeatWrapping;
  texture.anisotropy = 8;
  return texture;
};

const createRackTextures = () => {
  const w = 128;
  const h = 512;
  const base = document.createElement("canvas");
  const glow = document.createElement("canvas");
  base.width = glow.width = w;
  base.height = glow.height = h;
  const b = base.getContext("2d")!;
  const g = glow.getContext("2d")!;

  b.fillStyle = "#e3e5e8";
  b.fillRect(0, 0, w, h);
  b.fillStyle = "#c3c7cc";
  for (let y = 40; y < h - 20; y += 6) {
    for (let x = 14 + ((y / 6) % 2) * 3; x < w - 14; x += 6) {
      b.fillRect(x, y, 2.5, 2.5);
    }
  }
  b.fillStyle = "#d3d6da";
  b.fillRect(0, 0, w, 34);
  b.fillStyle = "#9da3aa";
  b.fillRect(w - 16, h / 2 - 40, 5, 80);
  b.strokeStyle = "#bfc4ca";
  b.lineWidth = 4;
  b.strokeRect(2, 2, w - 4, h - 4);

  g.fillStyle = "#000";
  g.fillRect(0, 0, w, h);
  for (let i = 0; i < 6; i += 1) {
    g.fillStyle = Math.random() > 0.2 ? "#5fe3ff" : "#ffffff";
    g.fillRect(14 + i * 9, 14, 5, 5);
  }

  const map = new CanvasTexture(base);
  const emissiveMap = new CanvasTexture(glow);
  map.colorSpace = emissiveMap.colorSpace = SRGBColorSpace;
  map.anisotropy = 8;
  return { map, emissiveMap };
};

/* -------------------------------------------------------------------------- */
/* Shell: floor, walls, ceiling and light strips                              */
/* -------------------------------------------------------------------------- */

const Shell = () => {
  const floorTexture = useMemo(() => {
    const texture = createFloorTexture();
    texture.repeat.set(18 / 1.2, 60 / 1.2);
    return texture;
  }, []);

  const strips = useMemo(() => {
    const items: Array<[number, number]> = [];
    [-3, 0, 3].forEach((x) => {
      for (let z = 4; z > -36; z -= 2.4) items.push([x, z]);
    });
    return items;
  }, []);

  return (
    <group>
      <mesh rotation-x={-Math.PI / 2} position={[0, 0, -14]} receiveShadow>
        <planeGeometry args={[18, 60]} />
        <meshStandardMaterial map={floorTexture} color="#b9bec4" roughness={0.6} metalness={0.05} />
      </mesh>
      <mesh rotation-x={Math.PI / 2} position={[0, 4.4, -14]}>
        <planeGeometry args={[18, 60]} />
        <meshStandardMaterial color="#e4e6e9" roughness={0.9} />
      </mesh>
      {[-7.5, 7.5].map((x) => (
        <mesh key={x} position={[x, 2.2, -14]} rotation-y={x < 0 ? Math.PI / 2 : -Math.PI / 2}>
          <planeGeometry args={[60, 4.4]} />
          <meshStandardMaterial color="#dfe2e5" roughness={0.95} />
        </mesh>
      ))}
      <mesh position={[0, 2.2, -38]}>
        <planeGeometry args={[18, 4.4]} />
        <meshStandardMaterial color="#e1e3e6" roughness={0.95} />
      </mesh>
      {/* Light plinth under the hero rack */}
      <mesh position={[0, 0.01, HERO_Z]} rotation-x={-Math.PI / 2}>
        <planeGeometry args={[2.4, 2.6]} />
        <meshStandardMaterial color="#f4f5f7" roughness={0.4} />
      </mesh>
      {strips.map(([x, z]) => (
        <mesh key={`${x}:${z}`} position={[x, 4.37, z]}>
          <boxGeometry args={[0.12, 0.03, 1.6]} />
          <meshBasicMaterial color={new Color(2.2, 2.2, 2.3)} toneMapped={false} />
        </mesh>
      ))}
    </group>
  );
};

/* -------------------------------------------------------------------------- */
/* Rack rows                                                                  */
/* -------------------------------------------------------------------------- */

const RackRows = () => {
  const ref = useRef<InstancedMesh>(null);
  const placements = useMemo(() => {
    const items: Array<{ x: number; z: number; rotation: number }> = [];
    ROWS.forEach((row) => {
      for (let z = ROW_START; z > ROW_END; z -= RACK.width) {
        items.push({ x: row.x, z: z - RACK.width / 2, rotation: row.facing });
      }
    });
    return items;
  }, []);

  const { geometry, materials } = useMemo(() => {
    const { map, emissiveMap } = createRackTextures();
    const side = new MeshStandardMaterial({ color: "#dcdfe2", roughness: 0.55, metalness: 0.15 });
    const top = new MeshStandardMaterial({ color: "#d4d7db", roughness: 0.6, metalness: 0.1 });
    const front = new MeshStandardMaterial({
      map,
      emissiveMap,
      emissive: new Color("#ffffff"),
      emissiveIntensity: 1.6,
      roughness: 0.5,
      metalness: 0.15,
    });
    const geometry = new BoxGeometry(RACK.width * 0.97, RACK.height, RACK.depth);
    geometry.translate(0, RACK.height / 2, 0);
    return { geometry, materials: [side, side, top, top, front, side] };
  }, []);

  useLayoutEffect(() => {
    const mesh = ref.current;
    if (!mesh) return;
    const dummy = new Object3D();
    placements.forEach((p, i) => {
      dummy.position.set(p.x, 0, p.z);
      dummy.rotation.set(0, p.rotation, 0);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
    });
    mesh.instanceMatrix.needsUpdate = true;
    mesh.computeBoundingSphere();
  }, [placements]);

  return (
    <instancedMesh
      ref={ref}
      args={[geometry, materials, placements.length]}
      castShadow
      receiveShadow
    />
  );
};

/* -------------------------------------------------------------------------- */
/* Overhead trays and live fibre                                              */
/* -------------------------------------------------------------------------- */

const OverheadTrays = () => {
  const ref = useRef<InstancedMesh>(null);
  const { geometry, segments } = useMemo(() => {
    const parts = [];
    const rail = new BoxGeometry(0.03, 0.09, 1);
    rail.translate(0.3, 0.045, 0);
    parts.push(rail, rail.clone().translate(-0.6, 0, 0));
    for (let i = 0; i < 4; i += 1) {
      const rung = new BoxGeometry(0.6, 0.015, 0.03);
      rung.translate(0, 0.008, -0.5 + 0.125 + i * 0.25);
      parts.push(rung);
    }
    const geometry = mergeGeometries(parts)!;
    const segments: Array<[number, number]> = [];
    ROWS.forEach((row) => {
      for (let z = ROW_START; z > ROW_END - 1; z -= 1) segments.push([row.x, z - 0.5]);
    });
    return { geometry, segments };
  }, []);

  useLayoutEffect(() => {
    const mesh = ref.current;
    if (!mesh) return;
    const dummy = new Object3D();
    segments.forEach(([x, z], i) => {
      dummy.position.set(x, 2.72, z);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
    });
    mesh.instanceMatrix.needsUpdate = true;
    mesh.computeBoundingSphere();
  }, [segments]);

  return (
    <instancedMesh ref={ref} args={[geometry, undefined, segments.length]} castShadow>
      <meshStandardMaterial color="#c9ced4" metalness={0.6} roughness={0.35} />
    </instancedMesh>
  );
};

const LiveFibers = () => {
  const fibers = useMemo(() => {
    const runs = [-1.5, 1.5, -1.42, 1.42].map((x, i) => {
      const curve = new CatmullRomCurve3(
        [
          new Vector3(x, 2.79, 6),
          new Vector3(x, 2.79, -14),
          new Vector3(x, 2.79, -30.5),
          new Vector3(x * 0.4, 2.62, -33.2),
          new Vector3(x * 0.1, 2.26, HERO_Z),
        ],
        false,
        "centripetal",
      );
      const material = createSignalMaterial({
        intensity: 1.6,
        pulseSpacing: 0.16,
        pulseSpeed: 0.05,
      });
      material.uniforms.uDraw.value = 1;
      material.uniforms.uPulse.value = 1;
      material.uniforms.uOffset.value = i * 0.37;
      return { geometry: new TubeGeometry(curve, 200, 0.01, 5, false), material };
    });
    return runs;
  }, []);

  useFrame(({ clock }) => {
    fibers.forEach(({ material }) => {
      material.uniforms.uTime.value = clock.elapsedTime;
    });
  });

  return (
    <group>
      {fibers.map(({ geometry, material }, i) => (
        <mesh key={i} geometry={geometry} material={material} />
      ))}
    </group>
  );
};

/* -------------------------------------------------------------------------- */
/* Hero rack, NIC and the patch cord we dive into                             */
/* -------------------------------------------------------------------------- */

const HeroRack = () => {
  const servers = useMemo(() => {
    const items: Array<{ y: number; pulled: boolean }> = [];
    for (let i = 0; i < 20; i += 1) {
      const y = 0.18 + i * 0.096;
      items.push({ y, pulled: Math.abs(y - 1.11) < 0.05 });
    }
    return items;
  }, []);

  const ledMaterial = useMemo(
    () => new MeshBasicMaterial({ color: new Color(0.6, 2.4, 3), toneMapped: false }),
    [],
  );

  return (
    <group position={[0, 0, HERO_Z]}>
      {/* Frame */}
      {[
        [-0.29, -0.58],
        [0.29, -0.58],
        [-0.29, 0.58],
        [0.29, 0.58],
      ].map(([x, z]) => (
        <mesh key={`${x}${z}`} position={[x, RACK.height / 2, z]} castShadow>
          <boxGeometry args={[0.04, RACK.height, 0.04]} />
          <meshStandardMaterial color="#2a2e34" metalness={0.7} roughness={0.35} />
        </mesh>
      ))}
      {[0.02, RACK.height].map((y) => (
        <mesh key={y} position={[0, y, 0]} castShadow>
          <boxGeometry args={[0.62, 0.04, 1.2]} />
          <meshStandardMaterial color="#2a2e34" metalness={0.7} roughness={0.35} />
        </mesh>
      ))}
      {[-0.305, 0.305].map((x) => (
        <mesh key={x} position={[x, RACK.height / 2, 0]}>
          <boxGeometry args={[0.01, RACK.height - 0.04, 1.16]} />
          <meshStandardMaterial color="#23272c" metalness={0.5} roughness={0.5} />
        </mesh>
      ))}

      {/* Servers */}
      {servers.map(({ y, pulled }) => (
        <group key={y} position={[0, y, pulled ? 0.3 : 0]}>
          <mesh castShadow>
            <boxGeometry args={[0.52, 0.084, 1]} />
            <meshStandardMaterial color={pulled ? "#3a4048" : "#1d2126"} metalness={0.6} roughness={0.4} />
          </mesh>
          <mesh position={[-0.2, 0, 0.501]} material={ledMaterial}>
            <boxGeometry args={[0.012, 0.008, 0.002]} />
          </mesh>
          <mesh position={[-0.18, 0, 0.501]} material={ledMaterial}>
            <boxGeometry args={[0.012, 0.008, 0.002]} />
          </mesh>
        </group>
      ))}

      {/* NIC card on the pulled server, with transceiver and LC connector */}
      <group position={[0.05, 1.155, 0.3 + 0.5]}>
        <mesh>
          <boxGeometry args={[0.2, 0.004, 0.12]} />
          <meshStandardMaterial color="#14301f" metalness={0.3} roughness={0.6} />
        </mesh>
        <mesh position={[0, 0.0035, 0.05]}>
          <boxGeometry args={[0.2, 0.002, 0.012]} />
          <meshStandardMaterial color="#c9a54a" metalness={1} roughness={0.25} />
        </mesh>
        <mesh position={[0, 0.006, 0.04]}>
          <boxGeometry args={[0.016, 0.012, 0.06]} />
          <meshStandardMaterial color="#c8ccd2" metalness={1} roughness={0.2} />
        </mesh>
        <mesh position={[0, 0.006, 0.08]}>
          <boxGeometry args={[0.012, 0.01, 0.03]} />
          <meshStandardMaterial color="#f2f3f5" roughness={0.4} />
        </mesh>
      </group>
    </group>
  );
};

const PatchCord = () => {
  const glowRef = useRef<MeshBasicMaterial>(null);
  const coreRef = useRef<MeshBasicMaterial>(null);

  const { jacket, signal } = useMemo(() => {
    const start = new Vector3(0.05, 1.161, HERO_FRONT + 0.295);
    const curve = new CatmullRomCurve3(
      [
        start,
        start.clone().add(new Vector3(0, 0, 0.22)),
        new Vector3(0.03, 1.24, -32.5),
        new Vector3(0, 1.33, -31.95),
        FIBER_END.clone(),
      ],
      false,
      "centripetal",
    );
    const signal = createSignalMaterial({ intensity: 2.2, pulseSpacing: 0.22, pulseSpeed: 0.18 });
    signal.uniforms.uDraw.value = 1;
    signal.uniforms.uPulse.value = 1;
    return {
      jacket: new TubeGeometry(curve, 160, 0.014, 20, false),
      signal: { geometry: new TubeGeometry(curve, 160, 0.0146, 12, false), material: signal },
    };
  }, []);

  const glowTexture = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = canvas.height = 128;
    const ctx = canvas.getContext("2d")!;
    const gradient = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
    gradient.addColorStop(0, "rgba(255,255,255,1)");
    gradient.addColorStop(0.25, "rgba(150,240,255,0.65)");
    gradient.addColorStop(1, "rgba(95,227,255,0)");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 128, 128);
    return new CanvasTexture(canvas);
  }, []);

  useFrame(({ clock }) => {
    signal.material.uniforms.uTime.value = clock.elapsedTime;
    const approach = range(telecomScroll.progress, 0.1, MOMENTS.handover);
    if (glowRef.current) glowRef.current.opacity = 0.15 + approach * 0.35;
    if (coreRef.current) coreRef.current.color.setScalar(1.6 + approach * 3);
  });

  const z = FIBER_END.z;

  return (
    <group>
      <mesh geometry={jacket} castShadow>
        <meshStandardMaterial color="#f4f5f7" roughness={0.35} />
      </mesh>
      <mesh geometry={signal.geometry} material={signal.material} />

      {/* End face: jacket, buffer, cladding, core */}
      <group position={[FIBER_END.x, FIBER_END.y, z]}>
        <mesh position-z={0.0004}>
          <circleGeometry args={[0.0136, 48]} />
          <meshStandardMaterial color="#e9ebee" roughness={0.5} />
        </mesh>
        <mesh position-z={0.0006}>
          <circleGeometry args={[0.0098, 48]} />
          <meshStandardMaterial color="#c9ced4" roughness={0.3} metalness={0.2} />
        </mesh>
        <mesh position-z={0.0008}>
          <circleGeometry args={[0.0072, 64]} />
          <meshBasicMaterial color={new Color(0.55, 1.4, 1.7)} toneMapped={false} />
        </mesh>
        <mesh position-z={0.001}>
          <circleGeometry args={[0.0026, 48]} />
          <meshBasicMaterial ref={coreRef} color={new Color(3, 3, 3)} toneMapped={false} />
        </mesh>
        <mesh position-z={0.0015}>
          <planeGeometry args={[0.045, 0.045]} />
          <meshBasicMaterial
            ref={glowRef}
            map={glowTexture}
            transparent
            depthWrite={false}
            blending={AdditiveBlending}
            toneMapped={false}
          />
        </mesh>
      </group>
    </group>
  );
};

/* -------------------------------------------------------------------------- */

export const RoomWorld = () => {
  const ref = useRef<Group>(null);

  useFrame(() => {
    if (ref.current) ref.current.visible = telecomScroll.progress < MOMENTS.handover + 0.004;
  });

  return (
    <group ref={ref}>
      <Shell />
      <RackRows />
      <OverheadTrays />
      <LiveFibers />
      <HeroRack />
      <PatchCord />
    </group>
  );
};
