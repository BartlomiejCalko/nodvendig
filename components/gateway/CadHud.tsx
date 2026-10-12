"use client";

import { useEffect, useRef, useState, type RefObject } from "react";
import { cn } from "@/lib/cn";
import { gatewayState } from "@/components/gateway/gateway-state";

/** AutoCAD-style command log, keyed to the intro timeline (seconds). */
export const CAD_COMMANDS = [
  { at: 0.15, text: "_LIMITS  0,0  48000,26000" },
  { at: 0.5, text: "_XLINE  Grid 1–5 · A–C  @12000" },
  { at: 1.0, text: "_PLINE  Wall  t=400" },
  { at: 1.55, text: "_RECTANG  Column 700×700  ×13" },
  { at: 2.0, text: "_ARRAY  RACK-42U 600×1200  Rows 6 · Cols 48" },
  { at: 2.75, text: "_TRAY  ROW A–F → BACKBONE → MMR" },
  { at: 3.2, text: "_DIMLINEAR" },
  { at: 3.6, text: "_3DORBIT" },
  { at: 4.1, text: "_EXTRUDE  Height 4600" },
  { at: 5.1, text: "_INSERT  RACK-42U  ×288" },
  { at: 6.9, text: "_CABLETRAY  Ladder 600 · H 2950" },
  { at: 7.9, text: "_FIBER  OS2 24F · ROW A–F → MMR" },
  { at: 9.1, text: "_LINKTEST  OTDR  ·  24/24 PASS" },
  { at: 9.6, text: "_RENDER  Realistic" },
] as const;

const LAYERS = [
  { name: "A-AXIS", color: "#c84a4a", at: 0.3 },
  { name: "A-WALL", color: "#e6edf2", at: 0.75 },
  { name: "S-COLS", color: "#9aa5b2", at: 1.45 },
  { name: "E-RACK", color: "#4fc7f2", at: 1.95 },
  { name: "E-MMR", color: "#d86bf2", at: 2.45 },
  { name: "E-TRAY", color: "#f2d14c", at: 2.7 },
  { name: "A-DIMS", color: "#5bd184", at: 3.1 },
] as const;

type CadHudProps = {
  timeline: RefObject<gsap.core.Timeline | null>;
  hidden: boolean;
  onSkip: () => void;
};

export const CadHud = ({ timeline, hidden, onSkip }: CadHudProps) => {
  const [step, setStep] = useState(0);
  const [layerStep, setLayerStep] = useState(0);
  const [mode3d, setMode3d] = useState(false);
  const coordsRef = useRef<HTMLSpanElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let frame = 0;
    const tick = () => {
      frame = requestAnimationFrame(tick);
      const tl = timeline.current;
      if (!tl) return;
      const time = tl.time();

      setStep(CAD_COMMANDS.filter((c) => c.at <= time).length);
      setLayerStep(LAYERS.filter((l) => l.at <= time).length);
      setMode3d(time > 3.6);

      // Crosshair wanders over the sheet while lines are being drawn.
      const drawing = gatewayState.draw > 0 && gatewayState.draw < 1;
      const cx = 50 + Math.sin(time * 2.1) * 26 + Math.sin(time * 5.3) * 6;
      const cy = 50 + Math.cos(time * 1.7) * 18 + Math.sin(time * 4.1) * 5;
      if (cursorRef.current) {
        cursorRef.current.style.opacity = drawing ? "1" : "0";
        cursorRef.current.style.transform = `translate(${cx}vw, ${cy}vh)`;
      }
      if (coordsRef.current) {
        const x = ((cx - 50) / 50) * 24000 + 24000;
        const y = ((cy - 50) / 50) * 13000 + 13000;
        coordsRef.current.textContent = `${x.toFixed(1).padStart(8, " ")}, ${y
          .toFixed(1)
          .padStart(8, " ")}, ${time > 3.6 ? (gatewayState.extrude * 4600).toFixed(1) : "0.0"}`;
      }
      if (progressRef.current) {
        progressRef.current.style.transform = `scaleX(${tl.progress()})`;
      }
    };
    tick();
    return () => cancelAnimationFrame(frame);
  }, [timeline]);

  const visible = CAD_COMMANDS.slice(Math.max(0, step - 3), step);

  return (
    <div
      className={cn(
        "pointer-events-none absolute inset-0 font-mono text-[11px] tracking-[0.04em] text-white/70 transition-opacity duration-700 ease-out-expo",
        hidden ? "opacity-0" : "opacity-100",
      )}
      aria-hidden={hidden}
    >
      {/* Top bar */}
      <div className="absolute inset-x-0 top-0 border-b border-white/10 bg-black/40 backdrop-blur-sm">
        <div className="flex items-center justify-between px-4 py-2.5 md:px-6">
          <div className="flex items-center gap-4">
            <span className="font-sans text-[13px] font-medium tracking-[0.08em] text-white">
              NØDVENDIG
            </span>
            <span className="hidden text-white/40 sm:inline">/</span>
            <span className="hidden border-b border-signal/60 pb-0.5 text-white sm:inline">
              DC-HALL-01.dwg
            </span>
            <span className="hidden text-white/35 md:inline">TELECOM-ROUTING.dwg</span>
          </div>
          <button
            type="button"
            onClick={onSkip}
            tabIndex={hidden ? -1 : 0}
            className="pointer-events-auto uppercase text-white/60 transition-colors duration-300 hover:text-white"
          >
            Skip intro →
          </button>
        </div>
        <div className="h-px w-full bg-white/5">
          <div ref={progressRef} className="h-px origin-left scale-x-0 bg-signal" />
        </div>
      </div>

      {/* Layer manager */}
      <div className="absolute top-20 left-6 hidden w-44 border border-white/10 bg-black/40 p-3 backdrop-blur-sm lg:block">
        <p className="mb-2 text-white/40 uppercase">Layers</p>
        <ul className="space-y-1.5">
          {LAYERS.map((layer, i) => (
            <li
              key={layer.name}
              className={cn(
                "flex items-center gap-2 transition-opacity duration-300",
                i < layerStep ? "opacity-100" : "opacity-25",
              )}
            >
              <span className="h-2 w-2" style={{ background: layer.color }} />
              <span>{layer.name}</span>
              {i === layerStep - 1 && !mode3d ? (
                <span className="ml-auto text-signal">●</span>
              ) : null}
            </li>
          ))}
        </ul>
      </div>

      {/* View cube label */}
      <div className="absolute top-20 right-6 hidden border border-white/10 bg-black/40 px-3 py-2 backdrop-blur-sm md:block">
        <span className="uppercase">{mode3d ? "SE Isometric · Realistic" : "Top · 2D Wireframe"}</span>
      </div>

      {/* Crosshair */}
      <div
        ref={cursorRef}
        className="absolute top-0 left-0 opacity-0 transition-opacity duration-300"
      >
        <div className="relative -translate-x-1/2 -translate-y-1/2">
          <span className="absolute top-1/2 left-1/2 h-px w-16 -translate-x-1/2 bg-white/80" />
          <span className="absolute top-1/2 left-1/2 h-16 w-px -translate-y-1/2 bg-white/80" />
          <span className="absolute top-1/2 left-1/2 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 border border-white/90" />
        </div>
      </div>

      {/* Command line */}
      <div className="absolute inset-x-0 bottom-0 border-t border-white/10 bg-black/50 backdrop-blur-sm">
        <div className="px-4 py-2 md:px-6">
          <ul className="min-h-[3.6em] space-y-0.5">
            {visible.map((command, i) => (
              <li
                key={command.text}
                className={cn(
                  "truncate",
                  i === visible.length - 1 ? "text-white" : "text-white/40",
                )}
              >
                <span className="text-white/40">Command: </span>
                {command.text}
              </li>
            ))}
          </ul>
          <div className="mt-1 flex items-center justify-between gap-4 border-t border-white/10 pt-1.5 text-white/45">
            <span className="flex items-center gap-1">
              Command:<span className="inline-block h-3 w-1.5 animate-pulse bg-white/70" />
            </span>
            <span className="hidden gap-3 uppercase md:flex">
              <span className={mode3d ? "text-white/30" : "text-signal"}>Ortho</span>
              <span className="text-signal">Osnap</span>
              <span className={mode3d ? "text-signal" : "text-white/30"}>3D Orbit</span>
              <span>Model</span>
            </span>
            <span ref={coordsRef} className="tabular-nums whitespace-pre" />
          </div>
        </div>
      </div>
    </div>
  );
};
