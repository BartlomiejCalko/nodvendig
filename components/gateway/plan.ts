import { CatmullRomCurve3, Vector3 } from "three";
import { createRandom } from "@/components/three/math";

/**
 * Data hall used by the gateway intro. All units are metres, the plan lies
 * on the XZ plane (y is up). Everything is generated procedurally so the CAD
 * drawing, the 3D extrusion and the assembly share one source of truth.
 */
export const HALL = {
  width: 48,
  depth: 26,
  height: 4.6,
  wall: 0.4,
} as const;

export const RACK = { width: 0.6, depth: 1.2, height: 2.2 } as const;
export const TRAY_HEIGHT = 2.95;
export const BACKBONE_X = 20.6;
export const BACKBONE_HEIGHT = 3.35;

const ROW_Z = [-8.4, -6.0, -1.2, 1.2, 6.0, 8.4];
const RACKS_PER_BLOCK = 24;
const BLOCK_START = [-19.2, 4.8];

export const LAYER = {
  axis: 0,
  wall: 1,
  column: 2,
  rack: 3,
  tray: 4,
  dimension: 5,
  room: 6,
} as const;

const LAYER_COLOR: Record<number, [number, number, number]> = {
  [LAYER.axis]: [0.78, 0.29, 0.29],
  [LAYER.wall]: [0.9, 0.93, 0.95],
  [LAYER.column]: [0.6, 0.65, 0.7],
  [LAYER.rack]: [0.31, 0.78, 0.95],
  [LAYER.tray]: [0.95, 0.82, 0.3],
  [LAYER.dimension]: [0.36, 0.82, 0.52],
  [LAYER.room]: [0.85, 0.42, 0.95],
};

type Point = [number, number];

type Segment = {
  a: Point;
  b: Point;
  layer: number;
  start: number;
  duration: number;
};

export type Rack = {
  x: number;
  z: number;
  facing: 1 | -1;
  row: number;
  delay: number;
};

export type Label = {
  text: string;
  x: number;
  z: number;
  size: number;
  rotation?: number;
  mono?: boolean;
  color?: string;
};

const segments: Segment[] = [];

const line = (
  a: Point,
  b: Point,
  layer: number,
  start: number,
  duration: number,
) => segments.push({ a, b, layer, start, duration });

const dashed = (
  a: Point,
  b: Point,
  layer: number,
  start: number,
  duration: number,
  dash = 0.9,
  gap = 0.45,
) => {
  const dx = b[0] - a[0];
  const dz = b[1] - a[1];
  const length = Math.hypot(dx, dz);
  const count = Math.floor(length / (dash + gap));
  for (let i = 0; i <= count; i += 1) {
    const t0 = (i * (dash + gap)) / length;
    const t1 = Math.min(1, (i * (dash + gap) + dash) / length);
    if (t0 >= 1) break;
    line(
      [a[0] + dx * t0, a[1] + dz * t0],
      [a[0] + dx * t1, a[1] + dz * t1],
      layer,
      start + duration * t0,
      Math.max(0.002, duration * (t1 - t0)),
    );
  }
};

const rect = (
  x0: number,
  z0: number,
  x1: number,
  z1: number,
  layer: number,
  start: number,
  duration: number,
) => {
  const d = duration / 4;
  line([x0, z0], [x1, z0], layer, start, d);
  line([x1, z0], [x1, z1], layer, start + d, d);
  line([x1, z1], [x0, z1], layer, start + d * 2, d);
  line([x0, z1], [x0, z0], layer, start + d * 3, d);
};

const circle = (
  cx: number,
  cz: number,
  radius: number,
  layer: number,
  start: number,
  duration: number,
  steps = 20,
) => {
  for (let i = 0; i < steps; i += 1) {
    const a0 = (i / steps) * Math.PI * 2;
    const a1 = ((i + 1) / steps) * Math.PI * 2;
    line(
      [cx + Math.cos(a0) * radius, cz + Math.sin(a0) * radius],
      [cx + Math.cos(a1) * radius, cz + Math.sin(a1) * radius],
      layer,
      start + (duration * i) / steps,
      duration / steps,
    );
  }
};

/* -------------------------------------------------------------------------- */
/* Plan                                                                       */
/* -------------------------------------------------------------------------- */

const hw = HALL.width / 2;
const hd = HALL.depth / 2;
const inner = HALL.wall;

export const labels: Label[] = [];

// Structural grid axes (dash-dot red, as in a real drawing).
const axisX = [-hw, -hw / 2, 0, hw / 2, hw];
const axisZ = [-hd, 0, hd];
axisX.forEach((x, i) => {
  dashed([x, -hd - 3.2], [x, hd + 3.2], LAYER.axis, 0.0 + i * 0.012, 0.09, 1.6, 0.5);
  circle(x, -hd - 4.2, 0.95, LAYER.axis, 0.07 + i * 0.012, 0.05);
  labels.push({ text: String(i + 1), x, z: -hd - 4.2, size: 1.1, mono: true, color: "#e06a6a" });
});
axisZ.forEach((z, i) => {
  dashed([-hw - 3.2, z], [hw + 3.2, z], LAYER.axis, 0.03 + i * 0.012, 0.09, 1.6, 0.5);
  circle(-hw - 4.2, z, 0.95, LAYER.axis, 0.09 + i * 0.012, 0.05);
  labels.push({ text: "ABC"[i], x: -hw - 4.2, z, size: 1.1, mono: true, color: "#e06a6a" });
});

// Walls: outer + inner outline with door openings.
const doors: Array<{ side: "w" | "e" | "n" | "s"; at: number; width: number }> = [
  { side: "w", at: 0, width: 2.4 },
  { side: "s", at: -12, width: 1.8 },
  { side: "n", at: 12, width: 1.8 },
];

const wallRun = (
  side: "w" | "e" | "n" | "s",
  offset: number,
  start: number,
  duration: number,
) => {
  const x0 = -hw + offset;
  const x1 = hw - offset;
  const z0 = -hd + offset;
  const z1 = hd - offset;
  const horizontal = side === "n" || side === "s";
  const fixed = side === "w" ? x0 : side === "e" ? x1 : side === "n" ? z0 : z1;
  const from = horizontal ? x0 : z0;
  const to = horizontal ? x1 : z1;
  const gaps = doors
    .filter((door) => door.side === side)
    .map((door) => [door.at - door.width / 2, door.at + door.width / 2])
    .sort((a, b) => a[0] - b[0]);

  const runs: Array<[number, number]> = [];
  let cursor = from;
  gaps.forEach(([g0, g1]) => {
    runs.push([cursor, g0]);
    cursor = g1;
  });
  runs.push([cursor, to]);

  const total = to - from;
  runs.forEach(([r0, r1]) => {
    const a: Point = horizontal ? [r0, fixed] : [fixed, r0];
    const b: Point = horizontal ? [r1, fixed] : [fixed, r1];
    line(
      a,
      b,
      LAYER.wall,
      start + ((r0 - from) / total) * duration,
      ((r1 - r0) / total) * duration,
    );
  });

  return { gaps, fixed, horizontal };
};

(["n", "e", "s", "w"] as const).forEach((side, i) => {
  wallRun(side, 0, 0.12 + i * 0.05, 0.08);
  const { gaps, fixed, horizontal } = wallRun(side, inner, 0.14 + i * 0.05, 0.08);
  // Door jambs and swing arcs.
  gaps.forEach(([g0, g1]) => {
    const outer = side === "w" ? -hw : side === "e" ? hw : side === "n" ? -hd : hd;
    [g0, g1].forEach((g) => {
      line(
        horizontal ? [g, outer] : [outer, g],
        horizontal ? [g, fixed] : [fixed, g],
        LAYER.wall,
        0.32,
        0.02,
      );
    });
    const radius = g1 - g0;
    const inward = side === "w" || side === "n" ? 1 : -1;
    for (let s = 0; s < 10; s += 1) {
      const a0 = (s / 10) * (Math.PI / 2);
      const a1 = ((s + 1) / 10) * (Math.PI / 2);
      const p = (a: number): Point =>
        horizontal
          ? [g0 + Math.cos(a) * radius, fixed + inward * Math.sin(a) * radius]
          : [fixed + inward * Math.sin(a) * radius, g0 + Math.cos(a) * radius];
      line(p(a0), p(a1), LAYER.wall, 0.33 + s * 0.004, 0.004);
    }
  });
});

// Columns along the grid, hatched.
export const columns: Point[] = [];
axisX.forEach((x) =>
  axisZ.forEach((z) => {
    columns.push([x, z]);
  }),
);
columns.forEach(([x, z], i) => {
  if (z === 0 && Math.abs(x) < hw) return;
  const s = 0.35;
  const start = 0.3 + i * 0.006;
  rect(x - s, z - s, x + s, z + s, LAYER.column, start, 0.03);
  line([x - s, z - s], [x + s, z + s], LAYER.column, start + 0.02, 0.01);
  line([x - s, z + s], [x + s, z - s], LAYER.column, start + 0.02, 0.01);
});

// Rack rows (two blocks per row, facing into the cold aisles).
export const racks: Rack[] = [];
ROW_Z.forEach((rowZ, row) => {
  const facing: 1 | -1 = row % 2 === 0 ? -1 : 1;
  BLOCK_START.forEach((blockX, block) => {
    for (let i = 0; i < RACKS_PER_BLOCK; i += 1) {
      const x = blockX + RACK.width / 2 + i * RACK.width;
      const order = block === 1 ? i : RACKS_PER_BLOCK - 1 - i;
      racks.push({
        x,
        z: rowZ,
        facing,
        row,
        delay: (row / ROW_Z.length) * 0.55 + (order / RACKS_PER_BLOCK) * 0.4,
      });
    }
    const x0 = blockX;
    const x1 = blockX + RACK.width * RACKS_PER_BLOCK;
    const z0 = rowZ - RACK.depth / 2;
    const z1 = rowZ + RACK.depth / 2;
    const start = 0.4 + row * 0.045 + block * 0.02;
    rect(x0, z0, x1, z1, LAYER.rack, start, 0.07);
    for (let i = 1; i < RACKS_PER_BLOCK; i += 1) {
      const x = x0 + i * RACK.width;
      line([x, z0], [x, z1], LAYER.rack, start + 0.05 + i * 0.0025, 0.01);
    }
  });
  labels.push({
    text: `ROW ${"ABCDEF"[row]}`,
    x: 0,
    z: rowZ,
    size: 0.62,
    mono: true,
    color: "#7fd6f5",
  });
});

// Meet-me room (MMR) on the east side.
const mmr = { x0: 21.4, x1: hw - inner, z0: -5, z1: 5 };
rect(mmr.x0, mmr.z0, mmr.x1, mmr.z1, LAYER.room, 0.6, 0.06);
for (let i = 0; i < 8; i += 1) {
  const z = mmr.z0 + 1 + i * 1.1;
  rect(mmr.x0 + 0.6, z, mmr.x0 + 1.6, z + 0.6, LAYER.room, 0.64 + i * 0.008, 0.02);
}
labels.push({ text: "MMR", x: (mmr.x0 + mmr.x1) / 2 + 0.3, z: mmr.z1 + 1, size: 0.75, mono: true, color: "#d98af2" });

// Cable trays above each row + backbone to the MMR (dashed, hidden line).
ROW_Z.forEach((rowZ, row) => {
  const z = rowZ + (row % 2 === 0 ? 0.22 : -0.22);
  dashed([-19.2, z], [BACKBONE_X, z], LAYER.tray, 0.66 + row * 0.018, 0.08, 0.7, 0.35);
});
dashed([BACKBONE_X, ROW_Z[0]], [BACKBONE_X, ROW_Z[ROW_Z.length - 1]], LAYER.tray, 0.78, 0.06, 0.7, 0.35);

// Dimension chains.
const dim = (a: Point, b: Point, offset: Point, text: string, start: number) => {
  const a2: Point = [a[0] + offset[0], a[1] + offset[1]];
  const b2: Point = [b[0] + offset[0], b[1] + offset[1]];
  line(a, a2, LAYER.dimension, start, 0.02);
  line(b, b2, LAYER.dimension, start, 0.02);
  line(a2, b2, LAYER.dimension, start + 0.02, 0.05);
  const tick = 0.35;
  [a2, b2].forEach((p) =>
    line([p[0] - tick, p[1] + tick], [p[0] + tick, p[1] - tick], LAYER.dimension, start + 0.06, 0.01),
  );
  labels.push({
    text,
    x: (a2[0] + b2[0]) / 2 + (offset[0] !== 0 ? -0.7 * Math.sign(offset[0]) : 0),
    z: (a2[1] + b2[1]) / 2 + (offset[1] !== 0 ? -0.6 * Math.sign(offset[1]) : 0),
    size: 0.7,
    mono: true,
    color: "#6fe09a",
    rotation: offset[0] !== 0 ? Math.PI / 2 : 0,
  });
};
dim([-hw, hd], [hw, hd], [0, 2], "48 000", 0.84);
dim([hw, -hd], [hw, hd], [2, 0], "26 000", 0.87);
dim([-19.2, -hd], [-4.8, -hd], [0, -1.6], "14 400", 0.9);

labels.push({ text: "DATA HALL 01", x: -12, z: 3.6, size: 1.05, color: "#e8edf2" });
labels.push({ text: "1.2 MW · 288 RACKS", x: -12, z: 4.9, size: 0.55, mono: true, color: "#8d98a3" });

/* -------------------------------------------------------------------------- */
/* Buffers                                                                    */
/* -------------------------------------------------------------------------- */

export const buildPlanBuffers = () => {
  const count = segments.length * 2;
  const position = new Float32Array(count * 3);
  const color = new Float32Array(count * 3);
  const start = new Float32Array(count);
  const duration = new Float32Array(count);
  const end = new Float32Array(count);
  const layer = new Float32Array(count);

  segments.forEach((segment, i) => {
    const c = LAYER_COLOR[segment.layer];
    [segment.a, segment.b].forEach((p, j) => {
      const v = i * 2 + j;
      position.set([p[0], 0.01, p[1]], v * 3);
      color.set(c, v * 3);
      start[v] = segment.start;
      duration[v] = segment.duration;
      end[v] = j;
      layer[v] = segment.layer;
    });
  });

  return { position, color, start, duration, end, layer };
};

/** Wall outline lifted to roof height plus vertical posts, for extrusion. */
export const buildWallFrame = () => {
  const walls = segments.filter((s) => s.layer === LAYER.wall || s.layer === LAYER.column);
  const points: number[] = [];
  const corners = new Set<string>();

  walls.forEach(({ a, b }) => {
    points.push(a[0], HALL.height, a[1], b[0], HALL.height, b[1]);
    [a, b].forEach((p) => corners.add(`${p[0].toFixed(2)}|${p[1].toFixed(2)}`));
  });

  corners.forEach((key) => {
    const [x, z] = key.split("|").map(Number);
    points.push(x, 0, z, x, HALL.height, z);
  });

  return new Float32Array(points);
};

/* -------------------------------------------------------------------------- */
/* Cable trays and fibre runs                                                 */
/* -------------------------------------------------------------------------- */

export type TraySegment = {
  x: number;
  y: number;
  z: number;
  length: number;
  rotation: number;
  delay: number;
};

export const traySegments: TraySegment[] = [];
const TRAY_PIECE = 2.4;
ROW_Z.forEach((rowZ, row) => {
  const z = rowZ + (row % 2 === 0 ? 0.22 : -0.22);
  const startX = -19.2;
  const pieces = Math.ceil((BACKBONE_X - startX) / TRAY_PIECE);
  for (let i = 0; i < pieces; i += 1) {
    const x0 = startX + i * TRAY_PIECE;
    const length = Math.min(TRAY_PIECE, BACKBONE_X - x0);
    traySegments.push({
      x: x0 + length / 2,
      y: TRAY_HEIGHT,
      z,
      length,
      rotation: 0,
      delay: (1 - i / pieces) * 0.55 + row * 0.04,
    });
  }
});
{
  const z0 = ROW_Z[0] - 0.4;
  const z1 = ROW_Z[ROW_Z.length - 1] + 0.4;
  const pieces = Math.ceil((z1 - z0) / TRAY_PIECE);
  for (let i = 0; i < pieces; i += 1) {
    const a = z0 + i * TRAY_PIECE;
    const length = Math.min(TRAY_PIECE, z1 - a);
    traySegments.push({
      x: BACKBONE_X,
      y: BACKBONE_HEIGHT,
      z: a + length / 2,
      length,
      rotation: Math.PI / 2,
      delay: Math.abs(a + length / 2) / 10 * 0.2,
    });
  }
}

export type CableRun = {
  curve: CatmullRomCurve3;
  delay: number;
  offset: number;
};

export const buildCableRuns = (): CableRun[] => {
  const random = createRandom(42);
  const runs: CableRun[] = [];

  ROW_Z.forEach((rowZ, row) => {
    const trayZ = rowZ + (row % 2 === 0 ? 0.22 : -0.22);
    for (let c = 0; c < 4; c += 1) {
      const rack = racks.filter((r) => r.row === row)[Math.floor(random() * 48)];
      const spread = (c - 1.5) * 0.08;
      const lane = trayZ + spread;
      const backboneLane = (row - 2.5) * 0.06 + spread * 0.5;
      const top = RACK.height;
      const points = [
        new Vector3(rack.x, top, rack.z),
        new Vector3(rack.x, top + 0.45, rack.z + (lane - rack.z) * 0.5),
        new Vector3(rack.x + 0.4, TRAY_HEIGHT + 0.06, lane),
        new Vector3((rack.x + BACKBONE_X) / 2, TRAY_HEIGHT + 0.06, lane),
        new Vector3(BACKBONE_X - 0.6, TRAY_HEIGHT + 0.08, lane),
        new Vector3(BACKBONE_X + backboneLane, BACKBONE_HEIGHT + 0.06, lane * 0.85),
        new Vector3(BACKBONE_X + backboneLane, BACKBONE_HEIGHT + 0.06, lane * 0.35),
        new Vector3(BACKBONE_X + backboneLane, BACKBONE_HEIGHT + 0.06, backboneLane * 4),
        new Vector3(22.3, BACKBONE_HEIGHT - 0.3, backboneLane * 4),
        new Vector3(22.6, 1.2, -4 + ((row * 4 + c) % 8) * 1.1),
      ];
      runs.push({
        curve: new CatmullRomCurve3(points, false, "centripetal", 0.4),
        delay: row * 0.1 + c * 0.03 + random() * 0.05,
        offset: random(),
      });
    }
  });

  return runs;
};

export const MMR = mmr;
