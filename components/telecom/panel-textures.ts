import { CanvasTexture, SRGBColorSpace } from "three";
import { createRandom } from "@/components/three/math";

export type PanelKind =
  | "topology"
  | "route"
  | "rack"
  | "spec"
  | "otdr"
  | "ports"
  | "splice";

const W = 1024;
const H = 640;
const CYAN = "#5fe3ff";
const INK = "rgba(220,235,245,0.92)";
const DIM = "rgba(220,235,245,0.38)";
const FAINT = "rgba(220,235,245,0.1)";

const fonts = () => {
  const style = getComputedStyle(document.documentElement);
  return {
    sans: style.getPropertyValue("--font-geist-sans").trim() || "system-ui, sans-serif",
    mono: style.getPropertyValue("--font-geist-mono").trim() || "ui-monospace, monospace",
  };
};

const frame = (ctx: CanvasRenderingContext2D, title: string, code: string) => {
  const { mono, sans } = fonts();
  ctx.fillStyle = "rgba(6,10,16,0.82)";
  ctx.fillRect(0, 0, W, H);

  ctx.strokeStyle = FAINT;
  ctx.lineWidth = 1;
  for (let x = 0; x <= W; x += 32) {
    ctx.beginPath();
    ctx.moveTo(x + 0.5, 0);
    ctx.lineTo(x + 0.5, H);
    ctx.stroke();
  }
  for (let y = 0; y <= H; y += 32) {
    ctx.beginPath();
    ctx.moveTo(0, y + 0.5);
    ctx.lineTo(W, y + 0.5);
    ctx.stroke();
  }

  ctx.strokeStyle = "rgba(160,230,255,0.55)";
  ctx.lineWidth = 2;
  ctx.strokeRect(1, 1, W - 2, H - 2);

  ctx.fillStyle = "rgba(6,10,16,0.9)";
  ctx.fillRect(0, 0, W, 64);
  ctx.strokeStyle = "rgba(160,230,255,0.25)";
  ctx.beginPath();
  ctx.moveTo(0, 64.5);
  ctx.lineTo(W, 64.5);
  ctx.stroke();

  ctx.fillStyle = INK;
  ctx.font = `500 26px ${sans}`;
  ctx.textBaseline = "middle";
  ctx.fillText(title, 28, 33);
  ctx.fillStyle = DIM;
  ctx.font = `400 18px ${mono}`;
  ctx.textAlign = "right";
  ctx.fillText(code, W - 28, 33);
  ctx.textAlign = "left";

  // Corner marks.
  ctx.strokeStyle = CYAN;
  ctx.lineWidth = 3;
  [
    [10, H - 10, 1, -1],
    [W - 10, H - 10, -1, -1],
  ].forEach(([x, y, dx, dy]) => {
    ctx.beginPath();
    ctx.moveTo(x, y + dy * 22);
    ctx.lineTo(x, y);
    ctx.lineTo(x + dx * 22, y);
    ctx.stroke();
  });
};

const label = (ctx: CanvasRenderingContext2D, text: string, x: number, y: number, color = DIM, size = 16) => {
  ctx.fillStyle = color;
  ctx.font = `400 ${size}px ${fonts().mono}`;
  ctx.fillText(text, x, y);
};

const drawTopology = (ctx: CanvasRenderingContext2D) => {
  const spines = [300, 724];
  const leaves = [140, 320, 500, 680, 860];
  ctx.lineWidth = 1.5;
  spines.forEach((sx) =>
    leaves.forEach((lx) => {
      ctx.strokeStyle = "rgba(95,227,255,0.45)";
      ctx.beginPath();
      ctx.moveTo(sx, 190);
      ctx.lineTo(lx, 380);
      ctx.stroke();
    }),
  );
  leaves.forEach((lx, i) => {
    for (let s = 0; s < 4; s += 1) {
      const x = lx - 54 + s * 36;
      ctx.strokeStyle = "rgba(220,235,245,0.3)";
      ctx.beginPath();
      ctx.moveTo(lx, 400);
      ctx.lineTo(x + 8, 520);
      ctx.stroke();
      ctx.fillStyle = "rgba(220,235,245,0.18)";
      ctx.fillRect(x, 520, 16, 40);
    }
    ctx.fillStyle = "#0b141c";
    ctx.strokeStyle = INK;
    ctx.lineWidth = 2;
    ctx.fillRect(lx - 60, 372, 120, 32);
    ctx.strokeRect(lx - 60, 372, 120, 32);
    label(ctx, `LEAF-0${i + 1}`, lx - 40, 390, INK, 15);
  });
  spines.forEach((sx, i) => {
    ctx.fillStyle = "#0b141c";
    ctx.strokeStyle = CYAN;
    ctx.lineWidth = 2;
    ctx.fillRect(sx - 80, 156, 160, 40);
    ctx.strokeRect(sx - 80, 156, 160, 40);
    label(ctx, `SPINE-0${i + 1} · 400G`, sx - 66, 178, CYAN, 15);
  });
  label(ctx, "OS2 · MPO-16 TRUNKS", 28, 110);
  label(ctx, "SERVER RACKS · 2× 100G", 28, 600);
};

const drawRoute = (ctx: CanvasRenderingContext2D) => {
  ctx.strokeStyle = INK;
  ctx.lineWidth = 3;
  ctx.strokeRect(80, 120, 860, 440);
  ctx.lineWidth = 1.5;
  for (let r = 0; r < 4; r += 1) {
    const y = 180 + r * 100;
    for (let i = 0; i < 18; i += 1) {
      ctx.strokeStyle = "rgba(220,235,245,0.35)";
      ctx.strokeRect(130 + i * 34, y, 30, 36);
    }
  }
  ctx.strokeStyle = CYAN;
  ctx.lineWidth = 4;
  ctx.setLineDash([14, 8]);
  for (let r = 0; r < 4; r += 1) {
    const y = 172 + r * 100;
    ctx.beginPath();
    ctx.moveTo(130, y);
    ctx.lineTo(800, y);
    ctx.lineTo(860, 340);
    ctx.stroke();
  }
  ctx.setLineDash([]);
  ctx.fillStyle = "rgba(95,227,255,0.18)";
  ctx.fillRect(840, 280, 80, 120);
  ctx.strokeStyle = CYAN;
  ctx.lineWidth = 2;
  ctx.strokeRect(840, 280, 80, 120);
  label(ctx, "MMR", 860, 345, CYAN, 18);
  label(ctx, "TRAY 600 · H 2950 · FILL ≤ 40%", 80, 100);
  label(ctx, "BEND RADIUS ≥ 30 mm", 80, 590);
};

const drawRack = (ctx: CanvasRenderingContext2D) => {
  const random = createRandom(7);
  [160, 420, 680].forEach((x, rack) => {
    ctx.strokeStyle = INK;
    ctx.lineWidth = 2;
    ctx.strokeRect(x, 100, 200, 500);
    label(ctx, `RACK B${rack + 1}`, x, 92, INK, 15);
    let y = 112;
    while (y < 580) {
      const u = random() > 0.7 ? 2 : 1;
      const h = u * 11;
      const kind = random();
      ctx.fillStyle =
        kind > 0.82 ? "rgba(95,227,255,0.55)" : kind > 0.4 ? "rgba(220,235,245,0.22)" : "rgba(220,235,245,0.06)";
      ctx.fillRect(x + 10, y, 180, h - 2);
      if (kind > 0.82) {
        for (let p = 0; p < 12; p += 1) {
          ctx.fillStyle = "#04121a";
          ctx.fillRect(x + 20 + p * 14, y + 3, 8, 4);
        }
      }
      y += h;
    }
  });
  label(ctx, "42U · 600×1200 · PDU A/B", 160, 625);
};

const drawSpec = (ctx: CanvasRenderingContext2D) => {
  const { sans } = fonts();
  const rows = [
    ["Backbone", "OS2 single-mode · 144F"],
    ["Horizontal", "Cat6A S/FTP · 90 m"],
    ["Connectivity", "MPO-16 · LC duplex"],
    ["Containment", "Ladder 600 · Fiber runner 300"],
    ["Loss budget", "≤ 1.9 dB per channel"],
    ["Labelling", "ISO/IEC 14763-2"],
    ["Handover", "As-built · test reports"],
  ];
  rows.forEach(([key, value], i) => {
    const y = 130 + i * 66;
    ctx.strokeStyle = FAINT;
    ctx.beginPath();
    ctx.moveTo(28, y + 30);
    ctx.lineTo(W - 28, y + 30);
    ctx.stroke();
    label(ctx, key.toUpperCase(), 28, y, DIM, 17);
    ctx.fillStyle = INK;
    ctx.font = `500 26px ${sans}`;
    ctx.fillText(value, 320, y);
  });
};

const drawOtdr = (ctx: CanvasRenderingContext2D) => {
  ctx.strokeStyle = "rgba(220,235,245,0.4)";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(80, 110);
  ctx.lineTo(80, 560);
  ctx.lineTo(960, 560);
  ctx.stroke();
  ctx.strokeStyle = CYAN;
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(80, 140);
  ctx.lineTo(96, 140);
  ctx.lineTo(100, 200);
  const events = [300, 520, 760];
  let y = 200;
  for (let x = 100; x < 900; x += 4) {
    y += 0.12;
    if (events.some((e) => Math.abs(e - x) < 2)) y += 14;
    ctx.lineTo(x, y + Math.sin(x * 0.7) * 0.6);
  }
  ctx.lineTo(904, 300);
  ctx.lineTo(912, 540);
  ctx.lineTo(960, 545);
  ctx.stroke();
  events.forEach((x, i) => {
    ctx.strokeStyle = "rgba(255,255,255,0.35)";
    ctx.setLineDash([4, 6]);
    ctx.beginPath();
    ctx.moveTo(x, 120);
    ctx.lineTo(x, 560);
    ctx.stroke();
    ctx.setLineDash([]);
    label(ctx, `E${i + 1} · 0.0${3 + i} dB`, x + 8, 130 + i * 24, INK, 15);
  });
  label(ctx, "1310 nm / 1550 nm · PASS", 80, 600, CYAN, 18);
  label(ctx, "dB", 40, 120);
  label(ctx, "km", 930, 590);
};

const drawPorts = (ctx: CanvasRenderingContext2D) => {
  const random = createRandom(3);
  for (let row = 0; row < 4; row += 1) {
    const y = 120 + row * 120;
    ctx.strokeStyle = "rgba(220,235,245,0.35)";
    ctx.strokeRect(60, y, 900, 90);
    label(ctx, `PP-${row + 1}`, 60, y - 10, DIM, 14);
    for (let p = 0; p < 24; p += 1) {
      const x = 80 + p * 36;
      const used = random() > 0.3;
      ctx.fillStyle = used ? "rgba(95,227,255,0.75)" : "rgba(220,235,245,0.12)";
      ctx.fillRect(x, y + 24, 26, 26);
      label(ctx, String(p + 1).padStart(2, "0"), x + 2, y + 72, DIM, 11);
    }
  }
};

const drawSplice = (ctx: CanvasRenderingContext2D) => {
  const colors = ["#3a7bff", "#ff8a1e", "#3ad15f", "#a0522d", "#9aa3ad", "#ffffff", "#ff3b3b", "#222", "#ffd23a", "#b05cff", "#ff6fb5", "#40e0d0"];
  colors.forEach((color, i) => {
    const y = 120 + i * 38;
    ctx.strokeStyle = color;
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(60, y);
    ctx.bezierCurveTo(260, y, 300, 330, 480, 330 + (i - 6) * 6);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(540, 330 + (i - 6) * 6);
    ctx.bezierCurveTo(720, 330, 760, y, 960, y);
    ctx.stroke();
    label(ctx, `F${String(i + 1).padStart(2, "0")}`, 970, y + 5, DIM, 12);
  });
  ctx.fillStyle = "rgba(95,227,255,0.2)";
  ctx.fillRect(470, 250, 80, 160);
  ctx.strokeStyle = CYAN;
  ctx.lineWidth = 2;
  ctx.strokeRect(470, 250, 80, 160);
  label(ctx, "FUSION", 478, 430, CYAN, 14);
  label(ctx, "AVG 0.02 dB", 466, 452, INK, 14);
};

const PANEL_TITLES: Record<PanelKind, [string, string]> = {
  topology: ["Spine–leaf fabric", "NET-01"],
  route: ["Fiber routing plan", "RTE-A"],
  rack: ["Rack elevations", "ELV-B"],
  spec: ["Cabling specification", "SPEC-02"],
  otdr: ["OTDR trace · link 017", "TST-017"],
  ports: ["Port map · MMR", "PMAP-04"],
  splice: ["Splice tray · 12F", "SPL-12"],
};

const DRAW: Record<PanelKind, (ctx: CanvasRenderingContext2D) => void> = {
  topology: drawTopology,
  route: drawRoute,
  rack: drawRack,
  spec: drawSpec,
  otdr: drawOtdr,
  ports: drawPorts,
  splice: drawSplice,
};

export const PANEL_ASPECT = W / H;

/** Technical "screen" panels used as content fragments in the space worlds. */
export const createPanelTexture = (kind: PanelKind) => {
  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d")!;
  const [title, code] = PANEL_TITLES[kind];
  frame(ctx, title, code);
  DRAW[kind](ctx);
  const texture = new CanvasTexture(canvas);
  texture.colorSpace = SRGBColorSpace;
  texture.anisotropy = 4;
  return texture;
};
