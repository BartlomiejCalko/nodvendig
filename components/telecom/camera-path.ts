import { Vector3 } from "three";
import { lerp, smoothstep } from "@/components/three/math";
import { MOMENTS, WORLD } from "@/components/telecom/telecom-state";

type Key = {
  p: number;
  pos: [number, number, number];
  look: [number, number, number];
  fov: number;
};

/** Light grey data hall — ends inside the fibre core of the hero patch cord. */
export const ROOM_KEYS: Key[] = [
  { p: 0, pos: [0, 2.35, 9], look: [0, 1.5, -20], fov: 42 },
  { p: 0.045, pos: [0.35, 2.05, -1], look: [0, 1.4, -30], fov: 42 },
  { p: 0.09, pos: [-0.4, 1.75, -17], look: [0, 1.3, -34], fov: 40 },
  { p: 0.118, pos: [0.25, 1.48, -27.4], look: [0, 1.3, -33.4], fov: 38 },
  { p: 0.138, pos: [0.32, 1.42, -30.25], look: [0, 1.35, -31.62], fov: 36 },
  { p: 0.152, pos: [0, 1.35, -31.25], look: [0, 1.35, -31.62], fov: 38 },
  { p: MOMENTS.handover, pos: [0, 1.35, -31.597], look: [0, 1.35, -32.2], fov: 50 },
];

const { idea, build, deliver, core } = WORLD;

/** Inside the fibre, then the Telecom universe. */
export const SPACE_KEYS: Key[] = [
  { p: MOMENTS.handover, pos: [0, 0, 0], look: [0, 0, -12], fov: 60 },
  { p: 0.2, pos: [0.3, 0.25, -70], look: [0, 0, -110], fov: 76 },
  { p: 0.245, pos: [-0.3, -0.2, -190], look: [0, 0, -240], fov: 84 },
  { p: 0.27, pos: [0, 0, -252], look: [0, 0.4, -300], fov: 66 },
  { p: 0.3, pos: [0, 1.6, idea + 66], look: [0, 2.2, idea], fov: 55 },
  { p: 0.33, pos: [0, 1.8, idea + 24], look: [0, 2.2, idea - 20], fov: 55 },
  { p: 0.36, pos: [0, 1.4, idea - 14], look: [-1, 1.2, idea - 60], fov: 56 },
  { p: 0.405, pos: [-2.5, 1.2, idea - 52], look: [5, 1.6, idea - 82], fov: 52 },
  { p: 0.45, pos: [2.5, 0.6, idea - 88], look: [-5, 0.5, idea - 118], fov: 52 },
  { p: 0.495, pos: [-1, 1.2, idea - 124], look: [3, 3, idea - 160], fov: 54 },
  { p: 0.52, pos: [0, 1.6, build + 62], look: [0, 2.2, build], fov: 55 },
  { p: 0.545, pos: [0, 1.8, build + 22], look: [0, 2.2, build - 20], fov: 55 },
  { p: 0.565, pos: [0, 1.4, build - 14], look: [2, 1, build - 60], fov: 56 },
  { p: 0.6, pos: [-2.5, 1.2, build - 46], look: [6, 1, build - 72], fov: 52 },
  { p: 0.645, pos: [2.5, 1.0, build - 92], look: [-7, 0.6, build - 116], fov: 52 },
  { p: 0.69, pos: [0, -3, build - 136], look: [0.5, 8, build - 162], fov: 56 },
  { p: 0.725, pos: [-6, 2.5, build - 182], look: [-14, -3, build - 196], fov: 54 },
  { p: 0.752, pos: [0, 1.6, deliver + 62], look: [0, 2.2, deliver], fov: 55 },
  { p: 0.775, pos: [0, 1.8, deliver + 24], look: [0, 2.2, deliver - 20], fov: 55 },
  { p: 0.797, pos: [0, 1.4, deliver - 14], look: [3, 1.5, deliver - 60], fov: 56 },
  { p: 0.825, pos: [-3, 1.2, deliver - 42], look: [7, 2, deliver - 62], fov: 52 },
  { p: 0.855, pos: [3, 1.2, deliver - 80], look: [-7, 3, deliver - 100], fov: 52 },
  { p: 0.885, pos: [0, 1.2, deliver - 118], look: [4, -1, deliver - 140], fov: 52 },
  { p: 0.93, pos: [0, 1.5, core + 92], look: [0, 1, core], fov: 50 },
  { p: 1, pos: [0, -4, core + 58], look: [0, -9, core], fov: 52 },
];

const catmull = (p0: number, p1: number, p2: number, p3: number, t: number) => {
  const v0 = (p2 - p0) * 0.5;
  const v1 = (p3 - p1) * 0.5;
  const t2 = t * t;
  const t3 = t * t2;
  return (2 * p1 - 2 * p2 + v0 + v1) * t3 + (-3 * p1 + 3 * p2 - 2 * v0 - v1) * t2 + v0 * t + p1;
};

/**
 * Samples a key track with Catmull–Rom interpolation. Each segment is eased
 * slightly so the camera lingers on the composed frames (where copy appears).
 */
export const sampleTrack = (
  keys: Key[],
  progress: number,
  position: Vector3,
  look: Vector3,
) => {
  const last = keys.length - 1;
  let i = 0;
  while (i < last - 1 && progress > keys[i + 1].p) i += 1;

  const a = keys[Math.max(0, i - 1)];
  const b = keys[i];
  const c = keys[Math.min(last, i + 1)];
  const d = keys[Math.min(last, i + 2)];
  const raw = Math.min(1, Math.max(0, (progress - b.p) / Math.max(1e-6, c.p - b.p)));
  const t = lerp(raw, smoothstep(raw), 0.45);

  position.set(
    catmull(a.pos[0], b.pos[0], c.pos[0], d.pos[0], t),
    catmull(a.pos[1], b.pos[1], c.pos[1], d.pos[1], t),
    catmull(a.pos[2], b.pos[2], c.pos[2], d.pos[2], t),
  );
  look.set(
    catmull(a.look[0], b.look[0], c.look[0], d.look[0], t),
    catmull(a.look[1], b.look[1], c.look[1], d.look[1], t),
    catmull(a.look[2], b.look[2], c.look[2], d.look[2], t),
  );

  return lerp(b.fov, c.fov, t);
};
